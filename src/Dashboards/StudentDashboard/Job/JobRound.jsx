import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobs
} from "../../../Redux/StudentDashboard/jobSlice";
import {
  fetchRounds
} from "../../../Redux/StudentDashboard/roundSlice";
import {
  Target, Search, Building2, CheckCircle, Clock, AlertCircle, Calendar,
  ChevronLeft, ChevronRight, Eye, EyeOff, Briefcase, Users, MessageSquare
} from 'lucide-react';

const JobRound = () => {
  const dispatch = useDispatch();
  const { universityName } = useParams();

  const jobs = useSelector((state) => state.job.jobs);
  const jobsLoading = useSelector((state) => state.job.loading);
  const jobsError = useSelector((state) => state.job.error); // <--- THIS IS KEY
  const rounds = useSelector((state) => state.round.rounds);
  const roundsLoading = useSelector((state) => state.round.loading);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showRoundsModal, setShowRoundsModal] = useState(false);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [expandedMessages, setExpandedMessages] = useState({});
  const [showNoRoundsPopup, setShowNoRoundsPopup] = useState(false);
  const [noRoundsMessage, setNoRoundsMessage] = useState("");

  const user = localStorage.getItem("user");
  const token = localStorage.getItem("Student token"); // Good to log the token too!

  // --- ADD THESE CONSOLE LOGS ---
  console.log("Component Render: JobRound");
  console.log("User from localStorage:", user);
  console.log("Token from localStorage:", token);

  // Parse user data safely
  let departmentId = null;
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      departmentId = parsedUser.department;
      console.log("Parsed User Department ID:", departmentId);
    } catch (e) {
      console.error("Error parsing user data from localStorage:", e);
      // Handle the error, maybe clear localStorage or redirect to login
    }
  } else {
    console.log("User data is null or empty in localStorage.");
  }

  // Early return for authentication (Crucial to check here)
  if (!token || !user) {
    console.warn("Authentication missing: Token or User data not found. Redirecting or showing login message.");
    return <div>Please log in to view job opportunities.</div>;
  }

    // Function to truncate text
  const truncateText = (text, limit = 100) => {
    return text && text.length > limit ? `${text.substring(0, limit)}...` : text;
  };

  useEffect(() => {
    console.log("useEffect: Fetching jobs for university:", universityName);
    // The user check is already done above, but good to ensure data is there for dispatch
    if (user && departmentId) { // Ensure departmentId is also valid if you use it in fetch logic
      dispatch(fetchJobs({ universityName }));
    } else {
      console.warn("useEffect: Not dispatching fetchJobs, user or departmentId missing.");
    }
  }, [dispatch, universityName, user, departmentId]); // Add departmentId to dependency array if used

  // Filtered jobs will react to changes in jobs, departmentId, searchTerm
  const filteredJobs = jobs.filter((job) =>
    departmentId ? job.departments.includes(departmentId) : true
  ).filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log("Current jobs state:", jobs);
  console.log("Current jobsLoading state:", jobsLoading);
  console.log("Current jobsError state:", jobsError); // <--- Check this value!
  console.log("Current filteredJobs:", filteredJobs);


  const handleFetchRounds = (jobId) => {
    console.log("handleFetchRounds: Attempting to fetch rounds for job ID:", jobId);
    dispatch(fetchRounds({ jobId, universityName }))
        .unwrap()
        .then((fetchedRounds) => {
          console.log("handleFetchRounds: Rounds fetched successfully:", fetchedRounds);
          if (fetchedRounds && fetchedRounds.length) {
            alert("Rounds fetched successfully."); // Consider replacing alerts with better UI feedback
            setShowRoundsModal(true);
            setCurrentRoundIndex(0); // Reset to first round
          } else {
            console.log("handleFetchRounds: No rounds available for this job.");
            alert("No rounds available for this job.");
            setNoRoundsMessage("No rounds have been added for this job. You will be notified if there are any updates.");
            setShowNoRoundsPopup(true);
            setShowRoundsModal(false);
          }
        })
        .catch((err) => {
          console.error("handleFetchRounds: Error fetching rounds:", err); // <--- IMPORTANT LOG
          setNoRoundsMessage("Failed to fetch round status. Please try again later.");
          setShowNoRoundsPopup(true);
          setShowRoundsModal(false);
        });
  };

    const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'selected':
      case 'qualified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getStatusIcon = (status) => {
      switch (status?.toLowerCase()) {
        case 'selected':
        case 'qualified':
          return <CheckCircle className="w-4 h-4 text-green-500" />;
        case 'pending':
        case 'in progress':
          return <Clock className="w-4 h-4 text-yellow-500" />;
        default:
          return <AlertCircle className="w-4 h-4 text-red-500" />;
      }
    };

  // ... (rest of your component code)

  if (jobsLoading || roundsLoading) {
    console.log("Rendering: Loading state active.");
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // --- Add a log before returning the main JSX ---
  console.log("Rendering: Main component content.");
  if (jobsError) {
      console.error("Displaying jobsError:", jobsError); // <--- This will confirm the source of your message
  }
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold flex items-center">
            <Target className="w-8 h-8 text-blue-600 mr-2" /> Interview Round Tracker
          </h2>
          <p className="text-gray-600">Monitor your progress and round updates</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow">
          <div className="text-center">
            <div className="font-bold text-xl">{filteredJobs.length}</div>
            <div className="text-sm">Applied Jobs</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search jobs by title or company..."
          className="pl-10 py-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Job Grid */}
{filteredJobs.length > 0 ? (
  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
    {filteredJobs.map((job, index) => (
      <div
        key={job._id}
        className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
      >
        {/* Job Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {index + 1}. {job.title}
              </h3>
              <div className="flex items-center text-gray-600 mb-2">
                <Building2 className="w-4 h-4 mr-2" />
                <span className="font-medium">{job.company}</span>
              </div>
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Applied
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">Min. {job.minPercentage}% required</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">
                Applied: {new Date(job.closingDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="p-6">
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            {expandedDescriptions[job._id] ? job.description : truncateText(job.description)}
            {job.description && job.description.length > 100 && (
              <button
                onClick={() => toggleDescription(job._id)}
                className="text-blue-600 hover:text-blue-800 ml-2 font-medium inline-flex items-center"
              >
                {expandedDescriptions[job._id] ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-1" />
                    Show More
                  </>
                )}
              </button>
            )}
          </p>

          {/* View Rounds Button */}
          <button
            onClick={() => handleFetchRounds(job._id)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Target className="w-5 h-5 mr-2" />
            View Interview Rounds
          </button>
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="text-center py-16">
    <Briefcase className="w-24 h-24 text-gray-300 mx-auto mb-6" />
    <h3 className="text-2xl font-bold text-gray-900 mb-2">No Applied Jobs Found</h3>
    <p className="text-gray-600 mb-6">
      {searchTerm
        ? "Try adjusting your search criteria to find applied jobs."
        : "You haven't applied to any jobs yet. Start applying to track your interview rounds here."}
    </p>
    {searchTerm && (
      <button
        onClick={() => setSearchTerm("")}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Clear Search
      </button>
    )}
  </div>
)}

      {/* Modal for rounds */}
      {showRoundsModal && rounds.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-4 space-y-4">
            <h3 className="font-bold text-lg text-center">
              {filteredJobs.find((j) => j._id === selectedJobId)?.title}
            </h3>
            <div>
              <p className="font-semibold">{rounds[currentRoundIndex].roundName}</p>
              <p>
                {expandedMessages[currentRoundIndex]
                  ? rounds[currentRoundIndex].roundDescription
                  : truncateText(rounds[currentRoundIndex].roundDescription, 150)}
                {rounds[currentRoundIndex].roundDescription.length > 150 && (
                  <button
                    onClick={() => toggleMessage(currentRoundIndex)}
                    className="ml-2 text-blue-500 text-sm"
                  >
                    {expandedMessages[currentRoundIndex] ? "Show Less" : "Show More"}
                  </button>
                )}
              </p>
              <div className={`inline-flex px-2 py-1 rounded ${getStatusColor(rounds[currentRoundIndex].status)}`}>
                {getStatusIcon(rounds[currentRoundIndex].status)}
                <span className="ml-1 text-sm">{rounds[currentRoundIndex].status}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentRoundIndex((prev) => Math.max(prev - 1, 0))}
                disabled={currentRoundIndex === 0}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronLeft /> Prev
              </button>
              <button
                onClick={() => setCurrentRoundIndex((prev) => Math.min(prev + 1, rounds.length - 1))}
                disabled={currentRoundIndex === rounds.length - 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next <ChevronRight />
              </button>
            </div>
            <button
              onClick={() => setShowRoundsModal(false)}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Popup for no rounds */}
      {showNoRoundsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-4 text-center space-y-2">
            <p>{noRoundsMessage}</p>
            <button
              onClick={() => setShowNoRoundsPopup(false)}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobRound;