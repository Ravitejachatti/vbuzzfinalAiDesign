import React from 'react';
import { FaCalendarAlt, FaUserGraduate, FaChartLine } from 'react-icons/fa';

const CampusRecruitment = () => {
  return (
    <section className="py-16 bg-gray-50" id="campus-recruitment">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Campus Recruitment Management</h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/3 px-4">
            <FaCalendarAlt className="text-blue-600 text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Efficient Drive Coordination</h3>
            <p className="text-gray-600">
              Streamline the organization of campus recruitment drives by scheduling, coordinating
              with recruiters, and managing student registrations.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/3 px-4">
            <FaUserGraduate className="text-blue-600 text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Digital Profiles and Resumes</h3>
            <p className="text-gray-600">
              Enable students to create digital profiles with their resumes, portfolios, and skill
              assessments for easy access by recruiters.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center md:w-1/3 px-4">
            <FaChartLine className="text-blue-600 text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Data-Driven Matching</h3>
            <p className="text-gray-600">
              Use data analytics to match students with job opportunities that align with their
              skills, academic background, and career interests.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampusRecruitment;
