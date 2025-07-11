// src/pages/Login.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../Redux/Auth/Action.js';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Dispatch the action and await the returned value
      const response = await dispatch(loginUser({ email, password }));
      
      console.log("login response:", response);
  
      // Check if the login was successful
      if (response && response.success) {
        toast.success('Login successful');
      } else {
        // Handle error message from the response
        console.log("Error:", response.message);
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      // Catch and display any unexpected errors
      console.error("Unexpected error:", error);
      toast.error('An unexpected error occurred');
    }
  };
  
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md bg-white p-8 rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold text-gray-800 text-center mb-6'>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='email' className='block text-gray-700 font-semibold mb-2'>Email</label>
            <input
              type='email'
              id='email'
              autoComplete="email"
              className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='password' className='block text-gray-700 font-semibold mb-2'>Password</label>
            <input
              type='password'
              id='password'
              autoComplete="current-password"
              className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300'
          >
            Login
          </button>
          <p className='text-gray-600 text-sm mt-4 text-center'>
            Don't have an account?{' '}
            <Link to='/register' className='text-blue-600 hover:underline'>
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
