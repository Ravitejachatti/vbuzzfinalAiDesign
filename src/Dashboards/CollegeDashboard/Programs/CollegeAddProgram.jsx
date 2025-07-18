import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchDept } from "../../../Redux/DepartmentSlice";
import { useDispatch,useSelector } from "react-redux";
import { addProgram} from "../../../Redux/programs";

const CollegeAddProgram = () => {
  const { universityName } = useParams();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const dispatch = useDispatch()
  const {departments,loading} = useSelector(state=>state.department)
  const [programData, setProgramData] = useState({
    name: "",
    type: "",
    duration: "",
    department: "",
    syllabus: "",
    eligibilityCriteria: "",
    level: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const token = localStorage.getItem("University authToken");
  console.log("Token in AddProgram:", token);

  const fetchDepartments = async () => {
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }
       dispatch(fetchDept({token,universityName}))
  };

  useEffect(() => {
    fetchDepartments();
  }, [BASE_URL, universityName]);

  const handleInputChange = (e) => {
    setProgramData({ ...programData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);

  // Ensure correct data format
  const finalProgramData = { ...programData };
  if (programData.type === "other") {
    finalProgramData.type = programData.otherType;
    delete finalProgramData.otherType;
  }

  // Validate before sending
  if (typeof finalProgramData.name !== "string" || !finalProgramData.name.trim()) {
    setError("Program name must be a valid string.");
    return;
  }

      const result=await dispatch(addProgram({token,universityName,finalProgramData}))
       if (result.meta.requestStatus === "fulfilled") {
    setSuccess("program added successfully!");
    
  } else {
    setError( "Something went wrong.");
  }
};

  
  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Program</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Program Name</label>
            <input type="text" name="name" value={programData.name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
          </div>
          <div>
            <label className="block font-medium">Program Type</label>
            <select name="type" value={programData.type} onChange={handleInputChange} className="border p-2 w-full rounded" required>
              <option value="">Select a type</option>
              <option value="b.tech">b.Tech</option>
              <option value="bachelors">bachelors</option>
              <option value="m.tech">m.Tech</option>
              <option value="masters">masters</option>
              <option value="masters">M.Sc.</option>
              <option value="masters">M.A</option>
              <option value="phd">phd</option>
              <option value="mba">mba</option>
              <option value="diploma">diploma</option>
            </select>

          </div>
          <div>
            <label className="block text-sm font-medium">Duration (years)</label>
            <input type="number" name="duration" value={programData.duration} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
          </div>
          <div>
            <label className="block font-medium">Department</label>
            <select name="department" value={programData.department} onChange={handleInputChange} className="border p-2 w-full rounded" required>
              <option value="">Select a department</option>
              {departments && departments.length > 0 && departments.map((dept) => (
  <option key={dept._id} value={dept._id}>
    {dept.name}
  </option>
))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Syllabus (URL)</label>
            <input type="url" name="syllabus" value={programData.syllabus} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium">Eligibility Criteria</label>
            <input type="text" name="eligibilityCriteria" value={programData.eligibilityCriteria} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block font-medium">Program Level</label>
            <select name="level" value={programData.level} onChange={handleInputChange} className="border p-2 w-full rounded" required>
              <option value="">Select a level</option>
              <option value="diploma">Diploma</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
              <option value="doctorate">Doctorate</option>
              <option value="professional">Professional</option>
            </select>
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Add Program</button>
      </form>
    </div>
  );
};

export default CollegeAddProgram;
