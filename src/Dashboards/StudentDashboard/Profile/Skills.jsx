import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSkills, updateSkills, clearUpdateStatus } from "../../../Redux/StudentDashboard/Profile/skillsSlice";
import { useParams, useLocation } from "react-router-dom";

const UpdateSkills = ({ goToNext }) => {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const location = useLocation();
  const token = localStorage.getItem("Student token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const studentDataFromLocation = location.state || JSON.parse(localStorage.getItem("studentData"));
  const studentId = studentDataFromLocation?.student?.id || localStorage.getItem("studentId");

  const { data, loading, error, updateStatus } = useSelector((state) => state.skills);

  const [skills, setSkills] = useState({
    technicalSkills: [],
    softSkills: [],
    languagesKnown: [],
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (studentId && universityName && token && BASE_URL) {
      dispatch(fetchSkills({ studentId, universityName, token, BASE_URL }));
    }
  }, [studentId, universityName, token, BASE_URL, dispatch]);

  useEffect(() => {
    if (data) {
      const cloned = JSON.parse(JSON.stringify(data));
      setSkills(cloned);
    }
  }, [data]);

  const handleChange = (e, field, index = null, subField = null) => {
    const { value } = e.target;
    if (index !== null && subField !== null) {
      const updatedArray = [...skills[field]];
      updatedArray[index][subField] = value;
      setSkills((prev) => ({ ...prev, [field]: updatedArray }));
    } else if (index !== null) {
      const updatedArray = [...skills[field]];
      updatedArray[index] = value;
      setSkills((prev) => ({ ...prev, [field]: updatedArray }));
    } else {
      setSkills((prev) => ({ ...prev, [field]: value }));
    }
  };

  const addEntry = (field) => {
    setSkills((prev) => ({
      ...prev,
      [field]: [...prev[field], field === "languagesKnown" ? { language: "", proficiency: "" } : ""],
    }));
  };

  const removeEntry = (field, index) => {
    const updatedArray = skills[field].filter((_, i) => i !== index);
    setSkills((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSkills({
      studentId,
      universityName,
      token,
      BASE_URL,
      skillsAndCompetencies: skills,
    }));
  };

  useEffect(() => {
    if (updateStatus === "success") {
      setMessage("Skills updated successfully!");
      dispatch(clearUpdateStatus());
      if (goToNext) goToNext();
    } else if (updateStatus === "failed") {
      setMessage("Failed to update skills.");
      dispatch(clearUpdateStatus());
    }
  }, [updateStatus, dispatch, goToNext]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Update Skills & Competencies</h1>

      {message && (
        <div className={`mb-4 p-3 rounded text-sm ${message.includes("Failed") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Technical Skills */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Technical Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {skills.technicalSkills.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleChange(e, "technicalSkills", index)}
                  placeholder="e.g., JavaScript, Python"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                />
                <button
                  type="button"
                  onClick={() => removeEntry("technicalSkills", index)}
                  className="text-sm text-gray-500 hover:text-red-600"
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addEntry("technicalSkills")}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
          >
            + Skill
          </button>
        </div>

        {/* Soft Skills */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Soft Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {skills.softSkills.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleChange(e, "softSkills", index)}
                  placeholder="e.g., Communication, Leadership"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                />
                <button
                  type="button"
                  onClick={() => removeEntry("softSkills", index)}
                  className="text-sm text-gray-500 hover:text-red-600"
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addEntry("softSkills")}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
          >
            + Skill
          </button>
        </div>

        {/* Languages */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Languages Known</h2>
          {skills.languagesKnown.map((language, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
              <input
                type="text"
                value={language.language}
                onChange={(e) => handleChange(e, "languagesKnown", index, "language")}
                placeholder="Language"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
              <select
                value={language.proficiency}
                onChange={(e) => handleChange(e, "languagesKnown", index, "proficiency")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              >
                <option value="">Proficiency</option>
                <option value="Fluent">Fluent</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Basic">Basic</option>
              </select>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => removeEntry("languagesKnown", index)}
                  className="text-sm text-gray-500 hover:text-red-600"
                >
                  X
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addEntry("languagesKnown")}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
          >
            + Language
          </button>
        </div>

        {/* Submit */}
        <div className="text-center mt-6">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-8 rounded-md"
          >
            Update & Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateSkills;