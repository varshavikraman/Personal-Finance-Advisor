import React from 'react';

const CategoryBreakdown = ({ categoryData, overspendingCategories }) => {
  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Category Breakdown</h3>
      
      {overspendingCategories.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2">⚠️ Overspending Alert</h4>
          <p className="text-red-700 text-sm">
            You're overspending in {overspendingCategories.length} categor
            {overspendingCategories.length === 1 ? 'y' : 'ies'}
          </p>
          <div className="mt-2 space-y-1">
            {overspendingCategories.map(cat => (
              <div key={cat.category} className="flex justify-between text-red-600 text-sm">
                <span>{cat.category}:</span>
                <span>Overspent by {formatCurrency(cat.overspent)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryData.map((category, index) => (
          <div 
            key={category.category} 
            className={`p-4 border rounded-lg shadow-sm ${
              category.overspent > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-800">{category.category}</h4>
              <span className={`text-sm font-semibold ${
                category.overspent > 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {formatCurrency(category.totalSpent)}
              </span>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Budget:</span>
                <span>{formatCurrency(category.budgetLimit)}</span>
              </div>
              <div className="flex justify-between">
                <span>Transactions:</span>
                <span>{category.expenseCount}</span>
              </div>
              {category.overspent > 0 && (
                <div className="flex justify-between text-red-600 font-medium">
                  <span>Overspent:</span>
                  <span>{formatCurrency(category.overspent)}</span>
                </div>
              )}
              {category.overspent < 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Under budget:</span>
                  <span>{formatCurrency(Math.abs(category.overspent))}</span>
                </div>
              )}
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Spent</span>
                <span>
                  {category.budgetLimit > 0 
                    ? `${Math.min((category.totalSpent / category.budgetLimit) * 100, 100).toFixed(1)}% of budget`
                    : 'No budget set'
                  }
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    category.budgetLimit === 0 ? 'bg-blue-400' :
                    category.totalSpent > category.budgetLimit ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ 
                    width: category.budgetLimit > 0 
                      ? `${Math.min((category.totalSpent / category.budgetLimit) * 100, 100)}%` 
                      : '100%' 
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBreakdown;