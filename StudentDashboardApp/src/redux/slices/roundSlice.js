import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:3003/api';

// Fetch rounds for a job
export const fetchRounds = createAsyncThunk(
  'round/fetchRounds',
  async ({ jobId, universityName }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('Student_token');
      const response = await axios.get(
        `${BASE_URL}/student/rounds/getRoundStatus/${jobId}`,
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

const roundSlice = createSlice({
  name: 'round',
  initialState: {
    rounds: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRounds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRounds.fulfilled, (state, action) => {
        state.loading = false;
        state.rounds = action.payload;
      })
      .addCase(fetchRounds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default roundSlice.reducer;