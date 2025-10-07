import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from '../assets/IMAGE/Savesage-logo29.png';
import IncomeIcon from './icons/IncomeIcon';
import BudgetIcon from './icons/BudgetIcon';
import ExpenseIcon from './icons/ExpenseIcon';
import GoalIcon from './icons/GoalIcon';
import LogoutIcon from './icons/LogoutIcon';
import HomeIcon from './icons/HomeIcon';
import ProfileIcon from './icons/ProfileIcon';
import NotificationIcon from './icons/NotificationIcon';
import SavingsIcon from './icons/SavingsIcon';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ children }) => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Logged out Successfully");
        setTimeout(() => {
          setUser(null); // clear user from context
          navigate("/", { replace: true });
        }, 3500);
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  useEffect(() => {
    const onPageShow = (e) => {
      if (e.persisted) {
        console.log("Page restored from bfcache, profile:", setUser);
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [setUser]);

  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications", { credentials: "include" });
      const data = await res.json();
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <nav>
      <div className="lg:ml-56 relative flex-1 overflow-x-hidden">
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white p-4 flex justify-between items-center">
          <img src={logo} alt="Logo" className="h-12" />
          <div className="flex space-x-4">
            <NavLink to="/view-profile"><ProfileIcon /></NavLink>
            <NavLink to="/notification" className="relative" onClick={() => setUnreadCount(0)}>
              <NotificationIcon />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          </div>
        </div>

        <div className="hidden lg:flex fixed top-0 left-56 right-0 bg-white p-4 justify-end items-center z-10">
          <div className="flex space-x-6 pr-6">
            <NavLink to="/view-profile"><ProfileIcon /></NavLink>
            <NavLink to="/notification"  className="relative" onClick={() => setUnreadCount(0)}>
              <NotificationIcon />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          </div>
        </div>

        <div className="h-screen w-56 fixed top-0 left-0 flex flex-col p-3 border-r border-gray-300 bg-white hidden lg:flex">
          <img src={logo} alt="Logo" className="h-20 mb-4" />
          <NavLink to="/home" className="flex space-x-3 h-14 w-full py-2 px-4 hover:bg-yellow-50 hover:rounded-lg">
            <HomeIcon /><span className="py-2 text-xl">Home</span>
          </NavLink>
          <NavLink to="/income" className="flex space-x-3 h-14 w-full py-2 px-4 hover:bg-yellow-50 hover:rounded-lg">
            <IncomeIcon /><span className="py-2 text-xl">Income</span>
          </NavLink>
          <NavLink to="/budget" className="flex space-x-3 h-14 w-full py-2 px-4 hover:bg-yellow-50 hover:rounded-lg">
            <BudgetIcon /><span className="py-2 text-xl">Budget</span>
          </NavLink>
          <NavLink to="/expense" className="flex space-x-3 h-14 w-full py-2 px-4 hover:bg-yellow-50 hover:rounded-lg">
            <ExpenseIcon /><span className="py-2 text-xl">Expense</span>
          </NavLink>
          <NavLink to="/goal" className="flex space-x-3 h-14 w-full py-2 px-4 hover:bg-yellow-50 hover:rounded-lg">
            <GoalIcon /><span className="py-2 text-xl">Goal</span>
          </NavLink>
          <NavLink to="/savings" className="flex space-x-3 h-14 w-full py-2 px-4 hover:bg-yellow-50 hover:rounded-lg">
            <SavingsIcon /><span className="py-2 text-xl">Wallet</span>
          </NavLink>
          <button 
            onClick={handleLogout} 
            className="flex space-x-3 h-14 w-full py-2 px-4 hover:bg-yellow-50 hover:rounded-lg text-left"
          >
            <LogoutIcon /><span className="py-2 text-xl">Logout</span>
          </button>
        </div>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg">
          <div className="flex justify-around items-center h-16">
            <NavLink to="/home"><HomeIcon /><span className="text-xs mt-1">Home</span></NavLink>
            <NavLink to="/income"><IncomeIcon /><span className="text-xs mt-1">Income</span></NavLink>
            <NavLink to="/budget"><BudgetIcon /><span className="text-xs mt-1">Budget</span></NavLink>
            <NavLink to="/expense"><ExpenseIcon /><span className="text-xs mt-1">Expense</span></NavLink>
            <NavLink to="/goal"><GoalIcon /><span className="text-xs mt-1">Goal</span></NavLink>
            <NavLink to="/savings"><SavingsIcon /><span className="text-xs mt-1">Wallet</span></NavLink>
            <button onClick={handleLogout} className="flex flex-col items-center justify-center p-2 hover:bg-yellow-50 rounded-lg">
              <LogoutIcon /><span className="text-xs mt-1">Logout</span>
            </button>
          </div>
        </div>

        <main className="mt-28 lg:mt-20 p-4">{children}</main>
      </div>
    </nav>
  );
};

export default Navbar;
