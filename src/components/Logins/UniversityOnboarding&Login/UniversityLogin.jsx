import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UniversityLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Access the base URL from the .env file
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}/user/login?universityName=${universityName}`,
        {
          email,
          password,
        }
      );

      const { message, token, user } = response.data;
      // Set universityId for all roles if present
if (user.universityId) {
  localStorage.setItem("universityId", user.universityId);
}

      // Save token and user info to localStorage
      localStorage.setItem("University authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("universityAuth", "true");
      //universityid
      localStorage.setItem("universityName", universityName);
      //universityid
      localStorage.setItem("universityId",user.universityId)
    

      // Store placementName permanently in localStorage for PlacementAdmin
      if (user.role === "PlacementAdmin" && user.placementname) {
        localStorage.setItem("placementName", user.placementname);
      }

      if (user.role === "PlacementDirector" && user.name){
        localStorage.setItem("placementDirectorName", user.name)
      }

      window.dispatchEvent(new Event("storage"));

      alert(user.role + " has " + message);

      // Role-based navigation with response passed as props
      const { role } = user;
      const loginState = { state: { user, token, message } };

      switch (role) {
        case "UniversityAdmin":
          navigate(`/dashboard/${universityName}`, loginState);
          break;
          
        case "PlacementDirector":
          navigate(`/dashboard/${universityName}/placementDirector/${user.placementDirectorName}`, loginState)
          break;

        case "PlacementAdmin":
          navigate(
            `/dashboard/${universityName}/placement/${user.placementname}`,
            loginState
          );
          break;

        case "CollegeAdmin":
          navigate(
            `/dashboard/${universityName}/colleges/${user.collegeName}`,
            loginState
          );
          break;

        case "DepartmentAdmin":
          navigate(
            `/dashboard/${universityName}/departments/${user.departmentName}`,
            loginState
          );
          break;

        default:
          setError("Invalid role. Please contact the administrator.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="universityName"
              className="block text-sm font-medium text-gray-700"
            >
              University Name
            </label>
            <input
              id="universityName"
              type="text"
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              placeholder="university name (Andhra University)"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <button
              type="button"
              className="absolute top-8 my-auto inset-y-2 right-2 bottom-2 flex items-center p-2  focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition "
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default UniversityLogin;


