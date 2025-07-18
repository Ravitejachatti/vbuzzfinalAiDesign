import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllFaculty,
  updateFaculty,
  deleteFaculty,
  resetFacultyState,
} from "../../../Redux/College/faculty"; // Assuming you have this
import { useParams } from "react-router-dom"; // For dynamic university name

const ManageFaculty = () => {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const { allFaculty, loading, error, success, message } = useSelector((state) => state.faculty);
  const departments = useSelector((state) => state.department.departments) || [];
  const [editPopup, setEditPopup] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({});
  const [feedback, setFeedback] = useState(null);
  const token = localStorage.getItem("University authToken");

  // Fetch all faculty on component mount
  useEffect(() => {
    dispatch(getAllFaculty({ universityName, token }));
    // console the allFaculty after fetching


  }, [universityName, token, dispatch]);

  useEffect(() => {
  console.log("Component allFaculty in manage faculty:", allFaculty);
}, [allFaculty]);


  const getDeptName = (deptId) =>
    departments.find((d) => d._id === deptId)?.name || "Unknown";

  const handleEdit = (faculty) => {
    setFormData(faculty);
    setEditPopup(true);
  };

const handleEditSubmit = async () => {
  const token = localStorage.getItem("University authToken");

  // Compare current input with original to extract only updated fields
  const updatedData = {};
  const original = allFaculty.find((f) => f._id === formData._id);

  if (!original) return;

  if (formData.name !== original.name) updatedData.name = formData.name;
  if (formData.email !== original.email) updatedData.email = formData.email;
  if (formData.phone !== original.phone) updatedData.phone = formData.phone;
  if (formData.bio !== original.bio) updatedData.bio = formData.bio;

  if (Object.keys(updatedData).length === 0) {
    setFeedback({ type: "error", text: "No fields were changed." });
    return;
  }

  try {
    await dispatch(
      updateFaculty({
        id: formData._id,
        facultyData: updatedData, // send only modified keys
        universityName,
        token,
      })
    ).unwrap();
    setFeedback({ type: "success", text: "Faculty updated successfully." });
    setEditPopup(null);
    dispatch(getAllFaculty({ universityName, token }));
  } catch (err) {
    setFeedback({ type: "error", text: `Update failed: ${err}` });
    console.error("Update error:", err);
  }
};


  const handleDelete = async () => {
    const token = localStorage.getItem("University authToken");
    try {
      await dispatch(deleteFaculty({ id: deleteId, universityName, token })).unwrap();
      setFeedback({ type: "success", text: "Faculty deleted successfully." });
      setDeleteId(null);
     dispatch(getAllFaculty({ universityName, token }));
    } catch (err) {
      setFeedback({ type: "error", text: `Delete failed: ${err}` });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Faculty List</h2>

      {feedback && (
        <div className={`p-3 rounded mb-4 text-sm ${feedback.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {feedback.text}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Department</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allFaculty?.map((f) => (
              <tr key={f._id}>
                <td className="border px-4 py-2">{f.name}</td>
                <td className="border px-4 py-2">{f.email}</td>
                <td className="border px-4 py-2">{f.phone}</td>
                <td className="border px-4 py-2">{getDeptName(f.departmentId)}</td>
                <td className="border px-4 py-2">{f.status}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => handleEdit(f)} className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => setDeleteId(f._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Popup */}
      {editPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Edit Faculty</h3>
            <input name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="border p-2 w-full mb-2" placeholder="Name" />
            <input name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="border p-2 w-full mb-2" placeholder="Email" />
            <input name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="border p-2 w-full mb-2" placeholder="Phone" />
            <textarea name="bio" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="border p-2 w-full mb-4" placeholder="Bio" />
            <div className="flex justify-end space-x-3">
              <button onClick={handleEditSubmit} className="bg-green-600 text-white px-4 py-1 rounded">Save</button>
              <button onClick={() => setEditPopup(null)} className="bg-gray-400 text-white px-4 py-1 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg mb-4">Are you sure you want to delete this faculty?</h3>
            <div className="flex justify-end space-x-3">
              <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-1 rounded">Delete</button>
              <button onClick={() => setDeleteId(null)} className="bg-gray-400 text-white px-4 py-1 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFaculty;

