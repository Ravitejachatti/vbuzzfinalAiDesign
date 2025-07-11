import React, { useState,  useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {addStudent, resetAddStudentStatus} from "../../../Redux/Placement/student/singleStudentadd";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddStudentForm = () => {
  const { universityName } = useParams();
  const dispatch = useDispatch();

    // Get from Redux store
    const colleges = useSelector((state) => state.colleges.colleges) || [];
    const departments = useSelector((state) => state.department.departments) || [];
    const programs = useSelector((state) => state.programs.programs) || [];

    console.log("Colleges:", colleges);
    console.log("Departments:", departments); 
    console.log("Programs:", programs);

    // Get universityId from localStorage
  const universityId = localStorage.getItem("universityId");
  const token = localStorage.getItem("University authToken");

  const [collegeId, setCollegeId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [registeredNumber, setRegisteredNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [enrollmentYear, setEnrollmentYear] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [programId, setProgramId] = useState("");

   // Redux add student status
  const addStatus = useSelector((state) => state.addStudent.status);
  const addError = useSelector((state) => state.addStudent.error);


    useEffect(() => {
    if (addStatus === "succeeded") {
      alert("Student added successfully!");
      // Reset form fields
      setCollegeId("");
      setDepartmentId("");
      setName("");
      setEmail("");
      setRegisteredNumber("");
      setPhone("");
      setEnrollmentYear("");
      setGraduationYear("");
      setProgramId("");
      dispatch(resetAddStudentStatus());
    }
  }, [addStatus,dispatch]);
  

 const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      universityId,
      collegeId,
      departmentId,
      programId,
      name,
      registered_number: registeredNumber,
      email,
      phone,
      enrollment_year: enrollmentYear,
      graduation_year: graduationYear,
    };
    console.log("Form Data:", formData);
    dispatch(addStudent({ formData, token, universityName, BASE_URL }));
    console.log("Student added with form data:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-1 md:p-6 mx-auto ">
      <div>
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Add New Student</h2>
        <p className="pb-5 font-sans text-[16px] text-gray-600">
          Dear placement offiecer, if any of the students are left to be added
          through bulk upload, then add them here. Otherwise, choose the bulk
          upload option to upload students for a class or department at once.
        </p>
      </div>
        {/* Show status/error */}
      {addStatus === "pending" && (
        <div className="text-blue-600 text-center mb-2">Adding student...</div>
      )}
      {addStatus === "failed" && (
        <div className="text-red-600 text-center mb-2">{addError}</div>
      )}


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* University ID */}
        <div>
          <label className="block  font-medium text-gray-600">University ID</label>
          <input
            type="text"
            value={universityId}
            readOnly
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

  {/* College Dropdown */}
<div className="mb-4">
  <label className="block text-gray-600 font-medium">Select College</label>
  <select
    value={collegeId}
    onChange={(e) => {
      setCollegeId(e.target.value);
      setDepartmentId("");
      setProgramId("");
    }}
    className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
    required
  >
    <option value="">Select a college</option>
    {colleges.map((college) => (
      <option key={college._id} value={college._id}>
        {college.name}
      </option>
    ))}
  </select>
</div>

{/* Department Dropdown */}
<div className="mb-4">
  <label className="block text-gray-600 font-medium">Select Department</label>
  <select
    value={departmentId}
    onChange={(e) => {
      setDepartmentId(e.target.value);
      setProgramId("");
    }}
    disabled={!collegeId}
    className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
    required
  >
    <option value="">{collegeId ? "Select a department" : "Select college first"}</option>
    {departments
      .filter((dept) => dept.college === collegeId)
      .map((department) => (
        <option key={department._id} value={department._id}>
          {department.name}
        </option>
      ))}
  </select>
</div>

{/* Program Dropdown */}
<div>
  <label className="block mb-2 font-medium text-gray-600">Select Program</label>
  <select
    value={programId}
    onChange={(e) => setProgramId(e.target.value)}
    disabled={!departmentId}
    className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
    required
  >
    <option value="">{departmentId ? "Select a program" : "Select department first"}</option>
    {programs
      .filter((prog) => prog.department._id === departmentId)
      .map((program) => (
        <option key={program._id} value={program._id}>
          {program.name}
        </option>
      ))}
  </select>
</div>


        {/* Name */}
        <div>
          <label className="block mb-2 font-medium text-gray-600">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter student's name"
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 font-medium text-gray-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter student's email"
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Registered Number */}
        <div>
          <label className="block mb-2 font-medium text-gray-600">Registered Number</label>
          <input
            type="text"
            value={registeredNumber}
            onChange={(e) => setRegisteredNumber(e.target.value)}
            placeholder="Enter registered number"
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-2 font-medium text-gray-600">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Enrollment Year */}
        <div>
          <label className="block mb-2 font-medium text-gray-600">Enrollment Year</label>
          <input
            type="number"
            value={enrollmentYear}
            onChange={(e) => setEnrollmentYear(e.target.value)}
            placeholder="Enter enrollment year"
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Graduation Year */}
        <div>
          <label className="block mb-2 font-medium text-gray-600">Graduation Year</label>
          <input
            type="number"
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.value)}
            placeholder="Enter graduation year"
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded shadow-lg transition-all duration-300"
        >
          Add Student
        </button>
      </div>
    </form>
  );
};

export default AddStudentForm;
