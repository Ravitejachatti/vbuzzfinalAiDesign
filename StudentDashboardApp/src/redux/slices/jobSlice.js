import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:3003/api';

// Fetch eligible jobs
export const fetchJobs = createAsyncThunk(
  'job/fetchJobs',
  async ({ universityName }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('Student_token');
      const response = await axios.get(
        `${BASE_URL}/student/jobs/getEligibleJobs`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Apply to job
export const applyToJob = createAsyncThunk(
  'job/applyToJob',
  async ({ jobId, universityName }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('Student_token');
      const response = await axios.post(
        `${BASE_URL}/student/jobs/${jobId}/apply`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      return { jobId, message: response.data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
      return rejectWithValue({ jobId, error: errorMsg });
    }
  }
);

const jobSlice = createSlice({
  name: 'job',
  initialState: {
    jobs: [],
    loading: false,
    error: null,
    applyingJobIds: [],
    applyError: null,
    applySuccessMessage: null,
  },
  reducers: {
    clearApplyStatus: (state) => {
      state.applyError = null;
      state.applySuccessMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.sort(
          (a, b) => new Date(b.closingDate) - new Date(a.closingDate)
        );
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Apply to job
      .addCase(applyToJob.pending, (state, action) => {
        state.applyingJobIds.push(action.meta.arg.jobId);
        state.applyError = null;
        state.applySuccessMessage = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        const { jobId, message } = action.payload;
        state.applyingJobIds = state.applyingJobIds.filter(id => id !== jobId);
        state.applySuccessMessage = message;
      })
      .addCase(applyToJob.rejected, (state, action) => {
        const { jobId, error } = action.payload;
        state.applyingJobIds = state.applyingJobIds.filter(id => id !== jobId);
        state.applyError = error;
      });
  },
});

export const { clearApplyStatus } = jobSlice.actions;
export default jobSlice.reducer;