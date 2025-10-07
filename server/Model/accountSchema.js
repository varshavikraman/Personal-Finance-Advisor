import { Schema} from "mongoose";
import {model}  from "mongoose";

const accountSchema = new Schema({
    email: { type: String, required: true, unique: true },
    incomes: [{
        month: { type: String, required: true },  // "2025-09"
        amount: { type: Number, required: true },
        manageIncome: { 
            type: String, 
            enum: ["50/30/20", "60/20/20", "70/10/20"], 
            required: true 
        },
        // Planned allocations (from split rule)
        budget: { type: Number, default: 0 },
        goal: { type: Number, default: 0 },
        savings: { type: Number, default: 0 },
        // Remaining allocations (after expenses/overspends)
        remainingBudget: { type: Number, default: 0 },
        remainingGoal: { type: Number, default: 0 },
        remainingSavings: { type: Number, default: 0 }
    }],
    budgets: [{
        category: { type: String, required: true },
        limit: { type: Number, required: true },
        spent: { type: Number, required: true },
        balance: { type: Number, required: true },
        overspent: { type: Number, default: 0 },
        month: { type: String, required: true }
    }],
    expenses: [{
        category: { type: String, required: true },
        amount: { type: Number, required: true },
        date: { type: String, required: true },
        month: { type: String, required: true }
    }],
    goals:[{
        goalName: { type: String, required: true },
        target: { type: Number, required: true },
        progress: { type: Number, default: 0 },  
        completed: { type: Boolean, default: false }
    }],
    savings: [{ 
        amount: { type: Number, required: true }, 
        date: { type: Date, default: Date.now } 
    }],
     withdrawals: [{
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now }
    }],
    advises: [{
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        read: { type: Boolean, default: false }
    },] 
})

const Account = model('Account', accountSchema)

export { Account }
