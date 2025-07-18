import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:3003/api';

// Fetch notices
export const fetchNotices = createAsyncThunk(
  'notice/fetchNotices',
  async ({ universityName }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('Student_token');
      const response = await axios.get(
        `${BASE_URL}/student/notice/allnotices`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Mark notice as read
export const markNoticeAsRead = createAsyncThunk(
  'notice/markNoticeAsRead',
  async ({ noticeId, universityName }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('Student_token');
      await axios.patch(
        `${BASE_URL}/notice/notices/${noticeId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      return noticeId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const noticeSlice = createSlice({
  name: 'notice',
  initialState: {
    notices: [],
    loading: false,
    error: null,
    markingReadIds: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch notices
      .addCase(fetchNotices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = action.payload.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark as read
      .addCase(markNoticeAsRead.pending, (state, action) => {
        state.markingReadIds.push(action.meta.arg.noticeId);
      })
      .addCase(markNoticeAsRead.fulfilled, (state, action) => {
        const id = action.payload;
        const idx = state.notices.findIndex(n => n._id === id);
        if (idx !== -1) {
          state.notices[idx].isRead = true;
        }
        state.markingReadIds = state.markingReadIds.filter(nid => nid !== id);
      })
      .addCase(markNoticeAsRead.rejected, (state, action) => {
        const id = action.meta.arg.noticeId;
        state.markingReadIds = state.markingReadIds.filter(nid => nid !== id);
        state.error = action.payload;
      });
  },
});

export default noticeSlice.reducer;