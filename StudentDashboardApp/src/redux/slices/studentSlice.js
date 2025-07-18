import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:3003/api'; // Update with your API URL

// Fetch student data
export const fetchStudent = createAsyncThunk(
  'student/fetchStudent',
  async ({ studentId, universityName }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('Student_token');
      const response = await axios.get(
        `${BASE_URL}/student/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      return response.data.student;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearStudent: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStudent } = studentSlice.actions;
export default studentSlice.reducer;