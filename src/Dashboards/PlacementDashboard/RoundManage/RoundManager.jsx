import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const RoundsManager = ({departments}) => {
  const { universityName } = useParams();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  console.log("departments:",departments); 

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [jobId, setJobId] = useState("");
  const [newRound, setNewRound] = useState({ name: "", description: "" });
  const [updateRoundData, setUpdateRoundData] = useState({
    name: "",
    description: "",
  });
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [selectedJobName, setSelectedJobName] = useState("");
  const [showAddRoundModal, setShowAddRoundModal] = useState(false);
  const [showViewRoundsModal, setShowViewRoundsModal] = useState(false);

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/job/getAllJobs?universityName=${universityName}`
      );
      const jobsData = Array.isArray(res.data.data) ? res.data.data : [];
      setJobs(jobsData);
      setFilteredJobs(jobsData);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      alert("Error fetching jobs. Please try again.");
      setJobs([]);
    }
  };

  // Fetch rounds
  const fetchRounds = async (jobId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/job/jobs/${jobId}/getAllRounds?universityName=${universityName}`
      );
      const roundsData = response.data?.data?.data[0]?.rounds || [];
      setRounds(roundsData);
      console.log("Rounds:", roundsData);
    } catch (error) {
      console.error("Error fetching rounds:", error);
      alert("Failed to fetch rounds.");
    }
  };

  // Handle View Rounds button click
  const handleViewRounds = async (jobId, jobTitle) => {
    setSelectedJobId(jobId);
    setSelectedJobName(jobTitle);
    await fetchRounds(jobId);
    setShowViewRoundsModal(true);
  };

  useEffect(() => {
    fetchJobs();
  }, [universityName]);

  // Filter jobs by department
  const handleDepartmentFilter = (deptId) => {
    setSelectedDepartment(deptId);
    if (deptId === "") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter((job) => job.departments.includes(deptId));
      setFilteredJobs(filtered);
    }
  };

  // Add round
  const addRound = async () => {
    if (!selectedJobId) {
      alert("Please enter a Job ID to add a round.");
      return;
    }

    if (!newRound.name || !newRound.description) {
      alert("Please provide all required fields.");
      return;
    }

    try {
      const roundData = { ...newRound, jobId: selectedJobId };
      const response = await axios.post(
        `${BASE_URL}/job/jobs/${selectedJobId}/addRounds?universityName=${universityName}`,
        roundData
      );
      alert("Round added successfully!");
      setRounds((prevRounds) => [...prevRounds, response.data?.data]);
      setNewRound({ name: "", description: "" });
      setShowAddRoundModal(false);
    } catch (error) {
      console.error("Error adding round:", error);
      alert("Failed to add the round. Please try again.");
    }
  };

  // Update round
  const updateRound = async () => {
    if (selectedRoundIndex === null) {
      alert("Please select a round to update.");
      return;
    }

    if (!updateRoundData.name || !updateRoundData.description) {
      alert("Please provide all required fields for the round.");
      return;
    }

    try {
      const roundData = {
        name: updateRoundData.name,
        description: updateRoundData.description,
      };
      await axios.put(
        `${BASE_URL}/job/jobs/${selectedJobId}/updateRounds/${selectedRoundIndex}?universityName=${universityName}`,
        roundData
      );
      alert("Round updated successfully!");
      setRounds((prevRounds) =>
        prevRounds.map((round, index) =>
          index === selectedRoundIndex ? { ...round, ...roundData } : round
        )
      );
      setUpdateRoundData({ name: "", description: "" });
      setSelectedRoundIndex(null);
    } catch (error) {
      console.error("Error updating round:", error);
      alert("Failed to update the round. Please try again.");
    }
  };

  // Delete round
  const deleteRound = async (index) => {
    try {
      await axios.delete(
        `${BASE_URL}/job/jobs/${selectedJobId}/deleteRounds/${index}?universityName=${universityName}`
      );
      alert("Round deleted successfully!");
      setRounds((prevRounds) => prevRounds.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting round:", error);
      alert("Failed to delete the round.");
    }
  };

  // Close modal
  const closeModal = () => {
    setShowAddRoundModal(false);
    setShowViewRoundsModal(false);
  };

  // Get department name by ID
  const getDepartmentName = (deptIds) => {
    return deptIds
      .map((id) => {
        const dept = departments.find((dept) => dept._id === id);
        return dept ? dept.name : "Unknown";
      })
      .join(", ");
  };

  return (
    <div className="min-h-screen">
      {/* Department Filter */}
      <div className="mb-4 flex">
        <label className="block text-gray-700 font-medium mb-1">Filter by Department:</label>
        <select
          value={selectedDepartment}
          onChange={(e) => handleDepartmentFilter(e.target.value)}
          className="w-{70%} p-1 border border-gray-300 rounded"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {/* Job list */}
<h2 className="text-2xl font-bold text-center">Job List</h2>
{filteredJobs.length === 0 ? (
  <p className="text-center text-gray-500 mt-4">No jobs available</p>
) : (
  <ul>
    {filteredJobs.map((job) => (
      <li key={job._id} className="border-b py-4 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{job.title}</h3>
          <p>Departments: {getDepartmentName(job.departments)}</p>
          <p>Closing Date: {new Date(job.closingDate).toLocaleDateString()}</p>
        </div>
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => handleViewRounds(job._id, job.title)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            View Rounds
          </button>
          <button
            onClick={() => {
              setSelectedJobId(job._id);
              setShowAddRoundModal(true);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Add Round
          </button>
        </div>
      </li>
    ))}
  </ul>
)}

        {/* Add Round Modal */}
        {showAddRoundModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[400px] md:w-[600px] lg:w-[800px]"> 
              <div className=" px-2"><h2 className="text-xl font-semibold ">Rounds of {selectedJobName} are:</h2>
              {rounds.length > 0 ? (
              <ul className="grid grid-cols-3 gap-4">
                {rounds.map((round, index) => (
                  <li key={index} className="py-1">
                    <p className="font-bold">{index}. {round.name}</p>
                    </li>
                    ))}
          </ul>) :( <p>No rounds found.</p>)}</div>
          <h2 className="text-lg font-semibold my-2">Add New Round</h2>

              <label className="block text-gray-700 font-medium">Job ID:</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg mb-2"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                placeholder="Enter Job ID"
              />
              <input
                type="text"
                placeholder="Round Name"
                className="w-full p-2 mb-2 border rounded-lg"
                value={newRound.name}
                onChange={(e) => setNewRound({ ...newRound, name: e.target.value })}
              />
              <textarea
                placeholder="Round Description"
                className="w-full p-2 mb-2 border rounded-lg"
                value={newRound.description}
                onChange={(e) => setNewRound({ ...newRound, description: e.target.value })}
              ></textarea>
              <button
                onClick={addRound}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >Add Round</button>
              <button
                onClick={() => setShowAddRoundModal(false)}
                className="w-full mt-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}

      {/* View Rounds Modal */}
      {showViewRoundsModal && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-[90%] max-h-[90vh] flex flex-col overflow-hidden">
      
      {/* Sticky Header */}
      <div className="px-6 py-4 border-b bg-white sticky top-0 z-10">
        <h2 className="text-xl font-bold">Rounds for {selectedJobName}</h2>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto px-6 py-4">
        {rounds.length > 0 ? (
          <ul className="grid grid-cols-2 gap-4">
            {rounds.map((round, index) => (
              <li key={index} className="p-4 shadow rounded-lg">
                <p className="font-bold">{index}. {round.name}</p>
                <p className="text-sm"><strong>Description:</strong> {round.description}</p>
                <p className="text-sm text-gray-500"><strong>Link:</strong> (To be added in backend)</p>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedRoundIndex(index);
                      setUpdateRoundData(round);
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => deleteRound(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No rounds found.</p>
        )}

        <button
          onClick={closeModal}
          className="w-full mt-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default RoundsManager;
