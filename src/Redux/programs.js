import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1️⃣ Add Program
export const addProgram = createAsyncThunk(
  'programs/add',
  async ({ token, universityName, finalProgramData }, thunkAPI) => {
    try { 
      const response = await axios.post(
        `${BASE_URL}/program/addprogram?universityName=${encodeURIComponent(
          universityName
        )}`,
        finalProgramData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.data;
    } catch (err) {
      let errorMessage = "Failed to add program. Please try again.";
      if (err.response) {
        errorMessage = err.response.data?.message || errorMessage;
      } else if (err.request) {
        errorMessage =
          "No response from the server. Please check your internet connection.";
      } else {
        errorMessage = err.message;
      }
      console.error("Error adding program:", err);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// 2️⃣ Fetch Programs
export const fetchProgram = createAsyncThunk(
  'programs/fetchAll',
  async ({ token, universityName }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/program/getprograms?universityName=${encodeURIComponent(
          universityName
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (err) {
      console.error("Error fetching programs:", err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch programs"
      );
    }
  }
);

// 3️⃣ Edit Program
export const editProgram = createAsyncThunk(
  'programs/edit',
  async ({ token, universityName, id, changes }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/program/updateprogram/${id}?universityName=${encodeURIComponent(
          universityName
        )}`,
        changes,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// 4️⃣ Delete Program
export const deleteProgram = createAsyncThunk(
  'programs/delete',
  async ({ token, universityName, id }, thunkAPI) => {
    try {
      await axios.delete(
        `${BASE_URL}/program/deleteprogram/${id}?universityName=${encodeURIComponent(
          universityName
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return id;
    } catch (err) {
      console.error("Failed to delete program:", err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete program"
      );
    }
  }
);

// Slice
const programSlice = createSlice({
  name: 'programs',
  initialState: {
    programs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProgram.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgram.fulfilled, (state, action) => {
        state.programs = action.payload;
        state.loading = false;
      })
      .addCase(fetchProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addProgram.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProgram.fulfilled, (state, action) => {
        state.programs.push(action.payload);
        state.loading = false;
      })
      .addCase(addProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit
      .addCase(editProgram.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProgram.fulfilled, (state, action) => {
        const idx = state.programs.findIndex(
          (p) => p._id === action.payload._id
        );
        if (idx !== -1) state.programs[idx] = action.payload;
        state.loading = false;
      })
      .addCase(editProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteProgram.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProgram.fulfilled, (state, action) => {
        state.programs = state.programs.filter(
          (p) => p._id !== action.payload
        );
        state.loading = false;
      })
      .addCase(deleteProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const programs = programSlice.reducer;
export default programSlice.reducer;
