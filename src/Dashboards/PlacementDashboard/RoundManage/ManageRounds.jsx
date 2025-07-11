// File 2: ManageRounds.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageRounds = ({ jobId, universityName, BASE_URL }) => {
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [editData, setEditData] = useState(null);

  const fetchRounds = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/job/jobs/${jobId}/getAllRounds?universityName=${universityName}`
      );
      setRounds(res.data.data);
    } catch (error) {
      console.error("Error fetching rounds:", error);
      alert("Error fetching rounds. Please try again.");
    }
  };

  useEffect(() => {
    fetchRounds();
  }, []);

  const handleViewRound = (index) => {
    setSelectedRound(rounds[index]);
  };

  const handleEditRound = (index) => {
    setEditData(rounds[index]);
  };

  const handleDeleteRound = async (index) => {
    try {
      await axios.delete(
        `${BASE_URL}/job/jobs/${jobId}/deleteRounds/${index}?universityName=${universityName}`
      );
      alert("Round deleted successfully.");
      fetchRounds();
    } catch (error) {
      console.error("Error deleting round:", error);
      alert("Failed to delete round. Please try again.");
    }
  };

  const handleUpdateRound = async () => {
    try {
      await axios.put(
        `${BASE_URL}/job/jobs/${jobId}/updateRounds/${editData.index}?universityName=${universityName}`,
        editData
      );
      alert("Round updated successfully.");
      setEditData(null);
      fetchRounds();
    } catch (error) {
      console.error("Error updating round:", error);
      alert("Failed to update round. Please try again.");
    }
  };

  return (
    <div>
      <h2>Manage Rounds</h2>
      <ul>
        {rounds.map((round, index) => (
          <li key={index}>
            {round.name}
            <button className="mr-1" onClick={() => handleViewRound(index)}>View</button>
            <button onClick={() => handleEditRound(index)}>Edit</button>
            <button onClick={() => handleDeleteRound(index)}>Delete</button>
          </li>
        ))}
      </ul>

      {selectedRound && (
        <div>
          <h3>Round Details</h3>
          <p>Name: {selectedRound.name}</p>
          <p>Description: {selectedRound.description}</p>
        </div>
      )}

      {editData && (
        <div>
          <h3>Edit Round</h3>
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          />
          <button onClick={handleUpdateRound}>Save</button>
        </div>
      )}
    </div>
  );
};

export default ManageRounds;