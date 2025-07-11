// src/Dashboards/PlacementDashboard/Student/BulkUpload.jsx
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
      setFileError("Only .csv or .xlsx allowed");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const uploadFile = convertedFile || file;
    if (!uploadFile) return alert("Select a file first");
    if (!universityId || !collegeId || !departmentId || !programId) {
      return alert("Fill all ID fields");
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
    <div className="p-6 b-white z-20 mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
            Bulk Upload Students (.csv or .xlsx files)
          </h2>
          <p className="pb-5 font-sans text-gray-600">
            Upload the students of a class or department. Ensure your file
            matches the required template columns:
          </p>
          <ul className="flex space-x-6 text-gray-700 mb-4 list-decimal list-inside">
            <li className="mr-4"> Name</li>
            <li className="mr-4"> Registered Number</li>
            <li className="mr-4"> Email</li>
            <li className="mr-4"> Phone</li>
            <li className="mr-4"> Enrollment Year</li>
            <li className="mr-4"> Graduation Year</li>
          </ul>

          <p>
            Click here to see the template:{" "}
            <a
              href="https://docs.google.com/spreadsheets/d/17ZFkjh11ZXTGNftQGNwnd2uuMJ3TVmxdyjkNEiRsUUo/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 rounded shadow-lg transition-all duration-300"
            >
              Template
            </a>
          </p>
        </div>


        {/* IDs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="mb-4">
            <label className="block text-gray-600 font-medium">UNIVERSITY ID</label>
            <input readOnly value={universityId || ""} placeholder="University ID" className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          {/* College Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">Select College</label>
            <select
              value={collegeId}
              onChange={(e) => {
                setCollegeId(e.target.value);
                setDepartmentId("");
                setProgramId("");
              }}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">Select Department</label>
            <select
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value);
                setProgramId("");
              }}
              disabled={!collegeId}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            <label className="block mb-2 font-medium text-gray-600">Select Program</label>
            <select
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              disabled={!departmentId}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

        {/* File */}
        <div>
          <input type="file" accept=".csv,.xlsx" onChange={handleFileChange} />
          {fileError && <p className="text-red-600">{fileError}</p>}
        </div>

        {/* Status */}
        {status === "pending" && <p className="text-blue-600">Uploading…</p>}
        {status === "failed" && <p className="text-red-600">❌ {error}</p>}

        <button type="submit" disabled={status === "pending"} className="bg-green-600 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>

      {showModal && (
        <div className="mt-6 p-4 border rounded bg-white">
          <h3 className="font-bold">Result</h3>
          {status === "succeeded" && <p className="text-green-700">Uploaded successfully.</p>}
          {result?.successCount != null && <p>✅ Success: {result.successCount}</p>}
          {result?.failedCount != null && <p>❌ Failed: {result.failedCount}</p>}

          {/* failed rows */}
          {(result?.failedRecords?.length || reasons.length) > 0 && (
            <div className="mt-2 overflow-auto max-h-60 border p-2 bg-gray-50">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    {["Name", "Reg. No.", "Email", "Phone", "Enroll Yr", "Grad Yr", "Reason"].map(h => (
                      <th key={h} className="border px-1">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(result?.failedRecords || reasons).map((rec, i) => {
                    const r = rec.row || {};
                    return (
                      <tr key={i}>
                        <td className="border px-1">{r.name}</td>
                        <td className="border px-1">{r.registered_number}</td>
                        <td className="border px-1">{r.email}</td>
                        <td className="border px-1">{r.phone}</td>
                        <td className="border px-1">{r.enrollment_year}</td>
                        <td className="border px-1">{r.graduation_year}</td>
                        <td className="border px-1 text-red-600">{rec.error}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <button onClick={closeModal} className="mt-4 bg-gray-500 text-white px-3 py-1 rounded">
            Close
          </button>
        </div>
      )}
    </div>
  );
}
