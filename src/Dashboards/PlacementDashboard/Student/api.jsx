import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = {
  // Add a student
  addStudent: (universityName, data) =>
    axios.post(`${BASE_URL}/student/add?universityName=${universityName}`, data),

  // Get all students
  getAllStudents: (universityName) =>
    axios.get(`${BASE_URL}/student/getAll/?universityName=${universityName}`),

  // Update a student
  updateStudent: (universityName, id, data) =>
    axios.put(`${BASE_URL}/student/update/${id}?universityName=${universityName}`, data),

  // Delete a student
  deleteStudent: (universityName, id) =>
    axios.delete(`${BASE_URL}/student/delete/${id}?universityName=${universityName}`),

  // Bulk upload students
  bulkUpload: (universityName, formData) =>
    axios.post(`${BASE_URL}/student/bulk-upload?universityName=${universityName}`, formData),
};

export default api;
