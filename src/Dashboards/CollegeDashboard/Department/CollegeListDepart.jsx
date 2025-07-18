import  { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { deptDelete,deptUpdate } from "../../../Redux/DepartmentSlice";

const CollegeListDepart = () => {
  const { universityName } = useParams(); // Fetch university name dynamically
  const location = useLocation(); // Access additional context if needed
  const user = location.state?.user || {}; // Extract user data from state
  const dispatch=useDispatch()
  const [selectedDepartment, setSelectedDepartment] = useState(null); // For editing
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [load,setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    head: { name: "", phone: "" },
  });
  const [error, setError] = useState("");
  

  const token = localStorage.getItem("University authToken"); // Retrieve token from localStorage
  
 const colleges = useSelector((state) => state.colleges.colleges) || [];
   const departments = useSelector((state) => state.department.departments) || [];
  const programs = useSelector((state) => state.programs.programs) || [];
  const students = useSelector((state) => state.students.students) || [];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
          dispatch(deptDelete({token,id,universityName}))
    }
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
      head: department.head || { name: "", phone: "" },
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.head.name || !formData.head.phone) {
      setError("Please fill out all required fields.");
      return;
    }
   setLoading(true)
    dispatch(deptUpdate({token,selectedDepartment,formData,universityName}))
    setLoading(false)
  };

  // Get College Name by ID
  const getCollegeName = (collegeId) => {
    const college = colleges.find((col) => col._id === collegeId);
    return college ? college.name : "Unknown College";
  };

  // Get Program Name by ID
  const getProgramName = (programId) => {
    const program = programs.find((prog) => prog._id === programId);
    return program ? program.name : "Unknown Program";
  };

  // Show College Details
  const showCollegeDetails = (collegeId) => {
    const college = colleges.find((col) => col._id === collegeId);
    setSelectedCollege(college);
  };

  // Show Program Details
  const showProgramDetails = (programId) => {
    const program = programs.find((prog) => prog._id === programId);
    setSelectedProgram(program);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Departments</h2>
      {error && <div className="text-red-500 mb-1">{error}</div>}
      <div className="overflow-auto max-w-full max-h-screen">
  <table className="min-w-full border-collapse border border-gray-300 shadow-lg">
    <thead className="bg-gray-100">
      <tr className="text-left">
        <th className="border border-gray-300 px-1 py-1 text-2xs">#</th>
        <th className="border border-gray-300 px-1 py-1 text-2xs">College</th>
        <th className="border border-gray-300 px-1 py-1 text-2xs">Department Name</th>
        <th className="border border-gray-300 px-1 py-1 text-2xs">Programs</th>
        <th className="border border-gray-300 px-1 py-1 text-2xs">Head</th>
        <th className="border border-gray-300 px-1 py-1 text-2xs">Contact</th>
        <th className="border border-gray-300 px-1 py-1 text-2xs">Email</th>
        <th className="border border-gray-300 px-1 py-1 text-2xs">Alternate Contact</th>
        <th className="border border-gray-300 px-1 py-1 text-2xs">Alternate Phone</th>
        <th className="border border-gray-300 px-1 py-1 text-2xs">Address</th>
        <th className="border border-gray-300 px-1 py-1 text-2xs">Actions</th>
      </tr>
    </thead>
    <tbody>
      {departments.map((dept, index) => (
        <tr key={dept._id} className="border border-gray-300 hover:bg-gray-50">
          <td className="border border-gray-300 px-1 py-1 text-2xs">{index + 1}</td>
          <td
                  className="border px-1 py-1  text-2xs cursor-pointer text-blue-600"
                  onClick={() => showCollegeDetails(dept.college)}
                >
                  {getCollegeName(dept.college)}
                </td>
          <td className="border border-gray-300 px-1 py-1 text-2xs font-semibold">{dept?.name}</td>
          <td className="border px-1 py-1 text-2xs ">
                  {dept.programs.map((progId, progIndex) => (
                    <div key={progId} className="text-blue-600 cursor-pointer">
                      {progIndex + 1}.{" "}
                      <span onClick={() => showProgramDetails(progId)}>
                        {getProgramName(progId)}
                      </span>
                    </div>
                  ))}
                </td>

          <td className="border border-gray-300 px-1 py-1 text-2xs">
            <span className="font-medium">{dept?.head?.name || "N/A"}</span>
            <br />
            <span className="text-gray-600">{dept?.head?.phone || "N/A"}</span>
          </td>
          <td className="border border-gray-300 px-1 py-1 text-2xs">{dept?.head?.phone || "N/A"}</td>
          <td className="border border-gray-300 px-1 py-1 text-2xs">{dept?.contactEmail || "N/A"}</td>
          <td className="border border-gray-300 px-1 py-1 text-2xs">{dept?.contactPhone || "N/A"}</td>
          <td className="border border-gray-300 px-1 py-1 text-2xs">{dept?.email || "N/A"}</td>
          <td className="border border-gray-300 px-1 py-1 text-2xs">
            {dept?.address?.roomNumber ? `Room ${dept?.address?.roomNumber}, ` : ""}
            {dept?.address?.building || "N/A"}
          </td>
          <td className="px-1 py-1 text-2xs flex ">
            <button
              className="text-blue-600 border border-blue-600 px-1 py-1 rounded mr-2"
              onClick={() => handleEdit(dept)}
            >
              Edit
            </button>
            <button
              className="text-red-600 border border-red-600 px-1 py-1 rounded"
              onClick={() => handleDelete(dept._id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>



      {/* Edit Department Modal */}
      {selectedDepartment && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Edit Department</h3>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-2xs font-medium mb-1">Department Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="p-2 border rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-2xs font-medium mb-1">Head of Department</label>
                <input
                  type="text"
                  name="headName"
                  value={formData.head.name}
                  onChange={(e) =>
                    setFormData({ ...formData, head: { ...formData.head, name: e.target.value } })
                  }
                  className="p-2 border rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-2xs font-medium mb-1">Head's Contact</label>
                <input
                  type="text"
                  name="headPhone"
                  value={formData.head.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, head: { ...formData.head, phone: e.target.value } })
                  }
                  className="p-2 border rounded w-full"
                />
              
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedDepartment(null)}
                  className="px-1 py-1 text-2xs bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-1 py-1 text-2xs bg-blue-500 text-white rounded"
                  disabled={load}
                >
                  {load? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        {/* College Details Modal */}
        {selectedCollege && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-bold mb-2">{selectedCollege.name}</h3>
            <p>Dean: {selectedCollege.dean}</p>
            <p>Email: {selectedCollege.adminEmail}</p>
            <p>Address: {selectedCollege.location.address}</p>
            <button onClick={() => setSelectedCollege(null)} className="text-red-600 mt-4">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center w-full">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-bold mb-2">Name of the Program: {selectedProgram.name}</h3>
            <p><strong>Type: </strong>{selectedProgram.type}</p>
            <p><strong>Level: </strong>{selectedProgram.level}</p>
            <p><strong>Duration:</strong> {selectedProgram.duration} years</p>
            <p><strong>Eligibility:</strong> {selectedProgram?.eligibilityCriteria}</p>
            <div>
              <p>Click to view syllabus:</p>
              <a href={selectedProgram.syllabus} className="text-blue-600" target="_blank" rel="noopener noreferrer">
              View Syllabus
            </a>
            </div>
            
            <button onClick={() => setSelectedProgram(null)} className="text-red-600 mt-2 border  border-red-600 px-1 py-1 rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeListDepart;
