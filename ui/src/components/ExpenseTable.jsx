import React, { useEffect, useState } from 'react';
import {toast} from 'react-toastify'

    const ExpenseTable = ({ filterMonth, refreshFlag }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpenses = async () => {
        try {
            const res = await fetch("/api/viewAllExpenses", {
            credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to fetch expenses");

            const data = await res.json();
            setExpenses(data.expenses || []);
        } catch (error) {
            console.error("Error fetching expenses:", error);
            setExpenses([]);
        } finally {
            setLoading(false);
        }
        };

        fetchExpenses();
    }, [refreshFlag]);

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;

    const formatMonthForDisplay = (monthString) => {
            if (!monthString) return '';
            const [year, month] = monthString.split('-');
            const date = new Date(year, month - 1);
            return date.toLocaleString('default', { month: 'long', year: 'numeric' });
        };

    const filteredExpenses = filterMonth
        ? expenses.filter(expense => expense.month === filterMonth)
        : expenses.filter(expense => expense.month === currentMonth);

    const handleDelete = async (expense) => {
        if (!window.confirm(`Delete ${expense.category} expense of ₹${expense.amount}?`)) return;

        try {
        const res = await fetch('/api/deleteExpense', {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Category: expense.category, Date: expense.date })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to delete expense');

        setExpenses(expenses.filter(e => e._id !== expense._id));
        toast.success("Expense deleted successfully!");
        } catch (error) {
        console.error("Error deleting expense:", error);
        alert("Failed to delete expense: " + error.message);
        }
    };

  return (
    <div className="max-w-5xl my-10 mx-auto p-4 overflow-x-auto">
      {loading ? (
        <h1 className="text-center py-8">Loading expenses...</h1>
      ) : filteredExpenses.length === 0 ? (
        <div className="text-center py-8">
          <h1 className="text-lg font-medium mb-2">
            {filterMonth 
              ? `No expenses found for ${formatMonthForDisplay(filterMonth)}` 
              : `No expenses found for ${formatMonthForDisplay(currentMonth)}`}
          </h1>
          {filterMonth && (
            <p className="text-gray-600">
              Try selecting a different month or clear the filter
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-md overflow-hidden min-w-max">
          <table className="w-full table-auto text-sm text-left">
            <thead className="bg-gray-100 text-gray-800 font-semibold">
                <tr>
                    <th className="px-4 py-3 text-yellow-600 sm:px-6">Date</th>
                    <th className="px-4 py-3 text-yellow-600 sm:px-6">Category</th>
                    <th className="px-4 py-3 text-yellow-600 sm:px-6">Amount</th>
                    <th className="px-4 py-3 text-yellow-600 sm:px-6">Action</th>
                </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredExpenses.map((expense) => (
                <tr key={expense._id} className="border-t">
                    <td className="px-4 py-4 sm:px-6">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="px-4 py-4 sm:px-6">{expense.category}</td>
                    <td className="px-4 py-4 sm:px-6">₹{expense.amount}</td>
                    <td className="px-4 py-4 space-x-2">
                        <button onClick={() => handleDelete(expense)} className="text-red-600 font-semibold">
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 3V4H4V6H5V19A2 2 0 0 0 7 21H17A2 2 0 0 0 19 19V6H20V4H15V3H9M7 6H17V19H7V6Z" />
                              <path d="M9 8V17H11V8H9M13 8V17H15V8H13Z" />
                            </svg>
                        </button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
