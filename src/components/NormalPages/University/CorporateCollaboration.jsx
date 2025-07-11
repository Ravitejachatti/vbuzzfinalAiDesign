import React from 'react';
import { FaBuilding, FaBriefcase, FaBullhorn } from 'react-icons/fa';

const CorporateCollaboration = () => {
  return (
    <section className="py-16 bg-gray-50" id="corporate-collaboration">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Collaboration with Corporates</h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/3 px-4">
            <FaBuilding className="text-blue-600 text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Corporate Partnerships</h3>
            <p className="text-gray-600">
              Build and nurture partnerships with top companies to improve placement rates and secure
              high-quality job offers for students.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/3 px-4">
            <FaBriefcase className="text-blue-600 text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Customized Internship Programs</h3>
            <p className="text-gray-600">
              Facilitate internships with corporate partners, allowing students to gain hands-on
              experience and practical skills while studying.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center md:w-1/3 px-4">
            <FaBullhorn className="text-blue-600 text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Corporate Sponsorships</h3>
            <p className="text-gray-600">
              Partner with companies to sponsor job fairs, hackathons, and other campus events that
              can attract recruiters and provide students with networking opportunities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporateCollaboration;
