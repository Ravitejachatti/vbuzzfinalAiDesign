import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:3003/api';

// Update personal details
export const updatePersonalDetails = createAsyncThunk(
  'profile/updatePersonalDetails',
  async ({ studentId, universityName, personalDetails }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('Student_token');
      const response = await axios.put(
        `${BASE_URL}/student/${studentId}/update-personal`,
        personalDetails,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update education details
export const updateEducationDetails = createAsyncThunk(
  'profile/updateEducationDetails',
  async ({ studentId, universityName, educationDetails }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('Student_token');
      const response = await axios.put(
        `${BASE_URL}/student/${studentId}/update-education`,
        educationDetails,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    loading: false,
    error: null,
    updateStatus: null,
  },
  reducers: {
    clearUpdateStatus: (state) => {
      state.updateStatus = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Personal details
      .addCase(updatePersonalDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateStatus = null;
      })
      .addCase(updatePersonalDetails.fulfilled, (state) => {
        state.loading = false;
        state.updateStatus = 'success';
      })
      .addCase(updatePersonalDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateStatus = 'failed';
      })
      // Education details
      .addCase(updateEducationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateStatus = null;
      })
      .addCase(updateEducationDetails.fulfilled, (state) => {
        state.loading = false;
        state.updateStatus = 'success';
      })
      .addCase(updateEducationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateStatus = 'failed';
      });
  },
});

export const { clearUpdateStatus } = profileSlice.actions;
export default profileSlice.reducer;