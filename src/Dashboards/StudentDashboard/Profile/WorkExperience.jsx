import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWorkExperience,
  updateWorkExperience,
  clearUpdateStatus,
} from "../../../Redux/StudentDashboard/Profile/workExperienceSlice";
import { useParams, useLocation } from "react-router-dom";

const UpdateExperience = ({ goToNext }) => {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const location = useLocation();
  const token = localStorage.getItem("Student token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const studentDataFromLocation =
    location.state || JSON.parse(localStorage.getItem("studentData") || "{}");
  const studentId =
    studentDataFromLocation?.student?.id || localStorage.getItem("studentId");

  const { data, loading, updateStatus } = useSelector((state) => state.workExperience);

  const [workExperience, setWorkExperience] = useState([
    {
      companyName: "",
      position: "",
      duration: "",
      responsibilitiesAndAchievements: [""],
      skillsAcquired: [""],
      experianceCertificateLink: "",
    },
  ]);

  const [message, setMessage] = useState({ text: "", type: "" });
  const didInitialize = useRef(false);

  useEffect(() => {
    if (studentId && universityName && token && BASE_URL) {
      dispatch(fetchWorkExperience({ studentId, universityName, token, BASE_URL }));
    }
  }, [studentId, universityName, token, BASE_URL, dispatch]);

  useEffect(() => {
    if (Array.isArray(data) && !didInitialize.current) {
      const normalized = data.length
        ? data.map((exp) => ({
            companyName: exp.companyName || "",
            position: exp.position || "",
            duration: exp.duration || "",
            responsibilitiesAndAchievements: exp.responsibilitiesAndAchievements?.length
              ? [...exp.responsibilitiesAndAchievements]
              : [""],
            skillsAcquired: exp.skillsAcquired?.length ? [...exp.skillsAcquired] : [""],
            experianceCertificateLink: exp.experianceCertificateLink || "",
          }))
        : [
            {
              companyName: "",
              position: "",
              duration: "",
              responsibilitiesAndAchievements: [""],
              skillsAcquired: [""],
              experianceCertificateLink: "",
            },
          ];
      setWorkExperience(normalized);
      didInitialize.current = true;
    }
  }, [data]);

  const handleChange = (e, idx, field) => {
    const { value } = e.target;
    setWorkExperience((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const handleArrayItemChange = (e, idx, arrayField, itemIdx) => {
    const { value } = e.target;
    setWorkExperience((prev) =>
      prev.map((item, i) =>
        i === idx
          ? { ...item, [arrayField]: item[arrayField].map((val, j) => (j === itemIdx ? value : val)) }
          : item
      )
    );
  };

  const addArrayItem = (idx, arrayField) => {
    setWorkExperience((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, [arrayField]: [...item[arrayField], ""] } : item
      )
    );
  };

  const removeArrayItem = (idx, arrayField, itemIdx) => {
    setWorkExperience((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              ...item,
              [arrayField]: item[arrayField].filter((_, j) => j !== itemIdx) || [""],
            }
          : item
      )
    );
  };

  const addExperience = () => {
    setWorkExperience((prev) => [
      ...prev,
      {
        companyName: "",
        position: "",
        duration: "",
        responsibilitiesAndAchievements: [""],
        skillsAcquired: [""],
        experianceCertificateLink: "",
      },
    ]);
  };

  const removeExperience = (idx) => {
    setWorkExperience((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleaned = workExperience.map((exp) => ({
      ...exp,
      responsibilitiesAndAchievements: exp.responsibilitiesAndAchievements.filter((x) => x.trim()),
      skillsAcquired: exp.skillsAcquired.filter((x) => x.trim()),
    }));
    dispatch(updateWorkExperience({ studentId, universityName, token, BASE_URL, workExperience: cleaned }));
  };

  useEffect(() => {
    if (updateStatus === "success") {
      setMessage({ text: "Work experience updated successfully!", type: "success" });
      dispatch(clearUpdateStatus());
      if (goToNext) goToNext();
    } else if (updateStatus === "failed") {
      setMessage({ text: "Failed to update work experience.", type: "error" });
      dispatch(clearUpdateStatus());
    }
  }, [updateStatus, dispatch, goToNext]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Update Work Experience</h1>

      {message.text && (
        <div className={`p-3 rounded mb-4 text-sm ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {workExperience.map((exp, idx) => (
          <div key={idx} className="border rounded-lg p-4 shadow-sm bg-white space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700">{idx + 1}. Experience</h2>
              {workExperience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(idx)}
                  className="text-red-600 hover:text-red-800 text-sm border rounded px-2 py-1"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Company, Position, Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["companyName", "position", "duration"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                  <input
                    type="text"
                    value={exp[field]}
                    onChange={(e) => handleChange(e, idx, field)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                    required
                  />
                </div>
              ))}
            </div>

            {/* Responsibilities & Achievements */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700">Responsibilities & Achievements</label>
                <button type="button" onClick={() => addArrayItem(idx, "responsibilitiesAndAchievements")} className="text-blue-600 hover:text-blue-800 text-sm font-medium">+ Add</button>
              </div>
              {exp.responsibilitiesAndAchievements.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-center space-x-2 mb-1">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayItemChange(e, idx, "responsibilitiesAndAchievements", itemIdx)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                  />
                  {exp.responsibilitiesAndAchievements.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem(idx, "responsibilitiesAndAchievements", itemIdx)} className="text-sm text-red-500">X</button>
                  )}
                </div>
              ))}
            </div>

            {/* Skills Acquired */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700">Skills Acquired</label>
                <button type="button" onClick={() => addArrayItem(idx, "skillsAcquired")} className="text-blue-600 hover:text-blue-800 text-sm font-medium">+ Add</button>
              </div>
              {exp.skillsAcquired.map((skill, skillIdx) => (
                <div key={skillIdx} className="flex items-center space-x-2 mb-1">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayItemChange(e, idx, "skillsAcquired", skillIdx)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                  />
                  {exp.skillsAcquired.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem(idx, "skillsAcquired", skillIdx)} className="text-sm text-red-500">X</button>
                  )}
                </div>
              ))}
            </div>

            {/* Certificate Link */}
            <div>
              <label className="text-sm font-medium text-gray-700">Experience Certificate Link</label>
              <input
                type="text"
                value={exp.experianceCertificateLink}
                onChange={(e) => handleChange(e, idx, "experianceCertificateLink")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                placeholder="e.g., https://example.com/certificate.pdf"
              />
            </div>
          </div>
        ))}

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button type="button" onClick={addExperience} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">+ Add Experience</button>
          <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Update & Next</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateExperience;