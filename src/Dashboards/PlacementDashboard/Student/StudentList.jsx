import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import ToggleEligibility from "../PlacementReport/ToggleEligibility";
import Select from "react-select";
import { saveAs } from "file-saver";
import { useDispatch, useSelector } from 'react-redux';
import {
  editStudent,
  deleteStudent,
  selectSingleStatus,
  selectSingleError,
} from "../../../Redux/Placement/student/singleStudentadd";
import { fetchStudents ,selectStudentsLoading} from "../../../Redux/Placement/StudentsSlice";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StudentList = () => {
  const dispatch = useDispatch();

  const allColumns = [
    { label: "Name", value: "name" },
    { label: "Registration Number", value: "registered_number" },
    { label: "Email", value: "email" },
    { label: "Phone", value: "phone" },
    { label: "DOB", value: "dob" },
    { label: "Age", value: "age" },
    { label: "Gender", value: "gender" },
    { label: "Caste", value: "caste" },
    { label: "College", value: "college" },
    { label: "Department", value: "department" },
    { label: "Program", value: "program" },
    { label: "Graduation Year", value: "graduation_year" },
    { label: "10th School", value: "tenth_school" },
    { label: "10th CGPA", value: "tenth_cgpa" },
    { label: "12th School", value: "twelfth_school" },
    { label: "12th Branch", value: "twelfth_branch" },
    { label: "12th CGPA", value: "twelfth_cgpa" },
    { label: "UG College", value: "ug_college" },
    { label: "UG Degree", value: "ug_degree" },
    { label: "UG CGPA", value: "ug_cgpa" },
    { label: "UG Project Title", value: "ug_project_title" },
    { label: "UG Project Organization", value: "ug_project_org" },
    { label: "Masters College", value: "masters_college" },
    { label: "Masters Specialization", value: "masters_degree" },
    { label: "Masters CGPA", value: "masters_cgpa" },
    { label: "Can Apply", value: "can_apply" },
  ];
  const [selectedColumns, setSelectedColumns] = useState([]); // Default all selected
  const { universityName } = useParams();
  const token = localStorage.getItem("University authToken");

  // Get from Redux store
  const colleges = useSelector((state) => state.colleges.colleges) || [];
  const departments = useSelector((state) => state.department.departments) || [];
  const programs = useSelector((state) => state.programs.programs) || [];
  const students = useSelector((state) => state.students.students) || [];
  const loading  = useSelector(selectStudentsLoading);
  const singleError = useSelector(selectSingleError);
  

  // derive graduationYears from the student objects
  const graduationYears = Array.from(
    new Set(students.map((s) => s.graduation_year))
  );

  const [programId, setProgramId] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filters, setFilters] = useState({
    graduationYear: "",
    college: "",
    department: "",
    programId: ""  // ✅ Add this
  });
  console.log("colleges:", colleges)
  console.log("Departments:", departments)
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    canApply: "",
    name: "",
    email: "",
    registered_number: "",
    phone: "",
    enrollment_year: "",
    graduation_year: "",
    username: "",
    password: "",
  });

  // Add new state for search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name"); // 'name' or 'registration'


  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    dispatch(deleteStudent({
      studentId: id,
      token,
      universityName,
      BASE_URL
    })).then((action) => {
      if (action.type.endsWith('/fulfilled')) {
        alert("Student deleted successfully!");
        dispatch(fetchStudents({ token, universityName, BASE_URL }));
      } else {
        alert("Delete failed: " + (singleError || 'Unknown error'));
      }
    });
  };

  const handleEditClick = (student) => {
    setEditingStudentId(student._id);
    setEditFormData({
      canApply: student.canApply || "",
      name: student.name || "",
      email: student.email || "",
      registered_number: student.registered_number || "",
      phone: student.phone || "",
      enrollment_year: student.enrollment_year || "",
      graduation_year: student.graduation_year || "",
      username: student.credentials?.username || "",
      password: "", // Do not pre-fill password for security reasons
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    dispatch(editStudent({
      studentId: editingStudentId,
      data: editFormData,
      token,
      universityName,
      BASE_URL
    })).then((action) => {
      if (action.type.endsWith('/fulfilled')) {
        alert("Student updated successfully!");
        setEditingStudentId(null);
            dispatch(fetchStudents({ token, universityName, BASE_URL }));
      } else {
        alert("Update failed: " + (singleError || 'Unknown error'));
      }
    });
  };


  const handleCancelEdit = () => {
    setEditingStudentId(null);
    setEditFormData({
      canApply: "",
      name: "",
      email: "",
      registered_number: "",
      phone: "",
      enrollment_year: "",
      graduation_year: "",
      username: "",
      password: "",
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };



  // Update the student's canApply status in the filtered list
  const handleStatusUpdate = (studentId, canApply) => {
    setFilteredStudents((prevStudents) =>
      prevStudents.map((student) =>
        student._id === studentId ? { ...student, canApply } : student
      )
    );
  };



  useEffect(() => {
    const filtered = students.filter((student) => {
      const { graduationYear, college, department, programId } = filters;

      // Apply filters
      const filterMatch =
        (!graduationYear || student.graduation_year === parseInt(graduationYear)) &&
        (!college || student.collegeId === college) &&
        (!department || student.departmentId === department) &&
        (!programId || student.programId === programId);

      // Apply search
      let searchMatch = true;
      if (searchTerm) {
        if (searchType === "name") {
          searchMatch = student.name?.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchType === "registration") {
          searchMatch = student.registered_number?.toLowerCase().includes(searchTerm.toLowerCase());
        }
      }

      return filterMatch && searchMatch;
    });
    setFilteredStudents(filtered);
  }, [students, filters, searchTerm, searchType]);

  // Add search handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchTerm(""); // Clear search term when changing search type
  };




  // to find the total number of students fetched and displayed along side the student list
  const totalStudents = filteredStudents.length;

  const getProgramName = (programId) => {
    const program = programs.find((program) => program._id === programId);
    return program ? program.name : "N/A";
  };

  // form of date of birth:
  const formatDate = (dob) => {
    if (!dob) return '';
    const date = new Date(dob);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // calculate the date of birth 
  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const downloadExcel = () => {
    if (filteredStudents.length === 0) {
      alert("No students to export.");
      return;
    }
    if (selectedColumns.length === 0) {
      alert("Please select at least one column to export.");
      return;
    }

    const selectedKeys = selectedColumns.map(col => col.value);

    const formattedStudents = filteredStudents.map((student, index) => {
      const row = { SNo: index + 1 };
      if (selectedKeys.includes("name")) row.Name = student.name || "";
      if (selectedKeys.includes("registered_number")) row["Registration Number"] = student.registered_number || "";
      if (selectedKeys.includes("email")) row.Email = student.email || "";
      if (selectedKeys.includes("phone")) row.Phone = student.phone || "";
      if (selectedKeys.includes("dob")) row.DOB = formatDate(student.dateOfBirth);
      if (selectedKeys.includes("age")) row.Age = calculateAge(student.dateOfBirth);
      if (selectedKeys.includes("gender")) row.Gender = student.gender || "";
      if (selectedKeys.includes("caste")) row.Caste = student.caste || "";
      if (selectedKeys.includes("college")) row.College = colleges.find(c => c._id === student.collegeId)?.name || "N/A";
      if (selectedKeys.includes("department")) row.Department = departments.find(d => d._id === student.departmentId)?.name || "N/A";
      if (selectedKeys.includes("program")) row.Program = getProgramName(student.programId);
      if (selectedKeys.includes("graduation_year")) row["Graduation Year"] = student.graduation_year || "";
      if (selectedKeys.includes("tenth_school")) row["10th School"] = student.tenth?.institutionName || "";
      if (selectedKeys.includes("tenth_cgpa")) row["10th CGPA"] = student.tenth?.percentageOrCGPA || "";
      if (selectedKeys.includes("twelfth_school")) row["12th School"] = student.twelfth?.institutionName || "";
      if (selectedKeys.includes("twelfth_branch")) row["12th Branch"] = student.twelfth?.stream || "";
      if (selectedKeys.includes("twelfth_cgpa")) row["12th CGPA"] = student.twelfth?.percentageOrCGPA || "";
      if (selectedKeys.includes("ug_college")) row["UG College"] = student.bachelors?.institutionName || "";
      if (selectedKeys.includes("ug_degree")) row["UG Degree"] = student.bachelors?.degree || "";
      if (selectedKeys.includes("ug_cgpa")) row["UG CGPA"] = student.bachelors?.percentageOrCGPA || "";
      if (selectedKeys.includes("ug_project_title")) row["UG Project Title"] = student.academicProjects?.[0]?.description || "";
      if (selectedKeys.includes("ug_project_org")) row["UG Project Organization"] = student.academicProjects?.[0]?.level || "";
      if (selectedKeys.includes("masters_college")) row["Masters College"] = student.masters?.institutionName || "";
      if (selectedKeys.includes("masters_degree")) row["Masters Specialization"] = student.masters?.degree || "";
      if (selectedKeys.includes("masters_cgpa")) row["Masters CGPA"] = student.masters?.percentageOrCGPA || "";
      if (selectedKeys.includes("can_apply")) row["Can Apply"] = student.canApply ? "Yes" : "No";
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedStudents);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Students_Selected_Columns.xlsx");
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <button disabled className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading students...
        </button>
      </div>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold my-2 text-center underline">Student Management</h1>
        <h2 className=""><strong>Student List:</strong>=({totalStudents})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {/* Graduation Year Dropdown */}
          <select
            name="graduationYear"
            value={filters.graduationYear}
            onChange={handleFilterChange}
            className="p-1 border rounded"
          >
            <option value="">Select Graduation Year</option>
            {graduationYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Colleges Dropdown */}
          <select
            name="college"
            value={filters.college}
            onChange={handleFilterChange}
            className="p-1 border rounded"
          >
            <option value="">Select College</option>
            {colleges.map((college) => (
              <option key={college._id} value={college._id}>
                {college.name}
              </option>
            ))}
          </select>

          {/* Departments Dropdown */}
          <select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            className="p-1 border rounded"
          >
            <option value="">Select Department</option>
            {departments
              .filter((department) => department.college === filters.college) // ✅ Show only departments of selected college
              .map((department) => (
                <option key={department._id} value={department._id}>
                  {department.name}
                </option>
              ))}
          </select>
          {/* Programs Dropdown */}
          <select
            name="programId"
            value={filters.programId}
            onChange={handleFilterChange}
            className="p-1 border rounded"
          >
            <option value="">Select Program</option>
            {programs
              // only show programs belonging to the selected department
              .filter((program) =>
                !filters.department ||
                // compare against the nested department._id
                program.department?._id === filters.department
              )
              .map((program) => (
                <option key={program._id} value={program._id}>
                  {program.name}
                </option>
              ))}
          </select>
        </div>
        {/* Add Search Bar */}
        <div className="flex flex-col sm:flex-row gap-10 mb-4">
          <div className="flex-1">
            <div className="flex items-center border rounded overflow-hidden">
              <select
                value={searchType}
                onChange={handleSearchTypeChange}
                className="px-3 py-3 border-r bg-gray-100 mr-3"
              >
                <option value="name">Search by Name</option>
                <option value="registration">Search by Registration No.</option>
              </select>
              <input
                type="text"
                placeholder={`Search by ${searchType === 'name' ? 'Name' : 'Registration No.'}...`}
                value={searchTerm}
                onChange={handleSearch}
                className="flex-1 p-2 "
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="p-3 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col mb-4">
          <label className="font-semibold mb-2">Select Columns to Export:</label>
          <Select
            isMulti
            options={allColumns}
            value={selectedColumns}
            onChange={(selected) => setSelectedColumns(selected)}
            placeholder="Select columns..."
            className="w-full"
          />
        </div>


        <div className="flex justify-start mb-4">
          <button
            onClick={downloadExcel}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-sm"
          >
            Download Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          {/* Table for displaying students */}
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-1 text-2xs text-right">#</th>
                <th className="border px-1 text-2xs text-left">Registration</th>
                <th className="border px-1 text-2xs text-left">Name</th>
                <th className="border px-1 text-2xs text-left">Email</th>
                <th className="border px-1 text-2xs text-left">Phone</th>
                <th className="border px-1 text-2xs text-left">DOB</th>
                <th className="border px-1 text-2xs text-left">Age</th>
                <th className="border px-1 text-2xs text-left">Gender</th>
                <th className="border px-1 text-2xs text-left">caste</th>
                <th className="border px-1 text-2xs text-left">College</th>
                <th className="border px-1 text-2xs text-left">Department</th>
                <th className="border px-1 text-2xs text-left">program</th>
                <th className="border px-1 text-2xs text-left">Graduation_Year</th>
                <th className="border px-1 text-2xs text-left">10th School Name</th>
                <th className="border px-1 text-2xs text-left">10th CGPA</th>
                <th className="border px-1 text-2xs text-left">12th School Name</th>
                <th className="border px-1 text-2xs text-left">12th Branch</th>
                <th className="border px-1 text-2xs text-left">12th CGPA</th>
                <th className="border px-1 text-2xs text-left">UG college</th>
                <th className="border px-1 text-2xs text-left">UG Degree Name</th>
                <th className="border px-1 text-2xs text-left">UG CGPA</th>
                <th className="border px-1 text-2xs text-left">UG-Project title</th>
                <th className="border px-1 text-2xs text-left">UG-Project organization</th>
                <th className="border px-1 text-2xs text-left">Masters College Name</th>
                <th className="border px-1 text-2xs text-left">Masters Specialization</th>
                <th className="border px-1 text-2xs text-left">Masters CGPA</th>


                <th className="border px-1 text-2xs text-left">canApply</th>
                <th className="border px-1 text-2xs text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents?.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student._id} className="border-b">
                    <td className="border px-1 text-2xs  text-right">{index + 1}.</td>
                    <td className="border px-1 text-2xs ">{student?.registered_number}</td>
                    <td className="border px-1 text-2xs">{student?.name}</td>
                    <td className="border px-1 text-2xs">{student?.email}</td>
                    <td className="border px-1 text-2xs">{student?.phone}</td>
                    <td className="border px-1 text-2xs">{formatDate(student?.dateOfBirth)}</td>
                    <td className="border px-1 text-xs">{calculateAge(student?.dateOfBirth)}</td>
                    <td className="border px-1 text-2xs">{student?.gender}</td>
                    <td className="border px-1 text-2xs">{student?.caste}</td>
                    <td className="border px-1 text-2xs">
                      {colleges.find((college) => college._id === student.collegeId)?.name}
                    </td>
                    <td className="border px-1 text-2xs">
                      {departments.find((department) => department._id === student.departmentId)?.name}
                    </td>
                    <td className="border px-1 text-2xs">
                      {getProgramName(student.programId)} {/* Display program name instead of ID */}
                    </td>
                    <td className="border px-1  text-2xs">{student.graduation_year}</td>
                    <td className="border px-1 text-2xs">{student.tenth?.institutionName
                    }</td>
                    <td className="border px-2 py-1 text-2xs">{student.tenth?.percentageOrCGPA}</td>
                    <td className="border px-1 text-2xs">{student.twelfth?.institutionName
                    }</td>
                    <td className="border px-1 text-2xs">{student.twelfth?.stream
                    }</td>
                    <td className="border px-1 text-2xs">{student.twelfth?.percentageOrCGPA}</td>
                    <td className="border px-1 text-2xs">{student.bachelors?.institutionName
                    }</td>
                    <td className="border px-1 text-2xs">{student.bachelors?.degree
                    }</td>
                    <td className="border px-1 py-1 text-2xs">{student.bachelors?.percentageOrCGPA}</td>
                    <td className="border px-1 text-2xs">{student.academicProjects[0]?.description}</td>
                    <td className="border px-1 text-2xs">{student.academicProjects[0]?.level
                    }</td>
                    <td className="border px-1 text-2xs">{student.masters?.institutionName}</td>
                    <td className="border px-1 text-2xs">{student.masters?.degree}</td>
                    <td className="border px-1 py-1 text-2xs">{student.masters?.percentageOrCGPA}</td>
                    <td className="border px-1 text-2xs">{student.canApply ? "true" : "false"}</td>
                    <td className="border px-1 text-2xs">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(student)}
                          className="bg-yellow-500 text-white px-1 rounded text-2xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="bg-red-500 text-white px-2  rounded text-2xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    No students available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Popup/Modal for editing student */}
          {editingStudentId && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl">

                {/* Modal status */}
                {status === "pending" && (
                  <p className="text-blue-600 mb-4">Saving changes…</p>
                )}
                {status === "failed" && singleError && (
                  <p className="text-red-600 mb-4">Update failed: {singleError}</p>
                )}
                <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block font-medium mb-1">canApply</label>
                    <input
                      type="boolean"
                      name="canApply"
                      value={editFormData.canApply}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block font-medium mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block font-medium mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block font-medium mb-1">Registered Number</label>
                    <input
                      type="text"
                      name="registered_number"
                      value={editFormData.registered_number}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block font-medium mb-1">Phone</label>
                    <input
                      type="number"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block font-medium mb-1">Graduation Year</label>
                    <input
                      type="number"
                      name="graduation_year"
                      value={editFormData.graduation_year}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block font-medium mb-1">User Name</label>
                    <input
                      type="text"
                      name="username"
                      value={editFormData.username}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block font-medium mb-1">New Password (optional)</label>
                    <input
                      type="password"
                      name="password"
                      value={editFormData.password}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2 flex justify-end space-x-2">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-1 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-1 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>

      </div>
    </>
  );
};

export default StudentList;
