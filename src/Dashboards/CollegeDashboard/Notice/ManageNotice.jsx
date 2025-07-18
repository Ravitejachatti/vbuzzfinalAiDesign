import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import{useDispatch, useSelector} from "react-redux";
import {
  fetchNotices,
  updateNotice,
  deleteNotice,
  clearNoticeState,
} from "../../../Redux/Placement/noticeSlice"

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getPriorityColor = (priority) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-orange-500";
    case "low":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const ManageNotice = () => {
  const dispatch = useDispatch();
  const [viewNotice, setViewNotice] = useState(null);
  const [viewMessage, setViewMessage] = useState(null);
  const [editNotice, setEditNotice] = useState(null);
  const [deleteNoticeId, setDeleteNoticeId] = useState(null);
  const { universityName } = useParams();
  const token = localStorage.getItem("University authToken");

  const colleges = useSelector((state) => state.colleges.colleges) || [];
  const departments = useSelector((state) => state.department.departments) || [];
  const programs = useSelector((state) => state.programs.programs) || [];
  const students = useSelector((state) => state.students.students) || [];

      const studentList = Array.isArray(students) ? students : [];
      console.log("students in manage notice:", studentList)

  // Fetch notices on mount
  useEffect(() => {
    dispatch(fetchNotices({ universityName, token }));
  }, [dispatch, universityName, token]);

    // Clear flash on unmount
  useEffect(() => () => dispatch(clearNoticeState()), [dispatch]);

   const { items: notices, loading, error, success } = useSelector((s) => s.createNotice);

  const getCollegeName = (collegeId) => {
    const college = colleges.find((col) => col._id === collegeId);
    return college ? college.name : "Unknown";
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find((dept) => dept._id === departmentId);
    return department ? department.name : "Unknown";
  };

  const getProgramName = (programId) => {
    const program = programs.find((prog) => prog._id === programId);
    return program ? program.name : "Unknown";
  };

  console.log("Colleges",colleges)
  console.log("departments", departments)
  console.log("programs",programs)
  console.log("students",students)

  // Delete notice
useEffect(() => {
  if (!deleteNoticeId) return;
  dispatch(deleteNotice({ universityName, noticeId: deleteNoticeId }))
    .then(() => setDeleteNoticeId(null));
}, [deleteNoticeId, dispatch, universityName]);

  // Update notice
const handleUpdate = (e) => {
  e.preventDefault();
  dispatch(updateNotice({
    universityName,
    noticeId: editNotice._id,
    updateData: editNotice,
  })).then(() => setEditNotice(null));
};


  // 1. Add this helper near the top of your component:
 const getStudentById = (id) => studentList.find((s) => s._id === id) || {};

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manage Notices</h1>
{loading && <p>Loading…</p>}
{error && <div className="bg-red-100 text-red-700 p-2 mb-4">{error}</div>}
{success && <div className="bg-green-100 text-green-700 p-2 mb-4">{success}</div>}
      
      {/* Notices List */}
      <ul>
        {notices?.length === 0 ? (
          <p className="text-center text-gray-500">No notices available</p>
        ) : (
          notices?.map((notice) => (
            <li
              key={notice._id}
              className="bg-white p-4 rounded-lg shadow-md mb-4 flex justify-between items-center relative"
            >
              {/* Vertical Line for Priority */}
              <div className={`absolute left-0 top-0 h-full w-2 ${getPriorityColor(notice?.priority)}`}></div>
              <div className="pl-4">
                <h3 className="text-lg font-bold">{notice.title}</h3>
                <p className="text-sm text-gray-600"><span className="font-bold">Message:</span>
                  {notice?.message.split(" ").length > 50 ? (
                    <>
                      {notice?.message.split(" ").slice(0, 50).join(" ")}...
                      <button
                        onClick={() => setViewMessage(notice?.message)}
                        className="text-blue-500 hover:underline ml-1"
                      >
                        View More
                      </button>
                    </>
                  ) : (
                    notice.message
                  )}
                </p>
                <p className="text-sm mt-2"><span className="font-bold">Priority:</span> {notice?.priority}</p>
                <p className="text-sm"><span className="font-bold">Expiry Date:</span> {new Date(notice?.expiryDate).toLocaleDateString()}</p>
            <p className="text-sm"><span className="font-bold">Colleges:</span>  {notice?.colleges.map(getCollegeName).join(", ")}</p>
            <p className="text-sm"><span className="font-bold">Departments:</span> {notice?.departments.map(getDepartmentName).join(", ")}</p>
            <p className="text-sm"><span className="font-bold">Programs: </span>{notice?.programs.map(getProgramName).join(", ")}</p>
   <div className="mt-2">
  <p className="font-bold text-sm mb-1">Read by:</p>
  <table className="min-w-full border border-gray-200 text-sm">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-2 py-1 text-left border">User Type</th>
      <th className="px-1 text-xs py-1 text-left border">Name</th>
        <th className="px-1 text-xs py-1 text-left border">Read At</th>
        <th className="px-1 text-xs py-1 text-left border">College</th>
              <th className="px-1 text-xs py-1 text-left border">Department</th>
     <th className="px-1 text-xs py-1 text-left border">Program</th>
      <th className="px-1 text-xs py-1 text-left border">Email</th>
      <th className="px-1 text-xs py-1 text-left border">Phone</th>
        <th className="px-1 text-xs py-1 text-left border">Reg. No.</th>
      </tr>
    </thead>
  <tbody>
      {notice?.readBy?.map((entry, index) => {
      const stud = getStudentById(entry.userId);
      const collegeName = getCollegeName(stud.collegeId);
       const deptName = getDepartmentName(stud.departmentId);
       const progName = getProgramName(stud.programId);
        return (
          <tr
            key={index}
            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
          >
            <td className="px-1 text-xs py-1 border">{entry.userType}</td>
           <td className="px-1 text-xs py-1 border">{stud.name}</td>
            <td className="px-1 text-xs py-1 border">
              {new Date(entry.readAt).toLocaleString()}
            </td>
            <td className="px-1 text-xs py-1 border">{collegeName}</td>
          <td className="px-1 text-xs py-1 border">{deptName}</td>
          <td className="px-1 text-xs py-1 border">{progName}</td>
           <td className="px-1 text-xs py-1 border">{stud.email}</td>
          <td className="px-1 text-xs py-1 border">{stud.phone}</td>
          <td className="px-1 text-xs py-1 border">{stud.registered_number}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>
            <p className="text-sm"><span className="font-bold"></span>Students: {notice?.students?.length}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setViewNotice(notice)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  View
                </button>
                <button
                  onClick={() => setEditNotice(notice)}
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => setDeleteNoticeId(notice._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* View Full Message Modal */}
      {viewMessage && (
  <div className=" fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto z-100">
    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/5 max-h-4/5 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Notice Message</h2>
      <div className="overflow-y-auto max-h-[70vh] p-2">
        <pre className="text-sm">{viewMessage}</pre>
      </div>
      <button
        onClick={() => setViewMessage(null)}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 w-full"
      >
        Close
      </button>
    </div>
  </div>
)}



    {/* View Notice Modal */}
    {viewNotice && (
   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto z-60">
    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/5 max-h-2/5 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{viewNotice?.title}</h2>
            <pre>{viewNotice?.message}</pre>
            <button
              onClick={() => setViewNotice(null)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Notice Modal */}
      {editNotice && (
        <div className="w-full fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
            <h2 className="text-xl font-bold mb-4">Edit Notice</h2>
            <form onSubmit={handleUpdate}>
              <label className="font-bold" >Title</label>
              <input
                type="text"
                value={editNotice.title}
                onChange={(e) => setEditNotice({ ...editNotice, title: e.target.value })}
                className="w-full p-2 border rounded-md mb-4"
              />
              <label className="font-bold">Message:</label>
              <textarea
                value={editNotice.message}
                onChange={(e) => setEditNotice({ ...editNotice, message: e.target.value })}
                className="w-full p-2 border rounded-md mb-4"
                rows="4"
              ></textarea>

              <label className="font-bold">Priority:</label>
              <input
                type="text"
                value={editNotice.priority}
                onChange={(e) => setEditNotice({ ...editNotice, priority: e.target.value })}
                className="w-full p-2 border rounded-md mb-4"
                placeholder="Priority (high, medium, low)"
              />
              <label className="font-bold">Expiry Date:</label>
              <input
                type="date"
                value={editNotice?.expiryDate?.split("T")[0]}
                onChange={(e) => setEditNotice({ ...editNotice, expiryDate: e.target.value })}
                className="w-full p-2 border rounded-md mb-4"
              />
           {/* edit college, departement and program with multiple dropdown checkbox */}
           <label className="font-bold">PDF:</label>
              <input
                type="text"
                value={editNotice.pdf}
                onChange={(e) => setEditNotice({ ...editNotice, pdf: e.target.value })}
                className="w-full p-2 border rounded-md mb-4"
                placeholder="pdf"
              />  
<label className="font-bold">link</label>
              <input
                type="text"
                value={editNotice.link}
                onChange={(e) => setEditNotice({ ...editNotice, link: e.target.value })}
                className="w-full p-2 border rounded-md mb-4"
                placeholder="Link (if any)"
              />

              <button
                type="button"
                onClick={() => setEditNotice(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 w-full mb-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageNotice;
