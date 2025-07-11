import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch skills
export const fetchSkills = createAsyncThunk(
  'skills/fetchSkills',
  async ({ studentId, universityName, token, BASE_URL }, thunkAPI) => {
    const response = await axios.get(
      `${BASE_URL}/student/${studentId}?universityName=${encodeURIComponent(universityName)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.student.skillsAndCompetencies || {
      technicalSkills: [],
      softSkills: [],
      languagesKnown: [],
    };
  }
);

// Update skills
export const updateSkills = createAsyncThunk(
  'skills/updateSkills',
  async ({ studentId, universityName, token, BASE_URL, skillsAndCompetencies }, thunkAPI) => {
    const response = await axios.put(
      `${BASE_URL}/student/${studentId}/update-skills?universityName=${encodeURIComponent(universityName)}`,
      { skillsAndCompetencies },
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

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    clearUpdateStatus: (state) => {
      state.updateStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateStatus = null;
      })
      .addCase(updateSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.updateStatus = 'success';
      })
      .addCase(updateSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.updateStatus = 'failed';
      });
  },
});

export const { clearUpdateStatus } = skillsSlice.actions;
export default skillsSlice.reducer;
export const skillsReducer = skillsSlice.reducer;