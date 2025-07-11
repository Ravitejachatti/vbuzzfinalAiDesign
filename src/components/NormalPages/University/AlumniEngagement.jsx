import React from 'react';
import { FaUsers, FaBriefcase, FaStar } from 'react-icons/fa';

const AlumniEngagement = () => {
  return (
    <section className="py-16" id="alumni-engagement">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Alumni Engagement and Networking</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaUsers className="text-blue-600 text-5xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Alumni Portal</h3>
            <p className="text-gray-600">
              Create an alumni portal where graduates can connect with current students, share career
              advice, and provide networking opportunities.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaBriefcase className="text-blue-600 text-5xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Job Opportunities for Alumni</h3>
            <p className="text-gray-600">
              Facilitate job postings specifically for alumni, giving them a platform to explore new
              career opportunities.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaStar className="text-blue-600 text-5xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Alumni Success Stories</h3>
            <p className="text-gray-600">
              Showcase alumni success stories to inspire current students and demonstrate the value
              of the university’s programs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlumniEngagement;
