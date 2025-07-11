// src/Redux/Placement/placementReportsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Thunk: fetch placement reports by graduation year & university
export const fetchPlacementReports = createAsyncThunk(
  'placementReports/fetch',
  async ({ token, universityName, graduationYear }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/placement/placement-reports`,
        {
          params: { universityName, graduationYear },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data?.success) return response.data.data;
      return rejectWithValue(response.data.message || 'No data');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// thunk to toggle eligibility
export const toggleEligibility = createAsyncThunk(
  "placementReports/toggleEligibility",
  async (
    { studentIds, canApply, token, universityName, graduationYear },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/job/jobs/canApply`,
        { studentIds, canApply },
        {
          params: { universityName },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // re-fetch fresh reports:
      await dispatch(fetchPlacementReports({ token, universityName, graduationYear }));
      return data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const placementReportsSlice = createSlice({
  name: 'placementReports',
  initialState: {
    list: [],
    loading: false,
    error: null,
    toggleMessage: null,
    toggling: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlacementReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlacementReports.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPlacementReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       .addCase(toggleEligibility.pending, state => {
        state.toggling = true;
        state.toggleMessage = null;
      })
      .addCase(toggleEligibility.fulfilled, (state, { payload }) => {
        state.toggling = false;
        state.toggleMessage = payload;
      })
      .addCase(toggleEligibility.rejected, (state, { payload }) => {
        state.toggling = false;
        state.toggleMessage = payload;
      });
  },
});

export default placementReportsSlice.reducer;
export const placementReportsReducer = placementReportsSlice.reducer;