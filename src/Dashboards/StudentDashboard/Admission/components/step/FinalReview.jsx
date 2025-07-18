// src/modules/admission/components/steps/FinalReview.jsx

import React from 'react';
// import { submitApplication } from '../../services/admission.api';

const FinalReview = ({ draftId, onFinish }) => {
  const handleSubmit = async () => {
    try {
      await submitApplication(draftId);
      alert("Application submitted successfully!");
      onFinish();
    } catch (err) {
      console.error("Failed to submit application", err);
      alert("Failed to submit. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Final Review</h2>
      <p className="text-gray-600">
        Please ensure all the information and uploaded documents are correct. You will not be able to edit the application after submission.
      </p>

      <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
        <p className="font-medium">Draft ID:</p>
        <p className="text-sm text-gray-700">{draftId}</p>
      </div>

      <div className="flex justify-between">
        <button
          className="btn btn-outline"
          onClick={() => alert("Use the back button to edit your steps before submission.")}
        >
          Go Back to Edit
        </button>
        <button
          className="btn btn-success"
          onClick={handleSubmit}
        >
          Submit Application
        </button>
      </div>
    </div>
  );
};

export default FinalReview;
