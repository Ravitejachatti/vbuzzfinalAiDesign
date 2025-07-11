// this have the listing of the job, edit and deleting of the job and filtering of the job on different basis

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { useDispatch,useSelector } from "react-redux";
import { fetchJobs,deleteJob,updateJob } from "../../../Redux/Jobslice";
import Multiselect from "multiselect-react-dropdown";

const JobManager = () => {
  const { universityName } = useParams();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("University authToken");

  const colleges = useSelector((state) => state.colleges.colleges) || [];
  const departments = useSelector((state) => state.department.departments) || [];
  const programs = useSelector((state) => state.programs.programs) || [];
  const students = useSelector((state) => state.students.students) || [];

  const [filteredJobs, setFilteredJobs] = useState([]);
  const [modalJob, setModalJob] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewDepartments, setViewDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [viewPrograms, setViewPrograms] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({
    year: false,
    type: false,
    college: false,
    department: false,
    program: false
  });
  const [selectedFilters, setSelectedFilters] = useState({
    passingYear: "",
    type: "",
    college: "",
    department: "",
    program: ""
  });


  const dispatch = useDispatch() ; 
  const {jobs,loading, err}=useSelector(state=>state.jobs)

  const fetchjobs = async () => {
   const result =await dispatch(fetchJobs({token,universityName}))
if (result.meta.requestStatus === "fulfilled") {
  setFilteredJobs([...result.payload].sort(sortByExpiryThenPosted))
  console.log("jobs in placement dashboard", result.payload)
}
   if (result.meta.requestStatus === "rejected") {
     console.error("Error fetching jobs:", result.payload);
   }
  };


  useEffect(() => {
    fetchjobs();
  }, [universityName]);


  const uniqueYears = jobs?.length ? [...new Set(jobs?.map(job => job.passingYear))] : [];

  const uniqueTypes = jobs?.length ? [...new Set(jobs?.map(job => job.type))]:[];

  const handleYearFilter = (year) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const handleTypeFilter = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

// newest closing dates first, then newest postings first
const sortByExpiryThenPosted = (a, b) => {
  const expA = new Date(a.closingDate), expB = new Date(b.closingDate);
  if (expB > expA) return 1;   // b closes later ⇒ b should come before a
  if (expB < expA) return -1;
  // same closingDate ⇒ compare createdAt
  const creA = new Date(a.createdAt), creB = new Date(b.createdAt);
  if (creB > creA) return 1;   // b posted later ⇒ b comes before
  if (creB < creA) return -1;
  return 0;
};


const handleFilterChange = () => {
  const filtered = jobs
    .filter((job) => {
      const jobCollegeIds = job.colleges || [];
      const jobDeptIds = job.departments || [];
      const jobProgramIds = job.programs || [];

      const collegeMatch =
        selectedColleges.length === 0 || // no filter applied
        jobCollegeIds.length === 0 || // job open to all colleges
        jobCollegeIds.some((id) => {
          const selectedIds = colleges
            .filter((c) => selectedColleges.includes(c.name))
            .map((c) => c._id);
          return selectedIds.includes(id);
        });

      const deptMatch =
        selectedDepartments.length === 0 ||
        jobDeptIds.length === 0 ||
        jobDeptIds.some((id) => {
          const selectedIds = departments
            .filter((d) => selectedDepartments.includes(d.name))
            .map((d) => d._id);
          return selectedIds.includes(id);
        });

      const programMatch =
        selectedPrograms.length === 0 ||
        jobProgramIds.length === 0 ||
        jobProgramIds.some((id) => {
          const selectedIds = programs
            .filter((p) => selectedPrograms.includes(p.name))
            .map((p) => p._id);
          return selectedIds.includes(id);
        });

      return (
        (selectedYears.length === 0 || selectedYears.includes(job.passingYear)) &&
        (selectedTypes.length === 0 || selectedTypes.includes(job.type)) &&
        collegeMatch &&
        deptMatch &&
        programMatch
      );
    })
    .sort(sortByExpiryThenPosted);

  setFilteredJobs(filtered);
};





  useEffect(() => {
    handleFilterChange();
  }, [selectedYears, selectedTypes, selectedColleges, selectedDepartments, selectedPrograms]);



  const handleEdit = async () => {
    console.log("Form Data:", formData);
    console.log("Modal Job ID:", modalJob._id);
    try {
      const jobId=modalJob._id
      dispatch(updateJob({token,formData,jobId,universityName}))
      setEditModalOpen(false);
     
    } catch (error) {
      console.error("Error updating Job:", error);
    }
  };

 // delete handler
const handleDelete = (jobId) => {
  if (!window.confirm("Are you sure you want to delete this job?")) return;
  dispatch(deleteJob({
    token,
    jobId,          // <-- pass the ID directly
    universityName,
  }));
};
  

  const getShortDepartmentNames = (deptIds) => {
    return deptIds
      .slice(0, 2) // Limit to 2 departments for a short representation
      ?.map((id) => {
        const dept = departments.find((dept) => dept._id === id);
        return dept ? dept.name : "Unknown";
      })
      .join(", ");
  };
  const getCollegeNameById = (id) => {
    const college = colleges.find((college) => college._id === id);
    return college ? college.name : "Unknown College";
  };

  const getProgramNameById = (id) => {
    const program = programs.find((program) => program._id === id);
    return program ? program.name : "Unknown Program";
  };

  const FilterDropdown = ({ label, options, selected, handler, keyName, dropdownOpen, setDropdownOpen }) => (
  <div className="relative mb-4">
    <label className="block text-gray-700 font-medium mb-2">{label}:</label>
    <div
      onClick={() =>
        setDropdownOpen((prev) => ({ ...prev, [keyName]: !prev[keyName] }))
      }
      className="p-2 border rounded bg-white cursor-pointer"
    >
      {selected?.length ? `${selected?.length} selected` : `Select ${label}`}
    </div>
    {dropdownOpen[keyName] && (
      <div className="absolute bg-white border rounded shadow-md w-full max-h-40 overflow-y-auto mt-1 z-10">
        <label className="flex items-center p-2 bg-gray-100 hover:bg-gray-200">
          <input
            type="checkbox"
            checked={selected?.length === options?.length}
            onChange={() =>
              handler(selected.length === options.length ? [] : [...options])
            }
            className="mr-2"
          />
          Select All
        </label>
        {options.map((option) => (
          <label key={option} className="flex items-center p-2 hover:bg-gray-100">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() =>
                handler(
                  selected.includes(option)
                    ? selected.filter((item) => item !== option)
                    : [...selected, option]
                )
              }
              className="mr-2"
            />
            {option}
          </label>
        ))}
      </div>
    )}
  </div>
);


// Trigger filtering when jobs are fetched
useEffect(() => {
  if (jobs?.length) {
    handleFilterChange();
  }
}, [jobs]);


  return (
    <div className="p-4">
     {/* Filter Dropdowns */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
  {/* Passing Year Filter */}
  <FilterDropdown
    label="Passing Year"
    options={uniqueYears}
    selected={selectedYears}
    handler={setSelectedYears}
    keyName="year"
    dropdownOpen={dropdownOpen}
    setDropdownOpen={setDropdownOpen}
  />

  {/* Job Type Filter */}
  <FilterDropdown
    label="Job Type"
    options={uniqueTypes}
    selected={selectedTypes}
    handler={setSelectedTypes}
    keyName="type"
    dropdownOpen={dropdownOpen}
    setDropdownOpen={setDropdownOpen}
  />

  {/* College Filter */}
  <FilterDropdown
    label="College"
    options={colleges.map((c) => c.name)}
    selected={selectedColleges}
    handler={(val) => {
      setSelectedColleges(val);
      setSelectedDepartments([]); // reset departments on college change
      setSelectedPrograms([]); // reset programs
    }}
    keyName="college"
    dropdownOpen={dropdownOpen}
    setDropdownOpen={setDropdownOpen}
  />

  {/* Filtered Departments based on selectedColleges */}
  <FilterDropdown
    label="Department"
    options={departments
      .filter((d) => selectedColleges.length === 0 || selectedColleges.some((collegeName) => {
        const college = colleges.find((c) => c.name === collegeName);
        return college && d.college === college._id;
      }))
      .map((d) => d.name)}
    selected={selectedDepartments}
    handler={(val) => {
      setSelectedDepartments(val);
      setSelectedPrograms([]); // reset programs
    }}
    keyName="department"
    dropdownOpen={dropdownOpen}
    setDropdownOpen={setDropdownOpen}
  />

  {/* Filtered Programs based on selectedDepartments */}
  <FilterDropdown
    label="Program"
    options={programs
      .filter((p) => selectedDepartments.length === 0 || selectedDepartments.some((deptName) => {
        const dept = departments.find((d) => d.name === deptName);
        return dept && p.department === dept._id;
      }))
      .map((p) => p.name)}
    selected={selectedPrograms}
    handler={setSelectedPrograms}
    keyName="program"
    dropdownOpen={dropdownOpen}
    setDropdownOpen={setDropdownOpen}
  />
</div>


      <h2 className="mb-2 font-bold">Job Listings: ({filteredJobs?.length})</h2>

      <div className="overflow-x-auto">
        <div className="overflow-x-auto max-h-[70vh]">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="border px-2 py-1 text-xs text-left">#</th>
                <th className="border px-2 py-1 text-xs text-left">Job Type</th>
                <th className="border px-2 py-1 text-xs text-left">Passing Year</th>
                <th className="border px-2 py-1 text-xs text-left">Colleges</th>
                <th className="border px-2 py-1 text-xs text-left">Departments</th>
                <th className="border px-2 py-1 text-xs text-left">Programs</th>
                <th className="border px-2 py-1 text-xs text-left">Company</th>
                <th className="border px-2 py-1 text-xs text-left">Title</th>
                <th className="border px-2 py-1 text-xs text-left">Job Role</th>
                <th className="border px-2 py-1 text-xs text-left">CTC</th>
                <th className="border px-2 py-1 text-xs text-left">Description</th>
                <th className="border px-2 py-1 text-xs text-left">Job Location</th>
                <th className="border px-2 py-1 text-xs text-left">Min Percentage</th>
                <th className="border px-2 py-1 text-xs text-left">Link to Apply</th>
                <th className="border px-2 py-1 text-xs text-left">Link to PDF</th>
                <th className="border px-2 py-1 text-xs text-left">Posted On</th>
                <th className="border px-2 py-1 text-xs text-left">Closing Date</th>
                <th className="border px-2 py-1 text-xs text-left">Status</th>
                <th className="border px-2 py-1 text-xs text-left">Applicants</th>
                <th className="border px-2 py-1 text-xs text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => (
                  <tr key={job._id} className="border-b">
                    <td className="border px-2 py-1 text-xs">{index + 1}</td>
                    <td className="border px-2 py-1 text-xs">{job.type}</td>
                    <td className="border px-2 py-1 text-xs">{job.passingYear}</td>
                    <td className="border px-2 py-1 text-xs">
                      {job?.colleges?.length > 2 ? (
                        <>
                          {job.colleges.slice(0, 2)?.map(getCollegeNameById).join(', ')}
                          <button
                            onClick={() => setViewDepartments(job.colleges)}
                            className="ml-2 text-blue-600 underline text-xs"
                          >
                            View All
                          </button>
                        </>
                      ) : (
                        job.colleges?.map(getCollegeNameById).join(', ')
                      )}
                    </td>
                    <td className="border px-2 py-1 text-xs">
                      {job?.departments?.length > 2 ? (
                        <>
                          {getShortDepartmentNames(job.departments)}
                          <button
                            onClick={() => {
                              setViewDepartments(job.departments);
                            }}
                            className="ml-2 text-blue-600 underline text-xs"
                          >
                            View All
                          </button>
                        </>
                      ) : getShortDepartmentNames(job.departments)}
                    </td>
            <td className="border px-2 py-1 text-xs">
  {job.programs?.length > 2 ? (
    <>
      {job.programs.slice(0, 2).map(getProgramNameById).join(", ")}
      <button
        onClick={() => setViewPrograms(job.programs)}
        className="ml-2 text-blue-600 underline text-xs"
      >
        View All
      </button>
    </>
  ) : (
    job.programs?.map(getProgramNameById).join(", ")
  )}
</td>

                    <td className="border px-2 py-1 text-xs">{job.company}</td>
                    <td className="border px-2 py-1 text-xs">{job.title}</td>
                    {/* if job role is greater, keep view */}
                    <td className="border px-2 py-1 text-xs">{job.jobRole}</td>
                    <td className="border px-2 py-1 text-xs">{job.ctc}</td>

                    <td className="border px-2 py-1 text-xs">
                      <button
                        onClick={() => {
                          setModalJob(job);
                          setViewModalOpen(true);
                        }}
                        className="bg-blue-500 text-white px-1 py-1 text-xs rounded"
                      >
                        View Description
                      </button>
                    </td>
                    <td className="border px-2 py-1 text-xs">{job.location}</td>
                    <td className="border px-2 py-1 text-xs">{job.minPercentage}</td>
                    <td className="border px-2 py-1 text-xs">
                      {job.linkToApply ? (
                        <a
                          href={job.linkToApply}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          Link
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="border px-2 py-1 text-xs">
                      {job.linkToPdf ? (
                        <a
                          href={job.linkToPdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          PDF
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="border px-2 py-1 text-xs">{new Date(job?.createdAt).toLocaleDateString()}</td>
                    <td className="border px-2 py-1 text-xs">{new Date(job?.closingDate).toLocaleDateString()}</td>
                    <td className="border px-2 py-1 text-xs">{job?.status}</td>
                    <td className="border px-2 py-1 text-xs">{job?.applications?.length || 0}</td>
                    <td className="border px-2 py-1 text-xs">
                      <button
                        onClick={() => {
                          setModalJob(job);
                          setFormData({ ...job });
                          setEditModalOpen(true);
                        }}
                        className="bg-yellow-500 text-white px-1 py-1 text-xs rounded"
                      >
                        Edit
                      </button>
                     <button
    onClick={() => handleDelete(job._id)}
    className="bg-red-500 text-white px-2 rounded text-2xs"
  >
    Delete
  </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center py-4">
                    No jobs available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Description Modal */}
      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Job Description</h2>
          <p className="text-sm whitespace-pre-wrap">{modalJob?.description}</p>
          <div className="mt-4 text-right">
            <button onClick={() => setViewModalOpen(false)} className="bg-blue-500 text-white px-4 py-2 rounded">Close</button>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* View Departments Modal */}
      <Dialog open={viewDepartments?.length > 2} onClose={() => setViewDepartments([])} className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl max-h-[80vh] overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Departments</h2>
          <ul className="list-decimal list-inside space-y-1 text-sm">
            {viewDepartments?.map((id, index) => {
              const dept = departments.find((d) => d._id === id);
              return <li key={index}>{dept ? dept.name : 'Unknown Department'}</li>;
            })}
          </ul>
          <div className="mt-4 text-right">
            <button onClick={() => setViewDepartments([])} className="bg-gray-500 text-white px-3 py-1 rounded">Close</button>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Edit Modal */}
      {/* Edit Job Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Edit Job</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} className="space-y-4">

            {/* Job Type */}
            <div>
              <label className="block font-medium">Job Type</label>
              <input
                type="text"
                value={formData.type || ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            {/* Passing Year */}
            <div>
              <label className="block font-medium">Passing Year</label>
              <input
                type="text"
                value={formData.passingYear || ''}
                onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
                className="w-full border px-2 py-1 rounded"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block font-medium">Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border px-2 py-1 rounded"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block font-medium">Company</label>
              <input
                type="text"
                value={formData.company || ''}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full border px-2 py-1 rounded"
              />
            </div>

            {/* job title */}
            <div>
              <label className="block font-medium">Job Title</label>
              <input
                type="text"
                value={formData.jobTitle || ''}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full border px-2 py-1 rounded"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border px-2 py-1 rounded min-h-[100px]"
              />
            </div>

            {/* Departments with Checkbox Dropdown */}
            {/* Colleges */}
            <div>
              <label className="block font-medium">Colleges</label>
              <Multiselect
                options={colleges}
                selectedValues={colleges.filter(college => formData.colleges?.includes(college._id))}
                onSelect={(selectedList) => {
                  const selectedIds = selectedList?.map(item => item._id);
                  setFormData({ ...formData, colleges: selectedIds });
                }}
                onRemove={(selectedList) => {
                  const selectedIds = selectedList?.map(item => item._id);
                  setFormData({ ...formData, colleges: selectedIds });
                }}
                displayValue="name"
                showCheckbox
                placeholder="Select Colleges"
              />
            </div>

            {/* Departments */}
            <div>
              <label className="block font-medium">Departments</label>
              <Multiselect
                options={departments}
                selectedValues={departments.filter(dept => formData.departments?.includes(dept._id))}
                onSelect={(selectedList) => {
                  const selectedIds = selectedList?.map(item => item._id);
                  setFormData({ ...formData, departments: selectedIds });
                }}
                onRemove={(selectedList) => {
                  const selectedIds = selectedList?.map(item => item._id);
                  setFormData({ ...formData, departments: selectedIds });
                }}
                displayValue="name"
                showCheckbox
                placeholder="Select Departments"
              />
            </div>

            {/* Programs */}
            <div>
              <label className="block font-medium">Programs</label>
              <Multiselect
                options={programs}
                selectedValues={programs.filter(prog => formData.programs?.includes(prog._id))}
                onSelect={(selectedList) => {
                  const selectedIds = selectedList?.map(item => item._id);
                  setFormData({ ...formData, programs: selectedIds });
                }}
                onRemove={(selectedList) => {
                  const selectedIds = selectedList?.map(item => item._id);
                  setFormData({ ...formData, programs: selectedIds });
                }}
                displayValue="name"
                showCheckbox
                placeholder="Select Programs"
              />
            </div>




            {/* Minimum Percentage */}
            <div>
              <label className="block font-medium">Min Percentage</label>
              <input
                type="number"
                value={formData.minPercentage || ''}
                onChange={(e) => setFormData({ ...formData, minPercentage: e.target.value })}
                className="w-full border px-2 py-1 rounded"
              />
            </div>

            {/* Link to Apply */}
            <div>
              <label className="block font-medium">Link to Apply</label>
              <input
                type="url"
                value={formData.linkToApply || ''}
                onChange={(e) => setFormData({ ...formData, linkToApply: e.target.value })}
                className="w-full border px-2 py-1 rounded"
                placeholder="Enter application link"
              />
            </div>

            {/* Link to PDF */}
            <div>
              <label className="block font-medium">Link to PDF</label>
              <input
                type="url"
                value={formData.linkToPdf || ''}
                onChange={(e) => setFormData({ ...formData, linkToPdf: e.target.value })}
                className="w-full border px-2 py-1 rounded"
                placeholder="Enter PDF link"
              />
            </div>

            {/* Closing Date */}
            <div>
              <label className="block font-medium">Closing Date</label>
              <input
                type="datetime-local"
                value={
                  formData.closingDate
                    ? new Date(formData.closingDate).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) => setFormData({ ...formData, closingDate: new Date(e.target.value) })}
                className="w-full border px-2 py-1 rounded"
              />
            </div>

            {/* Save Button */}
            {/* Save and Cancel Buttons */}
            <div className="text-right space-x-2">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}  // Close modal without saving
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>

          </form>
        </Dialog.Panel>
      </Dialog>

      {/* View Programs Modal */}
<Dialog
  open={viewPrograms.length > 2}
  onClose={() => setViewPrograms([])}
  className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50"
>
  <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl max-h-[80vh] overflow-y-auto">
    <h2 className="text-lg font-bold mb-4">Programs</h2>
    <ul className="list-decimal list-inside space-y-1 text-sm">
      {viewPrograms.map((id, idx) => {
        const prog = programs.find((p) => p._id === id);
        return <li key={idx}>{prog ? prog.name : "Unknown Program"}</li>;
      })}
    </ul>
    <div className="mt-4 text-right">
      <button
        onClick={() => setViewPrograms([])}
        className="bg-gray-500 text-white px-3 py-1 rounded"
      >
        Close
      </button>
    </div>
  </Dialog.Panel>
</Dialog>



      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
          <p>Are you sure you want to delete the job titled <strong>{modalJob?.title}</strong>?</p>
          <div className="mt-4 text-right space-x-2">
            <button onClick={() => setDeleteModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );

};
export default JobManager;


