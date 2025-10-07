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
    const monthStr = today.toISOString().substring(0, 7); // "YYYY-MM"
    // const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    // if (today.getDate() !== lastDay) {
    //   return res.status(400).json({
    //     message: "Adding Monthly Savings is only allowed on the last day of the month"
    //   });
    // }

    // 🔹 Find the income for the current month
    const monthlyIncome = userAccount.incomes.find(i => i.month === monthStr);

    if (!monthlyIncome) {
      return res.status(400).json({ message: "No income found for this month" });
    }

    const amountToSave = monthlyIncome.remainingSavings > 0 
      ? monthlyIncome.remainingSavings 
      : monthlyIncome.savings || 0;

    if (amountToSave <= 0) {
      return res.status(400).json({ message: "No savings available to add" });
    }

    // 🔹 Prevent duplicate entry for the same day
    const alreadySavedToday = userAccount.savings.some(
      s => new Date(s.date).toDateString() === today.toDateString()
    );
    if (alreadySavedToday) {
      return res.status(400).json({ message: "Savings already added today" });
    }

    // 🔹 Push new savings entry
    userAccount.savings.push({
      amount: amountToSave,
      date: today
    });

    // 🔹 Update advises
    userAccount.advises = [
      ...(userAccount.advises || []),
      {
        message: `₹${amountToSave} moved to savings for ${monthStr}.`,
        createdAt: today
      }
    ];

    // 🔹 Reset that month’s remainingSavings after moving
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

        // Group savings by month
        const savingsByMonth = {};
        
        userAccount.savings.forEach(saving => {
            const monthKey = saving.date.toISOString().substring(0, 7); // "YYYY-MM"
            
            if (!savingsByMonth[monthKey]) {
                savingsByMonth[monthKey] = 0;
            }
            savingsByMonth[monthKey] += saving.amount;
        });

        // Convert to array format for pie chart
        const pieChartData = Object.entries(savingsByMonth).map(([month, amount]) => ({
            name: formatMonthName(month),
            value: amount,
            month: month,
            fullAmount: `₹${amount.toFixed(2)}`
        }));

        // Sort by month (newest first) or by amount (largest first)
        pieChartData.sort((a, b) => b.value - a.value);

        // Calculate total savings
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

// Helper function to format month name
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

    // Withdraw from latest savings first
    for (let i = userAccount.savings.length - 1; i >= 0 && remainingWithdraw > 0; i--) {
      if (userAccount.savings[i].amount <= remainingWithdraw) {
        remainingWithdraw -= userAccount.savings[i].amount;
        userAccount.savings.splice(i, 1);
      } else {
        userAccount.savings[i].amount -= remainingWithdraw;
        remainingWithdraw = 0;
      }
    }

    // ✅ Record withdrawal
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
    const Email = req.email; // set from authMiddleware

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