import React from "react";
import { Link } from "react-router-dom";


const NotFound = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center text-white"
      style={{
        // backgroundImage: "url('https://github.com/gautamkushwaha/VBuzzFrontend/blob/main/public/404/NotFound.jpeg')",
        backgroundImage: "url('public/404/NotFound.jpeg')"
      }}
    >
      {/* Animated 404 */}
      <h1 className="text-9xl font-extrabold mb-4 animate-bounce drop-shadow-lg">404</h1>
      <p className="text-2xl font-medium mb-6 animate-pulse drop-shadow-lg text-white">
        Oops! The page you're looking for doesn't exist.
      </p>

      {/* Button to Navigate Back */}
      <Link
        to="/"
        className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
