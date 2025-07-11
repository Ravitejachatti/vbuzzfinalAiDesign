// PlacementCharts.jsx
import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';

const PlacementCharts = ({ reports }) => {
  const [reverseOrder, setReverseOrder] = useState(true);

  const companyMap = {};
  const ctcBuckets = [
    300000, 600000, 900000, 1200000,
    1500000, 1800000, 2100000, 2400000, 2700000, 3000000
  ];
  const ctcDistribution = {};

  ctcBuckets.forEach(b => {
    const label = `≥ ₹${(b / 100000).toFixed(1)}L`;
    ctcDistribution[label] = 0;
  });

  reports.forEach((report) => {
    const offCampus = (report.offCampusPlacements || []).filter(p => p.companyName || p.company);
    const onCampus = (report.onCampusPlacements || []).filter(p => p.status === 'Selected');
    const allPlacements = [...offCampus, ...onCampus];

    allPlacements.forEach(p => {
      const company = p.companyName || p.company || 'Unknown';
      const ctc = Number(p.ctc || 0);

      companyMap[company] = (companyMap[company] || 0) + 1;

      ctcBuckets.forEach(b => {
        if (ctc >= b) {
          const label = `≥ ₹${(b / 100000).toFixed(1)}L`;
          ctcDistribution[label] += 1;
        }
      });
    });
  });

  const companyData = Object.entries(companyMap).map(([name, count]) => ({ company: name, students: count }));
  const sortedCTCEntries = Object.entries(ctcDistribution)
    .sort((a, b) => Number(a[0].replace(/[^\d]/g, '')) - Number(b[0].replace(/[^\d]/g, '')));

  const ctcData = (reverseOrder ? [...sortedCTCEntries].reverse() : sortedCTCEntries)
    .map(([label, students]) => ({ label, students }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Toggle Sort Order */}
      <div className="col-span-full flex justify-end">
        <label className="mr-2 font-medium">CTC Sort:</label>
        <select
          className="border p-1 rounded"
          value={reverseOrder ? 'desc' : 'asc'}
          onChange={(e) => setReverseOrder(e.target.value === 'desc')}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Bar Chart for Company-wise Placement */}
      <div className="w-full h-96">
        <h2 className="text-lg font-semibold mb-2 text-center">Students Placed by Company</h2>
        <ResponsiveContainer>
          <BarChart data={companyData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="company" type="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey="students" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cumulative Bar Chart for CTC-wise Placement */}
      <div className="w-full h-96">
        <h2 className="text-lg font-semibold mb-2 text-center">Cumulative Students by CTC Ranges (in ₹)</h2>
        <ResponsiveContainer>
          <BarChart data={ctcData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="students" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PlacementCharts;