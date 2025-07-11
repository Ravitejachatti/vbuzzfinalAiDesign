import React from 'react';
import { FaBookOpen, FaLaptopCode, FaCertificate } from 'react-icons/fa';

const CurriculumTraining = () => {
  return (
    <section className="py-16 bg-gray-50" id="curriculum-training">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Customized Curriculum and Training Modules</h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/3 px-4">
            <FaBookOpen className="text-blue-600 text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Industry-Aligned Curriculum</h3>
            <p className="text-gray-600">
              Work with university faculties to align the curriculum with industry requirements,
              ensuring students are job-ready upon graduation.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/3 px-4">
            <FaLaptopCode className="text-blue-600 text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">On-Demand Training Modules</h3>
            <p className="text-gray-600">
              Offer online training modules on topics like coding, data science, digital marketing,
              and other in-demand skills that students can access at any time.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center md:w-1/3 px-4">
            <FaCertificate className="text-blue-600 text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Certification Programs</h3>
            <p className="text-gray-600">
              Provide certifications for students who complete specific courses or training programs,
              adding value to their resumes and digital profiles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurriculumTraining;
