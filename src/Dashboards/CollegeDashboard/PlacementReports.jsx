import React, { useState, useEffect } from "react";
import { fetchPlacementReports } from "../../Redux/Placement/placementReportsSlice";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx"; // Import the xlsx library
import ToggleEligibility from "../PlacementDashboard/PlacementReport/ToggleEligibility"
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';

const Reports = () => {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const currentYear = new Date().getFullYear();
  const [graduationYear, setGraduationYear] = useState(currentYear.toString());

  const colleges = useSelector((state) => state.colleges.colleges) || [];
  const departments = useSelector((state) => state.department.departments) || [];
  const programs = useSelector((state) => state.programs.programs) || [];
  const students = useSelector((state) => state.students.students) || [];

  console.log("students data in placementReports are:", students);
  const { list: reports, loading, error } = useSelector(s => s.placementReports);

  // added for imporved ui
  const [viewStudent, setViewStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // State for filters
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [placementStatusFilter, setPlacementStatusFilter] = useState("all"); // "all", "placed", "unplaced"

  const [selectedCompany, setSelectedCompany] = useState([]);
  const [selectedCTC, setSelectedCTC] = useState("");

  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [availableCTCs, setAvailableCTCs] = useState([]);

  // for the checkbox and eligibilty
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  // for the comapanies and CTCs
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  // Function to get companies and CTCs
  // Function to get companies and CTCs with valid placements only
  const getCompaniesAndCTCs = (report) => {
    const offCampus = (report.offCampusPlacements || []).filter(
      (placement) => placement && (placement.companyName || placement.company)
    );
    const onCampus = (report.onCampusPlacements || []).filter(
      (placement) => placement && placement.status === "Selected"
    );

    const allPlacements = [...offCampus, ...onCampus];

    return allPlacements?.map((placement) => {
      const company = placement.companyName || placement.company || "N/A";
      const ctc = placement.ctc ? `${placement.ctc}` : "N/A";
      return `${company} (${ctc})`;
    });
  };


  const filteredDepartments = useMemo(() => {
    return selectedCollege
      ? departments.filter((dept) => dept.college === selectedCollege)
      : departments;
  }, [selectedCollege, departments]);

  const filteredPrograms = useMemo(() => {
    return selectedDepartment
      ? programs.filter((prog) => prog.department?._id === selectedDepartment)
      : programs;
  }, [selectedDepartment, programs]);




  const token = localStorage.getItem("University authToken");

  console.log("students data in placemntReports are:", students);

  // Create mapping objects for quick ID-to-name lookup
  const collegeMap = useMemo(() => colleges?.reduce((acc, college) => {
    acc[college._id] = college.name;
    return acc;
  }, {}), [colleges]);

  const departmentMap = useMemo(() => departments?.reduce((acc, department) => {
    acc[department._id] = department.name;
    return acc;
  }, {}), [departments]);

  const programMap = useMemo(() => programs?.reduce((acc, program) => {
    acc[program._id] = program.name;
    return acc;
  }, {}), [programs]);

  + // Dispatch thunk on graduationYear change and keep error handling as well

    useEffect(() => {
      dispatch(fetchPlacementReports({ token, universityName, graduationYear }));
      // extract available companies and CTCs from reports

    }, [dispatch, token, universityName, graduationYear]);


  // 2️⃣ derive availableCompanies & availableCTCs from the freshly‐fetched `reports`
  useEffect(() => {
    const companiesSet = new Set();
    const ctcsSet = new Set();

    reports.forEach((r) => {
      // combine all valid placements
      const all = [
        ...(r.offCampusPlacements || []),
        ...(r.onCampusPlacements || []).filter(p => p.status === "Selected"),
      ];
      all.forEach((p) => {
        const name = p.companyName || p.company;
        if (name) companiesSet.add(name);
        if (p.ctc != null) ctcsSet.add(p.ctc);
      });
    });

    setAvailableCompanies(Array.from(companiesSet).sort((a, b) => a.localeCompare(b)));
    setAvailableCTCs(Array.from(ctcsSet).sort((a, b) => b - a));
  }, [reports]);


  // Filter reports based on selected college, department, program, and placement status
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesGraduationYear = !graduationYear || report.graduationYear === parseInt(graduationYear);
      const matchesCollege = !selectedCollege || report.collegeId === selectedCollege;
      const matchesDepartment = !selectedDepartment || report.departmentId === selectedDepartment;
      const matchesProgram = !selectedProgram || report.programId === selectedProgram;

      const offCampus = (report.offCampusPlacements || [])
      const onCampus = (report.onCampusPlacements || []).filter(p => p.status === "Selected");

      const allPlacements = [...offCampus, ...onCampus];

      // count *any* placement record, regardless of status
      const hasPlacements = (report?.placements?.length ?? 0) > 0;
      console.log("report.placements:", report);
      const matchesPlacementStatus =
        placementStatusFilter === "all" ||
        (placementStatusFilter === "placed" && hasPlacements) ||
        (placementStatusFilter === "unplaced" && !hasPlacements);

      const matchesCompany =
        selectedCompany.length === 0 ||
        allPlacements.some(p =>
          selectedCompany
            .map(c => c.toLowerCase())
            .includes((p.companyName || p.company || "").toLowerCase())
        );
      const matchesCTC =
        !selectedCTC ||
        allPlacements.some((p) =>
          p.ctc != null && Number(p.ctc) === Number(selectedCTC)
        );

      return (
        matchesGraduationYear &&
        matchesCollege &&
        matchesDepartment &&
        matchesProgram &&
        matchesPlacementStatus &&
        matchesCompany &&
        matchesCTC
      );
    });
  }, [
    reports,
    graduationYear,
    selectedCollege,
    selectedDepartment,
    selectedProgram,
    placementStatusFilter,
    selectedCompany,
    selectedCTC,
  ]);






  // Calculate total students, placed students, and total placements
  // Calculate total students, placed students, and total placements
  const { totalStudents, totalPlacedStudents, totalPlacements } = useMemo(() => {
    const totalStudents = filteredReports.length;
    let totalPlacedStudents = 0;
    let totalPlacements = 0;

    // Use a Set to track unique placed student IDs
    const placedStudentIds = new Set();

    filteredReports.forEach((report) => {
      const offCampusCount = (report.offCampusPlacements || []).filter(
        (placement) => placement && (placement.companyName || placement.company)
      ).length;

      const onCampusCount = (report.onCampusPlacements || []).filter(
        (placement) => placement && placement.status === "Selected"
      ).length;

      const studentPlacements = offCampusCount + onCampusCount;

      if (studentPlacements > 0) {
        placedStudentIds.add(report._id); // Add student ID to the set if placed
        totalPlacements += studentPlacements;
      }
    });

    // Total placed students is the size of the set
    totalPlacedStudents = placedStudentIds.size;

    return { totalStudents, totalPlacedStudents, totalPlacements };
  }, [filteredReports]);



  // Function to download the table data as an Excel file
  const downloadExcel = () => {
    // Prepare the data for the Excel file
    const data = filteredReports?.map((report) => {
      const allPlacements = [
        ...(report.offCampusPlacements || []),
        ...(report.onCampusPlacements || []),
      ];

      const placementDetails = allPlacements.length > 0
        ? allPlacements
          ?.map((placement) => {
            const company = placement.companyName || placement.company || "N/A";
            const status = placement.status || "N/A";
            return `${company} (${status})`;
          })
          .join(", ")
        : "No placements";

      return {
        Name: report.name,
        "Registered Number": report.registered_number,
        Email: report.email,
        Phone: report.phone,
        College: collegeMap[report.collegeId] || "N/A",
        Department: departmentMap[report.departmentId] || "N/A",
        Program: programMap[report.programId] || "N/A",
        "Total Placements": report.totalPlacements,
        "Placement Details": placementDetails,
      };
    });


    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Placement Reports");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "placement_reports.xlsx");


  };

  // Function to handle status update from ToggleEligibility component
  // This function will be passed to the ToggleEligibility componen
  const handleStatusUpdate = async (_updatedStudents) => {
    await dispatch(fetchPlacementReports({ token, universityName, graduationYear }));
    setSelectedStudentIds([]);
  };



  console.log("View Students in placement Reports:", viewStudent);
  console.log("Reports of Placements are here:", reports);


  // Updated function to get total placements
  const getTotalPlacements = (student) => {
    const offCampusCount = (student.offCampusPlacements || []).filter(
      (placement) => placement && (placement.companyName || placement.company)
    ).length;

    const onCampusSelected = (student.onCampusPlacements || []).filter(
      (placement) => placement && placement.status === "Selected"
    ).length;

    return offCampusCount + onCampusSelected;
  };


  const normalizeCTC = (val) => {
  const n = Number(val);
  if (!n || isNaN(n)) return 0;
  return n < 1000 ? n * 100000 : n; // If it's < 1000, assume it's in LPA
};




  return (
    <div className="p-4 border rounded w-full">
      <h1 className="text-xl font-bold ">Placement Reports:</h1>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 mb-3">
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
          <select
            value={selectedCollege}
            onChange={(e) => {
              setSelectedCollege(e.target.value);
              setSelectedDepartment("");
              setSelectedProgram("");
            }}
            className="w-full border p-2 rounded"
          >
            <option value="">All Colleges</option>
            {colleges.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

        </div>
        <div>
          <label className="block font-medium">Department</label>
          <select
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setSelectedProgram(""); // reset program on department change
            }}
            className="w-full border p-2 rounded"
          >
            <option value="">All Departments</option>
            {filteredDepartments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>

        </div>
        <div>
          <label className="block font-medium">Program</label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">All Programs</option>
            {filteredPrograms.map((p) => (
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
          <label className="block font-medium">CTC (in LPA)</label>
          <select value={selectedCTC} onChange={(e) => setSelectedCTC(e.target.value)} className="w-full border p-2 rounded">
            <option value="">All CTCs</option>
            {availableCTCs?.map((ctc, idx) => <option key={idx} value={ctc}>{ctc}</option>)}
          </select>
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
          <p className="text-lg font-bold text-blue-700">{totalStudents}</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-600">Total Placed Students</p>
          <p className="text-lg font-bold text-green-700">{totalPlacedStudents}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-600">Total Placements (incl. multiple offers)</p>
          <p className="text-lg font-bold text-purple-700">{totalPlacements}</p>
        </div>
      </div>


      {/* Download Button */}
      <div className="mb-4">
        <button
          onClick={downloadExcel}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Download Excel
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-auto max-h-[600px] border rounded">

          {selectedStudentIds.length > 0 && (
            <ToggleEligibility
              selectedStudents={reports.filter((r) => selectedStudentIds.includes(r._id))}
              onStatusUpdate={handleStatusUpdate}
            />
          )}

          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="border px-1 py-1 text-2xs">#</th>
                <th className="border px-1 py-1 text-2xs">Name</th>
                <th className="border px-1 py-1 text-2xs">Registered Number</th>
                <th className="border px-1 py-1 text-2xs">Email</th>
                <th className="border px-1 py-1 text-2xs">Phone</th>
                <th className="border px-1 py-1 text-2xs">Graduation_Year</th>
                <th className="border px-1 py-1 text-2xs">College</th>
                <th className="border px-1 py-1 text-2xs">Department</th>
                <th className="border px-1 py-1 text-2xs">Program</th>
                <th className="border px-1 py-1 text-2xs">Total Placement</th>
                <th className="border px-1 py-1 text-2xs">Placement Details</th>
                <th className="border px-1 py-1 text-2xs">Companies & CTCs</th>
                <th className="border px-1 text-2xs text-left">canApply</th>
                <th className="border px-1 py-1 text-2xs">
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
                  />
                </th>


              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-4">
                    No reports found.
                  </td>
                </tr>
              ) : (
                filteredReports?.map((report, index) => (
                  <React.Fragment key={report._id}>
                    <tr className="border-t">
                      <td className="border px-1 py-1 text-2xs">{index + 1}</td>
                      <td className="border px-1 py-1 text-2xs">{report.name}</td>
                      <td className="border px-1 py-1 text-2xs">
                        {report.registered_number}
                      </td>
                      <td className="border px-1 py-1 text-2xs">
                        {report.email}
                      </td>
                      <td className="border px-1 py-1 text-2xs">
                        {report.phone}
                      </td>
                      <td className="border px-1 py-1 text-2xs">
                        {report.graduationYear}
                      </td>
                      <td className="border px-1 py-1 text-2xs">
                        {collegeMap[report.collegeId] || "N/A"}
                      </td>
                      <td className="border px-1 py-1 text-2xs">
                        {departmentMap[report.departmentId] || "N/A"}
                      </td>
                      <td className="border px-1 py-1 text-2xs">
                        {programMap[report.programId] || "N/A"}
                      </td>
                      <td className="border px-1 py-1 text-2xs">
                        {getTotalPlacements(report)}
                      </td>

                      <td className="border px-1 py-1 text-2xs text-center">
                        <button
                          className="bg-blue-500 text-white px-1 py-1 rounded text-2xs"
                          onClick={() => {
                            setViewStudent(report);
                            setModalOpen(true);
                          }}
                        >
                          View Details
                        </button>
                      </td>


                      <td className="border px-1 py-1 text-2xs">
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
                                    className="text-blue-500 underline"
                                    onClick={() => setExpandedStudentId(report._id)}
                                  >
                                    View More
                                  </button>
                                </>
                              )}
                            </>
                          );
                        })()}
                      </td>
                      <td className="border px-1 py-1 text-2xs text-center">
                        {report.canApply ? (
                          <span className="text-green-500">Yes</span>
                        ) : (
                          <span className="text-red-500">No</span>
                        )}
                      </td>
                      <td className="border px-1 py-1 text-2xs">
                        <input
                          type="checkbox"
                          className="mr-2 pr-2"
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
                        />
                      </td>




                    </tr>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && viewStudent && (
        <div className="fixed bottom-20 left-0 right-0 z-50 bg-white border-t border-gray-300 shadow-lg max-h-[70vh] overflow-y-auto p-4 m-20">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">Student Placement Details</h2>
            <button
              className="text-red-500 font-bold text-xl"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
            <p><strong>Name:</strong> {viewStudent.name}</p>
            <p><strong>Registered Number:</strong> {viewStudent.registered_number}</p>
            <p><strong>Email:</strong> {viewStudent.email}</p>
            <p><strong>Phone:</strong> {viewStudent.phone}</p>
            <p><strong>College:</strong> {collegeMap[viewStudent.collegeId] || "N/A"}</p>
            <p><strong>Department:</strong> {departmentMap[viewStudent.departmentId] || "N/A"}</p>
            <p><strong>Program:</strong> {programMap[viewStudent.programId] || "N/A"}</p>
            <p><strong>Total Placements:</strong> {getTotalPlacements(viewStudent)}</p>
          </div>


          <h3 className="text-md font-semibold mb-2">
            Off-Campus Placements ({viewStudent.offCampusPlacements?.length || 0})
            <p><strong>Total Placements:</strong> {viewStudent.totalPlacements}</p>
          </h3>
          {viewStudent.offCampusPlacements && viewStudent.offCampusPlacements.length > 0 ? (
            <table className="min-w-full border border-gray-300 text-2xs mb-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-1 py-1">Company Name</th>
                  <th className="border px-1 py-1">Role</th>
                  <th className="border px-1 py-1">Type</th>
                  <th className="border px-1 py-1">CTC</th>
                  <th className="border px-1 py-1">Offer Letter</th>
                  <th className="border px-1 py-1">Feedback</th>
                  <th className="border px-1 py-1">Additional Details</th>
                </tr>
              </thead>
              <tbody>
                {viewStudent.offCampusPlacements?.map((placement, idx) => (
                  <tr key={idx}>
                    <td className="border px-1 py-1">{placement?.companyName || "N/A"}</td>
                    <td className="border px-1 py-1">{placement?.role || "N/A"}</td>
                    <td className="border px-1 py-1">{placement?.type || "N/A"}</td>
                    <td className="border px-1 py-1">{placement?.ctc || "N/A"}</td>
                    <td className="border px-1 py-1">{placement?.offerLetter || "N/A"}</td>
                    <td className="border px-1 py-1">{placement?.feedback || "N/A"}</td>
                    <td className="border px-1 py-1">{placement?.additionalDetails || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No off-campus placements available</p>
          )}

          <h3 className="text-md font-semibold mb-2 border-t pt-1 mt-5">
            On-Campus Placements ({viewStudent.onCampusPlacements?.length || 0})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-4 text-sm">
            <p className="cols-span-2"><strong>Companies Visited:({viewStudent.totalJobCompanies?.length || 0})</strong> {viewStudent.totalJobCompanies?.join(', ') || "N/A"}</p>
            <p><strong>Total Jobs:</strong> {viewStudent.totalJobs}</p>

            <p><strong>Companies Applied:</strong> {viewStudent.totalAppliedJobs}</p>
            <p><strong>Companies Selected:</strong> {viewStudent.totalSelectedJobs}</p>
          </div>
          {viewStudent.onCampusPlacements && viewStudent.onCampusPlacements.length > 0 ? (
            <table className="min-w-full border border-gray-300 text-2xs mb-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-1 py-1">Company Name</th>
                  <th className="border px-1 py-1">Role</th>
                  <th className="border px-1 py-1">Type</th>
                  <th className="border px-1 py-1">CTC</th>
                  <th className="border px-1 py-1">Offer Letter</th>
                  <th className="border px-1 py-1">Applied At</th>
                  <th className="border px-1 py-1">Additional Details</th>
                  <th className="border px-1 py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {viewStudent.onCampusPlacements?.map((placement, idx) => (
                  <tr key={idx}>
                    <td className="border px-1 py-1">{placement?.company || "N/A"}</td>
                    <td className="border px-1 py-1">{placement?.title || "N/A"}</td>
                    <td className="border px-1 py-1">{placement?.type || "N/A"}</td>
                    <td className="border px-1 py-1">{placement?.ctc || "N/A"}</td>
                    <td className="border px-1 py-1">{placement?.offerLetter || "N/A"}</td>
                    <td className="border px-1 py-1">
                      {placement?.appliedAt ? new Date(placement.appliedAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="border px-1 py-1">{placement?.additionalDetails || "N/A"}</td>
                    <td className="border px-1 py-1">{placement?.status || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No on-campus placements available</p>
          )}
        </div>
      )}

      {/* for coampanies and CTC */}
      {expandedStudentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-md w-full max-h-[60vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">All Companies & CTCs</h2>
              <button
                className="text-red-500 font-bold text-xl"
                onClick={() => setExpandedStudentId(null)}
              >
                ×
              </button>
            </div>
            <ol className="list-decimal pl-5">
              {getCompaniesAndCTCs(
                filteredReports.find((r) => r._id === expandedStudentId)
              )?.map((entry, idx) => (
                <li key={idx}>{entry}</li>
              ))}
            </ol>
          </div>
        </div>
      )}





    </div>
  );
};

export default Reports;