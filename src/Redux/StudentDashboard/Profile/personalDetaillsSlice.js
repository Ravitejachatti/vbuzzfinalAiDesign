import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch personal details
export const fetchPersonalDetails = createAsyncThunk(
  'personalDetails/fetchPersonalDetails',
  async ({ studentId, universityName, token, BASE_URL }, thunkAPI) => {
    const response = await axios.get(
      `${BASE_URL}/student/${studentId}?universityName=${encodeURIComponent(universityName)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.student;
  }
);

// Update personal details
export const updatePersonalDetails = createAsyncThunk(
  'personalDetails/updatePersonalDetails',
  async ({ studentId, universityName, token, BASE_URL, personalDetails }, thunkAPI) => {
    const response = await axios.put(
      `${BASE_URL}/student/${studentId}/update-personal?universityName=${encodeURIComponent(universityName)}`,
      personalDetails,
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

const personalDetailsSlice = createSlice({
  name: 'personalDetails',
  initialState,
  reducers: {
    clearUpdateStatus: (state) => {
      state.updateStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchPersonalDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonalDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPersonalDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update
      .addCase(updatePersonalDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateStatus = null;
      })
      .addCase(updatePersonalDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.updateStatus = 'success';
        state.data = action.payload.student; // Assuming the response contains the updated student object
        state.error = null;
        // Optionally, you can also update the data directly if needed  
      })
      .addCase(updatePersonalDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.updateStatus = 'failed';
      });
  },
});

export const { clearUpdateStatus } = personalDetailsSlice.actions;
export default personalDetailsSlice.reducer;
export const personalDetailsReducer = personalDetailsSlice.reducer;
