import React, { useState } from 'react';
import StudentLogin from '../../Logins/StudentLogin/StudentLogin';
import UniversityLogin from '../../Logins/UniversityOnboarding&Login/UniversityLogin';

function Login() {
    const [userType, setUserType] = useState(''); // No default selection

    return (
        <div className=" min-h-screen bg-gray-100">
            <div className=" p-1 ">
                {!userType ? (
                    <div className="flex items-center justify-center">
                        <div className='mt-20'>
                        <label htmlFor="user-type-select" className="block text-lg font-medium text-gray-700 mb-4">
                            Select User Type
                        </label>
                        <select
                            id="user-type-select"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">-- Select --</option>
                            <option value="student">Student</option>
                            <option value="admin">University Admin</option>
                        </select>
                        </div>
                    </div>
                ) : (
                    <>
                        {userType === 'student' ? (
                            <StudentLogin />
                        ) : (
                            <UniversityLogin />
                        )}
                    </>
                )}

                {/* Optional Footer or Additional Content */}
                {!userType && (
                    <div className="mt-4 text-center text-gray-600">
                        <p>Please select a user type to continue.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;
