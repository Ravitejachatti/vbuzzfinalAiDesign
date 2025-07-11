
import React, { useState, useEffect } from 'react';

const CTCRangeFilter = ({ selectedRange, onChange }) => {
  const [minCTC, setMinCTC] = useState('');
  const [maxCTC, setMaxCTC] = useState('');

  // Sync with parent state when inputs change
  useEffect(() => {
    if (minCTC === '' && maxCTC === '') {
      onChange(null);
    } else {
      // Convert LPA to rupees for internal filtering
      const minInRupees = Number(minCTC) * 100000 || 0;
      const maxInRupees = Number(maxCTC) * 100000 || Infinity;
      onChange({ min: minInRupees, max: maxInRupees });
    }
  }, [minCTC, maxCTC]);

  return (
    <div>
      <label className="block font-medium mb-1">CTC Range (in LPA)</label>
      <div className="flex space-x-2">
        <input
          type="number"
          placeholder="Min (LPA)"
          value={minCTC}
          onChange={(e) => setMinCTC(e.target.value)}
          className="w-1/2 border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Max (LPA)"
          value={maxCTC}
          onChange={(e) => setMaxCTC(e.target.value)}
          className="w-1/2 border p-2 rounded"
        />
      </div>
    </div>
  );
};

// Filtering function — ctc in rupees
export const matchCTCRange = (ctc, selectedRange) => {
  if (!selectedRange) return true;
  return ctc >= selectedRange.min && ctc <= selectedRange.max;
};

export default CTCRangeFilter;
