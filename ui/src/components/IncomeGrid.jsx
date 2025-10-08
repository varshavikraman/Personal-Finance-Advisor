import React, { useState, useEffect } from 'react';
import IncomeCard from './IncomeCard';

const IncomeGrid = ({ showButton = false }) => {
  const [income, setIncome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshFlag, setRefreshFlag] = useState(0); 

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const res = await fetch("/api/viewIncomeDetails", { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch income');
        const data = await res.json();
        setIncome(data); 
      } catch (error) {
        console.log("Error fetching income:", error);
        setIncome(null);
      } finally {
        setLoading(false);
      }
    };
    fetchIncome();
  }, [refreshFlag]);

  if (loading) return <p>Loading...</p>;
  if (!income) return <p>No income data</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <IncomeCard 
        incomeData={income}  
        showButton={showButton} 
        triggerRefresh={() => setRefreshFlag(prev => prev + 1)}
      />
    </div>
  );
};

export default IncomeGrid;
