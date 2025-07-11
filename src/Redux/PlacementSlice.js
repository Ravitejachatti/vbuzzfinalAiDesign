// src/Redux/placementSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ─── FETCH ALL ────────────────────────────────────────────────────────────────
export const fetchPlacements = createAsyncThunk(
  "placements/fetchPlacements",
  async ({ token, universityName }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/placement/getAllplacements?universityName=${encodeURIComponent(
          universityName
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.data || [];
    } catch (err) {
      console.error("Failed to fetch placements:", err);
      return thunkAPI.rejectWithValue("Failed to fetch placements");
    }
  }
);

// ─── ADD ONE ─────────────────────────────────────────────────────────────────
export const addPlacement = createAsyncThunk(
  "placements/addPlacement",
  async ({ token, formData, universityName }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/placement/addplacement?universityName=${encodeURIComponent(
          universityName
        )}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.data.placement;
    } catch (err) {
      console.error("Error adding placement:", err);
      return thunkAPI.rejectWithValue("Failed to add placement");
    }
  }
);

// ─── UPDATE ONE (and then re‐fetch the list) ─────────────────────────────────
export const updatePlacements = createAsyncThunk(
  "placements/updatePlacement",
  async ({ token, id, patchData, universityName }, thunkAPI) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/placement/updateplacements/${id}?universityName=${encodeURIComponent(
          universityName
        )}`,
        patchData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // After a successful PUT, immediately re-fetch the full, populated list:
      thunkAPI.dispatch(
        fetchPlacements({ token, universityName })
      );

      return res.data.data; // this is mostly returned so you could act on it if needed
    } catch (err) {
      console.error("Error updating placement:", err);
      return thunkAPI.rejectWithValue("Failed to update placement");
    }
  }
);

// ─── DELETE ONE ────────────────────────────────────────────────────────────────
export const deletePlacement = createAsyncThunk(
  "placements/deletePlacement",
  async ({ token, id, universityName }, thunkAPI) => {
    try {
      await axios.delete(
        `${BASE_URL}/placement/deleteplacements/${id}?universityName=${encodeURIComponent(
          universityName
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return id;
    } catch (err) {
      console.error("Error deleting placement:", err);
      return thunkAPI.rejectWithValue("Failed to delete placement");
    }
  }
);

// ─── SLICE ───────────────────────────────────────────────────────────────────
const placementSlice = createSlice({
  name: "placements",
  initialState: { placements: [], loading: false },
  reducers: {}, // ← note the plural
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchPlacements.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlacements.fulfilled, (state, action) => {
        state.placements = action.payload;
        state.loading = false;
      })
      .addCase(fetchPlacements.rejected, (state) => {
        state.loading = false;
      })

      // ADD
      .addCase(addPlacement.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPlacement.fulfilled, (state, action) => {
        state.placements.push(action.payload);
        state.loading = false;
      })
      .addCase(addPlacement.rejected, (state) => {
        state.loading = false;
      })

      // UPDATE
      .addCase(updatePlacements.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePlacements.fulfilled, (state) => {
        // no in‐place replace needed, since we immediately re‐fetched the list
        state.loading = false;
      })
      .addCase(updatePlacements.rejected, (state) => {
        state.loading = false;
      })

      // DELETE
      .addCase(deletePlacement.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePlacement.fulfilled, (state, action) => {
        state.placements = state.placements.filter(
          (p) => p._id !== action.payload
        );
        state.loading = false;
      })
      .addCase(deletePlacement.rejected, (state) => {
        state.loading = false;
      });
  },
});


export const placements=placementSlice.reducer 
export default placementSlice.reducer;
