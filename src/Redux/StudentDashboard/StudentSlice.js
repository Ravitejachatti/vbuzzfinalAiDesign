// src/Redux/studentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 1. Thunk: fetch a single student by ID & universityName
 */
export const fetchStudent = createAsyncThunk(
  "student/fetchStudent",
  async ({ studentId, universityName, token }, { rejectWithValue }) => {
    try {
      const token2 = token || localStorage.getItem("Student token") ;
      const response = await axios.get(
        `${BASE_URL}/student/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token2}` },
          params: { universityName },
        }
      );
      // API returns { student: { … } }
      return response.data.student;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

const studentSlice = createSlice({
  name: "student",
  initialState: {
    data: null,      // holds the student object
    loading: false,
    error: null,
  },
  reducers: {
    clearStudent(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStudent } = studentSlice.actions;
export default studentSlice.reducer;
export const studentData=studentSlice.reducer

