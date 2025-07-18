import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { 
  Search, Filter, Building2, CheckCircle, XCircle, AlertCircle, Briefcase, 
  TrendingUp, Eye, ExternalLink, Calendar, Users 
} from 'lucide-react';
import {
  fetchJobs,
  applyToJob,
  clearApplyStatus,
} from "../../../Redux/StudentDashboard/jobSlice";

const JobOpportunities = () => {
  const { universityName } = useParams();
  const dispatch = useDispatch();

  const {
    jobs,
    loading: jobsLoading,
    error: jobsError,
    applyingJobIds,
    applyError,
    applySuccessMessage,
  } = useSelector((state) => state.job);

  const studentLoading = useSelector((state) => state.student.loading);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedJobDescription, setSelectedJobDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("");

  useEffect(() => {
    if (universityName) {
      dispatch(fetchJobs({ universityName }));
    }
  }, [dispatch, universityName]);

  useEffect(() => {
    if (applyError) {
      alert(applyError);
      dispatch(clearApplyStatus());
    } else if (applySuccessMessage) {
      alert(applySuccessMessage);
      dispatch(clearApplyStatus());
    }
  }, [applyError, applySuccessMessage, dispatch]);

  const openLinkInNewTab = (url) => window.open(url, "_blank");

  const handleViewDescription = (description) => {
    setSelectedJobDescription(description);
    setViewModalOpen(true);
  };

  const handleApply = (job) => {
    if (job.status === "Closed" || applyingJobIds.includes(job._id)) return;
    dispatch(applyToJob({ jobId: job._id, universityName }));
  };

  const uniqueCompanies = [...new Set(jobs.map(job => job.company))];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = searchTerm
      ? (job.title + job.company + job.description)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;

    const matchesStatus = statusFilter === "all"
      ? true
      : job.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesCompany = companyFilter
      ? job.company.toLowerCase().includes(companyFilter.toLowerCase())
      : true;

    return matchesSearch && matchesStatus && matchesCompany;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'closed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  if (studentLoading || jobsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading job opportunities...</p>
        </div>
      </div>
    );
  }

  if (jobsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg font-medium">{jobsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <Briefcase className="w-8 h-8 text-blue-600 mr-3" />
              Job Opportunities
            </h2>
            <p className="text-gray-600 mt-2">Discover exciting career opportunities tailored for you</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{filteredJobs.length}</div>
              <div className="text-sm opacity-90">Available Jobs</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Companies</option>
                {uniqueCompanies.map((company, index) => (
                  <option key={index} value={company}>{company}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job, index) => {
            const isApplying = applyingJobIds.includes(job._id);
            return (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {index + 1}. {job.title}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Building2 className="w-4 h-4 mr-2" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                    </div>
                    <div className={`flex items-center px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                      <span className="ml-1">{job.status}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">Min. {job.minPercentage}% required</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        Closes: {new Date(job.closingDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {job.description.length > 120 
                      ? `${job.description.substring(0, 120)}...` 
                      : job.description
                    }
                    {job.description.length > 120 && (
                      <button
                        onClick={() => handleViewDescription(job.description)}
                        className="text-blue-600 hover:text-blue-800 ml-2 font-medium inline-flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Full
                      </button>
                    )}
                  </p>

                  <div className="flex space-x-3">
                    {job.linkToPdf && (
                      <button
                        onClick={() => openLinkInNewTab(job.linkToPdf)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                    )}

                    <button
                      onClick={() => handleApply(job)}
                      disabled={isApplying || job.status === "Closed"}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium flex items-center justify-center ${
                        isApplying
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : job.status === "Closed"
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                      }`}
                    >
                      {isApplying ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Applying...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Apply Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Briefcase className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Jobs Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== "all" || companyFilter
              ? "Try adjusting your search criteria."
              : "No job opportunities are available at the moment."}
          </p>
          {(searchTerm || statusFilter !== "all" || companyFilter) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setCompanyFilter("");
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Modal */}
<Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} className="relative z-50">
  <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <Dialog.Panel className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto p-6">
      <Dialog.Title className="text-xl font-bold mb-4">Job Description</Dialog.Title>
      <pre className="whitespace-pre-wrap text-gray-800">{selectedJobDescription}</pre>
      <div className="text-right mt-4">
        <button
          onClick={() => setViewModalOpen(false)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </Dialog.Panel>
  </div>
</Dialog>
    </div>
  );
};

export default JobOpportunities;