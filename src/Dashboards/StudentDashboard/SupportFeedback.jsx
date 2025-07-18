import React from 'react';

const SupportFeedback = () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Support and Feedback</h2>
      <p className="text-gray-600 mb-3">Need help or have feedback? Reach out to the placement office:</p>
      <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 mb-3">
        Contact Placement Office
      </button>
      <p className="text-gray-600 mb-2">Feedback on the application process:</p>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows="4"
        placeholder="Share your feedback..."
      ></textarea>
      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-3">
        Submit Feedback
      </button>
    </div>
  );
};

export default SupportFeedback;
