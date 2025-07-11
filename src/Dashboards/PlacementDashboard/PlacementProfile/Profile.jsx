import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";

const Profile = ({ user }) => {
  const universityId = user?.id || "";
    const { universityName } = useParams(); 

  const [placements, setPlacements] = useState([]);
  const [createForm, setCreateForm] = useState({
    name: "",
    head: "",
    email: "",
    password: "",
    phone: "",
    colleges: [],
    universityId: universityId,
  });
  const [editForm, setEditForm] = useState({
    name: "",
    head: "",
    email: "",
    password: "",
    phone: "",
    colleges: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPlacements, setLoadingPlacements] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlacementId, setCurrentPlacementId] = useState(null);
  const [userID, setUserID] = useState(null);
  const token = localStorage.getItem("University authToken");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;


// ✅ Use useEffect to fetch user ID once on component mount
useEffect(() => {
    let userData = localStorage.getItem("user");
    console.log("userData:", userData);

    if (userData) {
      let userObject = JSON.parse(userData);
      console.log("userObject:", userObject);
      setUserID(userObject.id);  // ✅ Updates state correctly
       console.log(userObject.id)
      console.log("userid:", userID);
    } else {
      console.log("No user data found in localStorage.");
    }
  }, []); // ✅ Empty dependency array ensures this runs only once


// ✅ Fetch all placements when userID changes
useEffect(() => {
    if (!userID) return;

    const fetchAllPlacements = async () => {
      setLoadingPlacements(true);
      try {
        console.log("link:",`${BASE_URL}/placement/getplacements/${userID}?universityName=${encodeURIComponent(universityName)}`)
        const response = await axios.get(
          `${BASE_URL}/placement/getplacements/${userID}?universityName=${encodeURIComponent(universityName)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }

        );

        if (response.data?.data) {
          setPlacements(response.data.data);
          console.log("placements:", response.data.data);
        } else {
          setPlacements([]);
        }
      } catch (err) {
        console.error("Failed to fetch placements:", err);
        setError("Failed to fetch placement cells.");
      } finally {
        setLoadingPlacements(false);
      }
    };

    fetchAllPlacements();
  }, [userID, universityName]); // ✅ Runs only when userID is set


  // Open the edit form in a popup
  const openEditPopup = (placement) => {
    setEditForm({
      name: placement.name,
      head: placement.head,
      email: placement.email,
      password: "",
      phone: placement.phone,
      colleges: placement.colleges.map((college) => college._id),
    });
    setIsEditing(true);
    setCurrentPlacementId(placement._id);
  };

  // Handle changes in the create form
  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm({ ...createForm, [name]: value });
  };

  // Handle changes in the edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  // Handle form submission for creating placement cells
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/placement/addplacement?universityName=${encodeURIComponent(universityName)}`,
        createForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Placement cell created successfully!");
      setError("");

      // Refresh placement list
      setPlacements((prev) => [...prev, response.data]);
      setCreateForm({
        name: "",
        head: "",
        email: "",
        password: "",
        phone: "",
        colleges: [],
        universityId: universityId,
      });
    } catch (err) {
      console.error("Error creating placement cell:", err);
      setError(err.response?.data?.message || "Failed to create placement cell.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for editing placement cells
 // Handle form submission for editing placement cells
const handleEditSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    // Update placement cell
    await axios.put(
      `${BASE_URL}/placement/updateplacements/${currentPlacementId}?universityName=${encodeURIComponent(universityName)}`,
      editForm,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Fetch the updated list of placements
    await fetchAllPlacements();

    setSuccess("Placement cell updated successfully!");
    setError("");

    // Close the edit popup
    setIsEditing(false);
    setCurrentPlacementId(null);
  } catch (err) {
    console.error("Error updating placement cell:", err);
    setError(err.response?.data?.message || "Failed to update placement cell.");
  } finally {
    setLoading(false);
  }
};



  // Handle deletion of placement cells
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this placement cell?")) {
      try {
        await axios.delete(`${BASE_URL}/placement/deleteplacements/${id}?universityName=${encodeURIComponent(universityName)}`);
        setSuccess("Placement cell deleted successfully!");

        // Remove placement from state
        setPlacements((prev) => prev.filter((placement) => placement._id !== id));
      } catch (err) {
        console.error("Error deleting placement cell:", err);
        setError("Failed to delete placement cell.");
      }
    }
  };

  return (
    <div className="p-6 mx-auto">
      {/* Placement cell list */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Placement Cells</h3>
        {loadingPlacements ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {placements.map((placement) => (
              <li key={placement._id} className="flex justify-between items-center border-b py-2">
                <div>
                  <strong>Name: {placement.name}</strong>
                  <p>Placement Head: {placement.head}</p>
                  <p>Email: {placement.email}</p>
                  <p>Phone: {placement.phone}</p>
                  <p>Colleges: {placement.colleges.map((college) => college.name).join(", ")}</p> 
                </div>
                <div>
                  <button
                    className="text-blue-600 hover:underline mr-4"
                    onClick={() => openEditPopup(placement)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(placement._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Placement Cell Popup */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Placement Cell</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Placement Cell Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="p-2 border rounded-md w-full"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Contact Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="p-2 border rounded-md w-full"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={editForm.password}
                  onChange={handleEditChange}
                  className="p-2 border rounded-md w-full"
                  placeholder="Enter new password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Placement Cell"}
              </button>
            </form>
            <button
              className="mt-4 w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
