import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { User, Mail, Phone, Calendar, GraduationCap, Building, BookOpen, Loader } from "lucide-react";
import { addStudent, resetAddStudentStatus, selectSingleStatus, selectSingleError } from "../../../Redux/Placement/student/singleStudentadd";

const AddStudentForm = () => {
  const dispatch = useDispatch();
  const { universityName } = useParams();

  const token = localStorage.getItem("University authToken");
  const universityId = localStorage.getItem("universityId");

  const colleges = useSelector((state) => state.colleges.colleges) || [];
  const departments = useSelector((state) => state.department.departments) || [];
  const programs = useSelector((state) => state.programs.programs) || [];

  const addStatus = useSelector(selectSingleStatus);
  const addError = useSelector(selectSingleError);

  const [formData, setFormData] = useState({
    collegeId: "",
    departmentId: "",
    programId: "",
    name: "",
    email: "",
    registeredNumber: "",
    phone: "",
    enrollmentYear: "",
    graduationYear: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (addStatus === "succeeded") {
      alert("Student added successfully!");
      setFormData({
        collegeId: "",
        departmentId: "",
        programId: "",
        name: "",
        email: "",
        registeredNumber: "",
        phone: "",
        enrollmentYear: "",
        graduationYear: "",
      });
      setErrors({});
      dispatch(resetAddStudentStatus());
    }
  }, [addStatus, dispatch]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.registeredNumber.trim()) newErrors.registeredNumber = "Registration number is required";
    if (!formData.collegeId) newErrors.collegeId = "College selection is required";
    if (!formData.departmentId) newErrors.departmentId = "Department selection is required";
    if (!formData.programId) newErrors.programId = "Program selection is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      universityId,
      collegeId: formData.collegeId,
      departmentId: formData.departmentId,
      programId: formData.programId,
      name: formData.name,
      registered_number: formData.registeredNumber,
      email: formData.email,
      phone: formData.phone,
      enrollment_year: formData.enrollmentYear,
      graduation_year: formData.graduationYear,
    };

    dispatch(addStudent({ formData: payload, token, universityName }));
  };

  const filteredDepartments = departments.filter((d) => d.college === formData.collegeId);
  const filteredPrograms = programs.filter((p) => p.department === formData.departmentId);

  return (
    <div className="max-w-4xl mx-auto bg-white border rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Add New Student</h2>
          <p className="text-sm text-gray-500">Manually add a student record.</p>
        </div>
      </div>

      {addStatus === "failed" && (
        <div className="text-sm text-red-600">{addError || "Failed to add student"}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* University ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Building className="w-4 h-4 inline mr-1" /> University ID
          </label>
          <input
            type="text"
            value={universityId}
            readOnly
            className="w-full p-2 border rounded-md bg-gray-100 text-gray-600"
          />
        </div>

        {/* College, Department, Program */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">College *</label>
            <select
              name="collegeId"
              value={formData.collegeId}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.collegeId ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select college</option>
              {colleges.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            {errors.collegeId && <p className="text-xs text-red-500">{errors.collegeId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              disabled={!formData.collegeId}
              className={`w-full p-2 border rounded-md ${errors.departmentId ? "border-red-500" : "border-gray-300"} ${!formData.collegeId && "bg-gray-50"}`}
            >
              <option value="">Select department</option>
              {filteredDepartments.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
            {errors.departmentId && <p className="text-xs text-red-500">{errors.departmentId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program *</label>
            <select
              name="programId"
              value={formData.programId}
              onChange={handleChange}
              disabled={!formData.departmentId}
              className={`w-full p-2 border rounded-md ${errors.programId ? "border-red-500" : "border-gray-300"} ${!formData.departmentId && "bg-gray-50"}`}
            >
              <option value="">Select program</option>
              {filteredPrograms.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
            {errors.programId && <p className="text-xs text-red-500">{errors.programId}</p>}
          </div>
        </div>

        {/* Other fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"><User className="w-4 h-4 inline mr-1" /> Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.name ? "border-red-500" : "border-gray-300"}`}
              placeholder="Full name"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"><Mail className="w-4 h-4 inline mr-1" /> Email *</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"}`}
              placeholder="Email"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
            <input
              name="registeredNumber"
              value={formData.registeredNumber}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.registeredNumber ? "border-red-500" : "border-gray-300"}`}
              placeholder="Registration No."
            />
            {errors.registeredNumber && <p className="text-xs text-red-500">{errors.registeredNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"><Phone className="w-4 h-4 inline mr-1" /> Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.phone ? "border-red-500" : "border-gray-300"}`}
              placeholder="10-digit phone"
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"><Calendar className="w-4 h-4 inline mr-1" /> Enrollment Year</label>
            <input
              name="enrollmentYear"
              value={formData.enrollmentYear}
              onChange={handleChange}
              type="number"
              placeholder="2020"
              className="w-full p-2 border rounded-md border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"><GraduationCap className="w-4 h-4 inline mr-1" /> Graduation Year</label>
            <input
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              type="number"
              placeholder="2024"
              className="w-full p-2 border rounded-md border-gray-300"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            onClick={() => { setFormData({ collegeId: "", departmentId: "", programId: "", name: "", email: "", registeredNumber: "", phone: "", enrollmentYear: "", graduationYear: "" }); setErrors({}); }}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={addStatus === "pending"}
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 disabled:opacity-50"
          >
            {addStatus === "pending" && <Loader className="animate-spin w-4 h-4 mr-2" />}
            Add Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudentForm;