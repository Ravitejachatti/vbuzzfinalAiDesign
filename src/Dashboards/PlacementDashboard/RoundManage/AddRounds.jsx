/*
  📦 Hybrid AddRound component
  - Uses Redux logic from your second code
  - UI styling from your first code (polished with Tailwind + Lucide icons)
*/

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Target, Plus, Eye, Edit, Trash2, Upload, Download, X, Calendar,
  Building, Users, FileText, Link as LinkIcon, Search, Filter, ChevronDown,
  AlertCircle, CheckCircle
} from "lucide-react";

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

  const { jobs, loading: jobsLoading, error: jobsError } = useSelector((s) => s.jobs);
  const { roundsList, loading: roundsLoading, error: roundsError } = useSelector((s) => s.roundsData);
  const departments = useSelector((s) => s.department.departments) || [];

  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [showRoundsModal, setShowRoundsModal] = useState(false);
  const [showAddRoundModal, setShowAddRoundModal] = useState(false);
  const [showUpdateRoundModal, setShowUpdateRoundModal] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(null);

  const [roundData, setRoundData] = useState({ name: "", description: "", pdfLink: "", examLink: "" });
  const [updateRoundData, setUpdateRoundData] = useState({ name: "", description: "", pdfLink: "", examLink: "" });
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    dispatch(fetchJobs({ token, universityName }));
  }, [dispatch, universityName]);

  useEffect(() => {
    let filtered = [...jobs].sort((a, b) => new Date(b.closingDate) - new Date(a.closingDate));
    if (selectedDepartment) {
      filtered = filtered.filter((j) => j.departments.includes(selectedDepartment));
    }
    if (searchTerm) {
      filtered = filtered.filter((j) => j.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredJobs(filtered);
  }, [jobs, selectedDepartment, searchTerm]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      setApplicants(rows.map((r) => ({
        registered_number: r.registered_number,
        name: r.name,
        status: r.status || "selected",
        feedback: r.feedback || "",
      })));
    };
    reader.readAsBinaryString(file);
  };

  const getDepartmentName = (deptIds) => {
    return deptIds.slice(0, 2).map((id) => {
      const dept = departments.find((d) => d._id === id);
      return dept ? dept.name : "Unknown";
    }).join(", ") + (deptIds.length > 2 ? ` +${deptIds.length - 2} more` : "");
  };

  const handleAddRound = async () => {
    if (!roundData.name || !roundData.description) {
      alert("Please fill in all fields.");
      return;
    }
    await dispatch(addRound({ token, universityName, jobId: selectedJobId, roundData, applicants })).unwrap()
      .then(() => {
        alert("Round added successfully!");
        dispatch(fetchRoundsByJob({ token, universityName, jobId: selectedJobId }));
        setShowAddRoundModal(false);
        setRoundData({ name: "", description: "", pdfLink: "", examLink: "" });
        setApplicants([]);
      }).catch((err) => alert("Failed to add round: " + err));
  };

  const handleUpdateRound = async () => {
    if (selectedRoundIndex == null) return alert("Select a round to update.");
    await dispatch(updateRound({ token, universityName, jobId: selectedJobId, roundIndex: selectedRoundIndex, updateData: updateRoundData })).unwrap()
      .then(() => {
        alert("Round updated successfully!");
        dispatch(fetchRoundsByJob({ token, universityName, jobId: selectedJobId }));
        setShowUpdateRoundModal(false);
        setSelectedRoundIndex(null);
      }).catch((err) => alert("Failed to update round: " + err));
  };

  const handleDeleteRound = async (idx) => {
    if (!window.confirm("Delete this round?")) return;
    await dispatch(deleteRound({ token, universityName, jobId: selectedJobId, roundIndex: idx })).unwrap()
      .then(() => {
        alert("Round deleted successfully!");
        dispatch(fetchRoundsByJob({ token, universityName, jobId: selectedJobId }));
      }).catch((err) => alert("Failed to delete round: " + err));
  };

  const openRounds = (job) => {
    setSelectedJobId(job._id);
    setSelectedJobTitle(job.title);
    dispatch(fetchRoundsByJob({ token, universityName, jobId: job._id }));
    setShowRoundsModal(true);
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Round Management</h1>
            <p className="text-purple-100 text-lg">Manage recruitment rounds for job postings</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{filteredJobs.length}</div>
            <div className="text-purple-200 text-sm">Active Jobs</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border p-6">
        <div className="flex items-center mb-6">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4 inline mr-1" /> Filter by Department
            </label>
            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (<option key={d._id} value={d._id}>{d.name}</option>))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-1" /> Search Jobs
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or company"
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

   {/* Jobs Grid */}
      {jobsLoading? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading jobs...</span>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job, index) => (
            <div key={job._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Job Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {index + 1}. {job.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Building className="w-4 h-4 mr-2" />
                      <span className="font-medium">{job.company}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      new Date(job.closingDate) > new Date() 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {new Date(job.closingDate) > new Date() ? 'Active' : 'Expired'}
                    </span>
                  </div>
                </div>

                {/* Job Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="font-medium">Departments:</span>
                    <span className="ml-1">{getDepartmentName(job.departments)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="font-medium">Closing Date:</span>
                    <span className="ml-1">{new Date(job.closingDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50 flex justify-between items-center">
                <button
                  onClick={() => {
                    setSelectedJobId(job._id);
                    setSelectedJobTitle(job.title);
                    dispatch(fetchRoundsByJob({ token, universityName, jobId: job._id }));
                    setShowRoundsModal(true);
                  }}
                  className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">View Rounds</span>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedJobId(job._id);
                    setSelectedJobTitle(job.title);
                    setShowAddRoundModal(true);
                  }}
                  className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span className="text-sm">Add Round</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      )}

      {/* View Rounds Modal */}
      {showRoundsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-purple-600 to-purple-700">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h2 className="text-xl font-bold">Rounds for {selectedJobTitle}</h2>
                  <p className="text-purple-100 text-sm">{roundsList.length} rounds found</p>
                </div>
                <button
                  onClick={() => setShowRoundsModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto px-6 py-4 flex-1">
              {roundsList && roundsList.length > 0  ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {rounds.map((round, index) => (
                    <div key={round._id || index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            Round {index + 1}: {round?.name || "No Name"}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            <span className="font-medium">Description:</span> {round?.description || "No Description"}
                          </p>
                        </div>
                      </div>

                      {/* Links */}
                      <div className="space-y-2 mb-4">
                        {round?.examLink && (
                          <div className="flex items-center">
                            <LinkIcon className="w-4 h-4 mr-2 text-blue-600" />
                            <a
                              href={round.examLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm underline"
                            >
                              Exam Link
                            </a>
                          </div>
                        )}
                        {round?.pdfLink && (
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-green-600" />
                            <a
                              href={round.pdfLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800 text-sm underline"
                            >
                              View PDF
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            const applicantsData = round.applicants || [];
                            setApplicants(applicantsData);
                            setShowApplicantsModal(true);
                          }}
                          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                        >
                          <Users className="w-4 h-4 mr-1" />
                          Applicants ({round.applicants?.length || 0})
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRoundIndex(index);
                            setUpdateRoundData(round);
                            setShowUpdateRoundModal(true);
                          }}
                          className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRound(index)}
                          className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No rounds found</h3>
                  <p className="text-gray-500">No rounds have been created for this job yet.</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowRoundsModal(false)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {showApplicantsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-h-[80vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h2 className="text-xl font-bold">Round Applicants</h2>
                  <p className="text-blue-100 text-sm">{applicants.length} applicants</p>
                </div>
                <button
                  onClick={() => setShowApplicantsModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-6 flex-1">
              {applicants.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applicants.map((applicant, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{applicant.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{applicant.registered_number}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              applicant.status === 'selected' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {applicant.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{applicant.feedback || 'No feedback'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants</h3>
                  <p className="text-gray-500">No students have been added to this round yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Round Modal */}
      {showAddRoundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-green-600 to-green-700">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h2 className="text-xl font-bold">Add Round for {selectedJobTitle}</h2>
                  <p className="text-green-100 text-sm">Create a new recruitment round</p>
                </div>
                <button
                  onClick={() => setShowAddRoundModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Template Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900 mb-2">Excel Template Requirements</h3>
                    <p className="text-sm text-blue-700 mb-2">
                      Please upload a .xlsx file with the following columns:
                    </p>
                    <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                      <li><strong>name</strong> - Student's full name</li>
                      <li><strong>registered_number</strong> - Student's registration number</li>
                      <li><strong>status</strong> - Application status (optional, defaults to "selected")</li>
                      <li><strong>feedback</strong> - Feedback for the student (optional)</li>
                    </ul>
                    <div className="mt-3">
                      <a
                        href="https://docs.google.com/spreadsheets/d/1UhM-_DS4tNH6UfcHSsDZfsEIhjEkOX-8s1ZQAYQE78o/edit?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        View Sample Template
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Round Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Technical Interview, HR Round"
                      value={roundData.name}
                      onChange={(e) => setRoundData({ ...roundData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PDF Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/document.pdf"
                      value={roundData.pdfLink}
                      onChange={(e) => setRoundData({ ...roundData, pdfLink: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Round Description *
                  </label>
                  <textarea
                    placeholder="Describe the round details, requirements, and instructions..."
                    value={roundData.description}
                    onChange={(e) => setRoundData({ ...roundData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows="4"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/exam-portal"
                    value={roundData.examLink}
                    onChange={(e) => setRoundData({ ...roundData, examLink: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Upload className="w-4 h-4 inline mr-1" />
                    Upload Applicants (Excel File)
                  </label>
                  <input
                    type="file"
                    accept=".xlsx,.csv"
                    onChange={handleFileUpload}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {applicants.length > 0 && (
                    <p className="mt-2 text-sm text-green-600 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {applicants.length} applicants loaded
                    </p>
                  )}
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-4">
              <button
                onClick={() => setShowAddRoundModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRound}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Round
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Round Modal */}
      {showUpdateRoundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-yellow-600 to-yellow-700">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h2 className="text-xl font-bold">Update Round</h2>
                  <p className="text-yellow-100 text-sm">Edit round details</p>
                </div>
                <button
                  onClick={() => setShowUpdateRoundModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Round Name
                  </label>
                  <input
                    type="text"
                    value={updateRoundData.name}
                    onChange={(e) => setUpdateRoundData({ ...updateRoundData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Round Description
                  </label>
                  <textarea
                    value={updateRoundData.description}
                    onChange={(e) => setUpdateRoundData({ ...updateRoundData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    rows="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PDF Link
                  </label>
                  <input
                    type="url"
                    value={updateRoundData.pdfLink}
                    onChange={(e) => setUpdateRoundData({ ...updateRoundData, pdfLink: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Link
                  </label>
                  <input
                    type="url"
                    value={updateRoundData.examLink}
                    onChange={(e) => setUpdateRoundData({ ...updateRoundData, examLink: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-4">
              <button
                onClick={() => setShowUpdateRoundModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRound}
                className="flex items-center bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Update Round
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRound;