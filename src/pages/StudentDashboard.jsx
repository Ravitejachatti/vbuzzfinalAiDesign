import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell, Briefcase, BarChart3, Target, User, FileText, GraduationCap, Menu, X
} from "lucide-react";
import { fetchStudent } from "../Redux/StudentDashboard/StudentSlice";
import JobOpportunities from '../Dashboards/StudentDashboard/Job/JobOpportunities';
import JobRound from '../Dashboards/StudentDashboard/Job/JobRound';
import ManageNotice from '../Dashboards/StudentDashboard/Job/Notices';
import AdmissionStepperPage from '../Dashboards/StudentDashboard/Admission/components/AdmissionStepperPage';
import PlacementAnalysis from '../Dashboards/StudentDashboard/PlacementReports/PlacementAnalysis';
import ProfileManagement from "../Dashboards/StudentDashboard/ProfileManagment";
import ResumeBuilder from "../Dashboards/StudentDashboard/Resume/Resume/ResumeBuilder";
import LoadingSpinner from "../components/Resuable/LoadingSpinner";

function StudentDashboard() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { universityName } = useParams();

  const locationState = location.state || {};
  const localStudent = JSON.parse(localStorage.getItem("Student User") || "{}");
  const studentId = localStudent.id || locationState.student?.id || null;

  const { data: studentData, loading, error } = useSelector((state) => state.student);

  const [activeComponent, setActiveComponent] = useState("ManageNotice");
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (studentId && universityName) {
      dispatch(fetchStudent({ studentId, universityName }));
    }
  }, [studentId, universityName, dispatch]);

  useEffect(() => {
    if (studentData && !localStorage.getItem("studentData")) {
      localStorage.setItem("studentData", JSON.stringify({ student: studentData }));
      localStorage.setItem("department", studentData.department);
    }
  }, [studentData]);

  const components = {
    PlacementAnalysis: <PlacementAnalysis />,
    JobOpportunities: <JobOpportunities />,
    JobRound: <JobRound />,
    ManageNotice: <ManageNotice setUnreadCount={setUnreadCount} />,
    ProfileManagement: <ProfileManagement />,
    AdmissionStepperPage: <AdmissionStepperPage />,
    ResumeBuilder: <ResumeBuilder />,
  };

  const sidebarItems = [
    { id: "ManageNotice", label: "Notices", icon: Bell, description: "View important announcements", badge: unreadCount > 0 ? unreadCount : null },
    { id: "JobOpportunities", label: "Job Opportunities", icon: Briefcase, description: "Browse available positions" },
    { id: "PlacementAnalysis", label: "Placement Reports", icon: BarChart3, description: "Track your placement progress" },
    { id: "JobRound", label: "Interview Rounds", icon: Target, description: "Monitor interview status" },
    { id: "ProfileManagement", label: "Profile Management", icon: User, description: "Update your information" },
    { id: "ResumeBuilder", label: "Resume Builder", icon: FileText, description: "Create professional resumes" },
    { id: "AdmissionStepperPage", label: "Admissions", icon: GraduationCap, description: "Manage applications" },
  ];

  const currentItem = sidebarItems.find((item) => item.id === activeComponent);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 p-4">Error loading student data: {error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Welcome, {studentData?.name || "Student"}
              </h1>
              <p className="text-sm text-gray-500">Student Dashboard</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {(studentData?.name || "S").charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 bg-white shadow-xl border-r min-h-screen">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {(studentData?.name || "S").charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold">{studentData?.name || "Student Name"}</h2>
                <p className="text-sm text-gray-500">Student Dashboard</p>
              </div>
            </div>
          </div>
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveComponent(item.id)}
                  className={`w-full text-left p-4 rounded-xl group ${
                    activeComponent === item.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                      : "text-gray-700 hover:bg-gray-50 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${activeComponent === item.id ? "text-white" : "text-gray-500 group-hover:text-blue-500"}`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className={`px-2 py-1 text-xs rounded-full ${activeComponent === item.id ? "bg-white/20 text-white" : "bg-red-500 text-white"}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-1 ${activeComponent === item.id ? "text-white/80" : "text-gray-500"}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-80 bg-white shadow-xl">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {(studentData?.name || "S").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{studentData?.name || "Student Name"}</h2>
                      <p className="text-sm text-gray-500">Student Dashboard</p>
                    </div>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>
              <nav className="p-4 space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveComponent(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left p-4 rounded-xl group ${
                        activeComponent === item.id
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-50 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${activeComponent === item.id ? "text-white" : "text-gray-500 group-hover:text-blue-500"}`} />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className={`px-2 py-1 text-xs rounded-full ${activeComponent === item.id ? "bg-white/20 text-white" : "bg-red-500 text-white"}`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs mt-1 ${activeComponent === item.id ? "text-white/80" : "text-gray-500"}`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 min-h-screen">
          <div className="bg-white shadow-sm border-b px-6 py-4">
            {currentItem && (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <currentItem.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{currentItem.label}</h1>
                  <p className="text-sm text-gray-500">{currentItem.description}</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
              {components[activeComponent]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;