// src/Redux/jobSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 1. Thunk: fetch all eligible jobs for this particular students
 */
export const fetchJobs = createAsyncThunk(
  "job/fetchJobs",
  async ({ universityName }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Student token");
      const response = await axios.get(
        `${BASE_URL}/student/jobs/getEligibleJobs`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      // response.data is an array of job objects
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

/**
 * 2. Thunk: apply to a single jobId
 */
export const applyToJob = createAsyncThunk(
  "job/applyToJob",
  async ({ jobId, universityName }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Student token");
      const response = await axios.post(
        `${BASE_URL}/student/jobs/${jobId}/apply`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      // return { jobId, message } so we know which job succeeded
      return { jobId, message: response.data.message };
    } catch (err) {
      // If API returns custom error under .data.error
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message;
      return rejectWithValue({ jobId, error: errorMsg });
    }
  }
);

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],                // array of job objects
    loading: false,          // for fetchJobs
    error: null,             // for fetchJobs
    applyingJobIds: [],      // list of jobIds currently being applied
    applyError: null,        // any apply errors
    applySuccessMessage: null,
  },
  reducers: {
    clearApplyStatus(state) {
      state.applyError = null;
      state.applySuccessMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchJobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        // Sort by closingDate descending
        state.jobs = action.payload.sort(
          (a, b) => new Date(b.closingDate) - new Date(a.closingDate)
        );
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // applyToJob
      .addCase(applyToJob.pending, (state, action) => {
        state.applyingJobIds.push(action.meta.arg.jobId);
        state.applyError = null;
        state.applySuccessMessage = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        const { jobId, message } = action.payload;
        state.applyingJobIds = state.applyingJobIds.filter(
          (id) => id !== jobId
        );
        state.applySuccessMessage = message;
      })
      .addCase(applyToJob.rejected, (state, action) => {
        const { jobId, error } = action.payload;
        state.applyingJobIds = state.applyingJobIds.filter(
          (id) => id !== jobId
        );
        state.applyError = error;
      });
  },
});

export const { clearApplyStatus } = jobSlice.actions;
export default jobSlice.reducer;
export const job=jobSlice.reducer

