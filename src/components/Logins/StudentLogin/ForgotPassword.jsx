import React, { useState } from 'react';
import axios from 'axios';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/student/forgot-password?universityName=${encodeURIComponent(universityName)}`,
        {
          email,
        }
      );

      if (response.status === 200) {
        setMessage(response.data.message || 'Password reset email sent.');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred. Please try again.';
      setMessage(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit}>
          {/* University Name Input */}
          <div className="mb-4">
            <label htmlFor="universityName" className="block text-gray-700 font-semibold mb-2">
              University Name
            </label>
            <input
              type="text"
              id="universityName"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your university name"
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              required
            />
          </div>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Submit
          </button>
        </form>
        {message && (
          <div className="mt-4 text-center text-gray-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
