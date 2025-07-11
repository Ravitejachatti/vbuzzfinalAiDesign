import React, { useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { FiUpload, FiDownload, FiX, FiCheck, FiAlertCircle, FiFileText } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadPlacements,
  clearPlacementState
} from "../../../Redux/Placement/uploadPlacementSlice";

const PlacementUpload = () => {
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState([]);
  // Redux dispatch + selectors
  const dispatch = useDispatch();
  const {
    loading,
    error,
    successMessage,
    updatedRecords,
    failedRecords,
  } = useSelector((state) => state.uploadPlacement);
  const [showResults, setShowResults] = useState(false);
  const [fileName, setFileName] = useState("");

  const { universityName } = useParams();
 

  const expectedColumns = [
    "registered_number",
    "companyName",
    "type",
    "ctc",
    "offerletter",
    "feedback",
    "additionalDetails",
  ];

  const downloadTemplate = () => {
    const templateData = [expectedColumns];
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "placement_template.xlsx");
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) {
      setError("No file selected.");
      return;
    }

    if (!uploadedFile.name.endsWith(".xlsx")) {
      setError("Invalid file format. Please upload a .xlsx file.");
      return;
    }

    setFile(uploadedFile);
    setFileName(uploadedFile.name);
    setError("");
    setSuccess("");
    parseFile(uploadedFile);
  };

  const parseFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setFileData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };


  const uploadData = () => {
    if (!file) return alert("No file selected.");
    // clear previous state
    dispatch(clearPlacementState());
    setShowResults(true);
    // dispatch the thunk
    dispatch(uploadPlacements({ universityName, file }));
  };

  const closeResults = () => {
    setShowResults(false);
    dispatch(clearPlacementState());
  };

  const removeFile = () => {
    setFile(null);
    setFileData([]);
    setFileName("");
  };

  return (
    <div className="p-4  mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload Placement Data</h1>

        {/* Template Section */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Download Template</h2>
            <p className="text-gray-600">
  Use our{" "}
  <a
    href="https://docs.google.com/spreadsheets/d/1fVqKZVIGYEeWCMMeMaShnsivziWn3MvpskQV7kX00kE/edit?gid=0#gid=0"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 underline hover:text-blue-800"
  >
    template
  </a>{" "}
  to ensure proper formatting.
</p>
            </div>
            <button
              onClick={downloadTemplate}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >

              <FiDownload className="mr-2" />
              Download Template
            </button>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Placement File</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {!file ? (
              <div className="flex flex-col items-center">
                <FiUpload className="text-4xl text-gray-400 mb-3" />
                <p className="text-gray-600 mb-4">Drag & drop your Excel file here, or click to browse</p>
                <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition inline-block">
                  <input 
                    type="file" 
                    accept=".xlsx" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                  Select File
                </label>
                <p className="text-xs text-gray-500 mt-2">Only .xlsx files are accepted</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <FiFileText className="text-4xl text-green-500 mb-3" />
                <p className="font-medium text-gray-800 mb-1">{fileName}</p>
                <p className="text-gray-600 mb-4">{fileData.length} records found</p>
                <button
                  onClick={removeFile}
                  className="text-red-600 hover:text-red-800 flex items-center text-sm"
                >
                  <FiX className="mr-1" /> Remove File
                </button>
              </div>
            )}
          </div>
        </div>

        {/* File Preview */}
        {fileData.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">File Preview</h2>
              <span className="text-sm text-gray-500">{fileData.length} records</span>
            </div>
            
            <div className="overflow-x-auto overflow-y-auto max-h-80 border rounded-lg">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50 sticky top-0">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
        {Object.keys(fileData[0]).map((key) => (
          <th
            key={key}
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {key}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {fileData.map((row, index) => (
        <tr
          key={index}
          className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
        >
          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
            {index + 1}
          </td>
          {Object.values(row).map((value, i) => (
            <td key={i} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
              {value !== undefined ? value.toString() : 'N/A'}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>

          </div>
        )}

        {/* Upload Button */}
        {fileData.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={uploadData}
              disabled={loading}
              className={`flex items-center px-6 py-3 rounded-lg text-white font-medium ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FiUpload className="mr-2" />
                  Upload Placement Data
                </>
              )}
            </button>
          </div>
        )}

        {/* Status Messages */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <div className="flex items-center">
              <FiAlertCircle className="text-red-500 mr-3 text-xl" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <div className="flex items-center">
              <FiCheck className="text-green-500 mr-3 text-xl" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Results */}
        {showResults && (updatedRecords.length > 0 || failedRecords.length > 0) && (
  <div className="mt-8 w-full">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800">Upload Results</h2>
      <button
        onClick={closeResults}
        className="text-gray-500 hover:text-gray-700"
      >
        <FiX className="text-xl" />
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {updatedRecords.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <FiCheck className="text-green-500 mr-2" />
            <h3 className="font-medium text-green-800">Successful Updates ({updatedRecords.length})</h3>
          </div>
          <div className="max-h-100 overflow-y-auto w-full">
            <table className="min-w-full bg-white border border-gray-200 rounded">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">#</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Registered Number</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Company</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">CTC</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Reason</th>
                </tr>
              </thead>
              <tbody>
                {updatedRecords.map((record, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                    <td className="px-4 py-2 text-xs text-gray-700">{index + 1}</td>
                    <td className="px-4 py-2 text-xs text-gray-700">{record.registered_number}</td>
                    <td className="px-4 py-2 text-xs text-gray-700">{record.companyName}</td>
                    <td className="px-4 py-2 text-xs text-gray-700">{record.ctc.toLocaleString()}</td>
                    <td className="px-4 py-2 text-xs text-gray-700">{record.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {failedRecords.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <FiAlertCircle className="text-red-500 mr-2" />
            <h3 className="font-medium text-red-800">Failed Updates ({failedRecords.length})</h3>
          </div>
          <div className="max-h-60 overflow-y-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded">
              <thead className="bg-red-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">#</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Registered Number</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Company</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">CTC</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Reason</th>
                </tr>
              </thead>
              <tbody>
                {failedRecords.map((record, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-red-50'}>
                    <td className="px-4 py-2 text-xs text-gray-700">{index + 1}</td>
                    <td className="px-4 py-2 text-xs text-gray-700">{record.registered_number}</td>
                    <td className="px-4 py-2 text-xs text-gray-700">{record.companyName}</td>
                    <td className="px-4 py-2 text-xs text-gray-700">{record.ctc.toLocaleString()}</td>
                    <td className="px-4 py-2 text-xs text-gray-700">{record.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default PlacementUpload;