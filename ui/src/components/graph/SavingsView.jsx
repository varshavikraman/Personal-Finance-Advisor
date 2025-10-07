// In your main dashboard or savings page
import React, {useState} from 'react'

import SavingsPieChart from './SavingsPieChart';

const SavingsView = () => {

    // Call this function from withdrawal/deposit components after successful API calls
    const triggerRefresh = () => {
        setRefreshFlag(prev => prev + 1);
    };

    return (
        <div className="max-w-6xl mx-4 md:mx-20 grid gap-6 grid-cols-1 px-4 py-10 border border-gray-300 rounded-lg shadow-md mb-5 lg:mb-10">
            <h1 className="text-xl font-bold text-center text-yellow-700 mb-4">Savings Overview</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="lg:col-span-2">
                    <SavingsPieChart />
                </div>
                

            </div>
        </div>
    );
};

export default SavingsView;