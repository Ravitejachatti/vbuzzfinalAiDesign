import axios from 'axios';
import AddDepartments from '../Dashboards/CollegeDashboard/AddDepartments';
import ViewStudents from '../Dashboards/CollegeDashboard/Student/ViewStudents';
import CollegeInfo from '../Dashboards/CollegeDashboard/CollegeInformation';
import Reports from '../Dashboards/CollegeDashboard/PlacementReports';
import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import JobOpenings from '../Dashboards/CollegeDashboard/JobOpenings';
import Notices from '../Dashboards/CollegeDashboard/Notices';
import Settings from '../Dashboards/CollegeDashboard/Settings';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDept } from '../Redux/DepartmentSlice';
import { fetchProgram } from '../Redux/programs';
import { fetchStudents } from '../Redux/Placement/StudentsSlice';
import { fetchColleges } from '../Redux/UniversitySlice';
import LoadingSpinner from '../components/Resuable/LoadingSpinner';
import CollegeDepart from '../Dashboards/CollegeDashboard/Department/CollegeDepart';
import CollegeProgram from '../Dashboards/CollegeDashboard/Programs/CollegeProgram';
import CollegeNotice from '../Dashboards/CollegeDashboard/Notice/CollegeNotice';
import CollegeJob from '../Dashboards/CollegeDashboard/job/CollegeJob';
import AddFaculty from '../Dashboards/CollegeDashboard/Faculty/AddFaculty';
import ManageFaculty from '../Dashboards/CollegeDashboard/Faculty/ManageFaculty';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function CollegeDashboard() {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const location = useLocation();
  const { user, token } = location.state || {};
  const CollegeName = user?.collegeName;

  const [activeComponent, setActiveComponent] = useState('ViewStudents');
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [load, setLoad] = useState(false);
  const [isFetchingAll, setIsFetchingAll] = useState(false);

  const fetchCollegesData = async () => {
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }
    setLoad(true);
    try {
      const result = await dispatch(fetchColleges({ token, universityName, BASE_URL }));
      if (result.meta.requestStatus === "fulfilled") {
        setError("");
        setSuccess("Colleges fetched successfully.");
        setColleges(result.payload);
      } else {
        setError("Something went wrong.");
      }
    } catch (err) {
      setError("Failed to fetch colleges.");
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
        setDepartments(result.payload);
      } else {
        setError("Something went wrong.");
      }
    } catch (err) {
      setError("Failed to fetch departments.");
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
        setPrograms(result.payload);
      } else {
        setError("Something went wrong.");
      }
    } catch (err) {
      setError("Failed to fetch programs.");
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
        setStudents(result.payload);
      } else {
        setError("Something went wrong.");
      }
    } catch (err) {
      setError("Failed to fetch students.");
    }
    setLoad(false);
  };

  useEffect(() => {
    const fetchAll = async () => {
      setIsFetchingAll(true);
      await Promise.all([
        fetchCollegesData(),
        fetchDepartments(),
        fetchPrograms(),
        handleFetchStudents(),
      ]);
      setIsFetchingAll(false);
    };
    fetchAll();
  }, [universityName]);

  const components = {
    AddDepartments: (
      <AddDepartments
        collegeId={user?.collegeId}
        token={token}
        colleges={colleges}
        departments={departments}
        programs={programs}
        CollegeName={CollegeName}
      />
    ),
    ManageFaculty: (
      <ManageFaculty
        collegeId={user?.collegeId}
        token={token}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    ViewStudents: (
      <ViewStudents
        collegeId={user?.collegeId}
        token={token}
        colleges={colleges}
        departments={departments}
        programs={programs}
        CollegeName={CollegeName}
        user={user}
      />
    ),
    CollegeInfo: (
      <CollegeInfo
        collegeId={user?.collegeId}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    CollegeDepart: (<CollegeDepart />),
    CollegeProgram: (<CollegeProgram />),
    CollegeNotice: (<CollegeNotice />),
    CollegeJob: (<CollegeJob />),
    AddFaculty: (<AddFaculty />),
    Reports: (
      <Reports
        collegeId={user?.collegeId}
        colleges={colleges}
        departments={departments}
        programs={programs}
        CollegeName={CollegeName}
        token={token}
      />
    ),
    Settings: (
      <Settings
        collegeId={user?.collegeId}
        colleges={colleges}
        departments={departments}
        programs={programs}
        CollegeName={CollegeName}
        token={token}
      />
    ),
  };

  const sidebarItems = [
    { id: 'ViewStudents', label: 'View Students' },
    { id: 'Reports', label: 'Placement Reports' },
    { id: 'CollegeDepart', label: 'CollegeDepart' },
    { id: 'CollegeProgram', label: 'CollegeProgram' },
    { id: 'CollegeNotice', label: 'CollegeNotice' },
    { id: 'CollegeJob', label: 'CollegeJob' },
    { id: 'AddFaculty', label: 'AddFaculty' },
    { id: 'ManageFaculty', label: 'Manage Faculty' },
    { id: 'CollegeInfo', label: 'College Information' },
    { id: 'Settings', label: 'Settings' },
  ];

  if (isFetchingAll) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex overflow-hidden">
        {/* Sidebar */}
        <div className="bg-white shadow-lg hidden md:block w-64 flex-shrink-0">
          <h1 className="text-lg font-semibold text-gray-800 p-6">{CollegeName} Dashboard</h1>
          <nav className="space-y-2 px-6">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveComponent(item.id)}
                className={`w-full text-left py-2 px-4 rounded-md text-gray-700 hover:bg-gray-200 ${
                  activeComponent === item.id ? 'bg-gray-200' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Sidebar */}
        <div className="bg-white shadow-lg md:hidden w-full">
          <select
            onChange={(e) => setActiveComponent(e.target.value)}
            className="w-full p-3 bg-gray-100 text-gray-700"
          >
            {sidebarItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-2 md:p-4 w-full max-w-full overflow-auto">
            {components[activeComponent]}
          </div>
        </div>
      </div>
    </>
  );
}

export default CollegeDashboard;
