import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch work experience
export const fetchWorkExperience = createAsyncThunk(
  'workExperience/fetchWorkExperience',
  async ({ studentId, universityName, token, BASE_URL }, thunkAPI) => {
    const response = await axios.get(
      `${BASE_URL}/student/${studentId}?universityName=${encodeURIComponent(universityName)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.student.workExperience || [];
  }
);

// Update work experience
export const updateWorkExperience = createAsyncThunk(
  'workExperience/updateWorkExperience',
  async ({ studentId, universityName, token, BASE_URL, workExperience }, thunkAPI) => {
    const response = await axios.put(
      `${BASE_URL}/student/${studentId}/update-experience?universityName=${encodeURIComponent(universityName)}`,
      { workExperience },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
  updateStatus: null,
};

const workExperienceSlice = createSlice({
  name: 'workExperience',
  initialState,
  reducers: {
    clearUpdateStatus: (state) => {
      state.updateStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWorkExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateWorkExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateStatus = null;
      })
      .addCase(updateWorkExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.updateStatus = 'success';
      })
      .addCase(updateWorkExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.updateStatus = 'failed';
      });
  },
});

export const { clearUpdateStatus } = workExperienceSlice.actions;
export default workExperienceSlice.reducer;
export const workExperienceReducer = workExperienceSlice.reducer;