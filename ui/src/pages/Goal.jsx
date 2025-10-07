import React, { useState } from 'react'
import {toast} from 'react-toastify'
import GoalGrid from '../components/GoalGrid';

const Goal = () => {
    const [goalName, setGoalName] = useState('');
    const [target, setTarget] = useState('');
    const [refreshFlag, setRefreshFlag] = useState(0);

    const handleGoal = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/addGoal', {
                method:'POST',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    GoalName:goalName,
                    Target:target,
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || data.error || 'Error Goal expense')
            }

            toast.success("Goal added successfully!");

            setGoalName('')
            setTarget('')

            setRefreshFlag(prev => prev + 1);

        } catch (err) {
            console.log('Error adding Goale: ', err);
            alert("Something went wrong: " + err.message)
        }
    }
  return (
    <>
        <div className="px-4 mx-auto w-full lg:w-[900px] flex-1 border border-gray-300 p-4 lg:p-8 rounded-lg shadow-md">
            <h3 className="text-2xl text-yellow-600 font-semibold mb-4">Create New Goal</h3>
            <form className="flex flex-wrap items-end space-x-4" onSubmit={handleGoal}>
                <div className="w-full md:w-auto md:flex-1">
                    <label className="block font-medium mb-1">Goal Name</label>
                    <input 
                        type="text" 
                        placeholder="e.g. New Laptop" 
                        className="border border-gray-300 p-2 rounded w-full"
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)} 
                        required/>
                </div>
                <div className="w-full md:w-auto md:flex-1">
                    <label className="block font-medium mb-1">Target Amount (₹)</label>
                    <input 
                        type="number" 
                        placeholder="e.g. 5000" 
                        className="border border-gray-300 p-2 rounded w-full" 
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        required/>
                </div>
                <div className="w-full md:w-auto">
                    <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded">Save Goal</button>
                </div>
            </form>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-center text-yellow-700 mb-4">My Goal</h1>
            <GoalGrid refreshFlag={refreshFlag}/>
        </div>
    </>
  )
}

export default Goal