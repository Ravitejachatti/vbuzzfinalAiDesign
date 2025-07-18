import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addNotice, clearNoticeState } from "../../../Redux/Placement/noticeSlice";
import { 
  Bell, Plus, Calendar, Users, Building, GraduationCap, 
  AlertTriangle, CheckCircle, FileText, Link as LinkIcon, 
  Send, ChevronDown 
} from "lucide-react";

const AddNotice = () => {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const { loading, error, success } = useSelector((state) => state.createNotice);
  const colleges = useSelector((state) => state.colleges.colleges) || [];
  const departments = useSelector((state) => state.department.departments) || [];
  const programs = useSelector((state) => state.programs.programs) || [];
  const students = useSelector((state) => state.students.students) || [];

  const [formData, setFormData] = useState({
    type: "",
    title: "",
    message: "",
    link: "",
    colleges: [],
    departments: [],
    programs: [],
    students: [],
    priority: "medium",
    openingDate: new Date(),
    expiryDate: new Date(),
  });

  const [dropdowns, setDropdowns] = useState({
    colleges: false, departments: false, programs: false, students: false
  });

  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    if (!formData.colleges.length) {
      setFilteredDepartments([]);
      return;
    }
    const filtered = departments.filter(d => formData.colleges.includes(d.college));
    setFilteredDepartments(filtered);
    setFormData(prev => ({ ...prev, departments: [], programs: [] }));
  }, [formData.colleges, departments]);

  useEffect(() => {
    if (!formData.departments.length) {
      setFilteredPrograms([]);
      return;
    }
    const deptPrograms = departments
      .filter(d => formData.departments.includes(d._id))
      .flatMap(d => d.programs);
    const uniquePrograms = programs.filter(p => deptPrograms.includes(p._id));
    setFilteredPrograms(uniquePrograms);
    setFormData(prev => ({ ...prev, programs: [] }));
  }, [formData.departments, departments, programs]);

  useEffect(() => {
    const fs = students.filter(
      s => formData.departments.includes(s.departmentId) && formData.programs.includes(s.programId)
    );
    setFilteredStudents(fs);
    setFormData(prev => ({ ...prev, students: fs.map(s => s._id) }));
  }, [formData.departments, formData.programs, students]);

  const handleSelectAll = (key, items) => {
    const allSelected = formData[key].length === items.length;
    setFormData(prev => ({ ...prev, [key]: allSelected ? [] : items.map(i => i._id) }));
  };

  const toggleItem = (key, id) => {
    setFormData(prev => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(id) ? arr.filter(i => i !== id) : [...arr, id]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      openingDate: formData.openingDate.toISOString(),
      expiryDate: formData.expiryDate.toISOString(),
    };
    dispatch(clearNoticeState());
    dispatch(addNotice({ universityName, noticeData: payload }))
      .unwrap()
      .then(() => {
        setFormData({
          type: "", title: "", message: "", link: "",
          colleges: [], departments: [], programs: [], students: [],
          priority: "medium", openingDate: new Date(), expiryDate: new Date(),
        });
      });
  };

  const getSelectedText = (selectedIds, items) => {
    if (!selectedIds.length) return "Select";
    if (selectedIds.length === 1) {
      const item = items.find(i => i._id === selectedIds[0]);
      return item ? item.name : "1 selected";
    }
    return `${selectedIds.length} selected`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Create Notice</h1>
            <p className="text-green-100 text-lg">Send announcements to students</p>
          </div>
          <Bell className="w-16 h-16 text-green-200" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b flex items-center">
          <div className="p-2 bg-green-100 rounded-lg mr-3">
            <Plus className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Notice Details</h2>
            <p className="text-sm text-gray-600">Fill in the details below</p>
          </div>
        </div>

        {error && <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center"><AlertTriangle className="w-5 h-5 mr-2" />{error}</div>}
        {success && <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center"><CheckCircle className="w-5 h-5 mr-2" />{success}</div>}

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notice Type *</label>
            <input value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" required />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" required />
          </div>

          {/* Message */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
            <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
              rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" required />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attachment Link</label>
            <input value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>

          {/* Date pickers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Opening Date</label>
            <DatePicker selected={formData.openingDate} onChange={d => setFormData({ ...formData, openingDate: d })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <DatePicker selected={formData.expiryDate} minDate={formData.openingDate}
              onChange={d => setFormData({ ...formData, expiryDate: d })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>

          {/* Example dropdown for Colleges */}
          {/* Similar dropdown pattern can be used for Departments, Programs, Students with toggleItem, handleSelectAll */}

          {/* Submit button */}
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={loading}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Submitting..." : <><Send className="w-5 h-5 mr-1" /> Add Notice</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNotice;