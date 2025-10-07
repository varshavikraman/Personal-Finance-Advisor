import { Router } from "express";
import { Account } from "../Model/accountSchema.js";

const budgetRoute = Router();

budgetRoute.post('/setBudget', async (req, res) => {
  try {
    const Email = req.email;
    const { Category, Limit, Month } = req.body;

    let userAccount = await Account.findOne({ email: Email });

    if (!userAccount) {
      return res.status(400).json({ 
        message: "Account not found. Please add your income first before setting a budget." 
      });
    }

    // Find income for the given month
    const monthIncome = userAccount.incomes.find(i => i.month === Month);

    if (!monthIncome || monthIncome.amount <= 0) {
      return res.status(400).json({ 
        message: "Please add your income for this month before setting a budget." 
      });
    }

    if (!userAccount.budgets) userAccount.budgets = [];

    // Check duplicate budget
    const existingBudget = userAccount.budgets.find(
      b => b.category.toLowerCase().trim() === Category.toLowerCase().trim() && b.month === Month
    );
    if (existingBudget) {
      return res.status(400).json({ message: "Budget already added for this category and month" });
    }

    let remaining = Limit;

    // Deduct from remainingBudget first
    const deductionFromBudget = Math.min(monthIncome.remainingBudget, remaining);
    monthIncome.remainingBudget -= deductionFromBudget;
    remaining -= deductionFromBudget;

    // Deduct remaining from remainingSavings
    if (remaining > 0) {
      const deductionFromSavings = Math.min(monthIncome.remainingSavings, remaining);
      monthIncome.remainingSavings -= deductionFromSavings;
      remaining -= deductionFromSavings;
    }

    // Deduct remaining from remainingGoal
    if (remaining > 0) {
      const deductionFromGoal = Math.min(monthIncome.remainingGoal, remaining);
      monthIncome.remainingGoal -= deductionFromGoal;
      remaining -= deductionFromGoal;
    }

    // Push the new budget
    userAccount.budgets.push({
      category: Category.trim(),
      limit: Limit,
      spent: 0,
      balance: Limit,
      overspent: 0,
      month: Month
    });

    await userAccount.save();

    res.status(201).json({ 
      message: "Budget added successfully",
      remainingBudget: monthIncome.remainingBudget,
      remainingSavings: monthIncome.remainingSavings,
      remainingGoal: monthIncome.remainingGoal
    });

  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ Error: 'Internal Server Error' });
  }
});


budgetRoute.get('/viewAllBudget', async (req, res) => {
    try {
        const Email = req.email;
        const userAccount = await Account.findOne({ email: Email });
        
        if (!userAccount || !userAccount.budgets) {
            return res.status(200).json([]);
        }
        
        res.status(200).json(userAccount.budgets);
    } catch (error) {
        console.error("Error fetching budgets:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

budgetRoute.get('/viewBudgetsByMonth', async (req, res) => {
  try {
    const Email = req.email;
    const { month } = req.query;  // 🔑 format: "yyyy-MM"

    const userAccount = await Account.findOne({ email: Email });
    if (!userAccount) {
      return res.status(404).json({ message: "User account not found" });
    }

    if (!month) {
      return res.status(400).json({ message: "Month query parameter is required (yyyy-MM)" });
    }

    if (!userAccount.budgets || userAccount.budgets.length === 0) {
      return res.status(404).json({ message: "No budgets found" });
    }

    // ✅ Filter budgets for requested month
    const monthlyBudgets = userAccount.budgets.filter(b => b.month === month);

    if (monthlyBudgets.length === 0) {
      return res.status(404).json({ message: `No budgets found for ${month}` });
    }

    // ✅ Get total income budget for that month
    const monthIncome = userAccount.incomes.find(i => i.month === month);

    const totalPlannedBudget = monthIncome ? monthIncome.budget : 0;
    const remainingBudget = monthIncome ? monthIncome.remainingBudget : 0;

    // ✅ Prepare chart data
    const chartData = monthlyBudgets.map(budget => ({
      name: budget.category,
      value: budget.limit,
      spent: budget.spent,
      balance: budget.balance,
      percentage: totalPlannedBudget > 0
        ? ((budget.limit / totalPlannedBudget) * 100).toFixed(1) + '%'
        : '0%'
    }));

    res.status(200).json({
      message: `Budgets for ${month}`,
      totalPlannedBudget,
      remainingBudget,
      budgets: monthlyBudgets,
      chartData
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ Error: "Internal Server Error" });
  }
});


export {budgetRoute}