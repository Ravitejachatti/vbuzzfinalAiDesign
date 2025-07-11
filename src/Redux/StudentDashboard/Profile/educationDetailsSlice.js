import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch education details
export const fetchEducationDetails = createAsyncThunk(
  'educationDetails/fetchEducationDetails',
  async ({ studentId, universityName, token, BASE_URL }, thunkAPI) => {
    const response = await axios.get(
      `${BASE_URL}/student/${studentId}?universityName=${encodeURIComponent(universityName)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.student;
  }
);

// Update education details
export const updateEducationDetails = createAsyncThunk(
  'educationDetails/updateEducationDetails',
  async ({ studentId, universityName, token, BASE_URL, educationDetails }, thunkAPI) => {
    const response = await axios.put(
      `${BASE_URL}/student/${studentId}/update-education?universityName=${encodeURIComponent(universityName)}`,
      educationDetails,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
  updateStatus: null,
};

const educationDetailsSlice = createSlice({
  name: 'educationDetails',
  initialState,
  reducers: {
    clearUpdateStatus: (state) => {
      state.updateStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEducationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEducationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEducationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateEducationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateStatus = null;
      })
      .addCase(updateEducationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.updateStatus = 'success';
      })
      .addCase(updateEducationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.updateStatus = 'failed';
      });
  },
});

export const { clearUpdateStatus } = educationDetailsSlice.actions;
export default educationDetailsSlice.reducer;
export const educationDetailsReducer = educationDetailsSlice.reducer;
