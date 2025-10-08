import React from "react";
import ExpensesRangeView from "../components/graph/ExpenseRangeView";
import ExpensesView from "../components/graph/ExpensesView";
import IncomeGrid from "../components/IncomeGrid";
import SavingsView from "../components/graph/SavingsView";
import { useAuth } from "../context/AuthContext";


const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <h3 className="mx-4 md:mx-20 mt-6 text-2xl font-semibold mb-4">
          Hello! {user.name || "Guest"}
        </h3>
      </div>
      <div className="mb-10">
        <p className="italic text-md text-gray-500 my-4 mx-4 md:mx-20">
          Here's your financial overview
        </p>
        <ExpensesView />
        <ExpensesRangeView/>
        <SavingsView/>
      </div>

      <div className="max-w-6xl mx-4 md:mx-20 px-4 py-10">
        <IncomeGrid showButton={false} />
      </div>
    </>
  );
};

export default Home;
