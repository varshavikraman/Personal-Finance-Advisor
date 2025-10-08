import React from 'react';

const Report = ({ monthlyReports, overallReview, suggestions, startMonth, endMonth }) => {
  const formatMonth = (monthString) => {
    if (!monthString) return "";
    const [year, month] = monthString.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleString("default", { month: "short", year: "numeric" });
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          📅 Monthly Expense Report: {formatMonth(startMonth)} to {formatMonth(endMonth)}
        </h3>
        <p className="text-gray-600">
          Analysis of {monthlyReports.length} month{monthlyReports.length !== 1 ? 's' : ''} of spending data
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Overall Financial Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Financial Health</p>
            <p className={`text-2xl font-bold ${getHealthColor(overallReview.spendingHealth)}`}>
              {overallReview.spendingHealth}/100
            </p>
            <p className="text-xs text-gray-500">{getHealthLabel(overallReview.spendingHealth)}</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold text-gray-800">
              ₹{overallReview.totalSpent.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600">Avg Monthly</p>
            <p className="text-2xl font-bold text-gray-800">
              ₹{overallReview.avgMonthlySpending.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600">Overspending</p>
            <p className="text-2xl font-bold text-red-600">
              {overallReview.overspendingMonths}/{overallReview.totalMonths} months
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Budget Usage</p>
            <p className={`text-lg font-bold ${
              overallReview.budgetUtilization <= 100 ? 'text-green-600' : 'text-red-600'
            }`}>
              {overallReview.budgetUtilization.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Savings Rate</p>
            <p className={`text-lg font-bold ${
              overallReview.savingsRate >= 10 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {overallReview.savingsRate.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Income</p>
            <p className="text-lg font-bold text-blue-600">
              ₹{overallReview.totalIncome.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Recommendations for Your Spending</h3>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  suggestion.type === 'critical' ? 'bg-red-50 border-red-400' :
                  suggestion.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex items-start">
                  <span className="text-lg mr-3">
                    {suggestion.type === 'critical' ? '🚨' : 
                     suggestion.type === 'warning' ? '⚠️' : '💡'}
                  </span>
                  <div>
                    <h4 className="font-semibold text-gray-800">{suggestion.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{suggestion.message}</p>
                    <p className="text-xs text-gray-500 mt-2">📌 {suggestion.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Monthly Breakdown</h3>
        <div className="space-y-4">
          {monthlyReports.map((report, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-800 text-lg">
                  {formatMonth(report.month)}
                </h4>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    report.balance >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    Balance: ₹{report.balance.toFixed(2)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    report.budgetUtilization <= 100 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {report.budgetUtilization.toFixed(0)}% Used
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="font-semibold text-lg">
                    ₹{(report.totalSpent ?? 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Planned Budget</p>
                  <p className="font-semibold text-lg">
                    ₹{(report.totalBudget ?? 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Allocated Budget</p>
                  <p className="font-semibold text-lg">
                    ₹{(report.allocatedBudget ?? 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Income</p>
                  <p className="font-semibold text-lg text-blue-600">
                    ₹{(report.income ?? 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Categories</p>
                  <p className="font-semibold text-lg">{report.categoriesCount ?? 0}</p>
                </div>
              </div>


              {report.categories.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Top Spending Categories:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {report.categories.slice(0, 3).map((cat, catIndex) => (
                      <div key={catIndex} > 
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {cat.category || 'No category name'}: ₹{(cat.spent || 0).toFixed(2)}
                          {cat.budget > 0 && (
                            <span className={`ml-1 text-xs ${
                              (cat.spent || 0) > cat.budget ? 'text-red-500' : 'text-green-500'
                            }`}>
                              ({(((cat.spent || 0) / cat.budget) * 100).toFixed(0)}%)
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Report;