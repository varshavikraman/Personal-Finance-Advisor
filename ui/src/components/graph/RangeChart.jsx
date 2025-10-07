import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

const RangeChart = ({ data, start, end, totalSpent, totalPlannedBudget, totalAllocatedBudget  }) => {
  const formatMonth = (monthString) => { 
    if (!monthString) return ""; 
      const [year, month] = monthString.split("-"); 
      const date = new Date(year, month - 1); 
      return date.toLocaleString("default", { month: "short", year: "numeric" }); 
    };

    // Custom tooltip 
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="p-3 bg-white border border-gray-200 rounded shadow"> 
          <p className="font-semibold">{formatMonth(label)}</p> 
          <p className="text-indigo-600">Spent: ₹{payload[0].value.toFixed(2)}</p> 
          <p className="text-emerald-600">Budget: ₹{payload[1].value.toFixed(2)}</p> </div> 
        ); 
      } 
      return null; 
    };

    const totalExpenses = data.reduce((sum, item) => sum + item.expenseAmount, 0).toFixed(2); 
    const totalBudgetSum = data.reduce((sum, item) => sum + item.budgetLimit, 0).toFixed(2);

    return ( 
      <div className="w-full"> 
        <h3 className="text-lg font-semibold mb-3"> Expenses from {formatMonth(start)} to {formatMonth(end)} </h3> 
        <div className="h-72 md:h-96 bg-gradient-to-br from-gray-50 to-gray-100 border rounded p-2"> 
          <ResponsiveContainer width="100%" height="100%"> 
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}> 
              <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="month" tickFormatter={formatMonth} angle={-30} textAnchor="end" height={70} /> 
              <YAxis /> 
              <Tooltip content={<CustomTooltip />} /> 
              <Legend /> 
              <Bar dataKey="expenseAmount" name="Amount Spent" fill="#6366F1" /> 
              <Bar dataKey="budgetLimit" name="Budget Limit" fill="#10B981" /> 
            </BarChart> 
          </ResponsiveContainer> 
        </div> 
        
        {/* Summary */} 
        <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4"> 
          <div className="p-3 bg-white border rounded shadow-sm"> 
            <p className="text-sm text-gray-500">Total Expenses</p> 
            <p className="text-xl font-bold text-indigo-600">₹{totalSpent.toFixed(2)}</p>
          </div> 
          <div className="p-3 bg-white border rounded shadow-sm"> 
            <p className="text-sm text-gray-500">Total Planned Budget</p> 
            <p className="text-xl font-bold text-emerald-600">₹{totalPlannedBudget.toFixed(2)}</p> 
          </div> 
          <div className="p-3 bg-white border rounded shadow-sm"> 
            <p className="text-sm text-gray-500">Total Allocated Budget</p> 
            <p className="text-xl font-bold text-emerald-600">₹{totalAllocatedBudget.toFixed(2)}</p> 
          </div> 
          {totalAllocatedBudget - totalSpent >= 0 ? (
            <div className="p-3 bg-white border rounded shadow-sm"> 
              <p className="text-sm text-gray-500">Balance</p> 
              <p className='text-xl font-bold text-emerald-600'>₹{(totalAllocatedBudget - totalSpent).toFixed(2)}</p> 
            </div>
            ) : (
              <div className="p-3 bg-white border rounded shadow-sm"> 
                <p className="text-sm text-gray-500">Overspent</p> 
                <p className='text-xl font-bold text-red-600'>₹{(totalSpent - totalAllocatedBudget).toFixed(2)}</p> 
              </div>
            )
          }
          <div className="p-3 bg-white border rounded shadow-sm"> 
            <p className="text-sm text-gray-500">Months Covered</p> 
            <p className="text-xl font-bold text-gray-700">{data.length}</p> 
          </div>
        </div> 
      </div> 
    ); 
  }; 
  
export default RangeChart;