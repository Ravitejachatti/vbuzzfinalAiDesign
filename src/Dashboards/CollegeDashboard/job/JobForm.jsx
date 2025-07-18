import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import { useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch,useSelector } from "react-redux"; 
import { addjob } from "../../../Redux/Jobslice";


const JobForm = () => {
  const { universityName } = useParams();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("University authToken");
  const dispatch=useDispatch() 
  const {jobs,loading} = useSelector(state=>state.jobs)
  const [formData, setFormData] = useState({
    passingYear: "",
    colleges: [],
    departments: [],
    programs: [],
    title: "",
    company: "",
    ctc: "",
    role: "",
    type: "",
    location: "",
    description: "",
    minPercentage: "",
    linkToApply: "",
    linkToPdf: "",
    closingDate: new Date(),
  });

   const colleges = useSelector((state) => state.colleges.colleges) || [];
    const departments = useSelector((state) => state.department.departments) || [];
    const programs = useSelector((state) => state.programs.programs) || [];
    const students = useSelector((state) => state.students.students) || [];

  const [showPreview, setShowPreview] = useState(false);

  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({ colleges: false, departments: false, programs: false });

  // Whenever departments change, recompute the allowed programs
  useEffect(() => {
    setFilteredPrograms(
      programs.filter((p) => formData.departments.includes(p.department._id || p.department))
    );
  }, [formData.departments, programs]);



  const toggleDropdown = (key) => {
    setDropdownOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSelectAll = (key, items) => {
    const allSelected = formData[key].length === items.length;
    const newSelection = allSelected ? [] : items.map((item) => item._id);
    setFormData({ ...formData, [key]: newSelection });
  };

  const handleSelectionChange = (id, key) => {
    const updatedList = formData[key].includes(id)
      ? formData[key].filter((item) => item !== id)
      : [...formData[key], id];
    setFormData({ ...formData, [key]: updatedList });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handlePreview = () => {
    setShowPreview(!showPreview);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(addjob({token,formData,universityName}))
      alert("Job added successfully!", "success");  
      setFormData({
        title: "",
        company: "",
        ctc: "",
        role: "",
        type: "",
        location: "",
        description: "",
        colleges: [],
        departments: [],
        programs: [],
        passingYear: "",
        minPercentage: "",
        linkToApply: "",
        linkToPdf: "",
        closingDate: new Date(),
      });
      setShowPreview(false);
    } catch (err) {
      console.error("Error adding job:", err);
      alert("Error adding job. Please try again.");
    }
  };

  return (
    <div className="mx-auto p-2  bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">Add job</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-2">

        {/* College, Department, Program */}
        <div className="grid grid-cols-3 gap-5">
            {/* Job Type */}
          <div>
            <label className="block font-semibold text-gray-700">Job Type(Internship/Full Time)</label>
            <input
              type="text"
              placeholder="Job Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="p-2 w-full border rounded"
            />
          </div>
         <div >
            <label className="block font-semibold text-gray-700">Colleges</label>
            <div
              onClick={() => toggleDropdown("colleges")}
              className="p-2 border rounded bg-white cursor-pointer"
            >
              {formData.colleges.length
                ? `${formData.colleges.length} selected`
                : "Select colleges"}
            </div>
            {dropdownOpen.colleges && (
              <div className="absolute z-10 bg-white border rounded shadow-md w-full max-h-40 overflow-y-auto">
                <label className="flex items-center p-2 bg-gray-100">
                  <input
                    type="checkbox"
                    onChange={() => toggleSelectAll("colleges", colleges)}
                  />
                  <span className="ml-2">Select All</span>
                </label>
                {colleges.map((c) => (
                  <label key={c._id} className="flex items-center p-2 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.colleges.includes(c._id)}
                      onChange={() => handleSelectionChange(c._id, "colleges")}
                    />
                    <span className="ml-2">{c.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Departments */}
          <div className="relative">
            <label className="block font-semibold text-gray-700">Departments</label>
            <div
              onClick={() => toggleDropdown("departments")}
              className="p-2 border rounded bg-white cursor-pointer"
            >
              {formData.departments.length
                ? `${formData.departments.length} selected`
                : "Select departments"}
            </div>
            {dropdownOpen.departments && (
              <div className="absolute z-10 bg-white border rounded shadow-md w-full max-h-40 overflow-y-auto">
                <label className="flex items-center p-2 bg-gray-100">
                  <input
                    type="checkbox"
                    onChange={() => toggleSelectAll("departments", departments)}
                  />
                  <span className="ml-2">Select All</span>
                </label>
                {departments.map((d) => (
                  <label key={d._id} className="flex items-center p-2 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.departments.includes(d._id)}
                      onChange={() => handleSelectionChange(d._id, "departments")}
                    />
                    <span className="ml-2">{d.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Passing Year */}
          <div>
            <label className="block font-semibold text-gray-700">Passing Year</label>
            <input
              name="passingYear"
              type="number"
              value={formData.passingYear}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
      

        {/* Programs (filtered) */}
        <div >
          <label className="block font-semibold text-gray-700">Programs</label>
          <div
            onClick={() => toggleDropdown("programs")}
            className="p-2 border rounded bg-white cursor-pointer"
          >
            {formData.programs.length
              ? `${formData.programs.length} selected`
              : "Select programs"}
          </div>
          {dropdownOpen.programs && (
            <div className="absolute z-10 bg-white border rounded shadow-md w-full max-h-40 overflow-y-auto">
              <label className="flex items-center p-2 bg-gray-100">
                <input
                  type="checkbox"
                  onChange={() => toggleSelectAll("programs", filteredPrograms)}
                />
                <span className="ml-2">Select All</span>
              </label>
              {filteredPrograms.map((p) => (
                <label key={p._id} className="flex items-center p-2 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.programs.includes(p._id)}
                    onChange={() => handleSelectionChange(p._id, "programs")}
                  />
                  <span className="ml-2">{p.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>


          {/* Company */}
          <div>
            <label className="block font-semibold text-gray-700">Company</label>
            <input
              type="text"
              placeholder="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="p-2 w-full border rounded"
              required
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="block font-semibold text-gray-700">Job Title</label>
            <input
              type="text"
              placeholder="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="p-2 w-full border rounded"
              required
            />
          </div>

          {/* Role */}
          <div className="col-span-2">
            <label className="block font-semibold text-gray-700">Role</label>
            <textarea
              type="text"
              placeholder="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="p-2 w-full border rounded"
            />
          </div>
          <div className="col-span-3">
          <label className="block font-semibold text-gray-700">Descriptions</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="p-2 w-full border rounded" rows="" ></textarea>
        </div>


          {/* Location */}
          <div>
            <label className="block font-semibold text-gray-700">Location</label>
            <input
              type="text"
              placeholder="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="p-2 w-full border rounded"
            />
          </div>

          {/* CTC */}
          <div>
            <label className="block font-semibold text-gray-700">CTC (LPA)</label>
            <input
              type="text"
              placeholder="CTC"
              name="ctc"
              value={formData.ctc}
              onChange={handleChange}
              className="p-2 w-full border rounded"
              required
            />
          </div>

          {/* Minimum Percentage */}
          <div>
            <label className="block font-semibold text-gray-700">Minimum Percentage</label>
            <input
              type="number"
              placeholder="Min Percentage"
              name="minPercentage"
              value={formData.minPercentage}
              onChange={handleChange}
              className="p-2 w-full border rounded"

            />
          </div>

          {/* Link to Apply */}
          <div>
            <label className="block font-semibold text-gray-700">Link to Apply(optional)</label>
            <input
              type="url"
              placeholder="Link to Apply"
              name="linkToApply"
              value={formData.linkToApply}
              onChange={handleChange}
              className="p-2 w-full border rounded"
            />
          </div>

          {/* Link to PDF */}
          <div>
            <label className="block font-semibold text-gray-700">Link to PDF(optional)</label>
            <input
              type="url"
              placeholder="Link to PDF"
              name="linkToPdf"
              value={formData.linkToPdf}
              onChange={handleChange}
              className="p-2 w-full border rounded"
            />
          </div>


          {/* Description */}


          {/* Closing Date */}
          <div>
            <label className="block font-semibold text-gray-700">Closing Date</label>
            <DatePicker selected={formData.closingDate} onChange={(date) => setFormData({ ...formData, closingDate: date })} className="p-2 w-full border rounded" />
          </div>


        </div>
       
        {/* Action Buttons */}
        <div className="mt-4 flex justify-between">
          <button type="button" onClick={handlePreview} className="bg-gray-500 text-white px-4 py-2 rounded">Preview</button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Job</button>
        </div>
      </form>

      {/* preview of the form */}
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Job Preview</h3>
            <div className="space-y-2">
              <p><strong>Title:</strong> {formData.title}</p>
              <p><strong>Company:</strong> {formData.company}</p>
              <p><strong>CTC:</strong> {formData.ctc} LPA</p>
              <pre><strong>Role:</strong> {formData.role}</pre>
              <p><strong>Type:</strong> {formData.type}</p>
              <p><strong>Location:</strong> {formData.location}</p>
              <p><strong>Min Percentage:</strong> {formData.minPercentage}%</p>
              <p><strong>Link to Apply:</strong> {formData.linkToApply}</p>
              <p><strong>Link to PDF:</strong> {formData.linkToPdf}</p>
              <p><strong>Closing Date:</strong> {formData.closingDate.toLocaleDateString()}</p>
              <pre><strong>Description:</strong> {formData.description}</pre>
              <p><strong>Passing Year:</strong> {formData.passingYear}</p>

              {/* College, Department, Program Preview */}
              <p><strong>Colleges:</strong> {colleges.filter(college => formData.colleges.includes(college._id)).map(college => college.name).join(", ")}</p>
              <p><strong>Departments:</strong> {departments.filter(dept => formData.departments.includes(dept._id)).map(dept => dept.name).join(", ")}</p>
              <p><strong>Programs:</strong> {filteredPrograms.filter(prog => formData.programs.includes(prog._id)).map(prog => prog.name).join(", ")}</p>
            </div>
            <div className="mt-4 text-right">
              <button onClick={handlePreview} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">Close Preview</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobForm;


