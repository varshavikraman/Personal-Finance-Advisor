import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError] = useState('');

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/signup',{
        method:'POST',
        credentials:'include',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          Name: name,
          Email: email,
          Password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || data.error || 'Sign Up Failed');
      }
      navigate('/login');
    } catch (err) {
      console.log('Error in signup:',err)
      setError(err.message || 'Signup Failed: Please Try Again!');
    }
  }
  return (
    <div className="bg-yellow-50 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg shadow-yellow-900 p-6">
        <h1 className="text-yellow-600 text-3xl font-semibold text-center py-4">Sign Up</h1>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        <form className="flex flex-col gap-y-5" onSubmit={handleSignup}>
        <div className="flex flex-col gap-y-2">
            <label className="font-medium text-md">Name:</label>
            <input 
              type="text" 
              required 
              className="border-gray-300 outline outline-gray-400 focus:border-2 border-gray-700 focus:outline-black w-full h-9 rounded-md px-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

            <button type="submit" className="h-9 mx-auto px-4 bg-yellow-600 rounded-sm text-white">
              SignUp
            </button>
        </form>

        <p className="text-center pt-7 text-sm">
          Already have an account? 
          <Link to="/login" className="text-yellow-600 font-medium"> Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup