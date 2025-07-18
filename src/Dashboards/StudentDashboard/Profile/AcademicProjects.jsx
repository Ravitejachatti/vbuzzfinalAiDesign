import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAcademicProjects,
  updateAcademicProjects,
  clearUpdateStatus,
} from "../../../Redux/StudentDashboard/Profile/academicProjectsSlice";
import { useParams, useLocation } from "react-router-dom";

const AcademicProjects = ({ goToNext }) => {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const location = useLocation();

  const token = localStorage.getItem("Student token");
  const studentId = JSON.parse(localStorage.getItem("studentData"))?.student?.id;

  const { data, loading, updateStatus, error } = useSelector(
    (state) => state.academicProjects
  );

  const [projects, setProjects] = useState([
    {
      title: "",
      level: "",
      description: "",
      role: "",
      toolsOrTechnologiesUsed: [],
      outcomesOrResults: "",
      publicationsOrResearchLinks: [],
    },
  ]);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (studentId && universityName && token) {
      dispatch(fetchAcademicProjects({ studentId, universityName, token }));
    }
  }, [studentId, universityName, token, dispatch]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setProjects(data.length ? JSON.parse(JSON.stringify(data)) : [
        {
          title: "",
          level: "",
          description: "",
          role: "",
          toolsOrTechnologiesUsed: [],
          outcomesOrResults: "",
          publicationsOrResearchLinks: [],
        },
      ]);
    }
  }, [data]);

  useEffect(() => {
    if (updateStatus === "success") {
      setMessage({ text: "Projects updated successfully!", type: "success" });
      dispatch(clearUpdateStatus());
      if (goToNext) goToNext();
    } else if (updateStatus === "failed") {
      setMessage({ text: "Failed to update projects.", type: "error" });
      dispatch(clearUpdateStatus());
    }
  }, [updateStatus, dispatch, goToNext]);

  const handleChange = (e, index, field) => {
    const value = e.target.value;
    setProjects((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleArrayChange = (e, index, field) => {
    const value = e.target.value;
    setProjects((prev) => {
      const updated = [...prev];
      updated[index][field] = value.split(",").map((item) => item.trim());
      return updated;
    });
  };

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        title: "",
        level: "",
        description: "",
        role: "",
        toolsOrTechnologiesUsed: [],
        outcomesOrResults: "",
        publicationsOrResearchLinks: [],
      },
    ]);
  };

  const removeProject = (index) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateAcademicProjects({ studentId, universityName, token, academicProjects: projects }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Academic Projects
        </h1>
        <p className="text-sm text-gray-600">Showcase your academic work and research projects.</p>
      </div>

      {message.text && (
        <div
          className={`p-3 mb-4 rounded-lg border text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border-green-300"
              : "bg-red-50 text-red-800 border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {projects.map((project, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Project {idx + 1}</h2>
              {projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProject(idx)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  🗑 Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title*</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => handleChange(e, idx, "title")}
                  required
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                  placeholder="e.g., Smart Attendance System"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Level*</label>
                <select
                  value={project.level}
                  onChange={(e) => handleChange(e, idx, "level")}
                  required
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                >
                  <option value="">Select level</option>
                  <option value="University">University</option>
                  <option value="Departmental">Departmental</option>
                  <option value="National">National</option>
                  <option value="International">International</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Role*</label>
                <input
                  type="text"
                  value={project.role}
                  onChange={(e) => handleChange(e, idx, "role")}
                  required
                  placeholder="e.g., Team Lead"
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
              <textarea
                rows={3}
                value={project.description}
                onChange={(e) => handleChange(e, idx, "description")}
                required
                placeholder="Describe the project objectives and your contributions"
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tools/Technologies Used</label>
                <textarea
                  rows={2}
                  value={project.toolsOrTechnologiesUsed.join(", ")}
                  onChange={(e) => handleArrayChange(e, idx, "toolsOrTechnologiesUsed")}
                  placeholder="e.g., React, Node.js"
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                />
                <p className="text-xs text-gray-500">Separate with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outcomes/Results</label>
                <textarea
                  rows={2}
                  value={project.outcomesOrResults}
                  onChange={(e) => handleChange(e, idx, "outcomesOrResults")}
                  placeholder="Awards, achievements"
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publications/Links</label>
                <input
                  type="text"
                  value={project.publicationsOrResearchLinks.join(", ")}
                  onChange={(e) => handleArrayChange(e, idx, "publicationsOrResearchLinks")}
                  placeholder="GitHub, DOI, etc."
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
                />
                <p className="text-xs text-gray-500">Separate with commas</p>
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-4">
          <button
            type="button"
            onClick={addProject}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            + Add Another Project
          </button>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            ✔ Save and Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default AcademicProjects;