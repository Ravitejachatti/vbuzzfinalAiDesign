// src/components/ToggleEligibility.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toggleEligibility } from "../../../Redux/Placement/placementReportsSlice";
import { useParams } from "react-router-dom";

const ToggleEligibility = ({ selectedStudents, graduationYear }) => {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const token = localStorage.getItem("University authToken");
  const { toggling, toggleMessage } = useSelector(state => state.placementReports);

  const handleConfirm = (canApply) => {
    if (selectedStudents.length === 0) {
      confirmAlert({
        title: "No students selected",
        message: "Please select at least one student.",
        buttons: [{ label: "OK" }],
      });
      return;
    }
    confirmAlert({
      title: "Confirm",
      message: `Mark ${selectedStudents.length} as ${canApply ? "eligible" : "ineligible"}?`,
      buttons: [
        {
          label: "Yes",
          onClick: () =>
            dispatch(
              toggleEligibility({
                studentIds: selectedStudents.map(s => s._id),
                canApply,
                token,
                universityName,
                graduationYear,
              })
            ),
        },
        { label: "No" },
      ],
    });
  };

  return (
    <div className="mb-4 p-3 bg-gray-50 rounded border">
      <h3 className="text-right text-sm font-medium">
        {selectedStudents.length} selected
      </h3>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => handleConfirm(true)}
          disabled={toggling}
          className={`px-2 py-1 rounded text-white ${
            toggling ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {toggling ? "..." : "Mark Eligible"}
        </button>
        <button
          onClick={() => handleConfirm(false)}
          disabled={toggling}
          className={`px-2 py-1 rounded text-white ${
            toggling ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {toggling ? "..." : "Mark Ineligible"}
        </button>
      </div>
      {toggleMessage && (
        <p className="mt-2 text-center text-sm text-purple-700">{toggleMessage}</p>
      )}
    </div>
  );
};

export default ToggleEligibility;
