import React, { useState } from 'react'
import {toast} from 'react-toastify'
import ExpenseTable from '../components/ExpenseTable'

const Expense = () => {
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [refreshFlag, setRefreshFlag] = useState(0);

    const handleExpense = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/addExpense', {
                method:'POST',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    Category: category,
                    Expense: amount,
                    expenseDate: date
                })
            });

            const data = await response.json();
            console.log('Response status:', response.status);
            console.log('Response data:', data);
            if (!response.ok) {
                throw new Error(data.message || data.error || 'Error adding expense')
            }

            toast.success("Expense added successfully!");

            setCategory('')
            setAmount('')
            setDate('')

            setRefreshFlag(prev => prev + 1);

        } catch (err) {
            console.log('Error adding expense: ', err);
            alert("Something went wrong: " + err.message)
        }
    }

    return (
        <>
            <>
                
                    <div className="px-4 mx-auto w-full lg:w-[900px] flex-1 border border-gray-300 p-4 lg:p-8 rounded-lg shadow-md mt-10">
                        <h3 className="text-2xl text-yellow-600 font-semibold mb-4">Create New Expense</h3>
                        <form className="flex flex-col md:flex-row flex-wrap gap-4 items-end" onSubmit={handleExpense}>
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
                                <label className="block font-medium mb-1">Amount (₹)</label>
                                <input 
                                    type="number" 
                                    placeholder="e.g. 5000" 
                                    className="border border-gray-300 p-2 rounded w-full" 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="w-full md:w-auto md:flex-1">
                                <label className="block font-medium mb-1">Date</label>
                                <input 
                                    type="date" 
                                    className="border border-gray-300 p-2 rounded w-full" 
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    max={new Date().toISOString().split("T")[0]}
                                    required
                                />
                            </div>
                            <div className="w-full md:w-auto">
                                <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded w-full md:w-auto">Save Expense</button>
                            </div>
                        </form>
                    </div>
                    
                    <div className="max-w-6xl mx-auto px-4 py-10">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-center text-yellow-700 mb-4 md:mb-0">My Expenses</h1>
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
                        <ExpenseTable filterMonth={filterMonth} refreshFlag={refreshFlag}/>
                    </div>
            </>
        </>
    )
}

export default Expense