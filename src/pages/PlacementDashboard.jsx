import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { 
  Users, 
  UserPlus, 
  Upload, 
  Briefcase, 
  List, 
  FileText, 
  Settings, 
  Bell, 
  BarChart3,
  Target,
  Menu,
  X,
  ChevronRight,
  Home,
  TrendingUp,
  Calendar,
  Award,
  Building
} from "lucide-react";

// Import components
import AddStudentForm from "../Dashboards/PlacementDashboard/Student/StudentForm";
import BulkUploadForm from "../Dashboards/PlacementDashboard/Student/BulkUpload";
import StudentList from "../Dashboards/PlacementDashboard/Student/StudentList";
import JobForm from "../Dashboards/PlacementDashboard/job/JobForm";
import JobManager from "../Dashboards/PlacementDashboard/job/JobManager";
import RoundsManager from "../Dashboards/PlacementDashboard/RoundManage/RoundManager";
import UploadApplicants from "../Dashboards/PlacementDashboard/RoundManage/UploadApplicants";
import StudentsAppliedForJob from "../Dashboards/PlacementDashboard/job/StudentsAppliedForJob";
// import ToggleEligibility from "../Dashboards/PlacementDashboard/Student/ToggleEligibility";
import AddRound from "../Dashboards/PlacementDashboard/RoundManage/AddRounds";
import Notices from "../Dashboards/PlacementDashboard/Notice/Notice";
import ManageNotice from "../Dashboards/PlacementDashboard/Notice/ManageNotice";
import Profile from "../Dashboards/PlacementDashboard/PlacementProfile/Profile";
import PlacementUpload from "../Dashboards/PlacementDashboard/PlacementReport/UploadPlacementData";
import PlacementReports from "../Dashboards/PlacementDashboard/PlacementReport/PlacementReport";
// redux imports
import { useDispatch, useSelector } from "react-redux";
import {fetchColleges} from "../Redux/UniversitySlice.js";
import {fetchDept} from '../Redux/DepartmentSlice.js';
import {fetchProgram} from "../Redux/programs.js";
import { fetchStudents } from "../Redux/Placement/StudentsSlice.js";
import { fetchNotices } from "../Redux/Placement/noticeSlice.js";
import { fetchJobs } from "../Redux/Jobslice.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function PlacementDashboard() {
  const location = useLocation();
  const { user } = location.state || {};
  const { universityName } = useParams();
  const { placementname } = useParams();

  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [universityId, setUniversityId] = useState("");
  const [programs, setPrograms] = useState([]);
  const [students, setStudents] = useState([]);
  const [graduationYears, setGraduationYears] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [load, setLoad] = useState(false);
  const [ error, setError] = useState("");
  const [isFetchingAll, setIsFetchingAll] = useState(true);
  const [success, setSuccess] = useState("");
const [notices, setNotices] = useState([]);
const dispatch = useDispatch();
const [jobs, setJobs] = useState([]);
const [openJobs, setOpenJobs] = useState([]);

  const token = localStorage.getItem("University authToken");
  const placementName = localStorage.getItem("placementName");

  // Dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    totalJobs: 0,
    placedStudents: 0,
    activeNotices: 0,
    placementRate: 0,
    activeCompanies: 0
  });

  // fetc with token 
const fetchcolleges = async () => {
  if (!token) {
    setError("Authentication token is missing.");
    return;
  }
  setLoad(true);
  try {
    // If your thunk expects BASE_URL, include it here
    const result = await dispatch(fetchColleges({ token, universityName, BASE_URL }));
    if (result.meta.requestStatus === "fulfilled") {
      setError("");
      setSuccess("Colleges fetched successfully.");
      // console.log("Colleges fetched successfully in PlacementDashboard:", result.payload);
      // console.log("Colleges fetched:", result.payload);
      setColleges(result.payload);
    } else {
      setError("Something went wrong.");
    }
  } catch (err) {
    setError("Failed to fetch colleges.");
    console.log("Error fetching colleges:", err);
  }
  setLoad(false);
};

const fetchDepartments = async () => {
  if (!token) {
    setError("Authentication token is missing.");
    return;
  }
  setLoad(true);
  try {
    const result = await dispatch(fetchDept({ token, universityName, BASE_URL }));
    if (result.meta.requestStatus === "fulfilled") {
      setError("");
      setSuccess("Departments fetched successfully.");
      // console.log("Departments fetched successfully in PlacementDashboard:", result.payload);
      setDepartments(result.payload);
    } else {
      setError("Something went wrong.");
    }
  } catch (err) {
    setError("Failed to fetch departments.", err);
    // console.log("Error fetching departments:", err);
  }
  setLoad(false);
}
const fetchPrograms = async () => {
  if (!token) {
    setError("Authentication token is missing.");
    return;
  }
  setLoad(true);
  try {
    const result = await dispatch(fetchProgram({ token, universityName, BASE_URL }));
    if (result.meta.requestStatus === "fulfilled") {
      setError("");
      setSuccess("Programs fetched successfully.");
      console.log("Programs fetched successfully in PlacementDashboard:", result.payload);
      setPrograms(result.payload);
    }
    else {
      setError("Something went wrong.");
    }
  } catch (err) {
    setError("Failed to fetch programs.");
    console.log("Error fetching programs:", err);
  }
  setLoad(false);
};

const getjobs = async () => {
  console.log("🔔 Starting fetchjobs with token:", token);
  if (!token) {
    console.error("⚠️ Token missing for fetchjobs");
    setError("Authentication token is missing.");
    return;
  }
  console.log("🔔 fetchjobs started");

  setLoad(true);
  try {
    console.log("🔔 Dispatching fetchJobs...");
    const result = await dispatch(fetchJobs({ token, universityName }));

    console.log("✅ Jobs fetched result:", result);

    if (result.meta.requestStatus === "fulfilled") {
      const fetchedJobs = result.payload;
      console.log("✅ Jobs fetched successfully:", fetchedJobs);

      setJobs(fetchedJobs);

      const openJobs = fetchedJobs.filter(job => 
        job.status === 'open' || job.isOpen === true
      );
      console.log("✅ Filtered openJobs:", openJobs);

      setOpenJobs(openJobs);

      setDashboardStats(prev => ({
        ...prev,
        totalJobs: openJobs.length
      }));

    } else {
      console.error("❌ fetchJobs failed:", result);
      setError("Failed to fetch jobs.");
    }
  } catch (err) {
    console.error("❌ Error in fetchjobs catch block:", err);
    setError("An error occurred while fetching jobs.");
  }
  setLoad(false);
};
const handleFetchStudents = async () => {
  console.log("fetchin students")
  if (!token) {
    setError("Authentication token is missing.");
    return;
  }
  setLoad(true);
  try {
    const result = await dispatch(fetchStudents({ token, universityName, BASE_URL }));
    if (result.meta.requestStatus === "fulfilled") {
      setError("");
      setSuccess("Students fetched successfully.");
      console.log("Students fetched successfully in PlacementDashboard:", result.payload);
      const fetchedStudents = result.payload.students;
      setStudents(result.payload);
      const placedCount =  fetchedStudents.filter(s => s.placements && s.placements.length > 0).length;
      console.log("Placed students count:", placedCount);
        const placementRate = fetchedStudents.length > 0 
          ? Math.round((placedCount / fetchedStudents.length) * 100)
          : 0;

        setDashboardStats(prev => ({
          ...prev,
          totalStudents: fetchedStudents.length,
          placedStudents: placedCount,
          placementRate
        }));

        console.log("Fetched students:", fetchedStudents);
        console.log("Placement rate:", placementRate);
        console.log("placementCount:", placedCount);

    } else {
      setError("Something went wrong.");
    }
  } catch (err) {
    setError("Failed to fetch students.");
    console.log("Error fetching students:", err);
  }
  setLoad(false);
};

// fetch notices as welll  using the redux 
const fetchNotice = async () => {
  if (!token) {
    setError("Authentication token is missing.");
    return;
  }
  setLoad(true);
  try {
    const result = await dispatch(fetchNotices({ token, universityName, BASE_URL }));
    if (result.meta.requestStatus === "fulfilled") {
      setError("");
      setSuccess("Notices fetched successfully.");
      console.log("Notices fetched successfully in PlacementDashboard:", result.payload);
      setNotices(result.payload);
    } else {
      setError("Something went wrong.");
    }
  } catch (err) {
    setError("Failed to fetch notices.");
    console.log("Error fetching notices:", err);
  }
  setLoad(false);
};

useEffect(() => {
  const fetchAll = async () => {
    console.log("🚀 Starting fetchAll");
    setIsFetchingAll(true);
    await Promise.all([
      getjobs() ,
      fetchcolleges(),
      fetchDepartments(),
      fetchPrograms(),
      handleFetchStudents(),
      fetchNotice(),
      
    ]);
    console.log("✅ Completed fetchAll");
    setIsFetchingAll(false);
  };
  fetchAll();
  // eslint-disable-next-line
}, [universityName]);

  const sidebarItems = [
    { 
      id: "Dashboard", 
      label: "Dashboard", 
      icon: Home,
      category: "overview"
    },
    { 
      id: "AddStudentForm", 
      label: "Add Student", 
      icon: UserPlus,
      category: "students"
    },
    { 
      id: "BulkUploadForm", 
      label: "Bulk Upload", 
      icon: Upload,
      category: "students"
    },
    { 
      id: "StudentList", 
      label: "Students List", 
      icon: Users,
      category: "students"
    },
    { 
      id: "JobForm", 
      label: "Add Job", 
      icon: Briefcase,
      category: "jobs"
    },
    { 
      id: "JobList", 
      label: "Jobs List", 
      icon: List,
      category: "jobs"
    },
    { 
      id: "StudentsAppliedForJob", 
      label: "Job Applications", 
      icon: FileText,
      category: "jobs"
    },
    { 
      id: "AddRound", 
      label: "Manage Rounds", 
      icon: Target,
      category: "rounds"
    },
    { 
      id: "PlacementReports", 
      label: "Placement Reports", 
      icon: BarChart3,
      category: "reports"
    },
    { 
      id: "PlacementUpload", 
      label: "Upload Placement", 
      icon: Upload,
      category: "reports"
    },
    { 
      id: "Notice", 
      label: "Create Notice", 
      icon: Bell,
      category: "notices"
    },
    { 
      id: "ManageNotice", 
      label: "Manage Notices", 
      icon: Settings,
      category: "notices"
    },
    { 
      id: "Profile", 
      label: "Profile", 
      icon: Settings,
      category: "settings"
    }
  ];

  const categories = {
    overview: "Overview",
    students: "Student Management",
    jobs: "Job Management", 
    rounds: "Round Management",
    reports: "Reports & Analytics",
    notices: "Notices",
    settings: "Settings"
  };

  // Enhanced Dashboard component
  const DashboardOverview = () => (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-blue-100 text-lg">{placementName} Dashboard</p>
            <p className="text-blue-200 text-sm mt-1">{universityName}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{new Date().toLocaleDateString()}</div>
            <div className="text-blue-200 text-sm">Last updated: {new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalStudents}</p>
              <p className="text-xs text-green-600 mt-1">↗ Active students</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalJobs}</p>
              <p className="text-xs text-blue-600 mt-1">↗ Open positions</p>
            </div>
            <div className="p-4 bg-green-50 rounded-2xl">
              <Briefcase className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Placed Students</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.placedStudents}</p>
              <p className="text-xs text-purple-600 mt-1">↗ Successfully placed</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-2xl">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Placement Rate</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.placementRate}%</p>
              <p className="text-xs text-orange-600 mt-1">↗ Success rate</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Target className="w-6 h-6 mr-3 text-blue-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => setActiveComponent("AddStudentForm")}
            className="group flex items-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border border-blue-200"
          >
            <div className="p-3 bg-blue-600 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-blue-900 block">Add New Student</span>
              <span className="text-blue-700 text-sm">Register individual students</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveComponent("JobForm")}
            className="group flex items-center p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 border border-green-200"
          >
            <div className="p-3 bg-green-600 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-green-900 block">Post New Job</span>
              <span className="text-green-700 text-sm">Create job opportunities</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveComponent("Notice")}
            className="group flex items-center p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 border border-purple-200"
          >
            <div className="p-3 bg-purple-600 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-purple-900 block">Create Notice</span>
              <span className="text-purple-700 text-sm">Send announcements</span>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-3 text-blue-600" />
            Recent Activities
          </h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">New students registered</p>
                <p className="text-sm text-gray-600">5 students added today</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <Briefcase className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">New job posted</p>
                <p className="text-sm text-gray-600">Software Engineer at TechCorp</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <Award className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Placement success</p>
                <p className="text-sm text-gray-600">3 students placed this week</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Building className="w-5 h-5 mr-3 text-blue-600" />
            System Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="font-medium text-gray-700">Total Colleges</span>
              <span className="font-bold text-gray-900">{colleges.length}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="font-medium text-gray-700">Total Departments</span>
              <span className="font-bold text-gray-900">{departments.length}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="font-medium text-gray-700">Total Programs</span>
              <span className="font-bold text-gray-900">{programs.length}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="font-medium text-gray-700">Graduation Years</span>
              <span className="font-bold text-gray-900">{graduationYears.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const components = {
    Dashboard: <DashboardOverview />,
    AddStudentForm: <AddStudentForm   
      universityId={universityId}
      colleges={colleges}
      departments={departments}
      programs={programs}
      onStudentAdded={() => window.location.reload()} 
    />,
    BulkUploadForm: <BulkUploadForm 
      universityId={universityId}
      colleges={colleges}
      departments={departments}
      programs={programs}
      onUploadSuccess={() => window.location.reload()} 
    />,
    StudentList: <StudentList 
      colleges={colleges} 
      departments={departments}  
      programs={programs} 
    />,
    JobForm: <JobForm 
      user={user}  
      colleges={colleges}
      departments={departments}
      programs={programs} 
      onJobAdded={() => window.location.reload()} 
    />,
    JobList: <JobManager 
      colleges={colleges} 
      departments={departments} 
      programs={programs}
    />,
    RoundsManager: <RoundsManager 
      user={user} 
      universityName={universityName} 
      colleges={colleges} 
      departments={departments} 
    />,
    UploadApplicants: <UploadApplicants 
      user={user} 
      universityName={universityName} 
      colleges={colleges} 
      departments={departments} 
    />,  
    PlacementUpload: <PlacementUpload 
      universityName={universityName} 
      colleges={colleges} 
      departments={departments} 
      programs={programs}
    />,
    PlacementReports: <PlacementReports  
      colleges={colleges}
      departments={departments}
      programs={programs}
      students={students}
    />,
    StudentsAppliedForJob: <StudentsAppliedForJob 
      user={user} 
      universityName={universityName}  
      departments={departments}  
      programs={programs} 
      colleges={colleges}   
      students={students}
    />,
    // ToggleEligibility: <ToggleEligibility 
    //   colleges={colleges} 
    //   departments={departments} 
    //   programs={programs}
    // />,
    AddRound: <AddRound   
      colleges={colleges} 
      departments={departments} 
    />,
    Notice: <Notices  
      colleges={colleges} 
      departments={departments} 
      programs={programs} 
      students={students}
    />,
    ManageNotice: <ManageNotice  
      colleges={colleges} 
      departments={departments} 
      programs={programs} 
      students={students}
    />,
    Profile: <Profile 
      user={user} 
      colleges={colleges} 
      departments={departments} 
      programs={programs} 
    />
  };

  if (isFetchingAll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 animate-ping mx-auto"></div>
          </div>
          <p className="mt-6 text-gray-700 font-medium">Loading dashboard...</p>
          <p className="text-gray-500 text-sm">Please wait while we prepare your workspace</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Enhanced Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-r border-gray-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Enhanced Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h2 className="text-xl font-bold">{placementName}</h2>
                <p className="text-blue-100 text-sm">{universityName}</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-blue-500 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Enhanced Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {Object.entries(categories).map(([categoryKey, categoryLabel]) => {
              const categoryItems = sidebarItems.filter(item => item.category === categoryKey);
              
              return (
                <div key={categoryKey}>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                    {categoryLabel}
                  </h3>
                  <div className="space-y-1">
                    {categoryItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeComponent === item.id;
                      
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveComponent(item.id);
                            setSidebarOpen(false);
                          }}
                          className={`
                            w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                            ${isActive 
                              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm' 
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }
                          `}
                        >
                          <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                          {item.label}
                          {isActive && <ChevronRight className="w-4 h-4 ml-auto text-blue-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center text-xs text-gray-500">
              <p>© 2024 V-Buzz International</p>
              <p>Placement Management System</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Enhanced Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-4 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {sidebarItems.find(item => item.id === activeComponent)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-600">
                  {categories[sidebarItems.find(item => item.id === activeComponent)?.category]}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  Welcome, {user?.name || 'Admin'}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.role || 'Placement Admin'}
                </div>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {(user?.name || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {components[activeComponent]}
          </div>
        </main>
      </div>
    </div>
  );
}

export default PlacementDashboard;