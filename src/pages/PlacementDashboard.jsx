import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import AddStudentForm from "../Dashboards/PlacementDashboard/Student/StudentForm";
import BulkUploadForm from "../Dashboards/PlacementDashboard/Student/BulkUpload";
import StudentList from "../Dashboards/PlacementDashboard/Student/StudentList";
import JobForm from "../Dashboards/PlacementDashboard/job/JobForm";
import JobManager from "../Dashboards/PlacementDashboard/job/JobManager";
import RoundsManager from "../Dashboards/PlacementDashboard/RoundManage/RoundManager";
import UploadApplicants from "../Dashboards/PlacementDashboard/RoundManage/UploadApplicants";
import StudentsAppliedForJob from "../Dashboards/PlacementDashboard/job/StudentsAppliedForJob";
import ToggleEligibility from "../Dashboards/PlacementDashboard/PlacementReport/ToggleEligibility.jsx";
import AddRound from "../Dashboards/PlacementDashboard/RoundManage/AddRounds";
import Notices from "../Dashboards/PlacementDashboard/Notice/Notice";
import ManageNotice from "../Dashboards/PlacementDashboard/Notice/ManageNotice";
import Profile from "../Dashboards/PlacementDashboard/PlacementProfile/Profile";
import PlacementUpload from "../Dashboards/PlacementDashboard/PlacementReport/UploadPlacementData";
import PlacementReports from "../Dashboards/PlacementDashboard/PlacementReport/PlacementReport";
import LoadingSpinner from "../components/Resuable/LoadingSpinner.jsx";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import {fetchColleges} from "../Redux/UniversitySlice.js";
import {fetchDept} from '../Redux/DepartmentSlice.js';
import {fetchProgram} from "../Redux/programs.js";
import { fetchStudents } from "../Redux/Placement/StudentsSlice.js";
import { fetchNotices } from "../Redux/Placement/noticeSlice.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function PlacementDashboard() {
  const location = useLocation();
  const { user } = location.state || {};
  const { universityName } = useParams();
  const {placementname} = useParams();
   const token = localStorage.getItem("University authToken");  
   const universityId= localStorage.getItem("universityId");
   const [isFetchingAll, setIsFetchingAll] = useState(true);

  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);
  const [success, setSuccess] = useState("");
  const [colleges, setColleges] = useState([]);
  const [notices, setNotices] = useState([]);


  const [activeComponent, setActiveComponent] = useState("AddStudentForm");
  // const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [students, setStudents] = useState([]);
  const [graduationYears, setGraduationYears] = useState([]);
const [filteredStudents, setFilteredStudents] = useState([]);
const [error, setError] = useState(null);


  const placementName =localStorage.getItem("placementName");


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
const handleFetchStudents = async () => {
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
      setStudents(result.payload);
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
    setIsFetchingAll(true);
    await Promise.all([
      fetchcolleges(),
      fetchDepartments(),
      fetchPrograms(),
      handleFetchStudents(),
      fetchNotice()
    ]);
    setIsFetchingAll(false);
  };
  fetchAll();
  // eslint-disable-next-line
}, [universityName]);


  const components = {
    AddStudentForm: <AddStudentForm />,
    BulkUploadForm: <BulkUploadForm 
    universityId={universityId}
    colleges={colleges}
    departments={departments}
    programs={programs}
    onUploadSuccess={() => window.location.reload()} />,
    StudentList: <StudentList colleges={colleges} departments={departments}  programs={programs} />,
    JobForm: <JobForm user={user}  colleges={colleges}
    departments={departments}
    programs={programs} onJobAdded={() => window.location.reload()} />,
    JobList: <JobManager colleges={colleges} departments={departments} programs={programs}/>,
    RoundsManager: <RoundsManager user={user} universityName={universityName} colleges={colleges} departments={departments} />,
    UploadApplicants: <UploadApplicants user={user} universityName={universityName} colleges={colleges} departments={departments} />,  
    PlacementUpload: <PlacementUpload universityName={universityName} colleges={colleges} departments={departments} programs={programs}/>,
    PlacementReports: <PlacementReports  colleges={colleges}
    departments={departments}
    programs={programs}
    students={students}
    />,
    StudentsAppliedForJob: <StudentsAppliedForJob user={user} universityName={universityName}  departments={departments}  programs={programs} colleges={colleges}   students={students}/>,
    ToggleEligibility:<ToggleEligibility colleges={colleges} departments={departments} programs={programs}/>,
    AddRound: <AddRound   colleges={colleges} departments={departments} />,
    Notice: <Notices  colleges={colleges} departments={departments} programs={programs} students={students}/>,
    ManageNotice: <ManageNotice  colleges={colleges} departments={departments} programs={programs} students={students}/>,
    Profile:<Profile user={user} colleges={colleges} departments={departments} programs={programs} />
  };

  const sidebarItems = [
    { id: "AddStudentForm", label: "Add Student " },
    { id: "BulkUploadForm", label: "Bulk Upload " },
    { id: "StudentList", label: "Students List" },
    { id: "JobForm", label: "Add Job " },
    { id: "JobList", label: "Jobs List" },
    { id: "StudentsAppliedForJob", label: "Students Applied" },
    { id: "AddRound", label: " Add Round" },
    { id: "PlacementReports", label: "Placement Reports" },
    { id: "PlacementUpload", label: "Upload Placement" },
    { id: "Notice", label: "Notice" },
    { id: "ManageNotice", label: "Manage Notice" },
    { id: "Profile", label: "Profile" }
  ];
if (isFetchingAll) {
  return <LoadingSpinner />;
}
  return (
    <div className="bg-gray-100 flex flex-col lg:flex-row h-screen">

      {/* Sidebar */}
      <div
        className={`${
          activeComponent ? "lg:w-52" : "lg:w-0"
        } bg-white shadow-lg lg:flex flex-shrink-0  lg:static lg:h-full lg:overflow-y-auto lg:pb-0 pb-1 overflow-x-auto lg:flex-col flex-row`}
      >
        
        <nav className="lg:space-y-3 lg:px-6 px-1 flex lg:block text-center py-5">
        <h2 className="hidden md:block text-[16px] font-semibold text-center text-gray-700 underline">{placementName}
</h2>

          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveComponent(item.id)}
              className={`text-left py-2 px-4 rounded-lg lg:my-2 text-sm font-small hover:bg-gray-100 ${
                activeComponent === item.id ? "bg-gray-200 font-bold" : "text-gray-600"
              }`}
              aria-label={item.label}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
  

      {/* Main Content */}
      <div className="flex-1  overflow-y-auto">
        <div className="p-1 md:p-2 mx-2 ml-1 md:ml-3">
          <div className=" p-1">{components[activeComponent]}</div>
        </div>
      </div> 
    </div>
  );
}

export default PlacementDashboard;



