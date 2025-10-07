import React, { useState, useEffect } from "react";
import RangeChart from "./RangeChart";
import CategoryBreakdown from "./CategoryBreakdown";
import Report from "./Report";

const ExpensesRangeView = () => {
  const [range, setRange] = useState({ start: "", end: "" });
  const [expenseData, setExpenseData] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatMonth = (monthString) => {
    if (!monthString) return "";
    const [year, month] = monthString.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleString("default", { month: "short", year: "numeric" });
  };

  const fetchExpenseData = async () => {
    if (!range.start || !range.end) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/viewExpensesByRange?start=${range.start}&end=${range.end}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to fetch expenses");
      }

      const data = await response.json();
      setExpenseData(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenseData(null);
    } finally {
      setLoading(false);
    }
  };

  const clearRange = () => {
    setRange({ start: "", end: "" });
    setExpenseData(null);
  };

  useEffect(() => {
    fetchExpenseData();
  }, [range]);

  // Calculate total budget from all selected months
  const totalBudgetSum = expenseData?.barGraphData?.reduce((sum, month) => sum + month.budgetLimit, 0) || 0;

  return (
    <div className="max-w-6xl mx-4 md:mx-20 grid gap-6 grid-cols-1 px-4 py-10 border border-gray-300 rounded-lg shadow-md mb-5 lg:mb-10">
      <h2 className="text-xl font-bold text-center text-yellow-700 mb-4">
        Expense Overview (Range)
      </h2>

      {/* Range filter with clear button */}
      <div className="flex flex-col lg:flex-row lg:items-end gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex-1">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Start Month
            </label>
            <input
              type="month"
              value={range.start}
              onChange={(e) => setRange({ ...range, start: e.target.value })}
              className="w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"            />
          </div>
          <div className="flex-1">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              End Month
            </label>
            <input
              type="month"
              value={range.end}
              onChange={(e) => setRange({ ...range, end: e.target.value })}
              className="w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"            />
          </div>
        </div>
        <div className="flex items-end lg:flex-row gap-2">
          <button
            onClick={clearRange}
            disabled={!range.start && !range.end}
            className="flex-1 lg:flex-none px-4 py-2.5 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-lg transition-colors duration-200 font-medium disabled:cursor-not-allowed"
          >            
            Clear
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      {(range.start || range.end) && (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
            <div className="flex justify-between items-start sm:items-center">
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-blue-600 font-medium mb-1">Selected Range</p>
                <p className="text-sm sm:text-lg font-semibold text-blue-800 leading-tight">
                  {formatMonth(range.start)} to {formatMonth(range.end)}
                </p>
              </div>
              <span className="text-lg sm:text-xl ml-2 text-blue-500 flex-shrink-0">📅</span>
            </div>
          </div>
          
          {expenseData && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4">
                <div className="flex justify-between items-start sm:items-center">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-green-600 font-medium mb-1">Total Budget</p>
                    <p className="text-sm sm:text-lg font-semibold text-green-800">
                      ₹{totalBudgetSum.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-lg sm:text-xl ml-2 text-green-500 flex-shrink-0">💰</span>
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 sm:p-4">
                <div className="flex justify-between items-start sm:items-center">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-purple-600 font-medium mb-1">Months Covered</p>
                    <p className="text-sm sm:text-lg font-semibold text-purple-800">
                      {expenseData.barGraphData?.length || 0} months
                    </p>
                  </div>
                  <span className="text-lg sm:text-xl ml-2 text-purple-500 flex-shrink-0">📊</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8 sm:py-12 lg:py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-500 mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Loading your expense data...</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">This may take a moment</p>
        </div>
      )}

      {/* Empty State - No Range Selected */}
      {!loading && (!range.start || !range.end) && (
        <div className="text-center py-8 sm:py-12 lg:py-16 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">📅</div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-medium mb-2">
            Select a Date Range
          </p>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto px-4">
            Choose start and end months to analyze your expenses across multiple periods
          </p>
        </div>
      )}

      {/* Empty State - No Data Found */}
      {!loading && range.start && range.end && !expenseData && (
        <div className="text-center py-8 sm:py-12 lg:py-16 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">📊</div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-medium mb-2">
            No Data Found
          </p>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto px-4">
            No expense data available for the selected range. Try different months.
          </p>
        </div>
      )}

      {/* Data Display */}
      {!loading && expenseData && (
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
          {/* Range Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <RangeChart
              data={expenseData.barGraphData || []}
              start={range.start}
              end={range.end}
              totalSpent={expenseData.totalSpent}
              totalPlannedBudget={expenseData.totalPlannedBudget}
              totalAllocatedBudget={expenseData.totalAllocatedBudget}
            />
          </div>
          
          {/* Category Breakdown */}
          {expenseData.categoryData && expenseData.categoryData.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <CategoryBreakdown 
                categoryData={expenseData.categoryData}
                overspendingCategories={expenseData.overspendingCategories || []}
              />
            </div>
          )}
          
          {/* Monthly Report */}
          {expenseData.monthlyReports && expenseData.monthlyReports.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <Report 
                monthlyReports={expenseData.monthlyReports}
                overallReview={expenseData.overallReview}
                suggestions={expenseData.suggestions}
                startMonth={range.start}
                endMonth={range.end}
              />
            </div>
          )}
        </div>
      )}

    </div>
    
  );
};

export default ExpensesRangeView;