import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch parent details
export const fetchParentDetails = createAsyncThunk(
  'parentDetails/fetchParentDetails',
  async ({ studentId, universityName, token, BASE_URL }, thunkAPI) => {
    const response = await axios.get(
      `${BASE_URL}/student/${studentId}?universityName=${encodeURIComponent(universityName)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.student.parentDetails || {
      name: "",
      contactNumber: "",
      occupation: "",
      address: "",
    };
  }
);

// Update parent details
export const updateParentDetails = createAsyncThunk(
  'parentDetails/updateParentDetails',
  async ({ studentId, universityName, token, BASE_URL, parentDetails }, thunkAPI) => {
    const response = await axios.put(
      `${BASE_URL}/student/${studentId}/update-parents?universityName=${encodeURIComponent(universityName)}`,
      { parentDetails },
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

const parentDetailsSlice = createSlice({
  name: 'parentDetails',
  initialState,
  reducers: {
    clearUpdateStatus: (state) => {
      state.updateStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchParentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateParentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateStatus = null;
      })
      .addCase(updateParentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.updateStatus = 'success';
      })
      .addCase(updateParentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.updateStatus = 'failed';
      });
  },
});

export const { clearUpdateStatus } = parentDetailsSlice.actions;
export default parentDetailsSlice.reducer;
export const parentDetailsReducer = parentDetailsSlice.reducer;