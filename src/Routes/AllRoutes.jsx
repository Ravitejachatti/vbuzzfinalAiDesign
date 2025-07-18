import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// Import layouts and pages
import UserLayout from "../Layouts/UserLayout.jsx";

// Import pages
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import Services from "../pages/Service.jsx";
import Contact from "../pages/contactus.jsx";
import  UniversityOnboarding from "../pages/UniversityOnboarding.jsx";
// import UniversityPage from "../pages/UniversityDashboard.jsx";
import CollegeDashboard from "../pages/CollegeDashboard.jsx";
// import DepartmentDashboard from "../pages/DepartmentDashboard.jsx";
import PlacementDashboard from "../pages/PlacementDashboard.jsx";
import StudentDashboard from "../pages/StudentDashboard.jsx";
// import PlacementDirectorPage from "../pages/PlacementDirectorPage.jsx";
import StudentLoginPage from "../pages/StudentLogin.jsx";
import UniversityLogin from "../pages/UniversityLogin.jsx";
import ForgotPassword from "../components/Logins/StudentLogin/ForgotPassword.jsx";
import ResetPassword from "../components/Logins/StudentLogin/ResetPasswordPage.jsx";
import FindJobPage from "../components/NormalPages/FindJob/FindJob.jsx";
import Corporate from "../pages/Corporate.jsx";
import UniversityPlacementPage from "../components/NormalPages/University/UniversityContact/Universities.jsx";
// import Faculty from "../Dashboards/FacultyDashboard/Faculty.jsx"




import NotFound from "../components/Resuable/NotFound.jsx";
// import VbuzzAdmin from "../pages/VbuzzAdmin.jsx";
import Login from "../components/NormalPages/Login/login.jsx";

// Simulated Authentication Management
const getAuthStatus = () => {
  return {
    isUniversityAuthenticated: localStorage.getItem("universityAuth") === "true",
    isStudentAuthenticated: localStorage.getItem("studentAuth") === "true",
  };
};

const ProtectedRoute = ({ isAuthenticated, redirectTo, children }) => {
  return isAuthenticated ? children : <Navigate to={redirectTo} />;
};

const AllRoutes = () => {
  const [authStatus, setAuthStatus] = useState(getAuthStatus());

  useEffect(() => {
    const handleStorageChange = () => setAuthStatus(getAuthStatus());
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        
        {/* Public Routes */}
        <Route path="/university-login" element={<UniversityLogin />} />
        <Route path="/student-login" element={<StudentLoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path ="/login" element ={<Login/>}/>

        {/* Public Layout Routes */}
        <Route path="/" element={<UserLayout />}>

 {/* University Dashboard Routes */}
 {/* <Route
          path="/dashboard/:universityName"
          element={
            <ProtectedRoute
              isAuthenticated={authStatus.isUniversityAuthenticated}
              redirectTo="/university-login"
            >
              <UniversityPage />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/dashboard/:universityName/colleges/:collegeName"
          element={
            <ProtectedRoute
              isAuthenticated={authStatus.isUniversityAuthenticated}
              redirectTo="/university-login"
            >
              <CollegeDashboard />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/dashboard/:universityName/departments/:departmentName"
          element={
            <ProtectedRoute
              isAuthenticated={authStatus.isUniversityAuthenticated}
              redirectTo="/university-login"
            >
              <DepartmentDashboard />
            </ProtectedRoute>
          }
        /> */}
          {/* <Route
          path="/dashboard/:universityName/placementDirector/:placementDirectorName"
          element={
            <ProtectedRoute
              isAuthenticated={authStatus.isUniversityAuthenticated}
              redirectTo="/university-login"
            >
              <PlacementDirectorPage/>
            </ProtectedRoute>
          }
        /> */}
        
        <Route
          path="/dashboard/:universityName/placement/:placementName"
          element={
            <ProtectedRoute
              isAuthenticated={authStatus.isUniversityAuthenticated}
              redirectTo="/university-login"
            >
              <PlacementDashboard />
            </ProtectedRoute>
          }
        />
        {/* Student Dashboard Route */}
        <Route
          path="/dashboard/:universityName/student/:registeredNumber"
          element={
            <ProtectedRoute
              isAuthenticated={authStatus.isStudentAuthenticated}
              redirectTo="/student-login"
            >
              <StudentDashboard />
            </ProtectedRoute>
          }
        /> 

          <Route path="/" element={<Home />} />
          {/* <Route path="/faculty" element={<Faculty />} /> */}
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path = "/find-job" element ={<FindJobPage/>}/>
          <Route path="/university-onboarding" element={<UniversityOnboarding />} />
          <Route path ="/page/companies"element={<Corporate/>}/>
          <Route path="/page/universities" element={<UniversityPlacementPage/>}/>
          {/* <Route path="/admin/pending-universities" element={<VbuzzAdmin/>}/> */}


          <Route path="*" element={<NotFound />} />

          {/* <Route path="/vbuzz-admin" element={<VbuzzAdmin/>}/> */}

        
     
          
          
         
        </Route>
      </Routes>
    </Router>
  );
};

export default AllRoutes;
