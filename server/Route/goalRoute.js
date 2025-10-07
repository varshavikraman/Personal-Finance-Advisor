import { Router } from "express";
import { Account } from "../Model/accountSchema.js";
import cron from "node-cron";

const goalRoute = Router();

goalRoute.post('/addGoal', async (req, res) => {
  try {
    const Email = req.email;
    const { GoalName, Target } = req.body;

    const userAccount = await Account.findOne({ email: Email });
    if (!userAccount) {
      return res.status(400).json({ message: "Please add income first before adding goals." });
    }

    // Check if the user has any income entries
    if (!userAccount.incomes || userAccount.incomes.length === 0) {
      return res.status(400).json({ message: "Please add income before adding goals." });
    }

    // Initialize goals array if undefined
    userAccount.goals ||= [];

    // Check if goal already exists (case-insensitive)
    const existingGoal = userAccount.goals.find(
      g => g.goalName.toLowerCase() === GoalName.toLowerCase()
    );

    if (existingGoal) {
      return res.status(400).json({ message: "Goal already exists" });
    }

    // Add new goal
    userAccount.goals.push({
      goalName: GoalName,
      target: Target,
      progress: 0,
      completed: false,
    });

    await userAccount.save();

    res.status(201).json({
      message: "Goal added successfully",
      goals: userAccount.goals,
    });

  } catch (error) {
    console.error("Error adding goal:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const allocateleftoverAmountToGoals = async (userEmail, monthStr) => {
  try {
    const account = await Account.findOne({ email: userEmail });
    if (!account) {
      return { advises: [], updatedGoals: [], savings: [], error: "Account not found" };
    }

    // Find the income entry for the given month
    const monthIncome = account.incomes.find(i => i.month === monthStr);
    if (!monthIncome) {
      return { advises: [], updatedGoals: account.goals, savings: account.savings || [], error: `No income found for ${monthStr}` };
    }

    // Pool together leftover budget + remaining goal allocation
    let leftoverAmount = (monthIncome.remainingBudget || 0) + (monthIncome.remainingGoal || 0);

    if (leftoverAmount <= 0) {
      return { 
        advises: [{ message: `No leftover funds to allocate for ${monthStr}`, createdAt: new Date() }], 
        updatedGoals: account.goals, 
        savings: account.savings || [] 
      };
    }

    const activeGoals = account.goals.filter(g => !g.completed);
    const advises = [];

    if (activeGoals.length === 0) {
      // Push leftover into savings array
      account.savings ||= [];
      account.savings.push({
        amount: leftoverAmount,
        date: new Date()
      });
      monthIncome.remainingBudget = 0; 
      monthIncome.remainingGoal = 0;   // ✅ clear goal portion too
      advises.push({
        message: `Rs ${leftoverAmount} moved to savings (no active goals).`,
        createdAt: new Date()
      });
    } else {
      const baseShare = Math.floor(leftoverAmount / activeGoals.length);
      let remainder = leftoverAmount % activeGoals.length;

      for (const goal of activeGoals) {
        let allocation = baseShare;
        if (remainder > 0) {
          allocation += 1;
          remainder -= 1;
        }

        goal.progress += allocation;
        if (goal.progress >= goal.target) {
          goal.progress = goal.target;
          goal.completed = true;
          advises.push({
            message: `Goal "${goal.goalName}" completed with this allocation!`,
            createdAt: new Date()
          });
        } else {
          advises.push({
            message: `Rs ${allocation} allocated to goal "${goal.goalName}". Progress: ${goal.progress}/${goal.target}`,
            createdAt: new Date()
          });
        }
      }

      monthIncome.remainingBudget = 0; 
      monthIncome.remainingGoal = 0;   // ✅ clear goal allocation after use
    }

    account.advises ||= [];
    account.advises.push(...advises);

    await account.save();

    return { 
      advises, 
      updatedGoals: account.goals, 
      savings: account.savings || [] 
    };
  } catch (error) {
    console.error("Error allocating leftover budget:", error);
    return { advises: [], updatedGoals: [], savings: account.savings || [], error: "Internal error" };
  }
};

goalRoute.post('/reconcileMonth', async (req, res) => {
  try {
    // const today = new Date();
    // const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    // if (today.getDate() !== lastDay) {
    //   return res.status(400).json({
    //     message: "Reconciliation is only allowed on the last day of the month"
    //   });
    // }

    const monthStr = today.toISOString().substring(0, 7); 

    const { advises, updatedGoals, savings, error } = await allocateleftoverAmountToGoals(req.email, monthStr);

    if (error) {
      return res.status(404).json({ error });
    }

    res.status(200).json({
      message: `Leftover budget allocated to goals for ${monthStr}`,
      notifications: advises,
      goals: updatedGoals,
      savings
    });

  } catch (error) {
    console.error("Error in reconcileMonth:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

goalRoute.get('/viewAllGoals', async (req, res) => {
  try {
    const Email = req.email;
    const userAccount = await Account.findOne({ email: Email });

    res.status(200).json(userAccount?.goals || []);
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

goalRoute.delete('/deleteGoal', async (req, res) => {
  try {
    const Email = req.email;
    const { GoalName } = req.body;

    const userAccount = await Account.findOne({ email: Email });
    if (!userAccount) {
      return res.status(404).json({ msg: "Account not found" });
    }

    const goalIndex = userAccount.goals.findIndex(g => g.goalName === GoalName);
    if (goalIndex < 0) {
      return res.status(404).json({ msg: "Goal not found" });
    }

    const allocatedAmount = userAccount.goals[goalIndex].progress;

    // Remove the goal
    userAccount.goals.splice(goalIndex, 1);

    let newAdvises = [];

    if (allocatedAmount > 0) {
      const activeGoals = userAccount.goals.filter(g => !g.completed);

      if (activeGoals.length > 0) {
        const baseShare = Math.floor(allocatedAmount / activeGoals.length);
        let remainder = allocatedAmount % activeGoals.length;

        for (const goal of activeGoals) {
          let allocation = baseShare;
          if (remainder > 0) {
            allocation += 1;
            remainder -= 1;
          }

          goal.progress += allocation;

          if (goal.progress >= goal.target) {
            goal.progress = goal.target;
            goal.completed = true;
          }
        }

        newAdvises.push({
          message: `Reallocated Rs ${allocatedAmount} equally among remaining goals.`,
          createdAt: new Date()
        });
      } else {
        // Push leftover to savings array instead of adding to number
        userAccount.savings ||= [];
        userAccount.savings.push({
          amount: allocatedAmount,
          date: new Date()
        });

        newAdvises.push({
          message: `Moved Rs ${allocatedAmount} to savings (no goals left).`,
          createdAt: new Date()
        });
      }
    }

    userAccount.advises ||= [];
    userAccount.advises.push(...newAdvises);

    await userAccount.save();

    res.status(200).json({
      message: `"${GoalName}" deleted successfully`,
      goals: userAccount.goals,
      savings: userAccount.savings,
      notifications: [...userAccount.advises]
    });

  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export {goalRoute}