import React, { useState, useEffect } from 'react';
import ExpensesBarChart from './ExpensesBarChart';

const ExpensesView = () => {
  const getCurrentMonth = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}`;
  };
  const [filterMonth, setFilterMonth] = useState(getCurrentMonth());
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({
    barGraphData: [],
    allocatedBudget: 0,
    plannedBudget: 0
});

  const fetchExpenseData = async (month) => {
      setLoading(true);
      try {
        const response = await fetch(`/api/viewExpensesByMonth/${month}`, {
            credentials: 'include'
          });

          if (!response.ok) {
            setChartData({
              barGraphData: [],
              allocatedBudget: 0,
              plannedBudget: 0
            });
            return;
          }

        const data = await response.json();

        setChartData({
            barGraphData: data.barGraphData || [],
            allocatedBudget: data.allocatedBudget || 0,
            plannedBudget: data.plannedBudget || 0
        });
        
      } catch (error) {
        console.error('Error fetching expense data:', error);
        setChartData({
            barGraphData: [],
            allocatedBudget: 0,
            plannedBudget: 0
        });
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchExpenseData(filterMonth);
    }, [filterMonth]);
  return (
    <div className="max-w-6xl mx-4 md:mx-20 grid gap-6 grid-cols-1 px-4 py-10 border border-gray-300 rounded-lg shadow-md mb-5 lg:mb-10">
      <h2 className="text-xl font-bold text-center text-yellow-700 mb-4 lg:mb-2">Monthly Expense Overview</h2>
      
      <div className="flex flex-col lg:items-center gap-2 mb-[20px]">
        <label htmlFor="month-select" className="font-medium">Select Month: </label>
        <input 
            id="month-select"
            type="month" 
            className="border border-gray-300 p-2 rounded" 
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
        />
        {filterMonth !== getCurrentMonth() && (
          <button
            onClick={() => setFilterMonth(getCurrentMonth())}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 rounded text-sm"
          >
            Reset
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading Expense data...</p>
      ) : (
        <ExpensesBarChart 
            data={chartData.barGraphData} 
            month={filterMonth}
            allocatedBudget={chartData.allocatedBudget}
            plannedBudget={chartData.plannedBudget}
        />
      )}
    </div>
  )
}

export default ExpensesView