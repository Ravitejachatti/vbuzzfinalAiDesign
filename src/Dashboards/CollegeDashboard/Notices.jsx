import React, { useState } from 'react';

function Notices() {
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: "Exam Schedule Released",
      description: "The final exam schedule for all programs has been released. Check the attachment for details.",
      category: "Exams",
      date: "2025-05-10",
      expiryDate: "2025-05-20",
      attachment: "exam-schedule.pdf",
      status: "Active",
      priority: "High",
    },
    {
      id: 2,
      title: "Annual Sports Meet",
      description: "The annual sports meet will be held on 25th May. Participation is mandatory for first-year students.",
      category: "Events",
      date: "2025-05-01",
      expiryDate: "2025-05-25",
      attachment: null,
      status: "New",
      priority: "Medium",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredNotices = notices
    .filter(notice => 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (selectedCategory === '' || notice.category === selectedCategory)
    );

  return (
    <div className="p-6 mx-auto">
      <h2 className="text-3xl font-bold mb-4">College Notices</h2>

      {/* Search and Filter */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search notices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-1/2"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="Exams">Exams</option>
          <option value="Events">Events</option>
          <option value="General">General</option>
        </select>
      </div>

      {/* Notices List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredNotices.map((notice) => (
          <div key={notice.id} className={`p-4 rounded shadow-md ${notice.priority === "High" ? "border-l-4 border-red-500" : "border-l-4 border-blue-500"} bg-white`}>
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold">{notice.title}</h3>
              <span className={`text-sm px-2 py-1 rounded ${notice.status === "New" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                {notice.status}
              </span>
            </div>
            <p className="text-gray-600">{notice.description}</p>
            <div className="mt-2">
              <span className="text-xs text-gray-500">Category: {notice.category}</span>
              <br />
              <span className="text-xs text-gray-500">Date: {notice.date}</span>
              {notice.attachment && (
                <div className="mt-2">
                  <a
                    href={`/${notice.attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Attachment
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No Notices Found */}
      {filteredNotices.length === 0 && (
        <p className="text-center text-gray-600 mt-4">No notices available</p>
      )}
    </div>
  );
}

export default Notices;
