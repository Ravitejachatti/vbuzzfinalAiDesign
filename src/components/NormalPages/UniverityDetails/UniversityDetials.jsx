import React from 'react';

function UniversityDetails({ universityName }) {
  // Static content based on universityName
  const getUniversityContent = () => {
    switch (universityName) {
      case 'Andhra University':
        return (
          <>
            <p className="text-gray-700 mt-2">
              Andhra University, located in Visakhapatnam, is one of India's oldest educational institutions. It offers a wide range of undergraduate, postgraduate, and doctoral programs in fields like Science, Arts, Engineering, and Law.
            </p>
            <p className="mt-4">Contact: +91 12345 67890 | Email: info@andhrauniversity.edu.in</p>
          </>
        );
      case 'Anna University':
        return (
          <>
            <p className="text-gray-700 mt-2">
              Anna University, based in Chennai, is known for its engineering and technology programs. It also offers courses in science, humanities, and management.
            </p>
            <p className="mt-4">Contact: +91 12345 67891 | Email: info@annauniv.edu</p>
          </>
        );
      case 'Gitam University':
        return (
          <>
            <p className="text-gray-700 mt-2">
              Gitam University has campuses across India and offers a variety of programs including engineering, business, law, and medical sciences.
            </p>
            <p className="mt-4">Contact: +91 12345 67892 | Email: info@gitam.edu</p>
          </>
        );
      default:
        return <p className="text-gray-700">University information is not available.</p>;
    }
  };

  return (
    <div className="p-6 bg-white max-w-3xl mx-auto rounded shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">{universityName}</h1>
      {getUniversityContent()}
    </div>
  );
}

export default UniversityDetails;
