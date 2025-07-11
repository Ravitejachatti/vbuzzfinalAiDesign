import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../../../Redux/Jobslice";
import {
  fetchRoundsByJob,
  addRound,
  updateRound,
  deleteRound,
} from "../../../Redux/Placement/roundsSlice";

const AddRound = () => {
  const { universityName } = useParams();
  const dispatch = useDispatch();
  const token = localStorage.getItem("University authToken");

  // global state slices
  const { jobs, loading: jobsLoading, error: jobsError } = useSelector(
    (s) => s.jobs
  );
  const {
   roundsList,
    loading: roundsLoading,
    error: roundsError,
  } = useSelector((s) => s.roundsData);

  const departments = useSelector((s) => s.department.departments) || [];

  // local UI state
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [showRoundsModal, setShowRoundsModal] = useState(false);
  const [showAddRoundModal, setShowAddRoundModal] = useState(false);
  const [showUpdateRoundModal, setShowUpdateRoundModal] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(null);

  // form state
  const [roundData, setRoundData] = useState({
    name: "",
    description: "",
    pdfLink: "",
    examLink: "",
  });
  const [updateRoundData, setUpdateRoundData] = useState({
    name: "",
    description: "",
    pdfLink: "",
    examLink: "",
  });
  const [applicants, setApplicants] = useState([]);

  // 1️⃣ fetch all jobs on mount
  useEffect(() => {
    dispatch(fetchJobs({ token, universityName }));
  }, [dispatch, universityName]);

  // 2️⃣ sort incoming jobs by closingDate desc
  useEffect(() => {
    if (Array.isArray(jobs)) {
      const sorted = [...jobs].sort(
        (a, b) => new Date(b.closingDate) - new Date(a.closingDate)
      );
      setFilteredJobs(sorted);
    }
  }, [jobs]);

  // 3️⃣ department filter
  const handleDepartmentFilter = (deptId) => {
    setSelectedDepartment(deptId);
    if (!deptId) {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter((j) => j.departments.includes(deptId)));
    }
  };

  // 4️⃣ open rounds modal and fetch rounds for that job
  const openRounds = (job) => {
    setSelectedJobId(job._id);
    setSelectedJobTitle(job.title);
    dispatch(
      fetchRoundsByJob({ token, universityName, jobId: job._id })
    );
    setShowRoundsModal(true);
  };

  // 5️⃣ file upload parsing
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      setApplicants(
        rows.map((r) => ({
          registered_number: r.registered_number,
          name: r.name,
          status: r.status || "selected",
          feedback: r.feedback || "",
        }))
      );
    };
    reader.readAsBinaryString(file);
  };

  // 6️⃣ add round
  const handleAddRound = async () => {
    if (!roundData.name || !roundData.description) {
      return alert("Please fill in all fields.");
    }
    await dispatch(
      addRound({
        token,
        universityName,
        jobId: selectedJobId,
        roundData,
        applicants,
      })
    )
      .unwrap()
  .then(() => {
     alert("Round added successfully!");
    // refetch
    dispatch(
      fetchRoundsByJob({ token, universityName, jobId: selectedJobId })
    );
    setShowAddRoundModal(false);
    setRoundData({ name: "", description: "", pdfLink: "", examLink: "" });
    setApplicants([]);
  })
  .catch((err) => {
     alert("Failed to add round: " + err);
   });
};

  // 7️⃣ update round
  const handleUpdateRound = async () => {
    if (selectedRoundIndex == null) {
      return alert("Select a round to update.");
    }
    await dispatch(
      updateRound({
        token,
        universityName,
        jobId: selectedJobId,
        roundIndex: selectedRoundIndex,
        updateData: updateRoundData,
      })
    )
       .unwrap()
   .then(() => {
     alert("Round updated successfully!");
    dispatch(
      fetchRoundsByJob({ token, universityName, jobId: selectedJobId })
    );
    setShowUpdateRoundModal(false);
    setSelectedRoundIndex(null);
  })
     .catch((err) => {
     alert("Failed to update round: " + err);
   });
 };

  // 8️⃣ delete round
  const handleDeleteRound = async (idx) => {
    if (!window.confirm("Delete this round?")) return;
    await dispatch(
      deleteRound({
        token,
        universityName,
        jobId: selectedJobId,
        roundIndex: idx,
      })
    )
      .unwrap()
      .then(() => {
        alert("Round deleted successfully!");
        dispatch(
          fetchRoundsByJob({ token, universityName, jobId: selectedJobId })
        );
      })
      .catch((err) => {
        alert("Failed to delete round: " + err);
      });
  };

  // render loaders / errors
  if (jobsLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <span>Loading jobs…</span>
      </div>
    );
  if (jobsError) return <p className="text-red-600">Error: {jobsError}</p>;

  return (
    <div className="h-screen p-8">
      {/* Department filter */}
      <div className="mb-4">
        <label>Filter by Department:</label>
        <select
          value={selectedDepartment}
          onChange={(e) => handleDepartmentFilter(e.target.value)}
          className="border p-2 ml-2"
        >
          <option value="">All</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Job cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredJobs.map((job, i) => (
          <div
            key={job._id}
            className="border rounded p-4 shadow-sm flex flex-col justify-between"
          >
            <div>
              <h3 className="font-semibold">
                {i + 1}. {job.title}
              </h3>
              <p className="text-sm">
                Closing: {new Date(job.closingDate).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => openRounds(job)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                View Rounds
              </button>
              <button
                onClick={() => {
                  setSelectedJobId(job._id);
                  setSelectedJobTitle(job.title);
                  setShowAddRoundModal(true);
                }}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Add Round
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Rounds Modal */}
      {showRoundsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-3/4 max-h-[80vh] overflow-auto">
            <h2 className="text-xl mb-4">Rounds for {selectedJobTitle}</h2>

            {roundsLoading ? (
              <p>Loading…</p>
            ) : roundsError ? (
              <p className="text-red-600">{roundsError}</p>
            ) : roundsList.length ? (
              <ul className="space-y-3">
                {roundsList.map((r, idx) => (
                  <li
                    key={idx}
                    className="border p-3 rounded flex justify-between items-start"
                  >
                    <div>
                      <p className="font-semibold">
                        {idx + 1}. {r.name}
                      </p>
                      <p>{r.description}</p>
                      {r.examLink && (
                        <p>
                          Exam:{" "}
                          <a
                            href={r.examLink}
                            target="_blank"
                            className="text-blue-500 underline"
                            rel="noopener noreferrer"
                          >
                            link
                          </a>
                        </p>
                      )}
                      {r.pdfLink && (
                        <p>
                          PDF:{" "}
                          <a
                            href={r.pdfLink}
                            target="_blank"
                            className="text-blue-500 underline"
                            rel="noopener noreferrer"
                          >
                            view
                          </a>
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => {
                          setSelectedRoundIndex(idx);
                          setUpdateRoundData(r);
                          setShowUpdateRoundModal(true);
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRound(idx)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          setApplicants(r.applicants || []);
                          setShowApplicantsModal(true);
                        }}
                        className="bg-purple-500 text-white px-2 py-1 rounded"
                      >
                        Applicants
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No rounds found.</p>
            )}

            <button
              onClick={() => setShowRoundsModal(false)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {showApplicantsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-2/3 max-h-[70vh] overflow-auto">
            <h2 className="text-xl mb-4">Applicants</h2>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">#</th>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Reg. Number</th>
                  <th className="border px-2 py-1">Status</th>
                  <th className="border px-2 py-1">Feedback</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((a, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="border px-2 py-1">{i + 1}</td>
                    <td className="border px-2 py-1">{a.name}</td>
                    <td className="border px-2 py-1">{a.registered_number}</td>
                    <td className="border px-2 py-1">{a.status}</td>
                    <td className="border px-2 py-1">{a.feedback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => setShowApplicantsModal(false)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Round Modal */}
      {showAddRoundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-2/3">
            <h2 className="text-xl mb-4">Add Round to {selectedJobTitle}</h2>

            <div className="bg-white p-6 rounded-lg shadow-lg w-[1000px]">
              <h2 className="text-xl font-bold mb-1">Add Round for {selectedJobTitle}</h2>
              {/* follow the following template for uploading the studnts for the given rounds: */}
              {/* excel sheet link */}
              <p className="text-sm text-gray-500 mb-1">
        Please upload a .xlsx file with the following columns:
        <ul className="list-disc list-inside">
          <li className="font-bold">name</li>
          <li  className="font-bold">registered_number</li>
          <li className="font-bold" >message(whatever you want)</li>
          <li className="font-bold">feedback(optional)</li>
        </ul>
      </p>
              {/* excel sheet link */}
              <p className="text-sm text-gray-500 mb-1">
                TEMPLATE –{" "}
                <a
                  href="https://docs.google.com/spreadsheets/d/1UhM-_DS4tNH6UfcHSsDZfsEIhjEkOX-8s1ZQAYQE78o/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Sample Sheet
                </a>
              </p>
</div>
            <input
              className="w-full mb-2 border p-2"
              placeholder="Round Name"
              value={roundData.name}
              onChange={(e) =>
                setRoundData({ ...roundData, name: e.target.value })
              }
            />
            <textarea
              className="w-full mb-2 border p-2"
              rows={3}
              placeholder="Description"
              value={roundData.description}
              onChange={(e) =>
                setRoundData({ ...roundData, description: e.target.value })
              }
            />
            <input
              className="w-full mb-2 border p-2"
              placeholder="PDF Link"
              value={roundData.pdfLink}
              onChange={(e) =>
                setRoundData({ ...roundData, pdfLink: e.target.value })
              }
            />
            <input
              className="w-full mb-2 border p-2"
              placeholder="Exam Link"
              value={roundData.examLink}
              onChange={(e) =>
                setRoundData({ ...roundData, examLink: e.target.value })
              }
            />
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={handleFileUpload}
              className="mb-4"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleAddRound}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddRoundModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Round Modal */}
      {showUpdateRoundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-2/3">
            <h2 className="text-xl mb-4">Update Round</h2>
            <input
              className="w-full mb-2 border p-2"
              placeholder="Round Name"
              value={updateRoundData.name}
              onChange={(e) =>
                setUpdateRoundData({ ...updateRoundData, name: e.target.value })
              }
            />
            <textarea
              className="w-full mb-2 border p-2"
              rows={3}
              placeholder="Description"
              value={updateRoundData.description}
              onChange={(e) =>
                setUpdateRoundData({
                  ...updateRoundData,
                  description: e.target.value,
                })
              }
            />
            <input
              className="w-full mb-2 border p-2"
              placeholder="PDF Link"
              value={updateRoundData.pdfLink}
              onChange={(e) =>
                setUpdateRoundData({
                  ...updateRoundData,
                  pdfLink: e.target.value,
                })
              }
            />
            <input
              className="w-full mb-4 border p-2"
              placeholder="Exam Link"
              value={updateRoundData.examLink}
              onChange={(e) =>
                setUpdateRoundData({
                  ...updateRoundData,
                  examLink: e.target.value,
                })
              }
            />
            <div className="flex space-x-2">
              <button
                onClick={handleUpdateRound}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Update
              </button>
              <button
                onClick={() => setShowUpdateRoundModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRound;
