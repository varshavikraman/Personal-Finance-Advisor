import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

const ExpensesBarChart = ({ data, month, allocatedBudget = 0, plannedBudget = 0 }) => {
    const [activeIndex, setActiveIndex] = useState(null);
    
    const formatMonthForDisplay = (monthString) => {
        if (!monthString) return '';
        const [year, month] = monthString.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    const colorPalette = {
        expenseAmount: {
            primary: '#6366F1', 
            hover: '#4F46E5',   
            light: '#C7D2FE'   
        },
        budgetLimit: {
            primary: '#10B981', 
            hover: '#059669',   
            light: '#A7F3D0'    
        }
    };

    const formattedMonth = formatMonthForDisplay(month);

    const totalExpenses = data.reduce((sum, item) => sum + (item.expenseAmount || 0), 0);
    
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-4 bg-white border border-gray-200 shadow-lg rounded-lg">
                    <p className="font-semibold text-gray-800">{label}</p>
                    <p className="text-indigo-600">
                        Spent: <span className="font-medium">₹{payload[0].value.toFixed(2)}</span>
                    </p>
                    <p className="text-emerald-600">
                        Budget: <span className="font-medium">₹{payload[1].value.toFixed(2)}</span>
                    </p>
                    {payload[0].value > payload[1].value && (
                        <p className="text-red-500 font-medium mt-1">Over budget!</p>
                    )}
                </div>
            );
        }
        return null;
    };

    const CustomBar = (props) => {
        const { fill, x, y, width, height, index, dataKey } = props;
        const isActive = activeIndex === index;
        const colorKey = dataKey === 'expenseAmount' ? 'expenseAmount' : 'budgetLimit';
        const barFill = isActive ? colorPalette[colorKey].hover : colorPalette[colorKey].primary;

        return (
            <g>
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={barFill}
                    rx={4}
                    ry={4} 
                />
            </g>
        );
    };

    if (!data || data.length === 0) {
        return (
            <div className="h-72 md:h-80 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg p-4 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="mb-4 h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <p className="text-gray-500 text-center">No expense data available </p>
            </div>
        );
    }

    return (
        <div className="font-medium w-full">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">Expenses for {formattedMonth}</h3>
                
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                        <div className="h-3 w-6 rounded-sm bg-indigo-500 mr-2"></div>
                        <span className="text-sm text-gray-600">Amount Spent</span>
                    </div>
                    <div className="flex items-center">
                        <div className="h-3 w-6 rounded-sm bg-emerald-500 mr-2"></div>
                        <span className="text-sm text-gray-600">Budget Limit</span>
                    </div>
                </div>
            </div>
            
            <div 
                className="w-full h-72 md:h-80 lg:h-96 bg-gradient-to-br from-gray-50 to-gray-100 p-2 rounded-lg border border-gray-200"
                onMouseLeave={() => setActiveIndex(null)}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#EEE" />
                        <XAxis 
                            dataKey="category" 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            tick={{ fill: '#4B5563' }}
                        />
                        <YAxis tick={{ fill: '#4B5563' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                            verticalAlign="top" 
                            height={36}
                            iconType="circle"
                            iconSize={10}
                        />
                        <Bar 
                            dataKey="expenseAmount" 
                            name="Amount Spent"
                            shape={<CustomBar dataKey="expenseAmount" />}
                            onMouseOver={(data, index) => setActiveIndex(index)}
                        />
                        <Bar 
                            dataKey="budgetLimit" 
                            name="Budget Limit"
                            shape={<CustomBar dataKey="budgetLimit" />}
                            onMouseOver={(data, index) => setActiveIndex(index)}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-5 p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Allocated Budget</p>
                    <p className="text-xl font-bold text-emerald-600">₹{allocatedBudget.toFixed(2)}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Planned Budget</p>
                    <p className="text-xl font-bold text-indigo-600">₹{plannedBudget.toFixed(2)}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Total Expenses</p>
                    <p className="text-xl font-bold text-gray-700">₹{totalExpenses.toFixed(2)}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Categories</p>
                    <p className="text-xl font-bold text-gray-700">{data.length}</p>
                </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700">Budget Status:</p>
                <p
                    className={
                    totalExpenses > allocatedBudget
                        ? "text-red-500 font-medium"
                        : "text-emerald-500 font-medium"
                    }
                >
                    {totalExpenses > allocatedBudget
                        ? `budget overspent by ₹${(totalExpenses - allocatedBudget).toFixed(2)}`
                        : `Expense within allocated budget, ₹${(allocatedBudget - totalExpenses).toFixed(2)} remaining`
                    }
                </p>
                </div>
            </div>
        </div>
    );
};

export default ExpensesBarChart;