import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  User,
  Building,
  Mail,
  Phone,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Users,
  MapPin,
  Shield,
  Eye,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewPlacement, setViewPlacement] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const token = localStorage.getItem("University authToken");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const userObject = JSON.parse(userData);
      setUserID(userObject.id);
    }
  }, []);

  useEffect(() => {
    if (!userID) return;

    const fetchAllPlacements = async () => {
      setLoadingPlacements(true);
      try {
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
  }, [userID, universityName]);

  const openEditPopup = (placement) => {
    setEditForm({
      name: placement.name,
      head: placement.head,
      email: placement.email,
      password: "",
      phone: placement.phone,
      colleges: placement.colleges || [],
    });
    setCurrentPlacementId(placement._id);
    setIsEditing(true);
  };

  const handleEditSubmit = async () => {
    if (!currentPlacementId) return;

    setLoading(true);
    try {
      await axios.put(
        `${BASE_URL}/placement/updateplacement/${currentPlacementId}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Placement updated successfully.");
      setIsEditing(false);
      setEditForm({});
      // Refresh list
      const updatedList = placements.map((p) =>
        p._id === currentPlacementId ? { ...p, ...editForm } : p
      );
      setPlacements(updatedList);
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update placement.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this placement cell?")) return;

    try {
      await axios.delete(`${BASE_URL}/placement/deleteplacement/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlacements((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete placement cell.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Placement Cells</h2>

      {loadingPlacements ? (
        <p>Loading placements...</p>
      ) : placements.length > 0 ? (
        <ul className="space-y-4">
          {placements.map((placement) => (
            <li key={placement._id} className="p-4 border rounded shadow">
              <h3 className="text-lg font-bold">{placement.name}</h3>
              <p><Users size={16} /> Head: {placement.head}</p>
              <p><Mail size={16} /> Email: {placement.email}</p>
              <p><Phone size={16} /> Phone: {placement.phone}</p>
              <div className="mt-2 flex gap-4">
                <button onClick={() => openEditPopup(placement)} className="text-blue-600 hover:underline">
                  <Edit size={16} /> Edit
                </button>
                <button onClick={() => handleDelete(placement._id)} className="text-red-600 hover:underline">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No placement cells found.</p>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Edit Placement</h3>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="border w-full mb-2 p-2"
              placeholder="Name"
            />
            <input
              type="text"
              value={editForm.head}
              onChange={(e) => setEditForm({ ...editForm, head: e.target.value })}
              className="border w-full mb-2 p-2"
              placeholder="Head"
            />
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="border w-full mb-2 p-2"
              placeholder="Email"
            />
            <input
              type="text"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              className="border w-full mb-2 p-2"
              placeholder="Phone"
            />
            <div className="flex gap-4 mt-4">
              <button onClick={handleEditSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
                <Save size={16} /> Save
              </button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;