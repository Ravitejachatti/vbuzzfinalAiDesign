// src/Redux/Student/documentVerificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDocumentVerification = createAsyncThunk(
  'documentVerification/fetch',
  async ({ studentId, universityName, token }, thunkAPI) => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/student/${studentId}?universityName=${encodeURIComponent(universityName)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.student.documentVerification || {};
  }
);

export const updateDocumentVerification = createAsyncThunk(
  'documentVerification/update',
  async ({ studentId, universityName, token, data }, thunkAPI) => {
    const res = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/student/${studentId}/update-verification?universityName=${encodeURIComponent(universityName)}`,
      { documentVerification: data },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  }
);

const documentVerificationSlice = createSlice({
  name: 'documentVerification',
  initialState: {
    loading: false,
    error: null,
    data: { aadharNumber: '', passportNumber: '' },
    message: '',
  },
  reducers: {
    clearMessage(state) {
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocumentVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocumentVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDocumentVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to fetch document verification details.";
      })
      .addCase(updateDocumentVerification.fulfilled, (state) => {
        state.message = "Document verification details updated successfully!";
      })
      .addCase(updateDocumentVerification.rejected, (state) => {
        state.message = "Failed to update document verification details.";
      });
  }
});

export const { clearMessage } = documentVerificationSlice.actions;
export default documentVerificationSlice.reducer;
export const documentVerificationReducer = documentVerificationSlice.reducer;