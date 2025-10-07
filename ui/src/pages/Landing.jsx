import React from 'react'
import Footer from '../components/Footer'
import logo from '../assets/IMAGE/Savesage-logo29.png'
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="bg-yellow-50 min-h-screen">
        <img src={logo} alt="logo" className="mx-auto pt-6"/>
        <p className="text-3xl font-bold text-center text-yellow-800 my-5">Take Control of Your Finances with SaveSage</p>
        <p className="text-lg text-yellow-400 text-center italic my-5">Track expenses, set goals, and build better financial habits — all in one secure platform tailored just for you.</p>
        <div className="flex justify-center space-x-24 my-20">
            <button className="bg-red-300 hover:bg-rose-900 text-white py-2 px-4 rounded">
                <Link to="/signup" className="text-white">Sign Up</Link>
            </button>
            <button className="bg-rose-400 hover:bg-red-900 text-white py-2 px-4 rounded">
                <Link to="/login" className="text-white">Log In</Link>
            </button>
        </div>
        <Footer/>
    </div>
  )
}

export default Landing