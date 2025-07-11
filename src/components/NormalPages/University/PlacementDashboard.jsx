import React from 'react';
import { FaTachometerAlt } from 'react-icons/fa';

const PlacementDashboard = () => {
  return (
    <section className="py-16" id="placement-dashboard">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Placement Dashboard for University Admins</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <FaTachometerAlt className="text-blue-600 text-5xl mr-4" />
            <h3 className="text-2xl font-semibold">Real-Time Insights</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Give university administrators access to a real-time dashboard showing placement
            statistics, recruiter engagement, and student performance.
          </p>
          {/* Dashboard Metrics (Placeholder) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h4 className="text-3xl font-bold text-blue-600">85%</h4>
              <p className="text-gray-600">Placement Rate</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h4 className="text-3xl font-bold text-blue-600">120</h4>
              <p className="text-gray-600">Active Recruiters</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h4 className="text-3xl font-bold text-blue-600">95%</h4>
              <p className="text-gray-600">Employer Satisfaction</p>
            </div>
          </div>
          {/* Action Button */}
          <div className="text-center mt-8">
            <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
              View Detailed Reports
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlacementDashboard;
