import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEducationDetails,
  updateEducationDetails,
  clearUpdateStatus,
} from "../../../Redux/StudentDashboard/Profile/educationDetailsSlice";
import { useParams, useLocation } from "react-router-dom";

// Reusable memoized input field
const InputField = React.memo(({ label, name, value, onChange, type = "text", placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      name={name}
      type={type}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded-md"
    />
  </div>
));

// Reusable memoized education section
const EducationSection = React.memo(({ title, data, setData, fields, handleChange }) => (
  <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {fields.map(({ name, label, type, placeholder }) => (
        <InputField
          key={name}
          name={name}
          label={label}
          type={type}
          value={data[name] || ""}
          onChange={(e) => handleChange(e, setData)}
          placeholder={placeholder}
        />
      ))}
    </div>
  </div>
));

function getChangedFields(initial, current) {
  const changed = {};
  for (const key in current) {
    if (typeof current[key] === "object" && current[key] !== null) {
      if (JSON.stringify(current[key]) !== JSON.stringify(initial?.[key] || {})) {
        changed[key] = current[key];
      }
    } else if (current[key] !== (initial?.[key] ?? "")) {
      changed[key] = current[key];
    }
  }
  return changed;
}

const UpdateEducationDetails = ({ goToNext }) => {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const location = useLocation();
  const token = localStorage.getItem("Student token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const studentId = JSON.parse(localStorage.getItem("studentData"))?.student?.id;

  const { data, loading, error, updateStatus } = useSelector((state) => state.educationDetails);

  const [tenth, setTenth] = useState({});
  const [twelfth, setTwelfth] = useState({});
  const [bachelors, setBachelors] = useState({});
  const [masters, setMasters] = useState({});
  const [certification, setCertification] = useState([]);
  const [initialEducation, setInitialEducation] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (studentId && universityName && token && BASE_URL) {
      dispatch(fetchEducationDetails({ studentId, universityName, token, BASE_URL }));
    }
  }, [studentId, universityName, token, BASE_URL, dispatch]);

  useEffect(() => {
    if (data) {
      setTenth(data.tenth || {});
      setTwelfth(data.twelfth || {});
      setBachelors(data.bachelors || {});
      setMasters(data.masters || {});
      setCertification(data.certification || []);
      setInitialEducation({
        tenth: data.tenth || {},
        twelfth: data.twelfth || {},
        bachelors: data.bachelors || {},
        masters: data.masters || {},
        certification: data.certification || [],
      });
    }
  }, [data]);

  const handleChange = useCallback((e, setter) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCertificationChange = useCallback((index, field, value) => {
    setCertification((prev) =>
      prev.map((cert, i) => (i === index ? { ...cert, [field]: value } : cert))
    );
  }, []);

  const addCertification = () => {
    setCertification((prev) => [
      ...prev,
      { institutionName: "", courseName: "", completionYear: "", percentageOrCGPA: "" },
    ]);
  };

  const removeCertification = (index) => {
    setCertification((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!initialEducation) return;
    const current = { tenth, twelfth, bachelors, masters, certification };
    const changedFields = getChangedFields(initialEducation, current);
    if (Object.keys(changedFields).length === 0) {
      setMessage({ text: "No changes to update.", type: "error" });
      return;
    }
    dispatch(updateEducationDetails({
      studentId, universityName, token, BASE_URL, educationDetails: changedFields
    }));
    setMessage({ text: "Updating education details...", type: "info" });
  };

  useEffect(() => {
    if (updateStatus === "success") {
      setMessage({ text: "Education details updated successfully!", type: "success" });
      dispatch(clearUpdateStatus());
      if (goToNext) goToNext();
    } else if (updateStatus === "failed") {
      setMessage({ text: "Failed to update education details.", type: "error" });
      dispatch(clearUpdateStatus());
    }
  }, [updateStatus, dispatch, goToNext]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading education details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Update Education Details</h1>

      {message.text && (
        <div className={`p-3 rounded-md mb-4 ${message.type === "success" ? "bg-green-100 text-green-800" : message.type === "error" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <EducationSection title="10th Grade" data={tenth} setData={setTenth} handleChange={handleChange} fields={[
          { name: "institutionName", label: "Institution Name" },
          { name: "board", label: "Board" },
          { name: "yearOfCompletion", label: "Year of Completion", type: "number" },
          { name: "percentageOrCGPA", label: "Percentage/CGPA" },
        ]} />

        <EducationSection title="12th Grade" data={twelfth} setData={setTwelfth} handleChange={handleChange} fields={[
          { name: "institutionName", label: "Institution Name" },
          { name: "board", label: "Board" },
          { name: "yearOfCompletion", label: "Year of Completion", type: "number" },
          { name: "percentageOrCGPA", label: "Percentage/CGPA" },
        ]} />

        <EducationSection title="Bachelor's Degree" data={bachelors} setData={setBachelors} handleChange={handleChange} fields={[
          { name: "institutionName", label: "Institution Name" },
          { name: "university", label: "University" },
          { name: "degree", label: "Degree" },
          { name: "specialization", label: "Specialization" },
          { name: "yearOfCompletion", label: "Year of Completion", type: "number" },
          { name: "percentageOrCGPA", label: "Percentage/CGPA" },
        ]} />

        <EducationSection title="Master's Degree" data={masters} setData={setMasters} handleChange={handleChange} fields={[
          { name: "institutionName", label: "Institution Name" },
          { name: "university", label: "University" },
          { name: "degree", label: "Degree" },
          { name: "specialization", label: "Specialization" },
          { name: "yearOfCompletion", label: "Year of Completion", type: "number" },
          { name: "percentageOrCGPA", label: "Percentage/CGPA" },
        ]} />

        {/* Certifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h3>
          {certification.map((cert, index) => (
            <div key={index} className="p-4 mb-4 border border-gray-100 rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {["institutionName", "courseName", "completionYear", "percentageOrCGPA"].map((field) => (
                  <InputField
                    key={field}
                    name={field}
                    label={field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                    type={field === "completionYear" ? "number" : "text"}
                    value={cert[field]}
                    onChange={(e) => handleCertificationChange(index, field, e.target.value)}
                  />
                ))}
              </div>
              <button type="button" onClick={() => removeCertification(index)} className="text-sm text-red-600 mt-2">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addCertification} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Add Certification</button>
        </div>

        <div className="text-center">
          <button type="submit" className="mt-6 px-6 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700">Update & Next</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEducationDetails;