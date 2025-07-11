import React from 'react';
import { Link } from 'react-router-dom';

function IndianUniversity() {
  const universities = [
    'Andhra University',
    'Anna University',
    'Gitam University'
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Explore Indian Universities - Collaborate with Us</h1>
      
      {/* List of universities, the name will be coming from the backend */}
      <ul className="space-y-2">
        {universities.map((university) => (
          <li key={university} className="text-blue-600 hover:underline">
            <Link to={`/universities/${encodeURIComponent(university)}`}>
              {university}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IndianUniversity;
