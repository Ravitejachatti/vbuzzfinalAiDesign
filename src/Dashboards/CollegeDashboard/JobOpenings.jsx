import React from 'react';

function JobOpenings() {
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Job Openings</h1>
            
            {/* New Job Openings Section */}
            <div className="bg-white p-4 rounded shadow-md mb-4">
                <h3 className="text-xl font-semibold mb-2">New Job Openings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded shadow-sm">
                        <h4 className="text-lg font-semibold">Software Engineer</h4>
                        <p className="text-gray-600">Company: ABC Corp</p>
                        <p className="text-gray-600">Location: Remote</p>
                        <p className="text-gray-600">Salary: $80,000 - $100,000</p>
                        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                            Apply Now
                        </button>
                    </div>
                    <div className="p-4 border rounded shadow-sm">
                        <h4 className="text-lg font-semibold">Data Analyst</h4>
                        <p className="text-gray-600">Company: XYZ Inc</p>
                        <p className="text-gray-600">Location: On-site</p>
                        <p className="text-gray-600">Salary: $70,000 - $90,000</p>
                        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                            Apply Now
                        </button>
                    </div>
                    <div className="p-4 border rounded shadow-sm">
                        <h4 className="text-lg font-semibold">Product Manager</h4>
                        <p className="text-gray-600">Company: Tech Solutions</p>
                        <p className="text-gray-600">Location: Hybrid</p>
                        <p className="text-gray-600">Salary: $90,000 - $120,000</p>
                        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Job Openings Archive Section */}
            <div className="bg-white p-4 rounded shadow-md">
                <h3 className="text-xl font-semibold mb-2">Job Openings Archive</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded shadow-sm">
                        <h4 className="text-lg font-semibold">Web Developer</h4>
                        <p className="text-gray-600">Company: Web Solutions</p>
                        <p className="text-gray-600">Location: Remote</p>
                        <p className="text-gray-600">Salary: $60,000 - $80,000</p>
                    </div>
                    <div className="p-4 border rounded shadow-sm">
                        <h4 className="text-lg font-semibold">UX Designer</h4>
                        <p className="text-gray-600">Company: Design Studio</p>
                        <p className="text-gray-600">Location: On-site</p>
                        <p className="text-gray-600">Salary: $70,000 - $90,000</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobOpenings;