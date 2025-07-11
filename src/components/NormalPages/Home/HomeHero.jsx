// VBuzzHomepage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../../Resuable/Button";
// Removed incorrect imports
// import { Icon } from 'lucide-react'; // Incorrect import
// import { FontAwesomeIcon } from 'react-icons'; // Incorrect import

const Counter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const end = parseInt(target.replace(/[^0-9]/g, ""), 10); // Extract numeric value
    if (count === end) return;

    const step = Math.ceil(end / (duration / 20)); // Calculate step size
    const timer = setInterval(() => {
      setCount((prev) => {
        const nextCount = prev + step;
        return nextCount >= end ? end : nextCount;
      });
    }, 20);

    setTimeout(() => clearInterval(timer), duration);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString()}+</span>;
};


import {
  FaBuilding,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaArrowCircleRight,
  FaCheckCircle,
  FaSignInAlt,
} from "react-icons/fa"; // Correct icon imports

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const VBuzzHomepage = () => {
  const [activeSection, setActiveSection] = useState("home");
  const duration = 2500;

  return (
    <div className="bg-gradient-to-b from-gray-100 to-blue-100 min-h-screen text-gray-800">
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/Hero_section/hero.webp')" }}
      >
        <div className="bg-black bg-opacity-50 p-8 rounded-lg">
          <h1 className="text-5xl font-bold text-white mb-4 animate-fadeIn">
            Welcome to V-Buzz
          </h1>
          <p className="text-xl text-white mb-6 animate-fadeIn">
            Connecting Talent with Opportunities Seamlessly
          </p>
          <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
            Get Started
          </button>
        </div>
      </section>

      <main className="py-16 max-w-7xl mx-auto">
        <div className="text-center animate-slideIn">
          <h2 className="text-4xl font-bold mb-8">Discover Our Mission</h2>
          <div
            className="relative h-[60vh] flex items-center justify-center text-center bg-cover bg-center rounded-xl"
            style={{ backgroundImage: "url('/Hero_section/mission.jpeg')" }}
          >
            {/* Overlay to darken the background image for better text visibility */}
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl"></div>
            <div className="relative z-10 flex flex-col items-center">
              <p className="text-2xl text-white mb-4 font-semibold w-[60%] ">
                At V-Buzz, we bridge the gap between Academia and the Corporate
                world with tailored solutions for recruitment and training.
              </p>

              <Link to="/about">
                <button className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
                  Learn More
                </button>
              </Link>
            </div>

          </div>
          {/* Additional Home Section */}
          <div className="mt-20 py-6 space-y-8 bg-white">
            <div className="px-5 bg-white animate-fadeIn">
              <h3 className="text-3xl font-bold mb-5">Our Approach</h3>
              <p className="text-gray-500 text-{16px}">
                We leverage technology and data-driven insights to match the
                right candidates with the right opportunities.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center animate-fadeIn mx-5 pb-8">
              <div className="p-6 bg-white rounded-2xl shadow-md">
                <div className="flex items-center space-x-2">
                  <FaUserGraduate size={48} className="text-blue-500" />
                  <h3 className="text-2xl font-semibold mb-1">Campus Recruitment</h3>
                </div>
                <p className="text-gray-600">
                  Efficiently organize and manage recruitment drives on campus.
                </p>
                <div className="mt-5">
                  <Button
                    to="/contact"
                    bgColor="bg-blue-500"
                    leftIcon={<FaSignInAlt />}
                  >
                    Consult
                  </Button>
                </div>


              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md">

                <div className="flex items-center space-x-2 py-4">
                  <FaBuilding size={48} className="text-blue-500" />
                <h3 className="text-2xl font-semibold mb-1">
                  Talent Acquisition
                </h3>
                </div>
               
                <p className="text-gray-600">
                  Find top talent from a diverse pool of candidates.
                </p>
                <div className="mt-5">
                  <Button
                    to="/contact"
                    bgColor="bg-blue-500"
                    leftIcon={<FaSignInAlt />}
                  >
                    Consult
                  </Button>
                </div>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md">

              <div className="flex items-center space-x-2 py-4">
                <FaChalkboardTeacher size={48} className="text-blue-500" />
                <h3 className="text-2xl font-semibold mb-2">
                  Training Modules
                </h3>
              </div>
                <p className="text-gray-600">
                  Upskill your workforce with our tailored training programs.
                </p>
                <div className="mt-5">
                  <Button
                    to="/contact"
                    bgColor="bg-blue-500"
                    leftIcon={<FaSignInAlt />}
                  >
                    Consult
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-16 animate-fadeIn">
      <h2 className="text-5xl font-bold mb-10">Our Impact</h2>
      <div className="flex justify-around flex-wrap gap-6">
        <div className="text-center bg-yellow-100 p-8 rounded-lg shadow-md">
          <h3 className="text-5xl font-bold text-blue-600">
            <Counter target="100000+" duration={duration} />
          </h3>
          <p className="text-gray-600">Placements</p>
        </div>
        <div className="text-center bg-red-100 p-8 rounded-lg shadow-md">
          <h3 className="text-5xl font-bold text-blue-600">
            <Counter target="5000+" duration={duration} />
          </h3>
          <p className="text-gray-600">Corporate Partners</p>
        </div>
        <div className="text-center bg-green-300 p-8 rounded-lg shadow-md">
          <h3 className="text-5xl font-bold text-blue-600">
            <Counter target="300+" duration={duration} />
          </h3>
          <p className="text-gray-600">Institution Partners</p>
        </div>
        <div className="text-center bg-blue-300 p-8 rounded-lg shadow-md">
          <h3 className="text-5xl font-bold text-blue-600">
            <Counter target="3000+" duration={duration} />
          </h3>
          <p className="text-gray-600">Workshops Conducted</p>
        </div>
      </div>
    </div>

        <div className="text-center animate-fadeIn">
          <h2 className="text-4xl font-bold mb-20">What People Say About Us</h2>
          <Carousel
            additionalTransfrom={0}
          
            autoPlay
            autoPlaySpeed={3000}
            centerMode={false}
            className="carousel-container"
            containerClass="container-with-dots"
            draggable
            infinite
            keyBoardControl
            minimumTouchDrag={80}
            responsive={{
              superLargeDesktop: {
                breakpoint: { max: 4000, min: 1024 },
                items: 3,
              },
              desktop: {
                breakpoint: { max: 1024, min: 768 },
                items: 2,
              },
              tablet: {
                breakpoint: { max: 768, min: 464 },
                items: 1,
              },
              mobile: {
                breakpoint: { max: 464, min: 0 },
                items: 1,
              },
            }}
          
            slidesToSlide={1}
            swipeable
          >
            <div className="mx-8 p-6 bg-white rounded-lg shadow-md">
              <FaCheckCircle size={32} className="text-green-500 mb-4" />
              <p className="text-gray-700 mb-4 italic">
                “V-Buzz revolutionized our campus hiring process!”
              </p>
              <h4 className="font-semibold">Jane Smith, University Admin</h4>
            </div>
            <div className=" mx-8 p-4 bg-white rounded-lg shadow-md">
              <FaCheckCircle size={32} className="text-green-500 mb-4" />
              <p className="text-gray-700 mb-4 italic">
                “Our company found the perfect hires through V-Buzz.”
              </p>
              <h4 className="font-semibold">John Doe, HR Manager</h4>
            </div>
            <div className=" mx-8 p-4 bg-white rounded-lg shadow-md">
              <FaCheckCircle size={32} className="text-green-500 mb-4" />
              <p className="text-gray-700 mb-4 italic">
                “Our company found the perfect hires through V-Buzz.”
              </p>
              <h4 className="font-semibold">John Doe, HR Manager</h4>
            </div>
            <div className=" mx-8  p-4 bg-white rounded-lg shadow-md">
              <FaCheckCircle size={32} className="text-green-500 mb-4" />
              <p className="text-gray-700 mb-4 italic">
                “Our company found the perfect hires through V-Buzz.”
              </p>
              <h4 className="font-semibold">John Doe, HR Manager</h4>
            </div>
            {/* Add more testimonials as needed */}
          </Carousel>


        </div>
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 mt-20 mb-14 py-16 rounded ">
          <div className="container mx-auto px-6 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Join us Today
            </h2>
            <p className="text-xl mb-4">
              Either you are a
              </p>
              <ol className="list-decimal list-inside ">
                <li className="inline">University or College looking for your student placement, </li>
                <li className="inline">Corporate for Fresher bulk hiring, or </li>
                <li className="inline">Student looking for jobs or internships.</li>
              </ol>

          <p>
              V-Buzz bridges the gap and connects you to endless opportunities.
            </p>
            <Link to="/register">
              <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 mt-10">
                Get Started
              </button>
            </Link>
          </div>
        </section>
      </main>

    </div>
  );
};

export default VBuzzHomepage;
