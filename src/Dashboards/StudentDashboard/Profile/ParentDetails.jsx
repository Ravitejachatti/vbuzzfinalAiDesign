import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchParentDetails,
  updateParentDetails,
  clearUpdateStatus,
} from "../../../Redux/StudentDashboard/Profile/parentDetailsSlice";
import { useParams, useLocation } from "react-router-dom";

const UpdateParentDetails = ({ goToNext }) => {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const location = useLocation();
  const token = localStorage.getItem("Student token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const studentDataFromLocation = location.state || JSON.parse(localStorage.getItem("studentData"));
  const studentId = studentDataFromLocation?.student?.id || localStorage.getItem("studentId");

  const { data, loading, updateStatus, error } = useSelector((state) => state.parentDetails);

  const [parentDetails, setParentDetails] = useState({
    name: "",
    contactNumber: "",
    occupation: "",
    address: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (studentId && universityName && token && BASE_URL) {
      dispatch(fetchParentDetails({ studentId, universityName, token, BASE_URL }));
    }
  }, [studentId, universityName, token, BASE_URL, dispatch]);

  useEffect(() => {
    if (data) {
      setParentDetails(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateParentDetails({
        studentId,
        universityName,
        token,
        BASE_URL,
        parentDetails,
      })
    );
  };

  useEffect(() => {
    if (updateStatus === "success") {
      setMessage({ text: "Parent details updated successfully!", type: "success" });
      dispatch(clearUpdateStatus());
      if (goToNext) goToNext();
    } else if (updateStatus === "failed") {
      setMessage({ text: "Failed to update parent details.", type: "error" });
      dispatch(clearUpdateStatus());
    }
  }, [updateStatus, dispatch, goToNext]);

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
        <div className="md:mb-8">
          <h1 className="text-lg md:text-xl font-semibold text-gray-800 md:mb-2">
            Parent/Guardian Details:
          </h1>
          <p className="text-gray-600">
            Update your parent or guardian's information
          </p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === "success" 
              ? "bg-green-50 border border-green-200 text-green-800" 
              : "bg-red-50 border border-red-200 text-red-800"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-1">
          {/* Basic Information - Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={parentDetails.name}
                onChange={handleChange}
                className="w-full p-1 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Parent/Guardian full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={parentDetails.contactNumber}
                onChange={handleChange}
                className="w-full p-1 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+91 9876543210"
                pattern="[0-9]{10}"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Occupation
              </label>
              <input
                type="text"
                name="occupation"
                value={parentDetails.occupation}
                onChange={handleChange}
                className="w-full p-1 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Business, Teacher"
              />
            </div> 
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Address
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              name="address"
              value={parentDetails.address}
              onChange={handleChange}
              rows={2}
              className="w-full p-1 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="House no, Street, City, State, Pincode"
              required
            />
          </div>
          </div>

          {/* Address Section */}
         

          {/* Emergency Contact Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Additional Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship
                </label>
                <select
                  className="w-full p-1 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select relationship</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alternate Contact
                </label>
                <input
                  type="tel"
                  className="w-full p-1 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Alternate phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full p-1 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Parent email address"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-1">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-2 rounded-lg transition duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Update & Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateParentDetails;