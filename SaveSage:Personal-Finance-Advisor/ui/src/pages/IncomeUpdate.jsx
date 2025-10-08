import React, { useState } from 'react'
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom';

const IncomeUpdate = () => {
    const [amount, setAmount] = useState('');
    const [manageIncome, setManageIncome] = useState('50/30/20');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleIncome = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await fetch('/api/updateIncome', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Amount: amount,
                    ManageIncome: manageIncome,
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || data.error || 'Error adding income');
            } else {
                toast.success("Income updated successfully!");
                setAmount('');
                setManageIncome('50/30/20');

                setTimeout(() => {
                    navigate("/home");
                }, 3500);
            }

            

        } catch (err) {
            console.log('Error adding income: ', err);
            alert(err.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="max-w-xl mx-auto flex-1 border border-gray-300 p-4 md:p-8 rounded-lg shadow-md mt-10">
                <h3 className="text-2xl text-yellow-600 font-semibold mb-4">Add Your Income</h3>
                <form onSubmit={handleIncome}>
                    <div className="my-4">
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
                    <div className="my-4">
                        <label className="block font-medium mb-1">Manage your Income*</label>
                        <select 
                            className="border border-gray-300 p-2 rounded w-full"
                            value={manageIncome}
                            onChange={(e) => setManageIncome(e.target.value)} 
                            required
                        >
                            <option value="50/30/20">50/30/20</option>
                            <option value="60/20/20">60/20/20</option>
                            <option value="70/10/20">70/10/20</option>
                        </select>
                    </div>
                    <div>
                        <button 
                            type="submit" 
                            className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded disabled:bg-yellow-300"
                            disabled={loading}
                        >
                            {loading ? 'Updating Income...' : 'Update Income'}
                        </button>
                    </div>
                </form>
                <p className="italic text-sm text-gray-500 mt-4">
                    <b className="text-gray-700">*</b>
                    Note: The <b className="text-gray-700">50/30/20</b> Rule is a fantastic guideline...
                </p>
                <p className="italic text-sm text-gray-500">
                    If you're in debt or behind on saving, shift the ratios to 
                    <b className="text-gray-700"> 60/20/20</b> or even <b className="text-gray-700">70/10/20</b> to boost savings.
                </p>
            </div>
        </>
    )
}

export default IncomeUpdate