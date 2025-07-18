import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFaculty, resetFacultyState } from "../../../Redux/College/faculty";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom"; // For dynamic university name


const AddFaculty = () => {
    const [messages, setMessages] = useState([]);
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.faculty);
    const location = useLocation(); // Access user data from state
    const user = location.state?.user || {}; // Extract user data from state
    const { universityName } = useParams(); // Get dynamic university name

    const initialFaculty = {
        name: "",
        email: "",
        phone: "",
        universityId: user.universityId || "", // Use user ID for university,
        collegeId: user.collegeId || "", // Use user ID for college,
        departmentId: "",
        status: "active",
        profilePictureUrl: "",
        bio: "",
    };


    const departments = useSelector((state) => state.department.departments) || [];
    console.log("Departments in AddFaculty:", departments);

    const [faculty, setFaculty] = useState(initialFaculty);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFaculty((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("University authToken");

        if (faculty.name && faculty.email && faculty.phone) {
            try {
                await dispatch(addFaculty({ facultyData: faculty, universityName, token })).unwrap();
                setMessages([{ status: "success", message: `${faculty.name} added successfully.` }]);
                setFaculty(initialFaculty);
            } catch (err) {
                setMessages([{ status: "error", message: `${faculty.name || "Faculty"} failed: ${err}` }]);
            }
        } else {
            setMessages([{ status: "error", message: `All required fields must be filled.` }]);
        }

        dispatch(resetFacultyState());
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Add Faculty Member</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-4 border border-gray-300 rounded-lg shadow-sm space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <input name="name" value={faculty.name} onChange={handleChange} placeholder="Name" className="p-2 border rounded" required />
                        <input name="email" type="email" value={faculty.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" required />
                        <input name="phone" value={faculty.phone} onChange={handleChange} placeholder="Phone" className="p-2 border rounded" required />
                        <input name="universityId" value={faculty.universityId} onChange={handleChange} placeholder="University ID" className="p-2 border rounded" required />
                        <input name="collegeId" value={faculty.collegeId} onChange={handleChange} placeholder="College ID" className="p-2 border rounded" required />
                        {/* ✅ Department dropdown instead of plain input */}
                        <select
                            name="departmentId"
                            value={faculty.departmentId}
                            onChange={handleChange}
                            className="p-2 border rounded"
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept._id} value={dept._id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                        <input name="status" value={faculty.status} onChange={handleChange} placeholder="Status" className="p-2 border rounded" />
                        <input name="profilePictureUrl" value={faculty.profilePictureUrl} onChange={handleChange} placeholder="Profile Picture URL" className="p-2 border rounded" />
                    </div>

                    <textarea name="bio" value={faculty.bio} onChange={handleChange} placeholder="Bio" className="w-full p-2 border rounded" rows={3} />
                </div>

                <div className="flex justify-end">
                    <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-60">
                        {loading ? "Submitting..." : "Add Faculty"}
                    </button>
                </div>
            </form>

            {messages.length > 0 && (
                <div className="mt-6 space-y-2">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`p-3 rounded text-sm ${msg.status === "success"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {msg.message}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddFaculty;
