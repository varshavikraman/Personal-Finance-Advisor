import React from 'react'

const BudgetCard = ({ budgetData }) => {
  const { category, limit, spent, balance, month } = budgetData;
  
  const percentageUsed = limit > 0 ? (spent / limit) * 100 : 0;
  
  return (
    <div className="border border-gray-300 p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
      <p className="font-bold text-xl text-yellow-700 capitalize">{category}</p>
      <p className="mt-2 text-sm text-gray-500">{month}</p>
      
      <div className="mt-4">
        <p className="text-gray-800 font-medium">
          Monthly Limit: <span className="font-semibold">₹{limit}</span>
        </p>
        <p className="text-gray-800 font-medium">
          Spent: <span className="font-semibold">₹{spent}</span>
        </p>
        <p className="text-gray-800 font-medium">
          Remaining: <span className="font-semibold">₹{Math.max(balance, 0)}</span>
        </p>
      </div>
      
      <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${percentageUsed > 100 ? 'bg-red-600' : 'bg-green-600'}`}
          style={{ width: `${Math.min(percentageUsed, 100)}%` }}
        ></div>
      </div>
      
      {percentageUsed > 100 && (
        <p className="mt-2 text-red-600 text-sm font-semibold">
          Over budget by ₹{spent - limit}
        </p>
      )}
    </div>
  )
}

export default BudgetCard