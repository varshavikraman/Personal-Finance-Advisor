import { Router } from "express";
import cron from "node-cron";
import { Account } from "../Model/accountSchema.js";

const savingRoute = Router();

savingRoute.post("/addMonthlySavings", async (req, res) => {
  try {
    const Email = req.email;

    const userAccount = await Account.findOne({ email: Email });
    if (!userAccount) {
      return res.status(404).json({ error: "Account not found" });
    }

    const today = new Date();
    // const monthStr = today.toISOString().substring(0, 7); // "YYYY-MM"
    // const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    // if (today.getDate() !== lastDay) {
    //   return res.status(400).json({
    //     message: "Adding Monthly Savings is only allowed on the last day of the month"
    //   });
    // }

    const monthlyIncome = userAccount.incomes.find(i => i.month === monthStr);
    if (!monthlyIncome) {
      return res.status(400).json({ message: "No income found for this month" });
    }

    const monthlyBudgets = userAccount.budgets.filter(b => b.month === monthStr);
    const totalBudgetLimit = monthlyBudgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = monthlyBudgets.reduce((sum, b) => sum + b.spent, 0);

    let unspentBudget = 0;
    if (totalBudgetLimit > totalSpent) {
      unspentBudget = totalBudgetLimit - totalSpent;
    }

    const incomeRemainingSavings = monthlyIncome.remainingSavings > 0 
      ? monthlyIncome.remainingSavings 
      : monthlyIncome.savings || 0;

    const amountToSave = (incomeRemainingSavings + unspentBudget);

    if (amountToSave <= 0) {
      return res.status(400).json({ message: "No savings available to add" });
    }

    const alreadySavedToday = userAccount.savings.some(
      s => new Date(s.date).toDateString() === today.toDateString()
    );
    if (alreadySavedToday) {
      return res.status(400).json({ message: "Savings already added today" });
    }

    userAccount.savings.push({
      amount: amountToSave,
      date: today
    });

    let message = `₹${amountToSave} moved to savings for ${monthStr}.`;
    if (unspentBudget > 0) {
      message += ` Includes ₹${unspentBudget} unspent from your monthly budget.`;
    }

    userAccount.advises = [
      ...(userAccount.advises || []),
      { message, createdAt: today }
    ];

    monthlyIncome.remainingSavings = 0;

    await userAccount.save();

    res.status(200).json({
      message: `₹${amountToSave} moved to savings history for ${monthStr}.`,
      savings: userAccount.savings,
      incomes: userAccount.incomes
    });

  } catch (error) {
    console.error("Error adding monthly savings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

savingRoute.get('/savingsPieChart', async (req, res) => {
    try {
        const Email = req.email;

        const userAccount = await Account.findOne({ email: Email });
        if (!userAccount) {
            return res.status(404).json({ message: "User account not found" });
        }

        const savingsByMonth = {};
        
        userAccount.savings.forEach(saving => {
            const monthKey = saving.date.toISOString().substring(0, 7); 
            
            if (!savingsByMonth[monthKey]) {
                savingsByMonth[monthKey] = 0;
            }
            savingsByMonth[monthKey] += saving.amount;
        });

        const pieChartData = Object.entries(savingsByMonth).map(([month, amount]) => ({
            name: formatMonthName(month),
            value: amount,
            month: month,
            fullAmount: `₹${amount.toFixed(2)}`
        }));

        pieChartData.sort((a, b) => b.value - a.value);

        const totalSavings = pieChartData.reduce((sum, item) => sum + item.value, 0);

        res.status(200).json({
            message: "Savings pie chart data retrieved successfully",
            pieChartData,
            totalSavings,
            totalMonths: pieChartData.length
        });

    } catch (error) {
        console.error("Error fetching savings pie chart data:", error);
        res.status(500).json({ Error: "Internal Server Error" });
    }
});

function formatMonthName(monthString) {
    const [year, month] = monthString.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
}

savingRoute.post("/withdrawFromSavings", async (req, res) => {
  try {
    const Email = req.email;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid withdraw amount" });
    }

    const userAccount = await Account.findOne({ email: Email });
    if (!userAccount) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalSavings = userAccount.savings.reduce((sum, s) => sum + s.amount, 0);
    if (amount > totalSavings) {
      return res.status(400).json({ message: "Not enough savings" });
    }

    let remainingWithdraw = amount;

    for (let i = userAccount.savings.length - 1; i >= 0 && remainingWithdraw > 0; i--) {
      if (userAccount.savings[i].amount <= remainingWithdraw) {
        remainingWithdraw -= userAccount.savings[i].amount;
        userAccount.savings.splice(i, 1);
      } else {
        userAccount.savings[i].amount -= remainingWithdraw;
        remainingWithdraw = 0;
      }
    }

    userAccount.withdrawals.push({ amount, date: new Date() });

    await userAccount.save();

    return res.status(200).json({
      message: "Withdrawal successful",
      withdrawn: amount,
      newTotal: userAccount.savings.reduce((sum, s) => sum + s.amount, 0)
    });

  } catch (error) {
    console.error("Error during withdrawal:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

savingRoute.get("/savingsSummary", async (req, res) => {
  try {
    const Email = req.email; 

    const account = await Account.findOne({ email: Email });
    if (!account) {
      return res.status(404).json({ message: "User account not found" });
    }

    const totalSavings = account.savings.reduce(
      (sum, s) => sum + (s.amount || 0),
      0
    );

    const totalWithdrawn = account.withdrawals.reduce(
      (sum, w) => sum + (w.amount || 0),
      0
    );

    const withdrawalHistory = account.withdrawals
      .map((w) => ({
        amount: w.amount,
        date: w.date,
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date)); 

    res.status(200).json({
      totalSavings,
      totalWithdrawn,
      withdrawalHistory,
    });
  } catch (err) {
    console.error("Error fetching savings summary:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export {savingRoute};