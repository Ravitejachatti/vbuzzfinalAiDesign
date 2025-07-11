import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  const toggleSlider = () => setIsSliderOpen(!isSliderOpen);

  const closeSlider = () => setIsSliderOpen(false);

  return (
    <header className="bg-blue-400 text-white p-1 z-50 relative overflow-hidden">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side: Contact */}
        <p className="text-lg font-semibold"><Link to="/contact">Whatsapp:+91 6304662487</Link></p>

        {/* Hamburger Icon for Mobile/Tablet */}
        <button
          className="block md:hidden text-white focus:outline-none"
          onClick={toggleSlider}
          aria-label="Toggle navigation slider"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                isSliderOpen
                  ? 'M6 18L18 6M6 6l12 12' // X icon when menu is open
                  : 'M4 6h16M4 12h16m-7 6h7' // Hamburger icon when menu is closed
              }
            />
          </svg>
        </button>

        {/* Navigation Links (Visible for larger screens) */}
        <ul className="hidden md:flex space-x-6">
          <li className="hover:text-gray-300 transition-colors duration-200">
            <Link to="/find-job">Find Job</Link>
          </li>
          <li className="hover:text-gray-300 transition-colors duration-200">
            <Link to="/page/universities">Universities</Link>
          </li>
          <li className="hover:text-gray-300 transition-colors duration-200">
            <Link to="/page/companies">Companies</Link>
          </li>
          <li className="hover:text-gray-300 transition-colors duration-200">
            <Link to="/university-onboarding">Institute Boarding</Link>
          </li>
        </ul>
      </div>

      {/* Slider for Mobile/Tablet */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-blue-600 shadow-lg transition-transform duration-300 z-50 ${
          isSliderOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white focus:outline-none md:hidden"
          onClick={closeSlider}
          aria-label="Close navigation slider"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation Links */}
        <ul className="flex flex-col space-y-6 p-6">
          <li className="hover:text-gray-300 transition-colors duration-200">
            <Link to="/find-job" onClick={closeSlider}>
              Find Job
            </Link>
          </li>
          <li className="hover:text-gray-300 transition-colors duration-200">
            <Link to="/page/universities" onClick={closeSlider}>
              Universities
            </Link>
          </li>
          <li className="hover:text-gray-300 transition-colors duration-200">
            <Link to="/page/companies" onClick={closeSlider}>
              Companies
            </Link>
          </li>
          <li className="hover:text-gray-300 transition-colors duration-200">
            <Link to="/university-onboarding" onClick={closeSlider}>
              Institute Boarding
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
