// src/Redux/StudentDashboard/Profile/academicProjectsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1) Thunk to fetch ONLY the academicProjects array
export const fetchAcademicProjects = createAsyncThunk(
  "academicProjects/fetchAcademicProjects",
  async ({ studentId, universityName, token }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/student/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      // response.data.student is the full student object; we only want academicProjects
      return response.data.student.academicProjects || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 2) Thunk to update academicProjects
export const updateAcademicProjects = createAsyncThunk(
  "academicProjects/updateAcademicProjects",
  async ({ studentId, universityName, token, academicProjects }, thunkAPI) => {
    try {
      // NOTE: Make sure this URL matches your backend's route exactly.
      // Some backends listen on PUT /student/:id?universityName=… with a body { academicProjects: […] }
      const response = await axios.put(
        `${BASE_URL}/student/${studentId}`, 
        { academicProjects },
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      // If your backend returns { student: { … } }, we only need updated academicProjects
      return response.data.student.academicProjects || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  data: null,          // This will eventually hold an array of project objects
  loading: false,
  error: null,
  updateStatus: null,  // 'success' | 'failed' | null
};

const academicProjectsSlice = createSlice({
  name: "academicProjects",
  initialState,
  reducers: {
    clearUpdateStatus: (state) => {
      state.updateStatus = null;
    },
  },
  extraReducers: (builder) => {
    // fetchAcademicProjects
    builder
      .addCase(fetchAcademicProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAcademicProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;       // <-- this is the array of projects
        state.error = null;
      })
      .addCase(fetchAcademicProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateAcademicProjects
      .addCase(updateAcademicProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateStatus = null;
      })
      .addCase(updateAcademicProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.updateStatus = "success";
        state.data = action.payload;        // <-- the server returned the updated array
      })
      .addCase(updateAcademicProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateStatus = "failed";
      });
  },
});

export const { clearUpdateStatus } = academicProjectsSlice.actions;
export default academicProjectsSlice.reducer;
export const academicProjectsReducer = academicProjectsSlice.reducer;
export const academicProjectsData = (state) => state.academicProjects.data;
export const academicProjectsLoading = (state) => state.academicProjects.loading;
export const academicProjectsError = (state) => state.academicProjects.error;
export const academicProjectsUpdateStatus = (state) => state.academicProjects.updateStatus;