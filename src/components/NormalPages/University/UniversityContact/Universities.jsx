import React, { useState, useEffect } from "react";

function UniversityPlacementPage() {
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("Universities");

    useEffect(() => {
        const messages = ["Universities", "Autonomous Colleges", "Institutes"];
        let index = 0;
        const interval = setInterval(() => {
            setMessage(messages[index]);
            index = (index + 1) % messages.length;
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
            {/* Header Section */}
            <header className="w-full py-12 text-center bg-gradient-to-r from-white to-purple-500 text-gray-500">
                <h1 className="text-5xl font-extrabold">Welcome to University Placement Platform</h1>
                <p className="mt-4 text-lg">Connecting education with employment, effortlessly.</p>
            </header>

            {/* Animated Section */}
            <section className="bg-gray-100 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        Are You... <br /> {message}?
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Let us help your students achieve their <span className="text-red-400 font-bold">Dream Careers.</span>  Contact us today to start building their futures.
                    </p>
                    <button
                        onClick={() => setShowPopup(true)}
                        className="px-10 py-4 bg-blue-600 text-white text-lg font-medium rounded-md shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105">
                        Connect Now
                    </button>
                </div>
            </section>

            {/* Intro Section */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <h2 className="text-4xl font-semibold text-gray-800 text-center">Who We Work With</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
                    <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Universities</h3>
                        <p className="text-gray-600">Partnering with top universities to provide students with access to global opportunities.</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Autonomous Colleges</h3>
                        <p className="text-gray-600">Collaborating with leading colleges to ensure students are placed in top organizations.</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Institutes</h3>
                        <p className="text-gray-600">Helping institutes bridge the gap between education and employment through strategic partnerships.</p>
                    </div>
                </div>
            </section>

            {/* Popup Section */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Thank You!</h2>
                        <p className="text-gray-600 mb-4">Our team will get in touch with you shortly.</p>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Footer Section */}
            <footer className="mt-12 bg-gray-800 text-white py-6 w-full text-center">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} University Placement Platform. All rights reserved.
                </p>
            </footer>
        </div>
    );
}

export default UniversityPlacementPage;
