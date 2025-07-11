import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaSignOutAlt } from "react-icons/fa";


const Navbar = () => {
  const { universityName } = useParams(); // Correctly destructure universityName from params
  const {registeredNumber} = useParams()

  console.log("UniversityName:", universityName);
  console.log("registeredNumber",registeredNumber)

  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Holds user information
  const [role, setRole] = useState(null); // Holds university role

  // Toggle menu for mobile
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const studentAuth = localStorage.getItem("studentAuth") === "true";
    const universityAuth = localStorage.getItem("universityAuth") === "true";

    if (studentAuth){
      if(registeredNumber && !localStorage.getItem("universityName")){
        localStorage.setItem("universityName", universityName);
        localStorage.setItem("registeredNumber", registeredNumber);
      }

    }
    
    // If universityAuth is true, persist universityName and placementName in localStorage
    if (universityAuth) {
      if (universityName && !localStorage.getItem("universityName")) {
        localStorage.setItem("universityName", universityName); // Store university name if not already set
      }

      const storedUniversityName = localStorage.getItem("universityName");
      const storedPlacementName = localStorage.getItem("placementName");

      const user = JSON.parse(localStorage.getItem("user"));
      setUser({
        type: "university",
        universityName: storedUniversityName,
        placementName: storedPlacementName,
        user,
      });
      setRole(user?.role);
    } else if (studentAuth) {
      const studentName = localStorage.getItem("studentName");
      const registeredNumber = localStorage.getItem("registeredNumber");
      const universityName = localStorage.getItem("universityName");
      setUser({ type: "student", name: studentName, registeredNumber, universityName });
    }
  }, [universityName]);

  console.log("User type for:", user?.type);

  // Handle Logout
  const handleLogout = () => {
    if (user?.type === "student") {
      localStorage.removeItem("studentAuth");
      localStorage.removeItem("studentData");
      localStorage.removeItem("studentName");
      localStorage.removeItem("Student User");
      localStorage.removeItem("Student token");
      localStorage.removeItem("studentDataStudentName");
      localStorage.removeItem("studentData_student");
      localStorage.removeItem("registeredNumber");
      localStorage.removeItem("universityName");
      localStorage.removeItem("studentId");
      localStorage.removeItem("departmentId");
      localStorage.removeItem("department");
    } else if (user?.type === "university") {
      localStorage.removeItem("universityAuth");
      localStorage.removeItem("University authToken");
      localStorage.removeItem("universityName");
      localStorage.removeItem("user");
      localStorage.removeItem("placementName");
    }

    setUser(null); // Reset user state
    setRole(null); // Reset role
    toast.success("Logged out successfully!");
    navigate("/"); // Redirect to the home page
  };

  // Navigate to Dashboard
  const handleDashboardNavigation = () => {
    if (user?.type === "student") {
      const { universityName, registeredNumber } = user;
      navigate(`/dashboard/${encodeURIComponent(universityName)}/student/${encodeURIComponent(registeredNumber)}`);
    } else if (user?.type === "university") {
      const placementName = user?.placementName; // Correctly access placementName

      console.log("name in navbar:", placementName);

      switch (role) {
        case "UniversityAdmin":
          navigate(`/dashboard/${user.universityName}`);
          break;
        case "PlacementAdmin":
          navigate(`/dashboard/${encodeURIComponent(user.universityName)}/placement/${placementName}`);
          break;
        case "CollegeAdmin":
          navigate(`/dashboard/${user.universityName}/colleges/${placementName}`);
          break;
        case "DepartmentAdmin":
          navigate(`/dashboard/${user.universityName}/departments/${placementName}`);
          break;
        default:
          toast.error("Invalid role. Please contact the administrator.");
      }
    }
  };

  return (
    <nav className="bg-gray-900  sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="">
           {/* use image for the logo */}
          <img src="/vcbil.png" alt="Logo" className="h-14 w-auto" />
        </div>

        {/* Hamburger Icon (Visible only on smaller screens) */}
        <button
          className="block md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>

        {/* Navigation Links (Visible on larger screens) */}
        <ul className="hidden md:flex space-x-6 items-center">
          <li>
            <Link to="/" className="text-yellow-500 hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-white hover:text-gray-300">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/services" className="text-white hover:text-gray-300">
              Services
            </Link>
          </li>

          {/* Dynamic User Display */}
          {user ? (
            <li className="flex items-center space-x-2">
              {/* Navigate to Dashboard */}
              <button
                className="text-white text-lg font-bold bg-yellow-500 p-2 rounded-full"
                onClick={handleDashboardNavigation}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center text-white hover:text-gray-300"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link to="/student-login" className="text-white hover:text-gray-300">
                  S. Login
                </Link>
              </li>
              <li>
                <Link to="/university-login" className="text-white hover:text-gray-300">
                  U. Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Navigation Links (Slider for Mobile/Tablet) */}
      <div
        className={`${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } fixed top-20 right-0 h-full w-full bg-blue-500 shadow-lg transition-transform duration-300 lg:hidden`}
      >
        <button
          className="absolute top-4 right-4 text-white focus:outline-none"
          onClick={closeMenu}
          aria-label="Close navigation menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <ul className="flex flex-col space-y-6 p-6">
          <li>
            <Link to="/" className="text-yellow-500 hover:text-gray-300" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-white hover:text-gray-300" onClick={closeMenu}>
              About Us
            </Link>
          </li>
          <li>
            <Link to="/services" className="text-white hover:text-gray-300" onClick={closeMenu}>
              Services
            </Link>
          </li>

          {/* Dynamic User Display */}
          {user ? (
            <li>
              <button
                onClick={handleDashboardNavigation}
                className="text-lg font-bold bg-yellow-500 p-2 rounded-full mr-2 text-white"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </button>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300"
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link to="/student-login" className="text-white hover:text-gray-300" onClick={closeMenu}>
                  S. Login
                </Link>
              </li>
              <li>
                <Link to="/university-login" className="text-white hover:text-gray-300" onClick={closeMenu}>
                  U. Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
