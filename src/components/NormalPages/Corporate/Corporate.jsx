import React, { useState, useEffect } from "react";

const CorporatePage = () => {
  const [message, setMessage] = useState("Startups");

  useEffect(() => {
    const messages = ["Startups", "Universities", "Experienced Professionals"];
    let index = 0;
    const interval = setInterval(() => {
      setMessage(messages[index]);
      index = (index + 1) % messages.length;
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header Section */}
      <header className=" w-full py-12 text-black text-center">
        <h1 className="text-5xl font-extrabold tracking-wide">Welcome to Our Hiring Platform</h1>
        <p className="mt-4 text-xl font-light">Connecting you with the best talent, seamlessly.</p>
      </header>


      {/* Animated Message Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Are You... <br />{message}</h2>
          <p className="text-lg text-gray-600 mb-8">
            Let us help you find the perfect candidates. Contact us today to begin your hiring process.
          </p>
          <button
            onClick={() => alert("Thank you for contacting us! We will get back to you soon.")}
            className="px-10 py-4 bg-gray-800 text-white text-lg font-medium rounded-md shadow-md hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 transition-transform transform hover:scale-105"
          >
            Contact Us Now
          </button>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-semibold text-gray-800 text-center">Who We Work With</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Universities</h3>
            <p className="text-gray-600">Partnering with top universities to connect companies with fresh talent.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Companies</h3>
            <p className="text-gray-600">Helping organizations hire both freshers and experienced professionals effortlessly.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Experienced Professionals</h3>
            <p className="text-gray-600">Connecting companies with highly skilled and seasoned candidates.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CorporatePage;
