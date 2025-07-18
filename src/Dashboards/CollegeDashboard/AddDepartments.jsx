import React, { useState } from 'react';
import { Plus, X, Eye } from 'lucide-react';

function AddDepartments({ collegeId, token, colleges, departments, programs }) {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    head: '',
    contact: '',
    email: '',
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDepartmentForm((prev) => ({ ...prev, [name]: value }));
  };

  const addDepartment = () => {
    const newDept = { ...departmentForm, id: Date.now(), programs: [] };
    departments.push(newDept);
    setSelectedDepartment(newDept);
    setDepartmentForm({ name: '', head: '', contact: '', email: '' });
    setShowAddForm(false);
  };

  const showProgramDetails = (program) => setSelectedProgram(program);
  const closeProgramPopup = () => setSelectedProgram(null);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Manage Departments</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Departments Table (styled) */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Head</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Programs</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, idx) => (
              <tr key={dept.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2 font-medium">{dept.name}</td>
                <td className="px-4 py-2">{dept.head}</td>
                <td className="px-4 py-2">{dept.contact}</td>
                <td className="px-4 py-2">{dept.email}</td>
                <td className="px-4 py-2 space-y-1">
                  {dept.programs.length > 0 ? (
                    dept.programs.map((program, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <Eye
                          onClick={() => showProgramDetails(program)}
                          className="w-4 h-4 text-blue-500 cursor-pointer hover:text-blue-700"
                        />
                        <span>{program.name}</span>
                      </div>
                    ))
                  ) : (
                    <span className="italic text-gray-400">No programs</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Department Modal (styled) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Add New Department</h3>
              <button onClick={() => setShowAddForm(false)} className="hover:bg-gray-100 p-1 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              {['name', 'head', 'contact', 'email'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-600 capitalize mb-1">
                    {field === 'head' ? 'Department Head' : field}
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={departmentForm[field]}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={field === 'name' ? 'Department Name' : ''}
                    required
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={addDepartment}
                className="px-4 py-2 text-sm rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow"
              >
                Add Department
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Program Details</h3>
              <button onClick={closeProgramPopup} className="hover:bg-gray-100 p-1 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-medium">Name:</span> {selectedProgram.name}</p>
              <p><span className="font-medium">Type:</span> {selectedProgram.type}</p>
              <p><span className="font-medium">Level:</span> {selectedProgram.level}</p>
              <p><span className="font-medium">Duration:</span> {selectedProgram.duration} years</p>
              <p><span className="font-medium">Eligibility:</span> {selectedProgram.eligibility}</p>
              <p>
                <span className="font-medium">Syllabus:</span>{' '}
                <a href={selectedProgram.syllabus} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View Document
                </a>
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeProgramPopup}
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddDepartments;