const generateFinancialAdvises = async (userAccount, monthStr) => {
  try {
    const newAdvises = [];

    const monthIncome = userAccount.incomes.find(i => i.month === monthStr);
    if (!monthIncome) {
      return userAccount.advises || [];
    }

    const monthlyBudgets = userAccount.budgets.filter(b => b.month === monthStr);

    const totalBudgetSet = monthlyBudgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = monthlyBudgets.reduce((sum, b) => sum + b.spent, 0);
    const incomeBudget = monthIncome.budget || 0;

    if (totalBudgetSet > incomeBudget) {
      newAdvises.push({
        message: `Alert! Your total budgets (Rs ${totalBudgetSet}) exceed your allocated budget (Rs ${incomeBudget}).`,
        createdAt: new Date()
      });
    }

    if (totalBudgetSet > 0) {
      const spendPercent = (totalSpent / totalBudgetSet) * 100;

      const today = new Date();
      const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const currentDay = today.getDate();
      const monthProgress = (currentDay / totalDays) * 100;

      if (spendPercent > 80) {
        newAdvises.push({
          message: `Alert! You are approaching budget limits! You have used Rs ${totalSpent} of Rs ${totalBudgetSet}.`,
          createdAt: new Date()
        });
      } 
      else if (monthProgress > 80 && spendPercent < 50) {
        newAdvises.push({
          message: `Great! You are saving well. Only Rs ${totalSpent} spent out of Rs ${totalBudgetSet}.`,
          createdAt: new Date()
        });
      }
    }


    monthlyBudgets.forEach(budget => {
      if (budget.spent > budget.limit) {
        const overspent = budget.spent - budget.limit;
        let overspentMsg = `${budget.category} budget is overspent by Rs ${overspent}.`;

        if (budget.overspentFromSavings > 0) overspentMsg += ` Rs ${budget.overspentFromSavings} covered from Savings.`;
        if (budget.overspentFromGoals > 0) overspentMsg += ` Rs ${budget.overspentFromGoals} covered from Goals.`;
        if (budget.overspent > 0) overspentMsg += ` Remaining overspent: Rs ${budget.overspent}.`;

        newAdvises.push({
          message: `Alert! ${overspentMsg} (Spent: Rs ${budget.spent}, Limit: Rs ${budget.limit})`,
          createdAt: new Date()
        });
      }
    });

    userAccount.goals.forEach(goal => {
      if (goal.completed) {
        newAdvises.push({
          message: `Congrats! Goal "${goal.goalName}" achieved.`,
          createdAt: new Date()
        });
      }
    });

    const existingMessages = new Set((userAccount.advises || []).map(a => a.message));
    const uniqueNewAdvises = newAdvises.filter(a => !existingMessages.has(a.message));

    userAccount.advises = [...(userAccount.advises || []), ...uniqueNewAdvises];

    await userAccount.save();

    return [...userAccount.advises].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  } catch (error) {
    console.error("Error generating financial advises:", error);
    return userAccount.advises || [];
  }
};

function generateOverallReview(monthlyData, categoryData, expenses) {
  const totalSpent = monthlyData.reduce((sum, month) => sum + month.expenseAmount, 0);
  const totalBudget = monthlyData.reduce((sum, month) => sum + month.budgetLimit, 0);
  const totalIncome = monthlyData.reduce((sum, month) => sum + month.income, 0);
  
  const avgMonthlySpending = totalSpent / monthlyData.length;
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpent) / totalIncome) * 100 : 0;

  const overspendingMonths = monthlyData.filter(month => month.expenseAmount > month.budgetLimit).length;
  const consistentCategories = categoryData.filter(cat => 
    Object.keys(cat.monthlyBreakdown).length === monthlyData.length
  ).length;

  return {
    totalSpent,
    totalBudget,
    totalIncome,
    avgMonthlySpending,
    budgetUtilization,
    savingsRate,
    overspendingMonths,
    consistentCategories,
    totalMonths: monthlyData.length,
    spendingHealth: calculateSpendingHealth(budgetUtilization, savingsRate, overspendingMonths, monthlyData.length)
  };
}

function calculateSpendingHealth(utilization, savingsRate, overspendingMonths, totalMonths) {
  let score = 100;
  if (utilization > 100) score -= 30;
  else if (utilization > 90) score -= 15;
  else if (utilization > 80) score -= 5;
  
  if (savingsRate > 20) score += 20;
  else if (savingsRate > 10) score += 10;
  else if (savingsRate < 0) score -= 20;
  
  const overspendingRatio = overspendingMonths / totalMonths;
  if (overspendingRatio > 0.5) score -= 25;
  else if (overspendingRatio > 0.25) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

function generateSuggestions(categoryData, monthlyData, review) {
  const suggestions = [];
  
  if (review.budgetUtilization > 100) {
    suggestions.push({
      type: 'warning',
      title: 'Over Budget',
      message: `You're exceeding your budget by ${(review.budgetUtilization - 100).toFixed(1)}% across all months.`,
      action: 'Review budget allocations'
    });
  }

  if (review.savingsRate < 10) {
    suggestions.push({
      type: 'warning',
      title: 'Low Savings Rate',
      message: `Your average savings rate is ${review.savingsRate.toFixed(1)}%. Aim for at least 10-20%.`,
      action: 'Look for areas to reduce spending'
    });
  }

  const overspendingCats = categoryData.filter(cat => cat.overspent > 0);
  if (overspendingCats.length > 0) {
    overspendingCats.forEach(cat => {
      suggestions.push({
        type: 'critical',
        title: `${cat.category} Overspending`,
        message: `You've overspent by ₹${cat.overspent.toFixed(2)} in ${cat.category} across all months`,
        action: 'Adjust budget or reduce spending'
      });
    });
  }

  return suggestions;
}

export { generateFinancialAdvises, generateOverallReview, generateSuggestions };
