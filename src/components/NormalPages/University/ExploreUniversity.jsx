import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExploreUniversities = () => {
  const navigate = useNavigate();

  // Navigation function for each category
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <section className="py-16 bg-gray-100 text-gray-800">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          Explore Universities With Us
        </h2>
        
        {/* Description */}
        <p className="text-center max-w-xl mx-auto text-gray-600 mb-10">
          Discover top universities worldwide! Choose to explore Indian or foreign universities to start your journey.
        </p>

        {/* University Options */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {/* Indian Universities */}
          <div
            onClick={() => handleNavigation('/indian-university')}
            className="cursor-pointer w-72 h-60 bg-white shadow-lg hover:shadow-2xl rounded-lg overflow-hidden transform hover:scale-105 transition duration-300"
          >
            <div className="h-full w-full flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 to-blue-600 text-white">
              <h3 className="text-2xl font-semibold">Indian Universities</h3>
              <p className="mt-2 text-center text-sm">
                Discover prestigious universities across India. Find your dream university close to home!
              </p>
            </div>
          </div>

          {/* Foreign Universities */}
          <div
            onClick={() => handleNavigation('/foreign-university')}
            className="cursor-pointer w-72 h-60 bg-white shadow-lg hover:shadow-2xl rounded-lg overflow-hidden transform hover:scale-105 transition duration-300"
          >
            <div className="h-full w-full flex flex-col justify-center items-center bg-gradient-to-r from-green-400 to-green-600 text-white">
              <h3 className="text-2xl font-semibold">Foreign Universities</h3>
              <p className="mt-2 text-center text-sm">
                Explore top universities worldwide for an international education experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreUniversities;
