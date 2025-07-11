import React, { useState, useEffect } from 'react';

const FindJobPage = () => {
  const [loadingMessage, setLoadingMessage] = useState("We are bringing jobs very fast, keep in touch!");

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingMessage((prevMessage) => {
        if (prevMessage.endsWith("...")) {
          return "We are bringing jobs very fast, keep in touch!";
        }
        return prevMessage + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Find Your Dream Job
      </h1>

      <div className="w-32 h-32 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-8"></div>

      <div className="mt-8 text-center">
        <h2 className="text-xl font-medium text-gray-600 animate-pulse">{loadingMessage}</h2>
      </div>

      <div className="mt-12 flex space-x-4">
        <div className="w-16 h-16 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-16 h-16 bg-green-500 rounded-full animate-bounce delay-200"></div>
        <div className="w-16 h-16 bg-red-500 rounded-full animate-bounce delay-400"></div>
      </div>

      <div className="mt-12 text-center">
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          onClick={() => alert("Stay tuned! More job updates coming soon!")}
        >
          Notify Me
        </button>
      </div>
    </div>
  );
};

export default FindJobPage;
