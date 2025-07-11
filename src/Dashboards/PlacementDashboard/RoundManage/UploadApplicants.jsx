import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useParams } from "react-router-dom";

const UploadApplicants = () => {
  const { universityName } = useParams();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [jobs, setJobs] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [jobId, setJobId] = useState("");
  const [roundIndex, setRoundIndex] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [selectedTab, setSelectedTab] = useState("view"); // "view" or "upload"

  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedRoundName, setSelectedRoundName] = useState("");

  // Fetch Jobs
  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/job/getAllJobs?universityName=${universityName}`
      );
      setJobs(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      alert("Error fetching jobs. Please try again.");
    }
  };

  // Fetch Rounds based on selected job
  const fetchRounds = async (jobId) => {
    if (!jobId) return;
    try {
      const response = await axios.get(
        `${BASE_URL}/job/jobs/${jobId}/getAllRounds?universityName=${universityName}`
      );
      const roundsData = response.data?.data?.data[0]?.rounds || [];
      setRounds(roundsData);
    } catch (error) {
      console.error("Error fetching rounds:", error);
    }
  };

  // Fetch Applicants
  const fetchApplicants = async () => {
    if (!jobId || roundIndex === "") {
      alert("Please select a job and round.");
      setResponseMessage("");
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/job/jobs/${jobId}/round/${roundIndex}/student/getAllApplicants?universityName=${universityName}`
      );
      setApplicants(response.data);
      setResponseMessage("");
    } catch (error) {
      console.error("Error fetching applicants:", error.message);
      setResponseMessage(
        <div className="p-4 bg-yellow-200 text-yellow-800 rounded">
          No students have been added to this round yet.
        </div>
      );
      
    }
  };

  // Handle Job Selection
  const handleJobSelection = (jobId) => {
    setJobId(jobId);
    const job = jobs.find((job) => job._id === jobId);
    setSelectedJobTitle(job ? job.title : "");
    setRounds([]);
    setRoundIndex("");
    setApplicants([]);
  };

  // Handle Round Selection
  const handleRoundSelection = (index) => {
    setRoundIndex(index);
    const round = rounds[index];
    setSelectedRoundName(round ? round.name : "");
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (jobId) {
      fetchRounds(jobId);
    }
  }, [jobId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-xl font-semibold">Manage Applicants</h1>

      {/* Tab Buttons */}
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => setSelectedTab("view")}
          className={`px-4 py-2 rounded ${
            selectedTab === "view" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          View Applicants in Round
        </button>
        <button
          onClick={() => setSelectedTab("upload")}
          className={`px-4 py-2 rounded ${
            selectedTab === "upload" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Upload Applicants for Round
        </button>
      </div>

      {/* Conditional Rendering Based on Selected Tab */}
      {selectedTab === "view" && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">View Applicants in Round</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block mb-2 font-medium">Select Job</label>
              <select
                value={jobId}
                onChange={(e) => handleJobSelection(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              >
                <option value="">Select Job</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-medium">Select Round</label>
              <select
                value={roundIndex}
                onChange={(e) => handleRoundSelection(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                disabled={!jobId}
              >
                <option value="">Select Round</option>
                {rounds.map((round, index) => (
                  <option key={index} value={index}>
                    Round {index + 1} - {round.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={fetchApplicants}
            className="mt-4 px-5 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Fetch Applicants
          </button>
          {applicants.success && Array.isArray(applicants.data) && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-4">
                Applicants for Job: {selectedJobTitle}, Round: {selectedRoundName}
              </h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">Registered Number</th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                    <th className="border border-gray-300 px-4 py-2">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.data.map((applicant, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">
                        {applicant.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {applicant.registered_number}
                      </td>
                      <td className="border border-gray-300  px-4 py-2">
                        {applicant.status}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {applicant.feedback}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {selectedTab === "upload" && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Upload Applicants for Round</h2>
          <form className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 font-medium">Select Job</label>
              <select
                value={jobId}
                onChange={(e) => handleJobSelection(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              >
                <option value="">Select Job</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-medium">Select Round</label>
              <select
                value={roundIndex}
                onChange={(e) => handleRoundSelection(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                disabled={!jobId}
              >
                <option value="">Select Round</option>
                {rounds.map((round, index) => (
                  <option key={index} value={index}>
                    Round {index + 1} - {round.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-medium">Upload File</label>
              <input
                type="file"
                id="excelFile"
                accept=".xlsx, .xls, .csv"
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {responseMessage && <div className="mt-4">{responseMessage}</div>}
    </div>
  );
};

export default UploadApplicants;
