import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL configured in Vite
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Async thunk to upload placement data file.
 * Expects an object with `universityName` and `file` (File) as properties.
 * On success, returns an object with updatedRecords and failedRecords arrays.
 */
export const uploadPlacements = createAsyncThunk(
  'placement/uploadPlacements',
  async ({ universityName, file }, thunkAPI) => {
    try {
      // Retrieve auth token from localStorage
      const token = localStorage.getItem('University authToken');
      // Construct URL with encoded universityName
      const url = `${BASE_URL}/placement/upload-placements?universityName=${encodeURIComponent(
        universityName
      )}`;
      // Prepare form data with the uploaded file
      const formData = new FormData();
      formData.append('file', file);

      // POST the file to the server
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Expecting response.data to include updatedRecords & failedRecords
      return {
        updatedRecords: response.data.updatedRecords || [],
        failedRecords: response.data.failedRecords || [],
      };
    } catch (error) {
      // Extract error message
      const message =
        error.response?.data?.error || error.message || 'Upload failed.';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const uploadPlacementSlice = createSlice({
  name: 'placement',
  initialState: {
    updatedRecords: [],    // Successfully updated entries
    failedRecords: [],     // Entries that failed validation or update
    loading: false,        // Upload in progress flag
    error: null,           // Error message if upload fails
    successMessage: null,  // Success message on completion
  },
  reducers: {
    /**
     * Clear all placement upload state (useful when closing modals or resetting forms)
     */
    clearPlacementState(state) {
      state.updatedRecords = [];
      state.failedRecords = [];
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending: reset errors and begin loading
      .addCase(uploadPlacements.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
        state.updatedRecords = [];
        state.failedRecords = [];
      })
      // Fulfilled: store returned records and set a success message
      .addCase(uploadPlacements.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedRecords = action.payload.updatedRecords;
        state.failedRecords = action.payload.failedRecords;
        state.successMessage = 'Placement data uploaded successfully!';
      })
      // Rejected: store the error message
      .addCase(uploadPlacements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

// Export actions and reducer
export const { clearPlacementState } = uploadPlacementSlice.actions;
export default uploadPlacementSlice.reducer;
export const uploadPlacementReducer = uploadPlacementSlice.reducer;