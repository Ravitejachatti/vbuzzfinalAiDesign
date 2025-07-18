import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addNotice,
  clearNoticeState
} from "../../../Redux/Placement/noticeSlice.js";

const AddNotice = () => {
  // Redux state and actions
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.createNotice);

  // Static lists from Redux
  const colleges = useSelector((state) => state.colleges.colleges) || [];
  const departments = useSelector((state) => state.department.departments) || [];
  const programs = useSelector((state) => state.programs.programs) || [];
  const studentsRaw = useSelector((state) => state.students.students) || [];
  const studentList = Array.isArray(studentsRaw)
    ? studentsRaw
    : Array.isArray(studentsRaw.students)
    ? studentsRaw.students
    : [];

  const { universityName } = useParams();

  // Form state
  const [formData, setFormData] = useState({
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

  // Dropdown toggles
  const [collegeDropdownOpen, setCollegeDropdownOpen] = useState(false);
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);
  const [programDropdownOpen, setProgramDropdownOpen] = useState(false);
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);

  // Derived lists
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Initialize filtered programs
  useEffect(() => {
    setFilteredPrograms(programs);
  }, [programs]);

  // Filter students when departments/programs change
  useEffect(() => {
    const fs = studentList.filter(
      (s) =>
        formData.departments.includes(s.departmentId) &&
        formData.programs.includes(s.programId)
    );
    setFilteredStudents(fs);
    setFormData((prev) => ({ ...prev, students: fs.map((s) => s._id) }));
  }, [formData.departments, formData.programs, studentList]);

  // Generic select-all handler
  const handleSelectAll = (key, items) => {
    setFormData((prev) => ({
      ...prev,
      [key]: items.map((i) => i._id),
    }));
  };

  // Toggle single selection
  const toggleSelection = (key, id) => {
    setFormData((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
      };
    });
  };

  // Submit handler
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
      });
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Add Notice</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded-md"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* Message */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            required
            className="w-full p-2 border rounded-md"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>

        {/* Link */}
        <div>
          <label className="block text-sm font-medium mb-1">Link (PDF)</label>
          <input
            type="url"
            className="w-full p-2 border rounded-md"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />
        </div>

        {/* Colleges */}
        <Dropdown
          label="Colleges"
          items={colleges}
          selected={formData.colleges}
          open={collegeDropdownOpen}
          onToggle={() => setCollegeDropdownOpen((o) => !o)}
          onSelectAll={() => handleSelectAll('colleges', colleges)}
          onToggleItem={(id) => toggleSelection('colleges', id)}
          itemLabel={(c) => c.name}
        />

        {/* Departments */}
        <Dropdown
          label="Departments"
          items={departments}
          selected={formData.departments}
          open={departmentDropdownOpen}
          onToggle={() => setDepartmentDropdownOpen((o) => !o)}
          onSelectAll={() => handleSelectAll('departments', departments)}
          onToggleItem={(id) => toggleSelection('departments', id)}
          itemLabel={(d) => d.name}
        />

        {/* Programs */}
        <Dropdown
          label="Programs"
          items={filteredPrograms}
          selected={formData.programs}
          open={programDropdownOpen}
          onToggle={() => setProgramDropdownOpen((o) => !o)}
          onSelectAll={() => handleSelectAll('programs', filteredPrograms)}
          onToggleItem={(id) => toggleSelection('programs', id)}
          itemLabel={(p) => p.name}
        />

        {/* Students */}
        <Dropdown
          label="Students"
          items={filteredStudents}
          selected={formData.students}
          open={studentDropdownOpen}
          onToggle={() => setStudentDropdownOpen((o) => !o)}
          onSelectAll={() => handleSelectAll('students', filteredStudents)}
          onToggleItem={(id) => toggleSelection('students', id)}
          itemLabel={(s) => `${s.name} (${s.registered_number})`}
          allColSpan
        />

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            className="w-full p-2 border rounded-md"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Opening Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Opening Date</label>
          <DatePicker
            selected={formData.openingDate}
            onChange={(date) =>
              setFormData({ ...formData, openingDate: date })
            }
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Expiry Date</label>
          <DatePicker
            selected={formData.expiryDate}
            onChange={(date) =>
              setFormData({ ...formData, expiryDate: date })
            }
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Submit */}
        <div className="col-span-3 text-center">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Submitting…' : 'Add Notice'}
          </button>
        </div>
      </form>
    </div>
  );
};

/**
 * Reusable dropdown component with select-all.
 * Props: label, items, selected, open, onToggle, onSelectAll, onToggleItem, itemLabel, allColSpan?
 */
const Dropdown = ({
  label,
  items,
  selected,
  open,
  onToggle,
  onSelectAll,
  onToggleItem,
  itemLabel,
  allColSpan = false,
}) => (
  <div className={allColSpan ? 'col-span-3' : ''}>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="relative">
      <input
        type="text"
        readOnly
        value={
          selected
            .map((id) => {
              const item = items.find((i) => i._id === id);
              return item ? itemLabel(item) : '';
            })
            .join(', ')
        }
        onClick={onToggle}
        placeholder={`Select ${label}`}
        className="w-full p-2 border rounded bg-white cursor-pointer"
      />
      {open && (
        <div className="absolute z-10 bg-white border rounded shadow-md w-full max-h-40 overflow-y-auto">
          <label className="flex items-center p-1 text-xs hover:bg-gray-100">
            <input
              type="checkbox"
              className="form-checkbox mr-1"
              checked={items.length > 0 && selected.length === items.length}
              onChange={(e) => onSelectAll()}
            />
            Select All
          </label>
          {items.map((i) => (
            <label key={i._id} className="flex items-center p-1 text-xs hover:bg-gray-100">
              <input
                type="checkbox"
                className="form-checkbox mr-1"
                checked={selected.includes(i._id)}
                onChange={() => onToggleItem(i._id)}
              />
              {itemLabel(i)}
            </label>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default AddNotice;
