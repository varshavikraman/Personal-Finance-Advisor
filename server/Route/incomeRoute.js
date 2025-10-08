import { Router } from "express";
import { Account } from "../Model/accountSchema.js";

const incomeRoute = Router();

incomeRoute.post('/addIncome', async (req, res) => {
  try {
    const Email = req.email;
    const { Amount, ManageIncome } = req.body;

    let userAccount = await Account.findOne({ email: Email });
    if (!userAccount) {
      userAccount = new Account({ email: Email });
    }

    const currentMonth = new Date().toISOString().substring(0, 7);

    const existingIncome = userAccount.incomes.find(i => i.month === currentMonth);
    if (existingIncome) {
      return res.status(400).json({ msg: "Income already exists for this month" });
    }

    const [budgetPercent, goalPercent, savingPercent] = ManageIncome.split("/").map(Number);
    if (![budgetPercent, goalPercent, savingPercent].every(n => !isNaN(n))) {
      return res.status(400).json({ msg: "Invalid ManageIncome format. Use '50/30/20' style." });
    }

    const budgetAmount = (Amount * budgetPercent) / 100;
    const goalAmount = (Amount * goalPercent) / 100;
    const savingAmount = (Amount * savingPercent) / 100;

    userAccount.incomes.push({
      month: currentMonth,
      amount: Amount,
      manageIncome: ManageIncome,
      budget: budgetAmount,
      goal: goalAmount,
      savings: savingAmount,
      remainingBudget: budgetAmount,
      remainingGoal: goalAmount,
      remainingSavings: savingAmount
    });

    await userAccount.save();

    res.status(201).json({
      msg: "Income added successfully",
      data: userAccount.incomes[userAccount.incomes.length - 1],
    });

  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ Error: 'Internal Server Error' });
  }
});

incomeRoute.get('/viewIncomeDetails', async (req, res) => {
  try {
    const Email = req.email;
    const userAccount = await Account.findOne({ email: Email });
    if (!userAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    const currentMonth = new Date().toISOString().substring(0, 7);

    let currentIncome = userAccount.incomes.find(i => i.month === currentMonth);

    if (!currentIncome && userAccount.incomes.length > 0) {
      const lastIncome = userAccount.incomes[userAccount.incomes.length - 1];
      const amount = lastIncome.amount;
      const manageIncome = lastIncome.manageIncome;

      const [budgetPercent, goalPercent, savingPercent] = manageIncome.split("/").map(Number);
      const budgetAmount = (amount * budgetPercent) / 100;
      const goalAmount = (amount * goalPercent) / 100;
      const savingAmount = (amount * savingPercent) / 100;

      const newIncome = {
        month: currentMonth,
        amount,
        manageIncome,
        budget: budgetAmount,
        goal: goalAmount,
        savings: savingAmount,
        remainingBudget: budgetAmount,
        remainingGoal: goalAmount,
        remainingSavings: savingAmount
      };

      userAccount.incomes.push(newIncome);
      await userAccount.save();
      currentIncome = newIncome;
    }

    if (!currentIncome) {
      return res.status(200).json({ message: "No income set yet", data: null });
    }

    const totalSavings = userAccount.savings?.reduce((sum, s) => sum + (s.amount || 0), 0) || 0;

    const totalSetBudget = userAccount.budgets
      ? userAccount.budgets
          .filter(b => b.month === currentMonth)
          .reduce((sum, b) => sum + b.limit, 0)
      : 0;

    const balance = Math.max(currentIncome.budget - totalSetBudget, 0);
    
    res.status(200).json({
      message: "Income Details fetched successfully",
      Income: currentIncome.amount,
      AllocatedBudget: currentIncome.budget,
      PlannedBudget:totalSetBudget,
      Balance:balance,
      AllocatedGoal: currentIncome.goal,
      CurrentGoal:currentIncome.remainingGoal,
      TotalSavings: totalSavings || currentIncome.savings,
      AllocatedSavings: currentIncome.savings,
      CurrentSavings:currentIncome.remainingSavings
    });

  } catch (error) {
    console.error("Error fetching income details:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

incomeRoute.put('/updateIncome', async (req, res) => {
  try {
    const Email = req.email;
    const { Amount, ManageIncome } = req.body;

    const userAccount = await Account.findOne({ email: Email });
    if (!userAccount) {
      return res.status(404).json({ msg: "Account not found for this email" });
    }

    const currentMonth = new Date().toISOString().substring(0, 7);

    let currentIncome = userAccount.incomes.find(i => i.month === currentMonth);

    if (!currentIncome) {
      currentIncome = {
        month: currentMonth,
        amount: 0,
        manageIncome: "50/30/20",
        budget: 0,
        goal: 0,
        savings: 0,
        remainingBudget: 0,
        remainingGoal: 0,
        remainingSavings: 0
      };
      userAccount.incomes.push(currentIncome);
    }

    const [budgetPercent, goalPercent, savingPercent] = ManageIncome.split("/").map(Number);
    if (![budgetPercent, goalPercent, savingPercent].every(n => !isNaN(n))) {
      return res.status(400).json({ msg: "Invalid ManageIncome format. Use '50/30/20' style." });
    }

    const budgetAmount = (Amount * budgetPercent) / 100;
    const goalAmount = (Amount * goalPercent) / 100;
    const savingAmount = (Amount * savingPercent) / 100;

    currentIncome.amount = Amount;
    currentIncome.manageIncome = ManageIncome;
    currentIncome.budget = budgetAmount;
    currentIncome.goal = goalAmount;
    currentIncome.savings = savingAmount;
    currentIncome.remainingBudget = budgetAmount;
    currentIncome.remainingGoal = goalAmount;
    currentIncome.remainingSavings = savingAmount;

    await userAccount.save();

    res.status(200).json({
      msg: "Income updated successfully",
      data: currentIncome,
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ Error: "Internal Server Error" });
  }
});

export {incomeRoute}