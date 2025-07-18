import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { fetchPersonalDetails, updatePersonalDetails, clearUpdateStatus } from "../../../Redux/StudentDashboard/Profile/personalDetaillsSlice.js";

const UpdatePersonalDetails = ({ goToNext }) => {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const location = useLocation();
  const token = localStorage.getItem("Student token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const studentDataFromLocation = location.state || JSON.parse(localStorage.getItem("studentData"));
  const studentId = studentDataFromLocation?.student?.id || localStorage.getItem("studentId");

  const { data, loading, error, updateStatus } = useSelector((state) => state.personalDetails);

  const [personalDetails, setPersonalDetails] = useState({
    name: "", surname: "", email: "", phone: "", gender: "",
    registered_number: "", enrollment_year: "", graduation_year: "",
    dateOfBirth: "", category: "", nationality: "", bloodGroup: "", caste: "",
    futurePlan: [], Bio: "", isPlacementOpted: false,
    disability: { hasDisability: false, type: "", severity: "", disabilityPercentage: 0, supportRequired: "" }
  });
  const [initialDetails, setInitialDetails] = useState(null);

  useEffect(() => {
    if (studentId && universityName && token && BASE_URL) {
      dispatch(fetchPersonalDetails({ studentId, universityName, token, BASE_URL }));
    }
  }, [studentId, universityName, token, BASE_URL, dispatch]);

  useEffect(() => {
    if (data) {
      const details = {
        ...data,
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
        futurePlan: data.futurePlan || [],
        disability: data.disability || { hasDisability: false, type: "", severity: "", disabilityPercentage: 0, supportRequired: "" }
      };
      setPersonalDetails(details);
      setInitialDetails(details);
    }
  }, [data]);

  const getChangedFields = (initial, current) => {
    const changed = {};
    for (const key in current) {
      if (typeof current[key] === "object" && current[key] !== null && !Array.isArray(current[key])) {
        if (JSON.stringify(current[key]) !== JSON.stringify(initial[key] || {})) {
          changed[key] = current[key];
        }
      } else if (Array.isArray(current[key])) {
        if (JSON.stringify(current[key]) !== JSON.stringify(initial[key] || [])) {
          changed[key] = current[key];
        }
      } else {
        if (current[key] !== (initial[key] ?? "")) {
          changed[key] = current[key];
        }
      }
    }
    return changed;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("disability.")) {
      const field = name.split(".")[1];
      setPersonalDetails((prev) => ({ ...prev, disability: { ...prev.disability, [field]: type === "checkbox" ? checked : value } }));
    } else {
      setPersonalDetails((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
  };

  const handleFuturePlanChange = (e) => {
    const { value, checked } = e.target;
    setPersonalDetails((prev) => ({
      ...prev,
      futurePlan: checked ? [...prev.futurePlan, value] : prev.futurePlan.filter((p) => p !== value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!initialDetails) return;
    const changedFields = getChangedFields(initialDetails, personalDetails);
    dispatch(updatePersonalDetails({ studentId, universityName, token, BASE_URL, personalDetails: changedFields }));
  };

  useEffect(() => {
    if (updateStatus === "success") {
      alert("Personal details updated successfully!");
      dispatch(clearUpdateStatus());
      if (goToNext) goToNext();
    }
  }, [updateStatus, dispatch, goToNext]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mx-auto p-4 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Update Personal Details</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Placement Opted */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Placement Preference</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPlacementOpted"
              checked={personalDetails.isPlacementOpted || false}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Opted for Placement</span>
          </div>
        </div>

        {/* Future Plan */}
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-2">Future Plans</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {['Higher Studies', 'Government Job', 'Private Job', 'Entrepreneurship', 'Business'].map(plan => (
              <label key={plan} className="flex items-center">
                <input
                  type="checkbox"
                  value={plan}
                  checked={personalDetails.futurePlan.includes(plan)}
                  onChange={handleFuturePlanChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm">{plan}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Editable fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 border-t pt-4">

                  <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={personalDetails.name || ""}
            disabled
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={personalDetails.email || ""}
            disabled
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={personalDetails.phone || ""}
            disabled
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
          {[
            { label: "Surname", name: "surname" },
            { label: "Registered Number", name: "registered_number" },
            { label: "Enrollment Year", name: "enrollment_year", type: "number" },
            { label: "Graduation Year", name: "graduation_year", type: "number" },
            { label: "Gender", name: "gender", type: "select", options: ["", "male", "female", "others"] },
            { label: "Date of Birth", name: "dateOfBirth", type: "date" },
            { label: "Category", name: "category" },
            { label: "Sub-Caste", name: "caste" },
            { label: "Nationality", name: "nationality" },
            { label: "Blood Group", name: "bloodGroup" }
          ].map(({ label, name, type = "text", options }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              {type === "select" ? (
                <select name={name} value={personalDetails[name] || ""} onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md">
                  {options.map(opt => <option key={opt} value={opt}>{opt || "Select"}</option>)}
                </select>
              ) : (
                <input type={type} name={name} value={personalDetails[name] || ""} onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md" />
              )}
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="border-t pt-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Professional Summary</h3>
          <textarea
            name="Bio"
            value={personalDetails.Bio || ""}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Disability */}
        <div className="border-t pt-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Disability Information</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="disability.hasDisability"
                checked={personalDetails.disability.hasDisability}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm">Has Disability</span>
            </label>
            {personalDetails.disability.hasDisability && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="disability.type" value={personalDetails.disability.type || ""} onChange={handleChange}
                  placeholder="Disability Type" className="p-2 border border-gray-300 rounded-md" />
                <select name="disability.severity" value={personalDetails.disability.severity || ""} onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-md">
                  <option value="">Select Severity</option>
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
                <input type="number" name="disability.disabilityPercentage" value={personalDetails.disability.disabilityPercentage || ""}
                  onChange={handleChange} placeholder="Disability %" min="0" max="100"
                  className="p-2 border border-gray-300 rounded-md" />
                <textarea name="disability.supportRequired" value={personalDetails.disability.supportRequired || ""}
                  onChange={handleChange} rows="2" placeholder="Support Required"
                  className="p-2 border border-gray-300 rounded-md" />
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="w-full border-t pt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">Check information before updating & going to next section.</p>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
            Update & Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePersonalDetails;