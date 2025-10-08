import React, { useState, useEffect } from 'react';
import BudgetCard from './BudgetCard';

const BudgetGrid = ({ filterMonth, refreshFlag }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const res = await fetch("/api/viewAllBudget", {
          credentials: 'include'
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch budgets');
        }
        
        const data = await res.json();
        setBudgets(data);
      } catch (error) {
        console.log("Error fetching budgets:", error);
        setBudgets([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBudget();
  }, [refreshFlag]);

  const formatMonthForDisplay = (monthString) => {
    if (!monthString) return '';
    const [year, month] = monthString.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;

  const filteredBudgets = filterMonth
    ? budgets.filter(budget => budget.month === filterMonth)
    : budgets.filter(budget => budget.month === currentMonth);

  return (
    <div>
      {loading ? (
        <h1 className="text-center py-8">Loading budgets...</h1>
      ) : filteredBudgets.length === 0 ? (
        <div className="text-center py-8">
          <h1 className="text-lg font-medium mb-2">
            {filterMonth 
              ? `No budgets found for ${formatMonthForDisplay(filterMonth)}` 
              : `No budgets found for ${formatMonthForDisplay(currentMonth)}`}
          </h1>
          {filterMonth && (
            <p className="text-gray-600">Try selecting a different month or clear the filter</p>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 px-4">
          {filteredBudgets.map((budget) => (
            <BudgetCard key={budget._id} budgetData={budget} />
          ))}
        </div>
      )}
    </div>
  )
}

export default BudgetGrid;
