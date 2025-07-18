import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";

const UpdatePreferences = ({ goToNext }) => {
    const { id } = useParams();
    const [preferences, setPreferences] = useState({
        jobpreferences: {
            fullTime: "",
            partTime: "",
            internship: "",
            jobType: "",
            skillLevel: "",
            sector: "",
            functionalArea: "",
            jobLocation: "",
            flexibleTimeHours: "",
        },
        higherEducationPreference: {
            interestedInHigherEducation: false,
            preferredDegree: "",
            preferredField: "",
            targetUniversities: [],
            preferredCountries: [],
        },
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: "", type: "" });
    const token = localStorage.getItem("Student token");
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { universityName } = useParams();
    const location = useLocation();

    const studentDataFromLocation = location.state || JSON.parse(localStorage.getItem("studentData"));
    const studentId = studentDataFromLocation?.student?.id || localStorage.getItem("studentId");

    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/student/${studentId}?universityName=${encodeURIComponent(universityName)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const studentData = response.data.student;
                setPreferences({
                    jobpreferences: studentData.jobpreferences || {
                        fullTime: "",
                        partTime: "",
                        internship: "",
                        jobType: "",
                        skillLevel: "",
                        sector: "",
                        functionalArea: "",
                        jobLocation: "",
                        flexibleTimeHours: "",
                    },
                    higherEducationPreference: studentData.higherEducationPreference || {
                        interestedInHigherEducation: false,
                        preferredDegree: "",
                        preferredField: "",
                        targetUniversities: [],
                        preferredCountries: [],
                    },
                });
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch preferences:", error);
                setMessage({ text: "Failed to fetch preferences.", type: "error" });
                setLoading(false);
            }
        };

        fetchPreferences();
    }, [studentId, universityName, token]);

    const handleChange = (e, section, field) => {
        const { value } = e.target;
        setPreferences(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const handleCheckboxChange = (e, section, field) => {
        const { checked } = e.target;
        setPreferences(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: checked,
            },
        }));
    };

    const handleArrayChange = (e, section, field) => {
        const { value } = e.target;
        setPreferences(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value.split(",").map(item => item.trim()),
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${BASE_URL}/student/${studentId}/update-preferences?universityName=${encodeURIComponent(universityName)}`,
                preferences,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage({ text: "Preferences updated successfully!", type: "success" });
            alert("Preferences updated successfully!");
            if (goToNext) goToNext();  // 👈 Navigate to next section
        } catch (error) {
            console.error("Failed to update preferences:", error);
            setMessage({ text: "Failed to update preferences.", type: "error" });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className=" mx-auto">
                <div className="text-center">
                    <h1 className=" text-gray-900">Update Your Preferences(Customize your job and higher education preferences)</h1>
                </div>
                {message.text && (
                    <div
                        className={`mb-6 p-4 rounded-lg ${message.type === "success"
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Job Preferences Section */}
                    <div className=" overflow-hidden">
                        <div className="px-6 py-1 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-xl font-semibold text-gray-800">Job Preferences</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Full Time Availability</label>
                                <select
                                    value={preferences.jobpreferences.fullTime}
                                    onChange={(e) => handleChange(e, "jobpreferences", "fullTime")}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                >
                                    <option value="">Select Option</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Part Time Availability</label>
                                <select
                                    value={preferences.jobpreferences.partTime}
                                    onChange={(e) => handleChange(e, "jobpreferences", "partTime")}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                >
                                    <option value="">Select Option</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Internship Availability</label>
                                <select
                                    value={preferences.jobpreferences.internship}
                                    onChange={(e) => handleChange(e, "jobpreferences", "internship")}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                >
                                    <option value="">Select Option</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Job Type Preference</label>
                                <select
                                    value={preferences.jobpreferences.jobType}
                                    onChange={(e) => handleChange(e, "jobpreferences", "jobType")}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                >
                                    <option value="">Select Job Type</option>
                                    <option value="government">Government</option>
                                    <option value="private">Private</option>
                                    <option value="entrepreneur">Entrepreneur</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Skill Level</label>
                                <select
                                    value={preferences.jobpreferences.skillLevel}
                                    onChange={(e) => handleChange(e, "jobpreferences", "skillLevel")}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                >
                                    <option value="">Select Skill Level</option>
                                    <option value="skilled">Skilled</option>
                                    <option value="semi-skilled">Semi-skilled</option>
                                    <option value="unskilled">Unskilled</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Preferred Sector</label>
                        
                                <input  
                                    type="text"
                                    value={preferences.jobpreferences.sector}
                                    onChange={(e) => handleChange(e, "jobpreferences", "sector")}
                                    className="mt-1 py-2 pl-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    placeholder="e.g., IT, Marketing"
                                />  
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Functional Area</label>
                          {/* just take the input  */}

                                <input
                                    type="text"
                                    value={preferences.jobpreferences.functionalArea}
                                    onChange={(e) => handleChange(e, "jobpreferences", "functionalArea")}
                                    className="mt-1 py-2 pl-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    placeholder="e.g., Software Development, Marketing"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Preferred Job Location</label>
                                <input
                                    type="text"
                                    value={preferences.jobpreferences.jobLocation}
                                    onChange={(e) => handleChange(e, "jobpreferences", "jobLocation")}
                                    className="mt-1 py-2 pl-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    placeholder="e.g., Bangalore, Remote"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Flexible Time/Hours</label>
                                <input
                                    type="text"
                                    value={preferences.jobpreferences.flexibleTimeHours}
                                    onChange={(e) => handleChange(e, "jobpreferences", "flexibleTimeHours")}
                                    className="mt-1 py-2 pl-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    placeholder="e.g., Flexible hours, Night shifts"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Higher Education Preferences Section */}
                    <div className=" overflow-hidden">
                        <div className="px-6 py-1 border-b border-gray-200 ">
                            <h2 className="text-xl font-semibold text-gray-800">Higher Education Preferences</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="interestedInHigherEducation"
                                    checked={preferences.higherEducationPreference.interestedInHigherEducation}
                                    onChange={(e) => handleCheckboxChange(e, "higherEducationPreference", "interestedInHigherEducation")}
                                    className="h-4 w-4  py-2 pl-3 text-blue-600 focus:ring-blue-500 border-gray-900 rounded"
                                />
                                <label htmlFor="interestedInHigherEducation" className="ml-3 block text-sm font-medium text-gray-700">
                                    Interested in Higher Education
                                </label>
                            </div>

                            {preferences.higherEducationPreference.interestedInHigherEducation && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">Preferred Degree</label>
                                        <input
                                            type="text"
                                            value={preferences.higherEducationPreference.preferredDegree}
                                            onChange={(e) => handleChange(e, "higherEducationPreference", "preferredDegree")}
                                            className="mt-1 py-2 pl-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-900 rounded-md"
                                            placeholder="e.g., MS, MBA, PhD"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">Preferred Field</label>
                                        <input
                                            type="text"
                                            value={preferences.higherEducationPreference.preferredField}
                                            onChange={(e) => handleChange(e, "higherEducationPreference", "preferredField")}
                                            className="mt-1 py-2 pl-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-900 rounded-md"
                                            placeholder="e.g., Computer Science, Business"
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">Target Universities (comma separated)</label>
                                        <input
                                            type="text"
                                            value={preferences.higherEducationPreference.targetUniversities.join(", ")}
                                            onChange={(e) => handleArrayChange(e, "higherEducationPreference", "targetUniversities")}
                                            className="mt-1 py-2 pl-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            placeholder="e.g., Stanford University, MIT"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Separate multiple universities with commas</p>
                                    </div>

                                    <div className="md:col-span-2 space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">Preferred Countries (comma separated)</label>
                                        <input
                                            type="text"
                                            value={preferences.higherEducationPreference.preferredCountries.join(", ")}
                                            onChange={(e) => handleArrayChange(e, "higherEducationPreference", "preferredCountries")}
                                            className="mt-1 py-2 pl-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            placeholder="e.g., USA, Germany, Canada"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Separate multiple countries with commas</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center ">
                        <button
                            type="submit"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Update & Next
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePreferences;