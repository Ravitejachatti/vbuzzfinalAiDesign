import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Add Faculty
export const addFaculty = createAsyncThunk(
  "faculty/addFaculty",
  async ({ facultyData, universityName, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/faculty?universityName=${encodeURIComponent(universityName)}`,
        facultyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get All Faculty
export const getAllFaculty = createAsyncThunk(
  "faculty/getAllFaculty",
  async ({ universityName, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/faculty?universityName=${encodeURIComponent(universityName)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("faculty Response data:", response.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get Faculty by ID
export const getFacultyById = createAsyncThunk(
  "faculty/getFacultyById",
  async ({ id, universityName, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/faculty/${id}?universityName=${encodeURIComponent(universityName)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Redux/College/faculty.js
export const updateFaculty = createAsyncThunk(
  "faculty/updateFaculty",
  async ({ id, facultyData, universityName, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/faculty/${id}?universityName=${encodeURIComponent(universityName)}`,
        facultyData, // Directly pass the updated fields (e.g., { name: "Dr. testing" })
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Delete Faculty
export const deleteFaculty = createAsyncThunk(
  "faculty/deleteFaculty",
  async ({ id, universityName, token }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/faculty/${id}?universityName=${encodeURIComponent(universityName)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const facultySlice = createSlice({
  name: "faculty",
  initialState: {
    data: null,
    list: [],
    current: null,
    loading: false,
    error: null,
    success: false,
    deleteMessage: null,
  },
  reducers: {
    resetFacultyState: (state) => {
      state.data = null;
      state.list = [];
      state.current = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deleteMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add
      .addCase(addFaculty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addFaculty.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.success = true;
      })
      .addCase(addFaculty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All
      .addCase(getAllFaculty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFaculty.fulfilled, (state, action) => {
        state.loading = false;
        state.allFaculty = action.payload; 
      })
      .addCase(getAllFaculty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by ID
      .addCase(getFacultyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFacultyById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(getFacultyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateFaculty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateFaculty.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.success = true;
      })
      .addCase(updateFaculty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteFaculty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFaculty.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteMessage = action.payload;
      })
      .addCase(deleteFaculty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetFacultyState } = facultySlice.actions;
export default facultySlice.reducer;
export const facultyReducer = facultySlice.reducer;
