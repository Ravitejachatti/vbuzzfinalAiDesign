// src/pages/Register.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { registerUser } from '../Redux/Auth/Action.js';
import { toast } from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(registerUser({ name, phone, email, password }));
      if (response.success) {
        toast.success('Registration successful');
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md bg-white p-8 rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold text-gray-800 text-center mb-6'>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='username' className='block text-gray-700 font-semibold mb-2'>Username</label>
            <input
              type='text'
              id='username'
               autoComplete='username'
              className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='phone' className='block text-gray-700 font-semibold mb-2'>Phone</label>
            <input
              type='text'
              id='phone'
               autoComplete='phone'
              className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
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
            Register
          </button>
          <p className='text-gray-600 text-sm mt-4 text-center'>
            Already have an account?{' '}
            <Link to='/login' className='text-blue-600 hover:underline'>
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
