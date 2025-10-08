import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SavingsPieChart = () => {
    const [savingsData, setSavingsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const COLORS = [
        '#64748b', '#ef4444', '#bef264', '#7dd3fc', '#a855f7',
        '#71717a', '#f97316', '#16a34a', '#0284c7', '#a21caf',
        '#78716c', '#fde047', '#064e3b', '#3730a3', '#ec4899'
    ];

    const fetchSavingsData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/savingsPieChart', {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch savings data');
            }

            const data = await response.json();
            setSavingsData(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching savings data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavingsData();
    }, []);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800">{data.name}</p>
                    <p className="text-green-600 font-medium">{data.fullAmount}</p>
                    <p className="text-sm text-gray-600">
                        {((data.value / savingsData.totalSavings) * 100).toFixed(1)}% of total
                    </p>
                </div>
            );
        }
        return null;
    };

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
        if (percent < 0.05) return null;
        
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline="central"
                className="text-xs font-medium"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                        <p className="mt-2 text-gray-600">Loading savings data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-red-500 text-lg mb-2">⚠️</div>
                        <p className="text-gray-600">Error loading savings data</p>
                        <button
                            onClick={fetchSavingsData}
                            className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!savingsData || !savingsData.pieChartData || savingsData.pieChartData.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-gray-400 text-4xl mb-3">💰</div>
                        <p className="text-gray-600 font-medium">No Savings Data</p>
                        <p className="text-gray-500 text-sm mt-1">Start saving to see your progress here</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Monthly Savings</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Distribution of your savings across different months
                    </p>
                </div>
                <div className="mt-2 sm:mt-0">
                    <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        <p className="text-sm text-green-800 font-medium">
                            Total Savings: ₹{savingsData.totalSavings.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={savingsData.pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                        >
                            {savingsData.pieChartData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]}
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            wrapperStyle={{
                                paddingLeft: '20px',
                                right: 0
                            }}
                            formatter={(value, entry) => (
                                <span className="text-sm text-gray-600">
                                    {value}
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                        {savingsData.totalMonths}
                    </p>
                    <p className="text-sm text-gray-600">Months with Savings</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                        ₹{(savingsData.totalSavings / savingsData.totalMonths).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Average per Month</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                        {savingsData.pieChartData[0]?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">Top Saving Month</p>
                </div>
            </div>

        </div>
    );
};

export default SavingsPieChart;