import React from 'react';
import {toast} from 'react-toastify';

const GoalCard = ({ goalData, onDelete }) => {
  const { goalName, target, progress, completed } = goalData;

  const progressPercentage = target > 0 ? (progress / target) * 100 : 0;

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete the "${goalName}" goal?`)) return;

    try {
      const res = await fetch('/api/deleteGoal', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ GoalName: goalName })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete goal');

      toast.success(`${goalName} goal deleted successfully!`);

      onDelete(goalData._id);

    } catch (error) {
      console.error("Error deleting goal:", error);
      alert("Failed to delete goal: " + error.message);
    }
  };

  return (
    <div className="border border-gray-300 p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
      <p className="font-bold text-xl text-yellow-700 capitalize">{goalName}</p>
      
      <div className="mt-4">
        <p className="text-gray-800 font-medium">
          Target Amount: <span className="font-semibold">₹{target}</span>
        </p>
        <p className="text-gray-800 font-medium">
          Amount Saved: <span className="font-semibold">₹{progress}</span>
        </p>
        <p className="text-gray-800 font-medium">
          Remaining: <span className="font-semibold">₹{target - progress}</span>
        </p>
      </div>

      <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="h-2.5 rounded-full bg-green-600"
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        ></div>
      </div>
      
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {Math.round(progressPercentage)}% Complete
        </span>
        <button onClick={handleDelete} className="text-red-600 font-semibold">
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 3V4H4V6H5V19A2 2 0 0 0 7 21H17A2 2 0 0 0 19 19V6H20V4H15V3H9M7 6H17V19H7V6Z" />
            <path d="M9 8V17H11V8H9M13 8V17H15V8H13Z" />
          </svg>
        </button>
      </div>

      {completed && (
        <div className="mt-2 text-green-600 font-semibold">
          Goal Completed!
        </div>
      )}
    </div>
  );
}

export default GoalCard;