import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, deleteJob, updateJob } from "../../../Redux/Jobslice";
import Multiselect from "multiselect-react-dropdown";
import { 
  Briefcase, 
  Building, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  Filter, 
  Search,
  X,
  Save,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const JobManager = ({ colleges, departments, programs }) => {
  const { universityName } = useParams();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("University authToken");

  const [filteredJobs, setFilteredJobs] = useState([]);
  const [modalJob, setModalJob] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewDepartments, setViewDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  
  // Filter states
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [dropdownOpen, setDropdownOpen] = useState({
    year: false,
    type: false,
    college: false,
    department: false,
    program: false
  });

  const dispatch = useDispatch();
  const { jobs, loading } = useSelector(state => state.jobs);

  const fetchjobs = async () => {
    const result = await dispatch(fetchJobs({ token, universityName }));
    if (result.meta.requestStatus === "fulfilled") {
      setFilteredJobs(jobs);
    }
  };

  useEffect(() => {
    fetchjobs();
  }, [universityName]);

  useEffect(() => {
    setFilteredJobs(jobs);
  }, [jobs]);

  const uniqueYears = jobs?.length ? [...new Set(jobs?.map(job => job.passingYear))] : [];
  const uniqueTypes = jobs?.length ? [...new Set(jobs?.map(job => job.type))] : [];

  const handleFilterChange = () => {
    const filtered = jobs.filter((job) => {
      const matchesSearch = !searchTerm || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      return (
        matchesSearch &&
        (selectedYears?.length === 0 || selectedYears.includes(job.passingYear)) &&
        (selectedTypes?.length === 0 || selectedTypes.includes(job.type)) &&
        (selectedColleges?.length === 0 || selectedColleges.some((college) => job.colleges.includes(college))) &&
        (selectedDepartments?.length === 0 || selectedDepartments.some((dept) => job.departments.includes(dept))) &&
        (selectedPrograms?.length === 0 || selectedPrograms.some((program) => job.programs.includes(program)))
      );
    });
    setFilteredJobs(filtered);
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedYears, selectedTypes, selectedColleges, selectedDepartments, selectedPrograms, searchTerm, jobs]);

  const handleEdit = async () => {
    try {
      const jobId = modalJob._id;
      dispatch(updateJob({ token, formData, jobId, universityName }));
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating Job:", error);
    }
  };

  const handleDelete = async () => {
    if (!modalJob || !modalJob._id) return;
    const jobId = modalJob._id;
    dispatch(deleteJob({ token, jobId, universityName }));
    setDeleteModalOpen(false);
  };

  const getShortDepartmentNames = (deptIds) => {
    return deptIds
      .slice(0, 2)
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isJobExpired = (closingDate) => {
    return new Date(closingDate) < new Date();
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Job Management</h1>
            <p className="text-blue-100 text-lg">Manage and monitor all job postings</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{filteredJobs.length}</div>
            <div className="text-blue-200 text-sm">Total Jobs</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Filters & Search</h2>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { 
              label: "Passing Year", 
              options: uniqueYears, 
              selected: selectedYears, 
              handler: setSelectedYears, 
              key: "year",
              icon: Calendar
            },
            { 
              label: "Job Type", 
              options: uniqueTypes, 
              selected: selectedTypes, 
              handler: setSelectedTypes, 
              key: "type",
              icon: Briefcase
            },
            { 
              label: "College", 
              options: colleges?.map(c => c.name), 
              selected: selectedColleges, 
              handler: setSelectedColleges, 
              key: "college",
              icon: Building
            },
            { 
              label: "Department", 
              options: departments?.map(d => d.name), 
              selected: selectedDepartments, 
              handler: setSelectedDepartments, 
              key: "department",
              icon: Building
            },
            { 
              label: "Program", 
              options: programs?.map(p => p.name), 
              selected: selectedPrograms, 
              handler: setSelectedPrograms, 
              key: "program",
              icon: Building
            },
          ]?.map(({ label, options, selected, handler, key, icon: Icon }) => (
            <div className="relative" key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Icon className="w-4 h-4 inline mr-1" />
                {label}
              </label>
              <div
                onClick={() => setDropdownOpen((prev) => ({ ...prev, [key]: !prev[key] }))}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400 transition-colors"
              >
                {selected?.length ? `${selected?.length} selected` : `Select ${label}`}
              </div>
              {dropdownOpen[key] && (
                <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg w-full max-h-40 overflow-y-auto mt-1">
                  <label className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer border-b">
                    <input
                      type="checkbox"
                      checked={selected?.length === options?.length}
                      onChange={() => {
                        if (selected?.length === options?.length) {
                          handler([]);
                        } else {
                          handler([...options]);
                        }
                      }}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium">Select All</span>
                  </label>
                  {options?.map((option) => (
                    <label key={option} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selected.includes(option)}
                        onChange={() => {
                          if (selected.includes(option)) {
                            handler(selected.filter((item) => item !== option));
                          } else {
                            handler([...selected, option]);
                          }
                        }}
                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Job Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{job.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Building className="w-4 h-4 mr-2" />
                      <span className="font-medium">{job.company}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{job.location || "Not specified"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                      {job.status || 'Active'}
                    </span>
                    {isJobExpired(job.closingDate) && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-full">
                        <Clock className="w-3 h-3 mr-1" />
                        Expired
                      </span>
                    )}
                  </div>
                </div>

                {/* Job Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                    <span className="font-medium">{job.ctc} LPA</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                    <span>{new Date(job.closingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-orange-600" />
                    <span>{job.applications?.length || 0} applicants</span>
                  </div>
                </div>

                {/* Departments Preview */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Departments:</span>
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {job?.departments?.slice(0, 2).map((deptId) => {
                      const dept = departments.find((d) => d._id === deptId);
                      return dept ? (
                        <span key={deptId} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {dept.name}
                        </span>
                      ) : null;
                    })}
                    {job?.departments?.length > 2 && (
                      <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        +{job.departments.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50 flex justify-between items-center">
                <button
                  onClick={() => {
                    setModalJob(job);
                    setViewModalOpen(true);
                  }}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">View</span>
                </button>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setModalJob(job);
                      setFormData({ ...job });
                      setEditModalOpen(true);
                    }}
                    className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    <span className="text-sm">Edit</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setModalJob(job);
                      setDeleteModalOpen(true);
                    }}
                    className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    <span className="text-sm">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          </div>
        )}
      </div>

      {/* View Description Modal */}
      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <Dialog.Title className="text-2xl font-bold">{modalJob?.title}</Dialog.Title>
                  <p className="text-blue-100">{modalJob?.company}</p>
                </div>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Job Description</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{modalJob?.description || "No description available"}</p>
                </div>
                
                {modalJob?.role && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Role Details</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{modalJob.role}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-xl font-semibold">Edit Job</Dialog.Title>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <input
                    type="text"
                    value={formData.type || ''}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passing Year</label>
                  <input
                    type="text"
                    value={formData.passingYear || ''}
                    onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTC (LPA)</label>
                  <input
                    type="text"
                    value={formData.ctc || ''}
                    onChange={(e) => setFormData({ ...formData, ctc: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Colleges</label>
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
                    className="rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departments</label>
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
                    className="rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Programs</label>
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
                    className="rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Closing Date</label>
                  <input
                    type="datetime-local"
                    value={
                      formData.closingDate
                        ? new Date(formData.closingDate).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) => setFormData({ ...formData, closingDate: new Date(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            
            <div className="text-center">
              <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
                Delete Job
              </Dialog.Title>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the job <strong>"{modalJob?.title}"</strong>? This action cannot be undone.
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Job
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default JobManager;