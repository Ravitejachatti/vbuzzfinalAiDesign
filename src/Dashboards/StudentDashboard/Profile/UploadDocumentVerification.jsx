// UpdateDocumentVerification.jsx (Redux-integrated)
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import {
  fetchDocumentVerification,
  updateDocumentVerification,
  clearMessage,
} from "../../../Redux/StudentDashboard/Profile/documentVerificationSlice";

const UpdateDocumentVerification = ({ goToNext }) => {
  const { universityName } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = localStorage.getItem("Student token");
  const studentDataFromLocation =
    location.state || JSON.parse(localStorage.getItem("studentData"));
  const studentId =
    studentDataFromLocation?.student?.id || localStorage.getItem("studentId");

  const { data, loading, message } = useSelector(
    (state) => state.documentVerification
  );

  const [formData, setFormData] = useState({
    aadharNumber: "",
    passportNumber: "",
  });

  useEffect(() => {
    dispatch(fetchDocumentVerification({ studentId, universityName, token }));
  }, [dispatch, studentId, universityName, token]);

  useEffect(() => {
    setFormData({ ...data });
  }, [data]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => dispatch(clearMessage()), 4000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateDocumentVerification({
        studentId,
        universityName,
        token,
        data: formData,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled" && goToNext) goToNext();
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto md:p-6">
      <div className="overflow-hidden md:p-6">
        <div className="mb-8">
          <h1 className="md:text-lg font-bold text-gray-800 md:mb-2">
            Document Verification:
          </h1>
          <p className="text-gray-600 text-sm">
            Update your official identification documents:
          </p>
        </div>

        {message && (
          <div
            className={`md:mb-6 md:p-4 rounded-lg ${
              message.includes("successfully")
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Aadhar Section */}
            <div className="md:p-6 bg-gray-50">
              <div className="flex items-center md:mb-4">
                <div className="bg-blue-100 md:p-2 rounded-lg mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="md:text-lg font-semibold text-gray-800">Aadhar Card</h2>
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aadhar Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter 12-digit Aadhar number"
                pattern="[0-9]{12}"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Format: 12-digit number without spaces or hyphens
              </p>
            </div>

            {/* Passport Section */}
            <div className="md:p-6 bg-gray-50">
              <div className="flex items-center md:mb-4">
                <div className="bg-blue-100 md:p-2 rounded-lg mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Passport</h2>
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passport Number
              </label>
              <input
                type="text"
                name="passportNumber"
                value={formData.passportNumber}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter passport number"
              />
              <p className="mt-1 text-xs text-gray-500">Optional for Indian nationals</p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Update and next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDocumentVerification;
