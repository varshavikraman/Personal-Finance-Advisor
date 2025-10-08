import React, { useState, useEffect } from 'react';
import {toast} from 'react-toastify'
import BudgetGrid from '../components/BudgetGrid'

const Budget = () => {
    const [category, setCategory] = useState('');
    const [limit, setLimit] = useState('');
    const [month, setMonth] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [refreshFlag, setRefreshFlag] = useState(0);
    const [totalBudget, setTotalBudget] = useState(0);
    const [plannedBudget, setPlannedBudget] = useState(0);
    const [balance, setBalance] = useState(0);

    const fetchBudgetSummary = async () => {
        try {
            const res = await fetch('/api/viewIncomeDetails', {
                credentials: 'include',
            });
            
            console.log('Response status:', res.status);
        
            const data = await res.json();
            console.log('Budget summary data:', data);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Error response:', errorText);
                throw new Error('Failed to fetch budget summary');
            }
           
            setTotalBudget(data.AllocatedBudget || 0);
            setPlannedBudget(data.PlannedBudget || 0);
            setBalance(data.Balance || 0);
            
        } catch (error) {
            console.error('Error fetching budget summary:', error);
            setTotalBudget(0);
            setBalance(0);
        }
    };

    useEffect(() => {
        fetchBudgetSummary(filterMonth);
    }, [filterMonth]);

    const handleBudget = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/setBudget', {
                method:'POST',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    Category:category,
                    Limit:limit,
                    Month:month
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Error adding expense')
            }

            toast.success("Budget added successfully!");

            setCategory('')
            setLimit('')
            setMonth('')

            await fetchBudgetSummary(filterMonth);
            setRefreshFlag(prev => prev + 1);

        } catch (err) {
            console.log('Error adding Budget: ', err);
            alert("Something went wrong: " + err.message)
        }
    }

    
  return (
    <>
        <div className="px-4 mx-auto w-full lg:w-[900px] flex-1 border border-gray-300 p-4 lg:p-8 rounded-lg shadow-md">
            <h3 className="text-2xl text-yellow-600 font-semibold mb-4">Set New Budget</h3>
            <form className="flex flex-col md:flex-row flex-wrap gap-4 items-end" onSubmit={handleBudget}>
                <div className="w-full md:w-auto md:flex-1">
                    <label className="block font-medium mb-1">Category</label>
                    <input 
                        type="text" 
                        placeholder="e.g. housing, food, transportation, debt, entertainment, etc" 
                        className="border border-gray-300 p-2 rounded w-full"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)} 
                        required
                    />
                </div>
                <div className="w-full md:w-auto md:flex-1">
                    <label className="block font-medium mb-1">Monthly Limit (₹)</label>
                    <input 
                        type="number" 
                        placeholder="e.g. 5000" 
                        className="border border-gray-300 p-2 rounded w-full"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        required
                    />
                </div>
                <div className="w-full md:w-auto md:flex-1">
                    <label className="block font-medium mb-1">Month</label>
                    <input 
                        type="month" 
                        className="border border-gray-300 p-2 rounded w-full" 
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        required/>
                </div>
                <div className="w-full md:w-auto">
                    <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded w-full md:w-auto">Save Budget</button>
                </div>
            </form>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center my-10 gap-4 sm:gap-10 px-4">
            <div className="bg-yellow-50 w-full sm:w-40 p-4 sm:p-8 rounded-lg shadow-md text-center">
                <h4 className="font-medium">Allocated Budget</h4>
                <p>₹ {totalBudget}</p>
            </div>
            <div className="bg-yellow-50 w-full sm:w-40 p-4 sm:p-8 rounded-lg shadow-md text-center">
                <h4 className="font-medium">Planned Budget</h4>
                <p>₹ {plannedBudget}</p>
            </div>
            <div className="bg-yellow-50 w-full sm:w-40 p-4 sm:p-8 rounded-lg shadow-md text-center">
                <h4 className="font-medium">Balance</h4>
                <p>₹ {balance}</p>
            </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-center text-yellow-700 mb-4 md:mb-0">My Budgets</h1>
                <div className="flex items-center gap-2">
                    <label className="font-medium">Filter by Month:</label>
                    <input 
                        type="month" 
                        className="border border-gray-300 p-2 rounded"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                    />
                    {filterMonth && (
                        <button 
                            onClick={() => setFilterMonth('')}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 rounded text-sm"
                        >
                            Clear Filter
                        </button>
                    )}
                </div>
            </div>
            <BudgetGrid filterMonth={filterMonth} refreshFlag={refreshFlag}/>
        </div>
    </>
  )
}

export default Budget