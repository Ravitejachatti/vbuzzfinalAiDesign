import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Async thunk for fetching students
export const fetchStudents = createAsyncThunk(
  "students/fetchAll",
  async ({ token, universityName, BASE_URL }, thunkAPI) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/student/?universityName=${universityName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const studentData = res.data.students;

      return {
        students: studentData
      }
    } catch (error) {
      return thunkAPI.rejectWithValue("Error fetching students", error.response?.data?.message || error.message);   
    }
  }
);

const studentsSlice = createSlice({
  name: "students",
  initialState: {
    students: [],
    graduationYears: [],
    colleges: [],
    departments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.students;
        state.graduationYears = action.payload.graduationYears;
        state.colleges = action.payload.colleges;
        state.departments = action.payload.departments;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch students";
      });
  },
});

export default studentsSlice.reducer;

export const { fetchStudents: fetchAllStudents } = studentsSlice.actions;

export const students = studentsSlice.reducer;

export const selectStudents  = (state) => state.students.students;
export const selectGraduationYears = (state) => state.students.graduationYears;
export const selectStudentColleges = (state) => state.students.colleges;
export const selectStudentDepts    = (state) => state.students.departments;
export const selectStudentsLoading = (state) => state.students.loading;
export const selectStudentsError   = (state) => state.students.error;

