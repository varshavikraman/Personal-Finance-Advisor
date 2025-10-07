import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Savings = () => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [savingsBalance, setSavingsBalance] = useState(null); // ✅ added state

  const handleWithdraw = async (e) => {
  e.preventDefault();

  if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
    toast.error("Please enter a valid amount", { position: "top-center", autoClose: 3000 });
    return;
  }

  const amount = parseFloat(withdrawAmount);
  setLoading(true);

  try {
    const response = await fetch('/api/withdrawFromSavings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ amount })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Withdrawal failed');

    toast.success(`Successfully withdrew ₹${amount.toFixed(2)} from savings!`);

    setWithdrawAmount('');
    fetchSavingsBalance(); // ✅ refresh balance


  } catch (error) {
    console.error('Withdrawal error:', error);
    toast.error(error.message || "Withdrawal failed");
  } finally {
    setLoading(false);
  }
};

  const fetchSavingsBalance = async () => {
    try {
      setBalanceLoading(true);
      const response = await fetch('/api/savingsSummary', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch savings balance');
      }

      const data = await response.json();
      setSavingsBalance(data);
    } catch (error) {
      console.error('Error fetching savings balance:', error);
      toast.error(error.message || 'Failed to load savings balance');
    } finally {
      setBalanceLoading(false);
    }
  };

  useEffect(() => {
    fetchSavingsBalance();
  }, []);

  return (
    <>
      {/* Withdraw Card */}
      <div className="max-w-xl mx-auto flex-1 border border-gray-300 p-4 md:p-8 rounded-lg shadow-md mt-10">
        <h3 className="text-2xl text-yellow-600 font-semibold mb-4 text-center">
          Withdraw from Savings
        </h3>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Transfer money from your savings to your available balance.
        </p>

        <form onSubmit={handleWithdraw} className="space-y-5">
            <div className="my-4">
                <label className="block font-medium mb-1">Withdrawal Amount:</label>
                <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="e.g. 5000" 
                    min="0"
                    className="border border-gray-300 p-2 rounded w-full"
                    required
                />
            </div>

            <div className="flex justify-center">
                <button
                type="submit"
                disabled={loading}
                className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-6 rounded disabled:bg-yellow-300 transition-colors duration-200"
                >
                {loading ? 'Processing...' : 'Withdraw'}
                </button>
            </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <div className="flex items-start space-x-2">
              <span className="text-yellow-600 text-lg">⚠️</span>
              <div>
                <p className="text-sm font-medium text-yellow-800">Safety Notice</p>
                <p className="italic text-xs text-yellow-700 mt-1">
                  Withdrawals are recorded and will affect your savings progress.
                  Regular withdrawals may impact your long-term financial goals.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Balance Summary */}
      {!balanceLoading && savingsBalance && (
        <div className="mt-6 p-4 rounded-lg">
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <div className='w-full sm:w-40 p-4 sm:p-8 rounded-lg shadow-md bg-blue-50'>
                <p className="text-sm text-blue-600 font-medium">Total Savings</p>
                <p className="text-lg font-bold text-blue-800">
                  ₹{savingsBalance.totalSavings.toFixed(2)}
                </p>
              </div>
              <div className='w-full sm:w-40 p-4 sm:p-8 rounded-lg shadow-md bg-blue-50'>
                <p className="text-sm text-blue-600 font-medium">Total Withdrawals</p>
                <p className="text-lg font-bold text-blue-800">
                  ₹{savingsBalance.totalWithdrawn.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Withdrawal History */}
            {savingsBalance.withdrawalHistory.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Withdrawal History</h4>
                    <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                        <tr>
                            <th className="px-4 py-2">#</th>
                            <th className="px-4 py-2">Amount (₹)</th>
                            <th className="px-4 py-2">Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {savingsBalance.withdrawalHistory.map((w, idx) => (
                            <tr
                            key={idx}
                            className="border-t hover:bg-gray-50 transition-colors"
                            >
                            <td className="px-4 py-2 font-medium text-gray-800">{idx + 1}</td>
                            <td className="px-4 py-2 text-red-600 font-semibold">₹{w.amount.toFixed(2)}</td>
                            <td className="px-4 py-2">{new Date(w.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            )}
        </div>
      )}
    </>
  );
};

export default Savings;
