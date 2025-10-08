import React, { useState, useEffect } from 'react';
import GoalCard from './GoalCard';

const GoalGrid = ({ refreshFlag }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch("/api/viewAllGoals", {
          credentials: 'include'
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch goals');
        }
        
        const data = await res.json();
        setGoals(data);
      } catch (error) {
        console.log("Error fetching goals:", error);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    }
    fetchGoals();
  }, [refreshFlag]);
  const removeGoal = (id) => {
    setGoals(prevGoals => prevGoals.filter(goal => goal._id !== id));
  };

  if (loading) {
    return <div className="text-center py-8">Loading goals...</div>;
  }

  if (goals.length === 0) {
    return <div className="text-center py-8">No goals set yet</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {goals.map((goal) => (
        <GoalCard 
          key={goal._id} 
          goalData={goal} 
          onDelete={removeGoal}
        />
      ))}
    </div>
  );
}

export default GoalGrid;