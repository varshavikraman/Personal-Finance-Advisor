import { Router } from "express";
import { Account } from "../Model/accountSchema.js";
import { generateFinancialAdvises } from "./generateAdvise.js";
import { generateOverallReview } from "./generateAdvise.js";
import { generateSuggestions } from "./generateAdvise.js";

const expenseRoute = Router()

expenseRoute.post('/addExpense', async (req, res) => {
  try {
    const Email = req.email;
    const { Category, Expense, Date } = req.body;

    const userAccount = await Account.findOne({ email: Email });
    if (!userAccount) {
      return res.status(400).json({ message: "Account not found. Please add your income first." });
    }

    if (!userAccount.incomes || userAccount.incomes.length === 0) {
      return res.status(400).json({ message: "Please add your income before adding expenses." });
    }

    if (!userAccount.expenses) userAccount.expenses = [];

    // 🔑 Extract month from expense date (format yyyy-MM)
    const expenseMonth = Date.substring(0, 7);

    // ✅ Find income for this month
    const monthIncome = userAccount.incomes.find(i => i.month === expenseMonth);
    if (!monthIncome) {
      return res.status(400).json({ message: "No income set for this month. Please add income first." });
    }

    // ✅ Add expense entry
    userAccount.expenses.push({
      category: Category,
      amount: Number(Expense),
      date: Date,
      month: expenseMonth
    });

    // ✅ Update corresponding budget
    const budget = userAccount.budgets.find(
      b => b.category.toLowerCase() === Category.toLowerCase().trim() && b.month === expenseMonth
    );

    if (budget) {
      budget.spent += Number(Expense);
      budget.balance = budget.limit - budget.spent;

      if (budget.spent > budget.limit) {
        let overspent = budget.spent - budget.limit;

        // Deduct from remainingBudget first
        const deductionFromBudget = Math.min(overspent, monthIncome.remainingBudget);
        monthIncome.remainingBudget -= deductionFromBudget;
        overspent -= deductionFromBudget;

        // Deduct from remainingSavings next
        const deductionFromSavings = Math.min(overspent, monthIncome.remainingSavings);
        monthIncome.remainingSavings -= deductionFromSavings;
        overspent -= deductionFromSavings;

        // Deduct from remainingGoal last
        const deductionFromGoal = Math.min(overspent, monthIncome.remainingGoal);
        monthIncome.remainingGoal -= deductionFromGoal;
        overspent -= deductionFromGoal;

        // Update budget overspent info
        budget.overspent = overspent;
        budget.overspentFromAllocatedBudget = deductionFromBudget;
        budget.overspentFromSavings = deductionFromSavings;
        budget.overspentFromGoals = deductionFromGoal;

      } else {
        // Reset overspent if within budget
        budget.overspent = 0;
        budget.overspentFromAllocatedBudget = 0;
        budget.overspentFromSavings = 0;
        budget.overspentFromGoals = 0;
      }
    }

    await userAccount.save();

    // 🔑 Generate financial advises (make sure this works with incomes[])
    const advises = await generateFinancialAdvises(userAccount);

    res.status(201).json({
      message: "Expense added successfully",
      budget: budget || null,
      updatedIncome: {
        month: monthIncome.month,
        remainingBudget: monthIncome.remainingBudget,
        remainingSavings: monthIncome.remainingSavings,
        remainingGoal: monthIncome.remainingGoal
      },
      advises
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ Error: 'Internal Server Error' });
  }
});



expenseRoute.get('/viewAllExpenses', async (req, res) => {
  try {
    const Email = req.email; 

    const userAccount = await Account.findOne({ email: Email });
    if (!userAccount) {
      return res.status(404).json({ message: "User account not found" });
    }

    if (!userAccount.expenses || userAccount.expenses.length === 0) {
      return res.status(404).json({ message: "No expenses found" });
    }

    const totalSpent = userAccount.expenses.reduce((sum, e) => sum + e.amount, 0);

    res.status(200).json({
      message: "All expenses fetched successfully",
      totalExpenses: userAccount.expenses.length,
      totalSpent,
      expenses: userAccount.expenses
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ Error: "Internal Server Error" });
  }
});

expenseRoute.get('/viewExpensesByMonth/:month', async (req, res) => {
    try {
        const Email = req.email;
        const { month } = req.params;

        const userAccount = await Account.findOne({ email: Email });

        if (!userAccount) {
            return res.status(404).json({ message: "User account not found" });
        }

        const monthlyExpenses = userAccount.expenses.filter(
            e => e.month === month
        );

        if (monthlyExpenses.length === 0) {
            return res.status(200).json({ 
                message: `No expenses found for ${month}`,
                totalExpenses: 0,
                totalSpent: 0,
                expenses: [],
                barGraphData: [],
                hasBudgets: false,
                allocatedBudget: 0,
                plannedBudget: 0
            });
        }

        const totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

        const monthlyBudgets = userAccount.budgets.filter(
            b => b.month === month
        );

        const monthIncome = userAccount.incomes.find(
            i => i.month === month
        );

        const barGraphData = [];

        const expensesByCategory = {};
        monthlyExpenses.forEach(expense => {
            if (!expensesByCategory[expense.category]) {
                expensesByCategory[expense.category] = 0;
            }
            expensesByCategory[expense.category] += expense.amount;
        });

        Object.entries(expensesByCategory).forEach(([category, amount]) => {
            const budgetForCategory = monthlyBudgets.find(b => b.category === category);
            
            barGraphData.push({
                category: category,
                expenseAmount: amount,
                budgetLimit: budgetForCategory ? budgetForCategory.limit : 0,
                budgetBalance: budgetForCategory ? Math.max(budgetForCategory.balance, 0) : 0, 
                overBudget: budgetForCategory ? (amount - budgetForCategory.limit) > 0 : false
            });
        });

        const plannedBudget = monthlyBudgets.reduce((sum, budget) => sum + budget.limit, 0);

        res.status(200).json({
            message: `Expenses for ${month}`,
            totalExpenses: monthlyExpenses.length,
            totalSpent,
            expenses: monthlyExpenses,
            barGraphData: barGraphData, 
            hasBudgets: monthlyBudgets.length > 0,
            allocatedBudget: monthIncome ? monthIncome.budget : 0,
            plannedBudget: plannedBudget 
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ Error: "Internal Server Error" });
    }
});

expenseRoute.get('/viewExpensesByRange', async (req, res) => {
  try {
    const Email = req.email;
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: "Start and end months are required in YYYY-MM format" });
    }

    const [startYear, startMonth] = start.split("-").map(Number);
    const [endYear, endMonth] = end.split("-").map(Number);
    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(endYear, endMonth, 0);

    const userAccount = await Account.findOne({ email: Email });
    if (!userAccount) return res.status(404).json({ message: "User account not found" });

    // Filter expenses in the range
    const filteredExpenses = userAccount.expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate >= startDate && expDate <= endDate;
    });

    if (filteredExpenses.length === 0) {
      return res.status(200).json({ 
        message: `No expenses found between ${start} and ${end}`,
        barGraphData: [],
        categoryData: [],
        monthlyReports: [],
        overallReview: {},
        suggestions: []
      });
    }

    // Group expenses by month and category
    const expensesByMonth = {};
    const expensesByCategory = {};
    const monthlyBudgets = {};
    const monthlyIncomes = {};

    // Prepare budgets and incomes per month for the range
    userAccount.budgets.forEach(b => {
      const [year, month] = b.month.split("-").map(Number);
      const budgetDate = new Date(year, month - 1, 1);
      if (budgetDate < startDate || budgetDate > endDate) return;

      if (!monthlyBudgets[b.month]) monthlyBudgets[b.month] = {};
      monthlyBudgets[b.month][b.category] = b.limit;
    });

    // Get income for months in range
    userAccount.incomes.forEach(i => {
      const [year, month] = i.month.split("-").map(Number);
      const incomeDate = new Date(year, month - 1, 1);
      if (incomeDate >= startDate && incomeDate <= endDate) {
        monthlyIncomes[i.month] = {
          amount: i.amount,
          manageIncome: i.manageIncome,
          allocatedBudget: i.budget,      // ✅ from income’s planned allocation
          allocatedGoal: i.goal,          // optional: add goal
          allocatedSavings: i.savings     // optional: add savings
        };
      }
    });

    // Process each expense
    filteredExpenses.forEach(exp => {
      const monthKey = exp.month;
      const category = exp.category;

      // Monthly data
      if (!expensesByMonth[monthKey]) {
        expensesByMonth[monthKey] = { 
          expenseAmount: 0, 
          budgetLimit: 0,
          income: monthlyIncomes[monthKey]?.amount || 0,
          categories: new Set()
        };
      }
      expensesByMonth[monthKey].expenseAmount += exp.amount;
      expensesByMonth[monthKey].categories.add(category);
      
      if (monthlyBudgets[monthKey]) {
        expensesByMonth[monthKey].budgetLimit = Object.values(monthlyBudgets[monthKey]).reduce((a, b) => a + b, 0);
      }

      // Category data
      if (!expensesByCategory[category]) {
        expensesByCategory[category] = { 
          totalSpent: 0, 
          expenseCount: 0, 
          budgetLimit: 0,
          monthlyBreakdown: {}
        };
      }
      expensesByCategory[category].totalSpent += exp.amount;
      expensesByCategory[category].expenseCount += 1;
      expensesByCategory[category].budgetLimit += monthlyBudgets[monthKey] && monthlyBudgets[monthKey][category] ? monthlyBudgets[monthKey][category] : 0;
      
      // Monthly breakdown per category
      if (!expensesByCategory[category].monthlyBreakdown[monthKey]) {
        expensesByCategory[category].monthlyBreakdown[monthKey] = 0;
      }
      expensesByCategory[category].monthlyBreakdown[monthKey] += exp.amount;
    });

    // Calculate averages and percentages
    const totalSpentAll = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    Object.keys(expensesByCategory).forEach(category => {
      const monthsWithData = Object.keys(expensesByCategory[category].monthlyBreakdown).length;
      expensesByCategory[category].averagePerMonth = expensesByCategory[category].totalSpent / Math.max(monthsWithData, 1);
      expensesByCategory[category].percentage = (expensesByCategory[category].totalSpent / totalSpentAll) * 100;
      expensesByCategory[category].overspent = Math.max(0, expensesByCategory[category].totalSpent - expensesByCategory[category].budgetLimit);
      expensesByCategory[category].utilization = expensesByCategory[category].budgetLimit > 0 
        ? (expensesByCategory[category].totalSpent / expensesByCategory[category].budgetLimit) * 100 
        : 0;
    });

    // Prepare data arrays
    const barGraphData = Object.entries(expensesByMonth)
      .map(([month, data]) => ({ 
        month, 
        ...data,
        categoriesCount: data.categories.size,
        balance: data.income - data.expenseAmount,
        budgetUtilization: data.budgetLimit > 0 ? (data.expenseAmount / data.budgetLimit) * 100 : 0
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const categoryData = Object.entries(expensesByCategory)
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.totalSpent - a.totalSpent);

    // Generate monthly reports for EACH month in the range
    const monthlyReports = barGraphData.map(monthData => {
      const monthKey = monthData.month;

      const monthCategories = categoryData
        .filter(cat => cat.monthlyBreakdown[monthKey])
        .map(cat => ({
          category: cat.category,
          spent: cat.monthlyBreakdown[monthKey] || 0,
          budget: monthlyBudgets[monthKey]?.[cat.category] || 0
        }))
        .sort((a, b) => b.spent - a.spent);

      // ✅ Calculate allocated budget for that month
      const allocatedBudget = monthlyIncomes[monthKey]?.allocatedBudget || 0;

      return {
        month: monthKey,
        totalSpent: monthData.expenseAmount,
        totalBudget: monthData.budgetLimit,
        allocatedBudget,  // ✅ new field
        income: monthlyIncomes[monthKey]?.amount || 0, // ✅ corrected
        balance: allocatedBudget - monthData.expenseAmount,
        categories: monthCategories,
        topSpendingCategory: monthCategories[0]?.category || 'None',
        budgetUtilization: monthData.budgetUtilization,
        categoriesCount: monthData.categoriesCount
      };
    });

    // Generate overall review and suggestions for the ENTIRE range
    const overallReview = generateOverallReview(barGraphData, categoryData, filteredExpenses);
    const suggestions = generateSuggestions(categoryData, barGraphData, overallReview);

    const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalPlannedBudget = barGraphData.reduce((sum, m) => sum + m.budgetLimit, 0);
    const totalIncome = barGraphData.reduce((sum, m) => sum + m.income, 0);
    const totalAllocatedBudget = Object.values(monthlyIncomes)
        .reduce((sum, i) => sum + (i.allocatedBudget || 0), 0);
    console.log(monthlyReports);
    

    res.status(200).json({
      message: `Expenses from ${start} to ${end}`,
      totalExpenses: filteredExpenses.length,
      totalSpent,
      totalPlannedBudget,
      totalAllocatedBudget,
      totalIncome,
      barGraphData,
      categoryData,
      monthlyReports, // This contains report for EACH month
      overallReview,  // This contains review for ENTIRE range
      suggestions,    // Suggestions for ENTIRE range
      overspendingCategories: categoryData.filter(c => c.overspent > 0)
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ Error: "Internal Server Error" });
  }
});

expenseRoute.delete('/deleteExpense', async (req, res) => {
    try {
        const Email = req.email;
        const { Category, Date } = req.body;

        const userAccount = await Account.findOne({ email: Email });

        if (!userAccount) {
            return res.status(404).json({ message: "Account not found for the user" });
        }

        const expenseIndex = userAccount.expenses.findIndex(
            exp => exp.date === Date && exp.category === Category
        );

        if (expenseIndex < 0) {
            return res.status(400).json({ message: "Expense not found" });
        }

        const [deletedExpense] = userAccount.expenses.splice(expenseIndex, 1);

        const expenseMonth = Date.substring(0, 7);

        const budget = userAccount.budgets.find(
            b => b.category === Category && b.month === expenseMonth
        );

        if (budget) {
            budget.spent -= deletedExpense.amount;
            budget.balance = budget.limit - budget.spent;
            budget.overspent = budget.spent > budget.limit ? budget.spent - budget.limit : 0;
        }

        await userAccount.save();

        res.status(200).json({
            message: "Expense deleted successfully",
            deletedExpense,
            updatedBudget: budget || null,
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ Error: "Internal Server Error" });
    }
});

export {expenseRoute}