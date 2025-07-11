import React from 'react';
import { FaLaptop, FaMicrophone, FaTrophy } from 'react-icons/fa';

const CareerFairs = () => {
  return (
    <section className="py-16 bg-gray-50" id="career-fairs">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Career Fairs and Industry Events</h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/3 px-4">
            <FaLaptop className="text-blue-600 text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Virtual and In-Person Fairs</h3>
            <p className="text-gray-600">
              Organize both virtual and physical career fairs where students can interact with
              employers, attend seminars, and apply for jobs in real-time.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/3 px-4">
            <FaMicrophone className="text-blue-600 text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Exclusive Webinars and Panels</h3>
            <p className="text-gray-600">
              Host webinars featuring industry experts, recruiters, and alumni to discuss career
              paths, industry trends, and skills needed in the job market.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center md:w-1/3 px-4">
            <FaTrophy className="text-blue-600 text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Hackathons and Competitions</h3>
            <p className="text-gray-600">
              Collaborate with corporates to host hackathons and competitions that allow students to
              demonstrate their skills and creativity, with potential job or internship offers as
              rewards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerFairs;
