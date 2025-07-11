// src/Redux/Jobslice.js
// here fetch all jobs, create job, edit job, delete job, fetchapplicants of job are here
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1️⃣ Fetch all jobs
export const fetchJobs = createAsyncThunk(
  "jobs/fetchAll",
  async ({ token, universityName }, thunkAPI) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/job/getAllJobs?universityName=${universityName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // assume API returns { data: { data: [...] } }
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch jobs");
    }
  }
);

// 2️⃣ Add a new job
export const addjob= createAsyncThunk(
  "jobs/add",
  async ({ token, formData, universityName }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/job/addJob?universityName=${universityName}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to add job");
    }
  }
);

// 3️⃣ Update an existing job
export const updateJob = createAsyncThunk(
  "jobs/update",
  async ({ token, formData, jobId, universityName }, thunkAPI) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/job/updateJob/${jobId}?universityName=${universityName}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      console.error("Failed to update job:", err);
      return thunkAPI.rejectWithValue("Failed to update job");
    }
  }
);

// 4️⃣ Delete a job
export const deleteJob = createAsyncThunk(
  "jobs/deletejob",
  async ({ token, jobId, universityName }, thunkAPI) => {
    try {
      await axios.delete(
        `${BASE_URL}/job/deleteJob/${jobId}?universityName=${universityName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );  
      return jobId;
    } catch (err) {
      console.error("Failed to delete job:", err);
      return thunkAPI.rejectWithValue("Failed to delete job");

    }
  }
);



// 5️⃣ Fetch applicants for a specific job
export const fetchApplicantsByJob = createAsyncThunk(
  "jobs/fetchApplicants",
  async ({ token, universityName, jobId }, thunkAPI) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/job/jobs/${jobId}/applicants?universityName=${universityName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.applicants || [];
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch applicants");
    }
  }
);

const jobslice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    applicants: [],   
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b
      // FETCH
      .addCase(fetchJobs.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchJobs.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.jobs = payload;
      })
      .addCase(fetchJobs.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      })

      // ADD
      .addCase(addjob.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(addjob.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.jobs.push(payload);
      })
      .addCase(addjob.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      })

      // UPDATE
      .addCase(updateJob.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(updateJob.fulfilled, (s, { payload }) => {
        s.loading = false;
        const idx = s.jobs.findIndex((j) => j._id === payload._id);
        if (idx !== -1) s.jobs[idx] = payload;
      })
      .addCase(updateJob.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      })

      // DELETE
      .addCase(deleteJob.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(deleteJob.fulfilled, (s, { payload: deletedId }) => {
        s.loading = false;
        s.jobs = s.jobs.filter((j) => j._id !== deletedId);
      })
      .addCase(deleteJob.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      })

            // FETCH APPLICANTS
      .addCase(fetchApplicantsByJob.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchApplicantsByJob.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.applicants = payload;
      })
      .addCase(fetchApplicantsByJob.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      });
  },
});

export default jobslice.reducer;


export const jobs= jobslice.reducer