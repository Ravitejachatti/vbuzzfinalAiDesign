import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const universityName = searchParams.get("universityName");

  console.log("Token:", token);
  console.log("University Name:", universityName);  

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!token || !universityName) {
      setMessage("Invalid or expired reset link.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/student/reset-password?universityName=${encodeURIComponent(universityName)}`,
        {
          token,
          newPassword,
        }
      );

      if (response.status === 200) {
        alert("Password has been reset successfully!");
        navigate("/student-login");
      } else {
        setMessage(response.data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Reset Password Error:", error.response?.data || error.message);
      setMessage(
        error.response?.data?.message || "Failed to reset password. The link may have expired."
      );
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Reset Password</h1>
        <form onSubmit={handleResetPassword}>
          <div className="mb-4 relative">
            <label htmlFor="newPassword" className="block text-gray-700 font-semibold mb-2">
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your new password"
              required
            />
            <div
              className="absolute top-10 right-4 cursor-pointer text-gray-600"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <div className="mb-4 relative">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Confirm your new password"
              required
            />
            <div
              className="absolute top-10 right-4 cursor-pointer text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Reset Password
          </button>
        </form>

        {message && <div className="mt-4 text-center text-red-600">{message}</div>}
      </div>
    </div>
  );
};

export default ResetPassword;
