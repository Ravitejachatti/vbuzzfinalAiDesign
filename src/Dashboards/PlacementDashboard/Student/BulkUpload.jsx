import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  bulkUploadStudents,
  resetBulkUploadStatus,
  selectBulkUploadStatus,
  selectBulkUploadError,
  selectBulkUploadResult,
  selectBulkUploadReasons,
} from "../../../Redux/Placement/student/bulkUploadStudents";
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  X,
  Users,
  FileText,
  ExternalLink
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function BulkUpload() {
  const { universityName } = useParams();
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [collegeId, setCollegeId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [programId, setProgramId] = useState("");
  const [fileError, setFileError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const status = useSelector(selectBulkUploadStatus);
  const error = useSelector(selectBulkUploadError);
  const result = useSelector(selectBulkUploadResult);
  const reasons = useSelector(selectBulkUploadReasons);

  const universityId = localStorage.getItem("universityId");
  const token = localStorage.getItem("University authToken");

  // Get from Redux store
  const colleges = useSelector((state) => state.colleges.colleges) || [];
  const departments = useSelector((state) => state.department.departments) || [];
  const programs = useSelector((state) => state.programs.programs) || [];

  useEffect(() => {
    if (status === "succeeded" || status === "failed") {
      setShowModal(true);
    }
  }, [status]);

  const allowed = [
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  function handleFileChange(e) {
    const sel = e.target.files[0];
    processFile(sel);
  }

  function processFile(sel) {
    if (sel && allowed.includes(sel.type)) {
      setFile(sel);
      setFileError(null);
      if (sel.type.includes("spreadsheetml")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const data = new Uint8Array(ev.target.result);
          const wb = XLSX.read(data, { type: "array" });
          const csv = XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
          setConvertedFile(new File([new Blob([csv], { type: "text/csv" })], sel.name.replace(/\.\w+$/, ".csv"), { type: "text/csv" }));
        };
        reader.readAsArrayBuffer(sel);
      } else {
        setConvertedFile(null);
      }
    } else {
      setFile(null);
      setConvertedFile(null);
      setFileError("Only .csv or .xlsx files are allowed");
    }
  }

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    const uploadFile = convertedFile || file;
    if (!uploadFile) return alert("Select a file first");
    if (!universityId || !collegeId || !departmentId || !programId) {
      return alert("Fill all required fields");
    }
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("universityId", universityId);
    formData.append("collegeId", collegeId);
    formData.append("departmentId", departmentId);
    formData.append("programId", programId);

    dispatch(bulkUploadStudents({ formData, token, universityName, BASE_URL }));
  }

  function closeModal() {
    setShowModal(false);
    dispatch(resetBulkUploadStatus());
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bulk Upload Students</h1>
            <p className="text-gray-600">Upload multiple students using CSV or Excel files</p>
          </div>
        </div>
      </div>

      {/* Template Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Download Template</h2>
            <p className="text-gray-600 mb-4">
              Use our template to ensure proper formatting. The template includes the following columns:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {["Name", "Registered Number", "Email", "Phone", "Enrollment Year", "Graduation Year"].map((col) => (
                <span key={col} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {col}
                </span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://docs.google.com/spreadsheets/d/17ZFkjh11ZXTGNftQGNwnd2uuMJ3TVmxdyjkNEiRsUUo/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Template
              </a>
              <button className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        {/* University ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">University ID</label>
          <input 
            readOnly 
            value={universityId || ""} 
            placeholder="University ID" 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none"
          />
        </div>

        {/* Selection Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* College Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select College <span className="text-red-500">*</span>
            </label>
            <select
              value={collegeId}
              onChange={(e) => {
                setCollegeId(e.target.value);
                setDepartmentId("");
                setProgramId("");
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="">Select a college</option>
              {colleges.map((college) => (
                <option key={college._id} value={college._id}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Department <span className="text-red-500">*</span>
            </label>
            <select
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value);
                setProgramId("");
              }}
              disabled={!collegeId}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
              required
            >
              <option value="">{collegeId ? "Select a department" : "Select college first"}</option>
              {departments
                .filter((dept) => dept.college === collegeId)
                .map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Program Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Program <span className="text-red-500">*</span>
            </label>
            <select
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              disabled={!departmentId}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
              required
            >
              <option value="">{departmentId ? "Select a program" : "Select department first"}</option>
              {programs
                .filter((prog) => prog.department._id === departmentId)
                .map((program) => (
                  <option key={program._id} value={program._id}>
                    {program.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload File <span className="text-red-500">*</span>
          </label>
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? "border-blue-500 bg-blue-50" 
                : file 
                ? "border-green-500 bg-green-50" 
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {file ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <FileText className="w-12 h-12 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-green-700">{file.name}</p>
                  <p className="text-sm text-green-600">File ready for upload</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setConvertedFile(null);
                    setFileError(null);
                  }}
                  className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <Upload className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    Drop your file here, or <span className="text-blue-600">browse</span>
                  </p>
                  <p className="text-sm text-gray-500">Supports CSV and Excel files</p>
                </div>
              </div>
            )}
          </div>
          
          {fileError && (
            <div className="mt-2 flex items-center text-red-600">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">{fileError}</span>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {status === "pending" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-700 font-medium">Uploading students...</span>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={status === "pending" || !file}
            className="flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "pending" ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload Students
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Upload Results</h3>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {status === "succeeded" && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-green-700 font-medium">Upload completed successfully!</span>
                  </div>
                </div>
              )}

              {result?.successCount != null && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{result.successCount}</p>
                    <p className="text-sm text-green-700">Successfully Added</p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">{result.failedCount || 0}</p>
                    <p className="text-sm text-red-700">Failed</p>
                  </div>
                </div>
              )}

              {/* Failed Records Table */}
              {(result?.failedRecords?.length || reasons.length) > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Failed Records</h4>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {["Name", "Reg. No.", "Email", "Phone", "Enroll Yr", "Grad Yr", "Reason"].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(result?.failedRecords || reasons).map((rec, i) => {
                          const r = rec.row || {};
                          return (
                            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="px-4 py-3 text-sm text-gray-900">{r.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{r.registered_number}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{r.email}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{r.phone}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{r.enrollment_year}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{r.graduation_year}</td>
                              <td className="px-4 py-3 text-sm text-red-600 font-medium">{rec.error}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}