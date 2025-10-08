import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError] = useState('');

  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login',{
        method:'POST',
        credentials:'include',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          Email:email,
          Password:password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || data.error || 'Login Failed');
      }

      await refreshUser();

      navigate('/home');
    } catch (err) {
      console.log('Error in login:',err)
      setError(err.message || 'Login Failed: Please Try Again!');
    }
  }

  return (
    <div className="bg-yellow-50 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg shadow-yellow-900 p-6">
        <h1 className="text-yellow-600 text-3xl font-semibold text-center py-4">Login</h1>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        <form className="flex flex-col gap-y-5" onSubmit={handleLogin}>
          <div className="flex flex-col gap-y-2">
            <label className="font-medium text-md">Email:</label>
            <input 
              type="email" 
              required 
              className="border-gray-300 outline outline-gray-400 focus:border-2 border-gray-700 focus:outline-black w-full h-9 rounded-md px-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <label className="font-medium text-md">Password:</label>
            <input 
              type="password" 
              required 
              className="border-gray-200 outline outline-gray-400 focus:border-2 border-gray-700 focus:outline-black w-full h-9 rounded-md px-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <button type="submit" className="h-9 px-4 bg-yellow-600 rounded-sm text-white">
              Login
            </button>
            <Link to="/signup" className="text-yellow-600 text-sm">Forgot Password?</Link>
          </div>
        </form>

        <p className="text-center pt-7 text-sm">
          Don't have an account? 
          <Link to="/signup" className="text-yellow-600 font-medium"> Sign Up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
