import React, { useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import studentData from '../a/StudentPlaced'; // Import the student data

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registering necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function PlacementReports() {
  // Filters state
  const [filters, setFilters] = useState({
    year: '',
    college: '',
    department: '',
    specialization: '',
    company: '',
    ctc: '',
  });

  // Apply filters to student data
  const filteredData = studentData.filter((item) => {
    return (
      (!filters.year || item.year.toString() === filters.year) &&
      (!filters.college || item.college.toLowerCase() === filters.college.toLowerCase()) &&
      (!filters.department || item.department.toLowerCase() === filters.department.toLowerCase()) &&
      (!filters.specialization || item.specialization.toLowerCase() === filters.specialization.toLowerCase()) &&
      (!filters.company || item.company.toLowerCase() === filters.company.toLowerCase()) &&
      (!filters.ctc || item.ctc.toString() === filters.ctc)
    );
  });

  // Data aggregation for statistics
  const placementsByYear = filteredData.reduce((acc, item) => {
    acc[item.year] = (acc[item.year] || 0) + 1;
    return acc;
  }, {});

  const placementsByCollege = filteredData.reduce((acc, item) => {
    acc[item.college] = (acc[item.college] || 0) + 1;
    return acc;
  }, {});

  const placementsByDepartment = filteredData.reduce((acc, item) => {
    acc[item.department] = (acc[item.department] || 0) + 1;
    return acc;
  }, {});

  const placementsBySpecialization = filteredData.reduce((acc, item) => {
    acc[item.specialization] = (acc[item.specialization] || 0) + 1;
    return acc;
  }, {});

  const placementsByCompany = filteredData.reduce((acc, item) => {
    acc[item.company] = (acc[item.company] || 0) + 1;
    return acc;
  }, {});

  const placementsByCTC = filteredData.reduce((acc, item) => {
    acc[item.ctc] = (acc[item.ctc] || 0) + 1;
    return acc;
  }, {});

  // Helper function to get unique values for each filter field
  const getUniqueValues = (data, key) => {
    return [...new Set(data.map((item) => item[key]))];
  };

  const years = getUniqueValues(studentData, 'year');
  const colleges = getUniqueValues(studentData, 'college');
  const departments = getUniqueValues(studentData, 'department');
  const specializations = getUniqueValues(studentData, 'specialization');
  const companies = getUniqueValues(studentData, 'company');
  const ctcs = getUniqueValues(studentData, 'ctc');

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Placement Reports</h2>

      {/* Filters Section */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <select
            className="p-2 border rounded-md w-full"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">College</label>
          <select
            className="p-2 border rounded-md w-full"
            value={filters.college}
            onChange={(e) => handleFilterChange('college', e.target.value)}
          >
            <option value="">All Colleges</option>
            {colleges.map((college) => (
              <option key={college} value={college}>
                {college}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Department</label>
          <select
            className="p-2 border rounded-md w-full"
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Specialization</label>
          <select
            className="p-2 border rounded-md w-full"
            value={filters.specialization}
            onChange={(e) => handleFilterChange('specialization', e.target.value)}
          >
            <option value="">All Specializations</option>
            {specializations.map((specialization) => (
              <option key={specialization} value={specialization}>
                {specialization}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Company</label>
          <select
            className="p-2 border rounded-md w-full"
            value={filters.company}
            onChange={(e) => handleFilterChange('company', e.target.value)}
          >
            <option value="">All Companies</option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">CTC</label>
          <select
            className="p-2 border rounded-md w-full"
            value={filters.ctc}
            onChange={(e) => handleFilterChange('ctc', e.target.value)}
          >
            <option value="">All CTCs</option>
            {ctcs.map((ctc) => (
              <option key={ctc} value={ctc}>
                {ctc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Display No Data Message */}
      {filteredData.length === 0 && (
        <p className="text-red-500 text-center">No data available for the selected filters.</p>
      )}

      {/* Table Section */}
      {filteredData.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Students Details</h3>
          <table className="table-auto border-collapse border border-gray-200 w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Year</th>
                <th className="border border-gray-300 px-4 py-2">College</th>
                <th className="border border-gray-300 px-4 py-2">Department</th>
                <th className="border border-gray-300 px-4 py-2">Specialization</th>
                <th className="border border-gray-300 px-4 py-2">Company</th>
                <th className="border border-gray-300 px-4 py-2">CTC</th>
                <th className="border border-gray-300 px-4 py-2">Placement Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((student, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{student.year}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.college}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.department}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.specialization}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.company}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.ctc}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.placementStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Statistical Visualizations */}
      {filteredData.length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          {/* Line Chart for Placements by Year */}
          <div className="p-4 bg-white shadow-md rounded">
            <h3 className="text-lg font-bold mb-2">Placements by Year</h3>
            <Line
              data={{
                labels: Object.keys(placementsByYear),
                datasets: [
                  {
                    label: 'Number of Placements',
                    data: Object.values(placementsByYear),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  },
                ],
              }}
              options={{ responsive: true }}
            />
          </div>

          {/* Pie Chart for Placements by College */}
          <div className="p-4 bg-white shadow-md rounded">
            <h3 className="text-lg font-bold mb-2">Placements by College</h3>
            <Pie
              data={{
                labels: Object.keys(placementsByCollege),
                datasets: [
                  {
                    label: 'Placements',
                    data: Object.values(placementsByCollege),
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.6)',
                      'rgba(54, 162, 235, 0.6)',
                      'rgba(255, 206, 86, 0.6)',
                      'rgba(75, 192, 192, 0.6)',
                      'rgba(153, 102, 255, 0.6)',
                    ],
                  },
                ],
              }}
              options={{ responsive: true }}
            />
          </div>

          {/* Bar Chart for Placements by Department */}
          <div className="p-4 bg-white shadow-md rounded">
            <h3 className="text-lg font-bold mb-2">Placements by Department</h3>
            <Bar
              data={{
                labels: Object.keys(placementsByDepartment),
                datasets: [
                  {
                    label: 'Number of Placements',
                    data: Object.values(placementsByDepartment),
                    backgroundColor: 'rgba(255, 159, 64, 0.6)',
                  },
                ],
              }}
              options={{ responsive: true }}
            />
          </div>

          {/* Bar Chart for Placements by Specialization */}
          <div className="p-4 bg-white shadow-md rounded">
            <h3 className="text-lg font-bold mb-2">Placements by Specialization</h3>
            <Bar
              data={{
                labels: Object.keys(placementsBySpecialization),
                datasets: [
                  {
                    label: 'Number of Placements',
                    data: Object.values(placementsBySpecialization),
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                  },
                ],
              }}
              options={{ responsive: true }}
            />
          </div>

          {/* Pie Chart for Placements by Company */}
          <div className="p-4 bg-white shadow-md rounded">
            <h3 className="text-lg font-bold mb-2">Placements by Company</h3>
            <Pie
              data={{
                labels: Object.keys(placementsByCompany),
                datasets: [
                  {
                    label: 'Placements',
                    data: Object.values(placementsByCompany),
                    backgroundColor: [
                      'rgba(255, 206, 86, 0.6)',
                      'rgba(54, 162, 235, 0.6)',
                      'rgba(255, 99, 132, 0.6)',
                      'rgba(75, 192, 192, 0.6)',
                      'rgba(153, 102, 255, 0.6)',
                    ],
                  },
                ],
              }}
              options={{ responsive: true }}
            />
          </div>

          {/* Bar Chart for Placements by CTC */}
          <div className="p-4 bg-white shadow-md rounded">
            <h3 className="text-lg font-bold mb-2">Placements by CTC</h3>
            <Bar
              data={{
                labels: Object.keys(placementsByCTC),
                datasets: [
                  {
                    label: 'Number of Placements',
                    data: Object.values(placementsByCTC),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  },
                ],
              }}
              options={{ responsive: true }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PlacementReports;
