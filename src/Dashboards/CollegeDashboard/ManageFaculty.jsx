import React, { useState } from 'react';

function ManageFaculty({ collegeId, token }) {
  // Initial faculty data
  const initialFaculty = [
    {
      id: 1,
      name: 'Dr. John Smith',
      department: 'Computer Science',
      specialization: 'Artificial Intelligence',
      areaOfInterest: 'Machine Learning',
      research: 'Neural Networks',
      designation: 'Professor',
      experience: '15',
      qualification: 'PhD in Computer Science',
      phone: '9876543210',
      email: 'john.smith@university.edu',
      linkedin: 'https://linkedin.com/johnsmith',
      googleScholar: 'https://scholar.google.com/johnsmith',
      irins: 'https://irins.org/johnsmith'
    },
    {
      id: 2,
      name: 'Dr. Sarah Johnson',
      department: 'Electrical Engineering',
      specialization: 'Power Systems',
      areaOfInterest: 'Renewable Energy',
      research: 'Smart Grids',
      designation: 'Associate Professor',
      experience: '10',
      qualification: 'PhD in Electrical Engineering',
      phone: '8765432109',
      email: 'sarah.johnson@university.edu',
      linkedin: 'https://linkedin.com/sarahjohnson',
      googleScholar: 'https://scholar.google.com/sarahjohnson',
      irins: 'https://irins.org/sarahjohnson'
    }
  ];

  const [facultyList, setFacultyList] = useState(initialFaculty);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    specialization: '',
    areaOfInterest: '',
    research: '',
    designation: '',
    experience: '',
    qualification: '',
    phone: '',
    email: '',
    linkedin: '',
    googleScholar: '',
    irins: '',
  });
  const [editingId, setEditingId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      // Update existing faculty
      setFacultyList(prevList =>
        prevList.map(faculty =>
          faculty.id === editingId ? { ...formData, id: editingId } : faculty
        )
      );
      setEditingId(null);
    } else {
      // Add new faculty
      setFacultyList((prevList) => [...prevList, { ...formData, id: Date.now() }]);
    }

    // Clear the form
    setFormData({
      name: '',
      department: '',
      specialization: '',
      areaOfInterest: '',
      research: '',
      designation: '',
      experience: '',
      qualification: '',
      phone: '',
      email: '',
      linkedin: '',
      googleScholar: '',
      irins: '',
    });
  };

  const handleEdit = (faculty) => {
    setFormData({
      name: faculty.name,
      department: faculty.department,
      specialization: faculty.specialization,
      areaOfInterest: faculty.areaOfInterest,
      research: faculty.research,
      designation: faculty.designation,
      experience: faculty.experience,
      qualification: faculty.qualification,
      phone: faculty.phone,
      email: faculty.email,
      linkedin: faculty.linkedin,
      googleScholar: faculty.googleScholar,
      irins: faculty.irins,
    });
    setEditingId(faculty.id);
  };

  const handleDelete = (id) => {
    setFacultyList((prevList) => prevList.filter((faculty) => faculty.id !== id));
  };

  return (
    <div className="p-4 mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Manage Faculty</h1>

      {/* Faculty Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Faculty' : 'Add Faculty'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area of Interest</label>
            <input
              type="text"
              name="areaOfInterest"
              value={formData.areaOfInterest}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Research</label>
            <input
              type="text"
              name="research"
              value={formData.research}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Scholar</label>
            <input
              type="url"
              name="googleScholar"
              value={formData.googleScholar}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IRINS</label>
            <input
              type="url"
              name="irins"
              value={formData.irins}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: '',
                  department: '',
                  specialization: '',
                  areaOfInterest: '',
                  research: '',
                  designation: '',
                  experience: '',
                  qualification: '',
                  phone: '',
                  email: '',
                  linkedin: '',
                  googleScholar: '',
                  irins: '',
                });
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? 'Update Faculty' : 'Add Faculty'}
          </button>
        </div>
      </form>

      {/* Faculty List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Links</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {facultyList.map((faculty) => (
                <tr key={faculty.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{faculty.name}</div>
                    <div className="text-sm text-gray-500">{faculty.email}</div>
                    <div className="text-sm text-gray-500">{faculty.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {faculty.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {faculty.designation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{faculty.specialization}</div>
                    <div className="text-xs text-gray-400">{faculty.areaOfInterest}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{faculty.experience} years</div>
                    <div className="text-xs text-gray-400">{faculty.qualification}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      {faculty.linkedin && (
                        <div>
                          <a href={faculty.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            LinkedIn
                          </a>
                        </div>
                      )}
                      {faculty.googleScholar && (
                        <div>
                          <a href={faculty.googleScholar} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Google Scholar
                          </a>
                        </div>
                      )}
                      {faculty.irins && (
                        <div>
                          <a href={faculty.irins} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            IRINS
                          </a>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(faculty)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(faculty.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageFaculty;