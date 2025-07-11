// src/Redux/roundSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Thunk to fetch rounds for a particular job
export const fetchRounds = createAsyncThunk(
  "round/fetchRounds",
  async ({ jobId, universityName }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Student token");
      const response = await axios.get(
        `${BASE_URL}/student/rounds/getRoundStatus/${jobId}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {universityName },
        }
      );
      return response.data; // Rounds data
      console.log("Fetched rounds:", response.data);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

const roundSlice = createSlice({
  name: "round",
  initialState: {
    rounds: [],         // Rounds for the selected job
    loading: false,     // Loading state
    error: null,        // Error state
  },
  extraReducers: (builder) => {
    builder
      // Fetch rounds
      .addCase(fetchRounds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRounds.fulfilled, (state, action) => {
        state.loading = false;
        state.rounds = action.payload;
      })
      .addCase(fetchRounds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default roundSlice.reducer;

export const roundReducer = roundSlice.reducer;