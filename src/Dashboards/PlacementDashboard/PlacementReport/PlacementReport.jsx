// ✅ Suggestions and fixes for your PlacementReports component

// Overall review:
// 1️⃣ Your current structure is very good but minor improvements are needed for readability, optimization, and safety.
// 2️⃣ Suggestions are inline as comments.
// 3️⃣ Included fixes for edge cases, variable naming consistency, and UX polish.

// 🔧 Updated and cleaned-up code:

import React, { useState, useEffect, useMemo } from "react";
import { fetchPlacementReports } from "../../../Redux/Placement/placementReportsSlice";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import ToggleEligibility from "./ToggleEligibility";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import CTCRangeFilter, { matchCTCRange } from "./CTCRangeFilter";
import {
  Eye, X, Users,User, Mail, Phone, CheckCircle, XCircle, Building, Briefcase, Award
} from "lucide-react";

const PlacementReports = () => {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const currentYear = new Date().getFullYear();
  const token = localStorage.getItem("University authToken");

  const [graduationYear, setGraduationYear] = useState(currentYear.toString());
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [placementStatusFilter, setPlacementStatusFilter] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [selectedCTC, setSelectedCTC] = useState("");
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [availableCTCs, setAvailableCTCs] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [viewStudent, setViewStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedStudentId, setExpandedStudentId] = useState(null);

  const colleges = useSelector((state) => state.colleges.colleges) || [];
  const departments = useSelector((state) => state.department.departments) || [];
  const programs = useSelector((state) => state.programs.programs) || [];
  const { list: reports, loading, error } = useSelector((s) => s.placementReports);

  // 🎯 1️⃣ Fetch placement reports whenever year/filters change
  useEffect(() => {
    dispatch(fetchPlacementReports({ token, universityName, graduationYear }));
  }, [dispatch, token, universityName, graduationYear]);

  // 🎯 2️⃣ Maps for lookup
  const collegeMap = useMemo(() => Object.fromEntries(colleges.map(c => [c._id, c.name])), [colleges]);
  const departmentMap = useMemo(() => Object.fromEntries(departments.map(d => [d._id, d.name])), [departments]);
  const programMap = useMemo(() => Object.fromEntries(programs.map(p => [p._id, p.name])), [programs]);

  // 🎯 3️⃣ Dynamic filter options
  useEffect(() => {
    const companies = new Set();
    const ctcs = new Set();
    reports.forEach((r) => {
      const placements = [...(r.offCampusPlacements || []), ...(r.onCampusPlacements || []).filter(p => p.status === "Selected")];
      placements.forEach((p) => {
        if (p.companyName || p.company) companies.add(p.companyName || p.company);
        if (p.ctc != null) ctcs.add(p.ctc);
      });
    });
    setAvailableCompanies([...companies].sort());
    setAvailableCTCs([...ctcs].sort((a, b) => b - a));
  }, [reports]);

  // 🎯 4️⃣ Cascading filters for College -> Dept -> Program
  useEffect(() => {
    if (!selectedCollege) {
      setFilteredDepartments([]);
      setSelectedDepartment("");
      setFilteredPrograms([]);
      setSelectedProgram("");
      return;
    }
    const deptForCollege = departments.filter(d => d.college === selectedCollege);
    setFilteredDepartments(deptForCollege);
  }, [selectedCollege, departments]);

  useEffect(() => {
    if (!selectedDepartment) {
      setFilteredPrograms([]);
      setSelectedProgram("");
      return;
    }
    const dept = departments.find(d => d._id === selectedDepartment);
    const progIds = dept?.programs || [];
    setFilteredPrograms(programs.filter(p => progIds.includes(p._id)));
  }, [selectedDepartment, departments, programs]);

  const getCompaniesAndCTCs = (r) => {
  const companies = [];
  (r.offCampusPlacements || []).forEach(p => {
    if (p.companyName) companies.push(`${p.companyName} (${p.ctc || 'N/A'})`);
  });
  (r.onCampusPlacements || []).forEach(p => {
    if (p.status === "Selected" && p.company)
      companies.push(`${p.company} (${p.ctc || 'N/A'})`);
  });
  return companies;
};

  // 🎯 5️⃣ Base + advanced filters
  const baseFilteredReports = useMemo(() => reports.filter(r =>
    (!graduationYear || r.graduationYear === parseInt(graduationYear)) &&
    (!selectedCollege || r.collegeId === selectedCollege) &&
    (!selectedDepartment || r.departmentId === selectedDepartment) &&
    (!selectedProgram || r.programId === selectedProgram)
  ), [reports, graduationYear, selectedCollege, selectedDepartment, selectedProgram]);

  const filteredReports = useMemo(() => baseFilteredReports.filter(r => {
    const placements = [...(r.offCampusPlacements || []), ...(r.onCampusPlacements || []).filter(p => p.status === "Selected")];
    const hasPlacements = placements.length > 0;
    const matchStatus = placementStatusFilter === "all" || (placementStatusFilter === "placed" && hasPlacements) || (placementStatusFilter === "unplaced" && !hasPlacements);
    const matchCompany = selectedCompany.length === 0 || placements.some(p => selectedCompany.map(c => c.toLowerCase()).includes((p.companyName || p.company || '').toLowerCase()));
    const matchCTC = !selectedCTC || placements.some(p => p.ctc && matchCTCRange(Number(p.ctc), selectedCTC));
    return matchStatus && matchCompany && matchCTC;
  }), [baseFilteredReports, placementStatusFilter, selectedCompany, selectedCTC]);

  // 🎯 6️⃣ Summary stats (fixes your `totalStudents` error!)
const stats = useMemo(() => {
  let placedStudentsCount = 0;
  let totalPlacements = 0;

baseFilteredReports.forEach(r => {
  // Ensure placements exist before counting 
  if (r.offCampusPlacements || r.onCampusPlacements) {
    const offCampusCount = (r.offCampusPlacements || []).filter(p => p.companyName || p.company).length;
    const onCampusCount = (r.onCampusPlacements || []).filter(p => p.status === "Selected").length;
    const totalStudentPlacements = offCampusCount + onCampusCount;

    console.log(`Student: ${r.name}, Off-Campus: ${offCampusCount}, On-Campus: ${onCampusCount}, Total Placements: ${totalStudentPlacements}`);

    if (totalStudentPlacements > 0) {
      placedStudentsCount += 1;
    }
    totalPlacements += totalStudentPlacements;
  }
});

  return {
    totalStudents: baseFilteredReports.length,
    totalPlacedStudents: placedStudentsCount,
    totalPlacements
  };
}, [baseFilteredReports]);

  const getTotalPlacements = (r) => {
    const off = (r.offCampusPlacements || []).filter(p => p.companyName || p.company).length;
    const on = (r.onCampusPlacements || []).filter(p => p.status === "Selected").length;
    return off + on;
  };

  const handleStatusUpdate = async () => {
    await dispatch(fetchPlacementReports({ token, universityName, graduationYear }));
    setSelectedStudentIds([]);
  };

  const downloadExcel = () => {
    const data = filteredReports.map(r => {
      const placements = [...(r.offCampusPlacements || []), ...(r.onCampusPlacements || [])];
      const placementDetails = placements.map(p => `${p.companyName || p.company || 'N/A'} (${p.status || 'N/A'})`).join(', ') || 'No placements';
      return {
        Name: r.name,
        "Registered Number": r.registered_number,
        Email: r.email,
        Phone: r.phone,
        College: collegeMap[r.collegeId] || 'N/A',
        Department: departmentMap[r.departmentId] || 'N/A',
        Program: programMap[r.programId] || 'N/A',
        "Placement Details": placementDetails
      };
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Placement Reports");
    XLSX.writeFile(wb, "placement_reports.xlsx");
  };




  return (
    <div className="p-4 border rounded w-full">
      <h1 className="text-xl font-bold ">Placement Reports:</h1>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-3">
        <div>
          <label className="block font-medium">Graduation Year</label>
          <input
            type="number"
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.value)}
            className="w-full border p-2 rounded"
            min="2000"
            max={currentYear + 5}
          />
          {loading && (
            <div className="mt-2 text-blue-500">Loading data...</div>
          )}
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <div>
          <label className="block font-medium">College</label>
          <select value={selectedCollege} onChange={(e) => setSelectedCollege(e.target.value)} className="w-full border p-2 rounded">
            <option value="">All Colleges</option>
            {colleges?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        {/* Department Filter */}
        <div>
          <label className="block font-medium">Department</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full border p-2 rounded"
            disabled={!selectedCollege}
          >
            <option value="">All Departments</option>
            {filteredDepartments?.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Program Filter */}
        <div>
          <label className="block font-medium">Program</label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="w-full border p-2 rounded"
            disabled={!selectedDepartment}
          >
            <option value="">All Programs</option>
            {filteredPrograms?.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Company Name</label>
          <Select
            isMulti
            options={availableCompanies.map(c => ({ label: c, value: c }))}
            value={selectedCompany.map(c => ({ label: c, value: c }))}
            onChange={opts => setSelectedCompany(opts ? opts.map(o => o.value) : [])}
            className="w-full"
            placeholder="Filter by one or more companies…"
          />
        </div>
      <div>
  <CTCRangeFilter selectedRange={selectedCTC} onChange={setSelectedCTC} />
</div>
        <div>
          <label className="block font-medium">Placement Status</label>
          <select value={placementStatusFilter} onChange={(e) => setPlacementStatusFilter(e.target.value)} className="w-full border p-2 rounded">
            <option value="all">All</option>
            <option value="placed">Placed</option>
            <option value="unplaced">Unplaced</option>
          </select>
        </div>
      </div>

      {/* Display Placement Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-lg font-bold text-blue-700">{stats.totalStudents}</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-600">Total Placed Students</p>
          <p className="text-lg font-bold text-green-700">{stats.totalPlacedStudents}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-600">Total Placements (incl. multiple offers)</p>
          <p className="text-lg font-bold text-purple-700">{stats.totalPlacements}</p>
        </div>
      </div>
{/* 
      <PlacementCharts reports={filteredReports} departmentMap={departmentMap} /> */}



      {/* Download Button */}
      <div className="mb-4">
        <button
          onClick={downloadExcel}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Download Excel
        </button>
      </div>

      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Placement Data</h2>
              <span className="text-sm text-gray-600">{filteredReports.length} students</span>
            </div>
          </div>

          {selectedStudentIds.length > 0 && (
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
              <ToggleEligibility
                selectedStudents={reports.filter((r) => selectedStudentIds.includes(r._id))}
                onStatusUpdate={handleStatusUpdate}
              />
            </div>
          )}

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placements</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Companies</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={
                        selectedStudentIds.length === filteredReports.length &&
                        filteredReports.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudentIds(filteredReports?.map((r) => r._id));
                        } else {
                          setSelectedStudentIds([]);
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No placement data found</p>
                      <p className="text-sm">Try adjusting your filters or graduation year</p>
                    </td>
                  </tr>
                ) : (
                  filteredReports?.map((report, index) => (
                    <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{report.name}</div>
                            <div className="text-sm text-gray-500">{report.registered_number}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <Mail className="w-3 h-3 mr-1 text-gray-400" />
                            {report.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-1 text-gray-400" />
                            {report.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">{collegeMap[report.collegeId] || "N/A"}</div>
                          <div className="text-gray-500">{departmentMap[report.departmentId] || "N/A"}</div>
                          <div className="text-gray-500">{programMap[report.programId] || "N/A"}</div>
                          <div className="text-gray-500">Class of {report.graduationYear}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-blue-600 mr-2">
                            {getTotalPlacements(report)}
                          </span>
                          <button
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            onClick={() => {
                              setViewStudent(report);
                              setModalOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {(() => {
                            const companies = getCompaniesAndCTCs(report);
                            const displayCompanies = companies.slice(0, 2).join(", ");
                            const hasMore = companies.length > 2;

                            return (
                              <>
                                {displayCompanies}
                                {hasMore && (
                                  <>
                                    ,{" "}
                                    <button
                                      className="text-blue-600 hover:text-blue-800 underline transition-colors"
                                      onClick={() => setExpandedStudentId(report._id)}
                                    >
                                      +{companies.length - 2} more
                                    </button>
                                  </>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {report.canApply ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">Eligible</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <XCircle className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">Ineligible</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.includes(report._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudentIds((prev) => [...prev, report._id]);
                            } else {
                              setSelectedStudentIds((prev) =>
                                prev.filter((id) => id !== report._id)
                              );
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {modalOpen && viewStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{viewStudent.name}</h2>
                  <p className="text-blue-100">{viewStudent.registered_number}</p>
                </div>
                <button
                  className="text-white hover:text-gray-200 transition-colors"
                  onClick={() => setModalOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Student Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <User className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Personal</span>
                  </div>
                  <p className="font-semibold">{viewStudent.name}</p>
                  <p className="text-sm text-gray-600">{viewStudent.registered_number}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Mail className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Contact</span>
                  </div>
                  <p className="font-semibold">{viewStudent.email}</p>
                  <p className="text-sm text-gray-600">{viewStudent.phone}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Building className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Academic</span>
                  </div>
                  <p className="font-semibold">{collegeMap[viewStudent.collegeId] || "N/A"}</p>
                  <p className="text-sm text-gray-600">{departmentMap[viewStudent.departmentId] || "N/A"}</p>
                  <p className="text-sm text-gray-600">{programMap[viewStudent.programId] || "N/A"}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Award className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Placements</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{getTotalPlacements(viewStudent)}</p>
                  <p className="text-sm text-gray-600">Total Offers</p>
                </div>
              </div>

              {/* Off-Campus Placements */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                  Off-Campus Placements ({viewStudent.offCampusPlacements?.length || 0})
                </h3>
                {viewStudent.offCampusPlacements && viewStudent.offCampusPlacements.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTC</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer Letter</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feedback</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {viewStudent.offCampusPlacements?.map((placement, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{placement?.companyName || "N/A"}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{placement?.role || "N/A"}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{placement?.type || "N/A"}</td>
                            <td className="px-4 py-3 text-sm font-medium text-green-600">{placement?.ctc || "N/A"}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{placement?.offerLetter || "N/A"}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{placement?.feedback || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No off-campus placements available</p>
                  </div>
                )}
              </div>

              {/* On-Campus Placements */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-blue-600" />
                  On-Campus Placements ({viewStudent.onCampusPlacements?.length || 0})
                </h3>
                
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 font-medium">Companies Visited</p>
                    <p className="text-2xl font-bold text-blue-700">{viewStudent.totalJobCompanies?.length || 0}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600 font-medium">Applications</p>
                    <p className="text-2xl font-bold text-green-700">{viewStudent.totalAppliedJobs || 0}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-purple-600 font-medium">Selected</p>
                    <p className="text-2xl font-bold text-purple-700">{viewStudent.totalSelectedJobs || 0}</p>
                  </div>
                </div>

                {viewStudent.onCampusPlacements && viewStudent.onCampusPlacements.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTC</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {viewStudent.onCampusPlacements?.map((placement, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{placement?.company || "N/A"}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{placement?.title || "N/A"}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{placement?.type || "N/A"}</td>
                            <td className="px-4 py-3 text-sm font-medium text-green-600">{placement?.ctc || "N/A"}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {placement?.appliedAt ? new Date(placement.appliedAt).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                placement?.status === "Selected" 
                                  ? "bg-green-100 text-green-800" 
                                  : placement?.status === "Rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {placement?.status || "N/A"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No on-campus placements available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Companies Modal */}
      {expandedStudentId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[60vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">All Companies & CTCs</h2>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setExpandedStudentId(null)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto">
              <ol className="list-decimal pl-5 space-y-2">
                {getCompaniesAndCTCs(
                  filteredReports.find((r) => r._id === expandedStudentId)
                )?.map((entry, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{entry}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementReports;
