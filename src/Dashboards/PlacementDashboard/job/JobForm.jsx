import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import { useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux"; 
import { addjob } from "../../../Redux/Jobslice";
import { 
  Briefcase, 
  Building, 
  MapPin, 
  DollarSign, 
  Calendar, 
  FileText, 
  Users,
  Eye,
  Plus
} from "lucide-react";

const JobForm = ({ onJobAdded, colleges, programs }) => {
  const { universityName } = useParams();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("University authToken");
  const dispatch = useDispatch(); 
  const { jobs, loading } = useSelector(state => state.jobs);

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

  const [showPreview, setShowPreview] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({ 
    colleges: false, 
    departments: false, 
    programs: false 
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/department/getAllDepartments?universityName=${encodeURIComponent(universityName)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDepartments(response.data);
      } catch (err) {
        console.error("Error fetching departments:", err);
        alert("Failed to fetch departments.");
      }
    };

    fetchDepartments();
  }, [universityName]);

  useEffect(() => {
    const filtered = programs.filter((program) =>
      formData.departments.includes(program.department)
    );
    setFilteredPrograms(filtered);
  }, [formData.departments, programs]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (!formData.ctc.trim()) newErrors.ctc = "CTC is required";
    if (!formData.type.trim()) newErrors.type = "Job type is required";
    if (formData.colleges.length === 0) newErrors.colleges = "At least one college must be selected";
    if (formData.departments.length === 0) newErrors.departments = "At least one department must be selected";
    if (formData.programs.length === 0) newErrors.programs = "At least one program must be selected";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    
    // Clear error when user makes selection
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      dispatch(addjob({ token, formData, universityName }));
      
      onJobAdded();
      alert("Job added successfully!");
      
      // Reset form
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
      setErrors({});
    } catch (err) {
      console.error("Error adding job:", err);
      alert("Error adding job. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add New Job</h2>
              <p className="text-sm text-gray-600">
                Create a new job posting for students
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-1" />
                Job Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.type ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select job type</option>
                <option value="Full Time">Full Time</option>
                <option value="Internship">Internship</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Company *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.company ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter job title"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter job location"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* CTC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                CTC (LPA) *
              </label>
              <input
                type="text"
                name="ctc"
                value={formData.ctc}
                onChange={handleChange}
                placeholder="Enter CTC"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.ctc ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.ctc && <p className="mt-1 text-sm text-red-600">{errors.ctc}</p>}
            </div>

            {/* Minimum Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Percentage
              </label>
              <input
                type="number"
                name="minPercentage"
                value={formData.minPercentage}
                onChange={handleChange}
                placeholder="Enter minimum percentage"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Passing Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Passing Year
              </label>
              <input
                type="number"
                name="passingYear"
                value={formData.passingYear}
                onChange={handleChange}
                placeholder="Enter passing year"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Closing Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Closing Date
              </label>
              <DatePicker
                selected={formData.closingDate}
                onChange={(date) => setFormData({ ...formData, closingDate: date })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
              />
            </div>

            {/* Multi-select dropdowns */}
            {["colleges", "departments", "programs"].map((key) => (
              <div key={key} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  {key.charAt(0).toUpperCase() + key.slice(1)} *
                </label>
                <div 
                  onClick={() => toggleDropdown(key)} 
                  className={`w-full px-3 py-2 border rounded-lg bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors[key] ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  {formData[key].length ? `${formData[key].length} selected` : `Select ${key}`}
                </div>
                {errors[key] && <p className="mt-1 text-sm text-red-600">{errors[key]}</p>}
                
                {dropdownOpen[key] && (
                  <div className="absolute z-10 bg-white border rounded-lg shadow-lg w-full max-h-40 overflow-y-auto mt-1">
                    <label className="flex items-center p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer">
                      <input 
                        type="checkbox" 
                        onChange={() => toggleSelectAll(key, key === "colleges" ? colleges : key === "departments" ? departments : filteredPrograms)} 
                        className="mr-2"
                      />
                      Select All
                    </label>
                    {(key === "colleges" ? colleges : key === "departments" ? departments : filteredPrograms).map((item) => (
                      <label key={item._id} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData[key].includes(item._id)} 
                          onChange={() => handleSelectionChange(item._id, key)} 
                          className="mr-2"
                        />
                        {item.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Role */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Role
              </label>
              <textarea
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Enter job role details"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Link
              </label>
              <input
                type="url"
                name="linkToApply"
                value={formData.linkToApply}
                onChange={handleChange}
                placeholder="Enter application link"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF Link
              </label>
              <input
                type="url"
                name="linkToPdf"
                value={formData.linkToPdf}
                onChange={handleChange}
                placeholder="Enter PDF link"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter detailed job description"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button 
              type="button" 
              onClick={handlePreview} 
              className="flex items-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding Job...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Job Preview</h3>
                <button
                  onClick={handlePreview}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Job Title</p>
                    <p className="text-lg font-semibold">{formData.title || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Company</p>
                    <p className="text-lg font-semibold">{formData.company || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">CTC</p>
                    <p className="text-lg font-semibold">{formData.ctc ? `${formData.ctc} LPA` : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Job Type</p>
                    <p className="text-lg font-semibold">{formData.type || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Location</p>
                    <p className="text-lg font-semibold">{formData.location || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Closing Date</p>
                    <p className="text-lg font-semibold">{formData.closingDate.toLocaleDateString()}</p>
                  </div>
                </div>

                {formData.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Description</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{formData.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Colleges</p>
                    <p className="text-sm text-gray-800">
                      {colleges.filter(college => formData.colleges.includes(college._id)).map(college => college.name).join(", ") || "None selected"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Departments</p>
                    <p className="text-sm text-gray-800">
                      {departments.filter(dept => formData.departments.includes(dept._id)).map(dept => dept.name).join(", ") || "None selected"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Programs</p>
                    <p className="text-sm text-gray-800">
                      {filteredPrograms.filter(prog => formData.programs.includes(prog._id)).map(prog => prog.name).join(", ") || "None selected"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={handlePreview}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobForm;