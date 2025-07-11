import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Install react-icons if not installed

const StudentLogin = () => {
  const [registeredNumber, setRegisteredNumber] = useState("");
  const [password, setPassword] = useState("");
  const [universityName, setUniversityName] = useState("Andhra University");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await axios.post(
        `${baseUrl}/student/login?universityName=${encodeURIComponent(universityName)}`,
        {
          registered_number: registeredNumber,
          password: password,
        }
      );
      console.log("Login successful and the response data:", response.data);
      alert("Login successful!");
      // Assuming 'response' contains the given JSON object:
      localStorage.setItem("Student token", response.data.token); // Sets the token
      localStorage.setItem("Student User", JSON.stringify(response.data.student));
      localStorage.setItem("user", JSON.stringify(response.data.student)); // Stores the student object as JSON
      localStorage.setItem("studentAuth", "true"); // Indicates the student is authenticated
      localStorage.setItem("studentName",response.data.student.name)

      window.dispatchEvent(new Event("storage"));

      navigate(`/dashboard/${encodeURIComponent(universityName)}/student/${encodeURIComponent(registeredNumber)}`, {
        state: response.data,
      });
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage(error.response?.data?.message || "An error occurred during login.");
      alert(error.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Student Login</h1>
        <form onSubmit={handleLogin} className="mt-6">
          <div className="mb-4">
            <label htmlFor="universityName" className="block text-sm font-medium text-gray-700">
              Andhra University
            </label>
            <input
              type="text"
              id="universityName"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={"Andhra University"}
              // onChange={(e) => setUniversityName(e.target.value)}
              onChange={(e) => setUniversityName("Andhra University")}
              required
              placeholder="university name (e.g., Andhra University)"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="registeredNumber" className="block text-sm font-medium text-gray-700">
              Registered Number
            </label>
            <input
              type="text"
              id="registeredNumber"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={registeredNumber}
              onChange={(e) => setRegisteredNumber(e.target.value)}
              required
              placeholder="Enter your registered number"
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"} // Toggle password visibility
              id="password"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
            {/* Eye Icon */}
            <div
              className="absolute top-10 right-4 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          {errorMessage && (
            <p className="mb-4 text-sm text-red-500">{errorMessage}</p>
          )}
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white bg-blue-500 rounded-md ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <div>
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              <p className="text-center mt-4">Forgot Password?</p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
