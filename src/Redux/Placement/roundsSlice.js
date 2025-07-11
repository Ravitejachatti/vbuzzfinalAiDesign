import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1️⃣ Fetch all rounds for a job
export const fetchRoundsByJob = createAsyncThunk(
  "rounds/fetchByJob",
  async ({ token, universityName, jobId }, thunkAPI) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/job/jobs/${jobId}/getAllRounds?universityName=${universityName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // API returns data[0].rounds
      return res.data.data[0]?.rounds || [];
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch rounds");
    }
  }
);

// 2️⃣ Add a new round
export const addRound = createAsyncThunk(
  "rounds/add",
  async ({ token, universityName, jobId, roundData, applicants }, thunkAPI) => {
    try {
      await axios.post(
        `${BASE_URL}/job/jobs/${jobId}/addRounds?universityName=${universityName}`,
        { roundData, applicants },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // return payload so we can refetch
      return { jobId };
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to add round");
    }
  }
);

// 3️⃣ Update an existing round
export const updateRound = createAsyncThunk(
  "rounds/update",
  async ({ token, universityName, jobId, roundIndex, updateData }, thunkAPI) => {
    try {
      await axios.put(
        `${BASE_URL}/job/jobs/${jobId}/updateRounds/${roundIndex}?universityName=${universityName}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { jobId };
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to update round");
    }
  }
);

// 4️⃣ Delete a round
export const deleteRound = createAsyncThunk(
  "rounds/delete",
  async ({ token, universityName, jobId, roundIndex }, thunkAPI) => {
    try {
      await axios.delete(
        `${BASE_URL}/job/jobs/${jobId}/deleteRounds/${roundIndex}?universityName=${universityName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { jobId };
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to delete round");
    }
  }
);

const roundsSlice = createSlice({
  name: "rounds",
  initialState: {
    roundsList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b
      // FETCH
      .addCase(fetchRoundsByJob.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchRoundsByJob.fulfilled, (s, { payload }) => {
        s.loading = false; s.roundsList = payload;
      })
      .addCase(fetchRoundsByJob.rejected, (s, { payload }) => {
        s.loading = false; s.error = payload;
      })

      // ADD → refetch
      .addCase(addRound.fulfilled, (s, { payload }) => {
        s.loading = false; 
      })
      .addCase(addRound.rejected, (s, { payload }) => {
        s.loading = false; s.error = payload;
      })

      // UPDATE → refetch
      .addCase(updateRound.fulfilled, (s) => { s.loading = false })
      .addCase(updateRound.rejected, (s, { payload }) => {
        s.loading = false; s.error = payload;
      })

      // DELETE → refetch
      .addCase(deleteRound.fulfilled, (s) => { s.loading = false })
      .addCase(deleteRound.rejected, (s, { payload }) => {
        s.loading = false; s.error = payload;
      });
  },
});

export default roundsSlice.reducer;
export const roundsReducer = roundsSlice.reducer;