import React from 'react';
import { FaChalkboardTeacher, FaTools, FaHandshake } from 'react-icons/fa';

const WorkshopsTraining = () => {
  return (
    <section className="py-16" id="workshops-training">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Workshops and Training Sessions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaChalkboardTeacher className="text-blue-600 text-5xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Skill Development Programs</h3>
            <p className="text-gray-600">
              Organize workshops on resume building, interview techniques, and career exploration
              tailored to various industries.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaTools className="text-blue-600 text-5xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Pre-Placement Training</h3>
            <p className="text-gray-600">
              Offer training sessions in collaboration with corporate partners to help students
              prepare for specific job roles and industry demands.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaHandshake className="text-blue-600 text-5xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Mentorship and Guidance</h3>
            <p className="text-gray-600">
              Connect students with mentors from the industry, allowing them to gain insights into
              their desired career paths and understand current trends.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkshopsTraining;
