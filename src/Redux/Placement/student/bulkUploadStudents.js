// src/Redux/Placement/student/bulkUploadStudents.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk
export const bulkUploadStudents = createAsyncThunk(
  "bulkUpload/bulkUploadStudents",
  async ({ formData, token, universityName, BASE_URL }, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/student/bulk-upload?universityName=${universityName}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Bulk upload successful:", data);
      return data;
    } catch (err) {
      console.error("Error uploading bulk students:", err.response?.data);
      // build a single payload object
      const payload = {
        error:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Bulk upload failed",
        reasons: err.response?.data?.reasons || [],
      };
      return thunkAPI.rejectWithValue(payload);
    }
  }
);

const bulkUploadSlice = createSlice({
  name: "bulkUpload",
  initialState: {
    status: "idle",
    error: null,
    result: null,
    reasons: [],
  },
  reducers: {
    resetBulkUploadStatus(state) {
      state.status = "idle";
      state.error = null;
      state.result = null;
      state.reasons = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bulkUploadStudents.pending, (state) => {
        state.status = "pending";
        state.error = null;
        state.result = null;
        state.reasons = [];
      })
      .addCase(bulkUploadStudents.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.result = payload;
        state.reasons = payload.failedRecords || [];
      })
      .addCase(bulkUploadStudents.rejected, (state, { payload }) => {
        state.status = "failed";
        // payload is our object { error, reasons }
        state.error = payload.error;
        state.result = null;
        state.reasons = payload.reasons;
      });
  },
});

export const { resetBulkUploadStatus } = bulkUploadSlice.actions;
export default bulkUploadSlice.reducer;
export const bulkUploadReducer = bulkUploadSlice.reducer;
export const selectBulkUploadStatus = (s) => s.bulkUpload.status;
export const selectBulkUploadError = (s) => s.bulkUpload.error;
export const selectBulkUploadResult = (s) => s.bulkUpload.result;
export const selectBulkUploadReasons = (s) => s.bulkUpload.reasons;
