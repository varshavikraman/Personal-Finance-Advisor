import React from 'react';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

const IncomeCard = ({ incomeData, showButton = false }) => {
  const { Income, AllocatedBudget, AllocatedGoal, AllocatedSavings } = incomeData;

  const handleGoalAllocate = async () => {
    try {
      const res = await fetch("/api/reconcileMonth", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reconcile month");

      toast.success(data.message);
      console.log("Updated goals:", data.goals);

    } catch (error) {
      console.error("Error reconciling month:", error);
      toast.error( error.message);
    }
  }
  const handleSavingsAllocate = async () => {
  try {
    const res = await fetch("/api/addMonthlySavings", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add monthly savings");

    toast.success(data.message);
    console.log("Updated savings:", data.savings);

  } catch (error) {
    console.error("Error adding monthly savings:", error);
    toast.error(error.message);
  }
};

  return (
    <>
      <div className="border border-gray-300 p-6 rounded-xl shadow hover:shadow-lg transition duration-300 ">
        <p className="font-bold text-xl text-yellow-700 capitalize">Income</p>
        <p className="my-4 text-gray-800 font-semibold">₹ {Income}</p>
        {showButton && (
          <Link to="/income-update">
            <button className="bg-yellow-700 hover:bg-yellow-400 text-white font-semibold py-1 px-2 rounded">Update</button>
          </Link>
        )}
        
      </div>
      <div className="border border-gray-300 p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
        <p className="font-bold text-xl text-yellow-700 capitalize">Budget</p>
        <p className="my-4 text-gray-800 font-semibold">₹ {AllocatedBudget}</p>
      </div>
      <div className="border border-gray-300 p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
        <p className="font-bold text-xl text-yellow-700 capitalize">Goal</p>
        <p className="my-4 text-gray-800 font-semibold">₹ {AllocatedGoal}</p>
        {showButton && (
          <button onClick={handleGoalAllocate} className="bg-yellow-700 hover:bg-yellow-400 text-white font-semibold py-1 px-2 rounded">Allocate Goal</button>
        )}
      </div>
      <div className="border border-gray-300 p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
        <p className="font-bold text-xl text-yellow-700 capitalize">Savings</p>
        <p className="my-4 text-gray-800 font-semibold">₹ {AllocatedSavings}</p>
        {showButton && (
          <button onClick={handleSavingsAllocate} className="bg-yellow-700 hover:bg-yellow-400 text-white font-semibold py-1 px-2 rounded">Allocate Savings</button>
        )}
      </div>
    </>
  );
};

export default IncomeCard;
