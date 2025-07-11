// here we list the student applied for the jobs, and list more function of the students( fileds of the student ) calling directly from the student slice for his datas

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Select from "react-select";
import {useDispatch, useSelector} from "react-redux";
import { fetchJobs, fetchApplicantsByJob } from '../../../Redux/Jobslice.js';

const StudentsAppliedForJob = () => {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const [jobId, setJobId] = useState("");
  const [filteredApplicants, setFilteredApplicants] = useState([]);

  const [selectedJobs, setSelectedJobs] = useState([]);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]); // ✅ Program filter

  const [selectedColumns, setSelectedColumns] = useState([]);

   const colleges = useSelector((state) => state.colleges.colleges) || [];
    const departments = useSelector((state) => state.department.departments) || [];
    const programs = useSelector((state) => state.programs.programs) || [];
    const students = useSelector((state) => state.students.students) || [];
   const { jobs, applicants, loading, error } = useSelector(state => state.jobs);

   console.log("jobs in the students applied for job:", jobs);



  const studentList = Array.isArray(students)
    ? students
    : Array.isArray(students?.students)
      ? students.students
      : [];


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
    { label: "UG Project Org", value: "ug_project_org" },
    { label: "Masters College", value: "masters_college" },
    { label: "Masters Specialization", value: "masters_specialization" },
    { label: "Masters CGPA", value: "masters_cgpa" },
    { label: "Can Apply", value: "can_apply" },
  ];
  useEffect(() => { setSelectedColumns([]); }, []);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("University authToken");

  console.log("studnts data in the student applied for job:", students);

  // Mapping college, department, and program IDs to names
  const collegeMap = colleges.reduce((acc, college) => {
    acc[college._id] = college.name;
    return acc;
  }, {});

  const departmentMap = departments.reduce((acc, department) => {
    acc[department._id] = department.name;
    return acc;
  }, {});

  const programMap = programs.reduce((acc, program) => {
    acc[program._id] = program.name;
    return acc;
  }, {});

  // 1️⃣ load all jobs once
  useEffect(() => {
    dispatch(fetchJobs({ token, universityName }));
  }, [dispatch, token, universityName])

  // 2️⃣ Once jobs are loaded, select the first one (earliest closing date)
useEffect(() => {
  if (jobs.length > 0) {
    const sortedJobs = [...jobs].sort((a, b) => new Date(b.closingDate) - new Date(a.closingDate));
    setJobId(sortedJobs[0]._id);
  }
}, [jobs]);

 // 2️⃣ when jobId changes, load its applicants
  useEffect(() => {
    if (!jobId) return;
    dispatch(fetchApplicantsByJob({ token, universityName, jobId }));
  }, [dispatch, token, universityName, jobId]);


   // 3️⃣ whenever `applicants` or `students` updates, enrich & filter
  useEffect(() => {
    const enriched = applicants.map(app => {
      const stu = studentList.find(s => s._id === app._id);
      return stu
        ? {
            ...app,
            name: stu.name,
            registered_number: stu.registered_number,
            email: stu.email,
            phone: stu.phone,
            dateOfBirth: stu.dateOfBirth,
            gender: stu.gender,
            caste: stu.caste,
            collegeId: stu.collegeId,
            departmentId: stu.departmentId,
            programId: stu.programId,
            graduation_year: stu.graduation_year,
            tenth: stu.tenth,
            twelfth: stu.twelfth,
            bachelors: stu.bachelors,
            masters: stu.masters,
            academicProjects: stu.academicProjects,
            canApply: stu.canApply,
          }
        : app;
    });
    setFilteredApplicants(enriched);
  }, [applicants, studentList]);

  const formatDate = (dob) => {
    if (!dob) return "";
    const d = new Date(dob);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };
  

  // Handle dropdown changes
  const handleJobChange = (e) => setJobId(e.target.value);
  const handleJobFilter = (options) => {
    setSelectedJobs(options);
    filterApplicants(options, selectedColleges, selectedDepartments, selectedPrograms);
  };
  const handleCollegeFilter = (options) => {
    setSelectedColleges(options);
    filterApplicants(selectedJobs, options, selectedDepartments, selectedPrograms);
  };
  const handleDepartmentFilter = (options) => {
    setSelectedDepartments(options);
    filterApplicants(selectedJobs, selectedColleges, options, selectedPrograms);
  };
  const handleProgramFilter = (options) => {
    setSelectedPrograms(options);
    filterApplicants(selectedJobs, selectedColleges, selectedDepartments, options);
  };

  const filterApplicants = (jobs, colleges, departments, programs) => {
    const filtered = applicants.filter((applicant) => {
      const jobMatch = jobs.length === 0 || jobs.some((job) => job.value === applicant.jobId);
      const collegeMatch = colleges.length === 0 || colleges.some((college) => college.value === applicant.collegeId);
      const departmentMatch = departments.length === 0 || departments.some((dept) => dept.value === applicant.departmentId);
      const programMatch = programs.length === 0 || programs.some((prog) => prog.value === applicant.programId);
      return jobMatch && collegeMatch && departmentMatch && programMatch;
    });
    setFilteredApplicants(filtered);
  };

  const mappedData = filteredApplicants.map((applicant, index) => ({
    SNo: index + 1,
    Name: applicant.name,
    "Registered Number": applicant.registered_number,
    Email: applicant.email,
    Phone: applicant.phone,
    College: collegeMap[applicant.collegeId] || "N/A",
    Department: departmentMap[applicant.departmentId] || "N/A",
    Program: programMap[applicant.programId] || "N/A",
    Nationality: applicant.nationality,
    EnrollmentYear: applicant.enrollment_year,
    GraduationYear: applicant.graduation_year,
    FuturePlan: applicant.futurePlan,
    PlacementOpted: applicant.isPlacementOpted,
    DOB: applicant.dob,

  }));
  

  const jobOptions = jobs.map((job) => ({ value: job._id, label: job.title }));
  const collegeOptions = colleges.map((college) => ({ value: college._id, label: college.name }));
  const departmentOptions = departments.map((dept) => ({ value: dept._id, label: dept.name }));
  const programOptions = programs.map((prog) => ({ value: prog._id, label: prog.name }));

  const exportToExcel = () => {
    const selectedKeys = selectedColumns.map(col => col.value);
    const mapped = filteredApplicants.map((stu, idx) => {
      const row = { SNo: idx + 1 };
      if (selectedKeys.includes("name")) row.Name = stu.name;
      if (selectedKeys.includes("registered_number")) row["Registration Number"] = stu.registered_number;
      if (selectedKeys.includes("email")) row.Email = stu.email;
      if (selectedKeys.includes("phone")) row.Phone = stu.phone;
      if (selectedKeys.includes("dob")) row.DOB = formatDate(stu.dateOfBirth);
      if (selectedKeys.includes("age")) row.Age = calculateAge(stu.dateOfBirth);
      if (selectedKeys.includes("gender")) row.Gender = stu.gender;
      if (selectedKeys.includes("caste")) row.Caste = stu.caste;
      if (selectedKeys.includes("college")) row.College = collegeMap[stu.collegeId] || "N/A";
      if (selectedKeys.includes("department")) row.Department = departmentMap[stu.departmentId] || "N/A";
      if (selectedKeys.includes("program")) row.Program = programMap[stu.programId] || "N/A";
      if (selectedKeys.includes("graduation_year")) row["Graduation Year"] = stu.graduation_year;
      if (selectedKeys.includes("tenth_school")) row["10th School"] = stu.tenth?.institutionName;
      if (selectedKeys.includes("tenth_cgpa")) row["10th CGPA"] = stu.tenth?.percentageOrCGPA;
      if (selectedKeys.includes("twelfth_school")) row["12th School"] = stu.twelfth?.institutionName;
      if (selectedKeys.includes("twelfth_branch")) row["12th Branch"] = stu.twelfth?.stream;
      if (selectedKeys.includes("twelfth_cgpa")) row["12th CGPA"] = stu.twelfth?.percentageOrCGPA;
      if (selectedKeys.includes("ug_college")) row["UG College"] = stu.bachelors?.institutionName;
      if (selectedKeys.includes("ug_degree")) row["UG Degree"] = stu.bachelors?.degree;
      if (selectedKeys.includes("ug_cgpa")) row["UG CGPA"] = stu.bachelors?.percentageOrCGPA;
      if (selectedKeys.includes("ug_project_title")) row["UG Project Title"] = stu.academicProjects?.[0]?.description;
      if (selectedKeys.includes("ug_project_org")) row["UG Project Org"] = stu.academicProjects?.[0]?.level;
      if (selectedKeys.includes("masters_college")) row["Masters College"] = stu.masters?.institutionName;
      if (selectedKeys.includes("masters_specialization")) row["Masters Specialization"] = stu.masters?.degree;
      if (selectedKeys.includes("masters_cgpa")) row["Masters CGPA"] = stu.masters?.percentageOrCGPA;
      if (selectedKeys.includes("can_apply")) row["Can Apply"] = stu.canApply ? "Yes" : "No";
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(mapped);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applicants");

    const today = new Date().toISOString().split("T")[0];
    const filename = `${filteredApplicants[0]?.jobTitle || "Job"}_${filteredApplicants[0]?.companyName || "Company"}_${today}.xlsx`;

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), filename);
  };
  

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Applicants for Job</h2> 

<div className="overflow-x-auto whitespace-nowrap mb-6">
  <div className="flex space-x-3">
   {[...jobs]
  .sort((a, b) => new Date(b.closingDate) - new Date(a.closingDate))
  .map((job, index) => (
    <div
      key={job._id}
      onClick={() => setJobId(job._id)}
      className={`w-[300px] flex-shrink-0 p-2 border rounded shadow hover:shadow-lg cursor-pointer transition-all duration-200 ${
        jobId === job._id ? 'bg-blue-100 border-blue-500' : 'bg-white'
      }`}
    >
      <h3 className="font-semibold text-sm truncate">{index + 1}. {job.title}</h3>
      <p className="text-xs text-gray-700 truncate">{job.company}</p>
      <p className="text-[10px] text-gray-500">
        {new Date(job.closingDate).toLocaleDateString()}
      </p>
    </div>
  ))}

  </div>
</div>




      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block mb-2 font-medium">Filter by Job:</label>
          <Select isMulti options={jobOptions} value={selectedJobs} onChange={handleJobFilter} placeholder="Select jobs..." />
        </div>
        <div>
          <label className="block mb-2 font-medium">Filter by College:</label>
          <Select isMulti options={collegeOptions} value={selectedColleges} onChange={handleCollegeFilter} placeholder="Select colleges..." />
        </div>
        <div>
          <label className="block mb-2 font-medium">Filter by Department:</label>
          <Select isMulti options={departmentOptions} value={selectedDepartments} onChange={handleDepartmentFilter} placeholder="Select departments..." />
        </div>
        <div>
          <label className="block mb-2 font-medium">Filter by Program:</label>
          <Select isMulti options={programOptions} value={selectedPrograms} onChange={handleProgramFilter} placeholder="Select programs..." />
        </div>
      </div>

      {/* Table */}
      {loading && <p className="text-blue-600">Loading applicants...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && filteredApplicants.length > 0 && (
        <>
          <div className="mb-4">
            <p className="text-lg font-semibold">Total Students Applied: {filteredApplicants.length}</p>
            <Select isMulti options={allColumns} value={selectedColumns} onChange={setSelectedColumns} className="mb-4" placeholder="Select columns to download..."/>
      <button onClick={exportToExcel} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Export to Excel</button>
          </div>
<div className="overflow-x-auto overflow-y-auto max-h-[600px] border rounded
">
          <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 text-2xs ">#</th> 
              <th className="border px-2 py-1 text-2xs">Name</th>
              <th className="border px-2 py-1 text-2xs">Registration</th>
              <th className="border px-2 py-1 text-2xs">Email</th>
              <th className="border px-2 py-1 text-2xs">Phone</th>
              <th className="border px-2 py-1 text-2xs">DOB</th>
              <th className="border px-2 py-1 text-2xs">Age</th>
              <th className="border px-2 py-1 text-2xs">Gender</th>
              <th className="border px-2 py-1 text-2xs">Caste</th>
              <th className="border px-2 py-1 text-2xs">College</th>
              <th className="border px-2 py-1 text-2xs">Department</th>
              <th className="border px-2 py-1 text-2xs">Program</th>
              <th className="border px-2 py-1 text-2xs">Graduation Year</th>
              <th className="border px-2 py-1 text-2xs">10th School</th>
              <th className="border px-2 py-1 text-2xs">10th CGPA</th>
              <th className="border px-2 py-1 text-2xs">12th School</th>
              <th className="border px-2 py-1 text-2xs">12th Branch</th>
              <th className="border px-2 py-1 text-2xs">12th CGPA</th>
              <th className="border px-2 py-1 text-2xs">UG College</th>
              <th className="border px-2 py-1 text-2xs">UG Degree</th>
              <th className="border px-2 py-1 text-2xs">UG CGPA</th>
              <th className="border px-2 py-1 text-2xs">UG Project Title</th>
              <th className="border px-2 py-1 text-2xs">UG Project Org</th>
              <th className="border px-2 py-1 text-2xs">Masters College</th>
              <th className="border px-2 py-1 text-2xs">Masters Specialization</th>
              <th className="border px-2 py-1 text-2xs">Masters CGPA</th>
              <th className="border px-2 py-1 text-2xs">Can Apply</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.map((stu, idx) => (
              <tr key={stu._id} className="border">
                <td className="border px-2 py-1 text-2xs text-center">{idx + 1}</td>
                <td className="border px-2 py-1 text-2xs">{stu.name}</td>
                <td className="border px-2 py-1 text-2xs">{stu.registered_number}</td>
                <td className="border px-2 py-1 text-2xs">{stu.email}</td>
                <td className="border px-2 py-1 text-2xs">{stu.phone}</td>
                <td className="border px-2 py-1 text-2xs">{formatDate(stu.dateOfBirth)}</td>
                <td className="border px-2 py-1 text-2xs">{calculateAge(stu.dateOfBirth)}</td>
                <td className="border px-2 py-1 text-2xs">{stu.gender}</td>
                <td className="border px-2 py-1 text-2xs">{stu.caste}</td>
                <td className="border px-2 py-1 text-2xs">{collegeMap[stu.collegeId]}</td>
                <td className="border px-2 py-1 text-2xs">{departmentMap[stu.departmentId]}</td>
                <td className="border px-2 py-1 text-2xs">{programMap[stu.programId]}</td>
                <td className="border px-2 py-1 text-2xs">{stu.graduation_year}</td>
                <td className="border px-2 py-1 text-2xs">{stu.tenth?.institutionName}</td>
                <td className="border px-2 py-1 text-2xs">{stu.tenth?.percentageOrCGPA}</td>
                <td className="border px-2 py-1 text-2xs">{stu.twelfth?.institutionName}</td>
                <td className="border px-2 py-1 text-2xs">{stu.twelfth?.stream}</td>
                <td className="border px-2 py-1 text-2xs">{stu.twelfth?.percentageOrCGPA}</td>
                <td className="border px-2 py-1 text-2xs">{stu.bachelors?.institutionName}</td>
                <td className="border px-2 py-1 text-2xs">{stu.bachelors?.degree}</td>
                <td className="border px-2 py-1 text-2xs">{stu.bachelors?.percentageOrCGPA}</td>
                <td className="border px-2 py-1 text-2xs">{stu.academicProjects?.[0]?.description}</td>
                <td className="border px-2 py-1 text-2xs">{stu.academicProjects?.[0]?.level}</td>
                <td className="border px-2 py-1 text-2xs">{stu.masters?.institutionName}</td>
                <td className="border px-2 py-1 text-2xs">{stu.masters?.degree}</td>
                <td className="border px-2 py-1 text-2xs">{stu.masters?.percentageOrCGPA}</td>
                <td className="border px-2 py-1 text-2xs">{stu.canApply ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        </div>
        </>
      )}
      {!loading && !error && filteredApplicants.length === 0 && jobId && (
        <p className="text-gray-600">No applicants found for this job.</p>
      )}
    </div>
  );
};

export default StudentsAppliedForJob;
