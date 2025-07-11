// src/Redux/noticeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1️⃣ Fetch all notices
export const fetchNotices = createAsyncThunk(
  'notice/fetchNotices',
  async ({ universityName, token }, thunkAPI) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/notice`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      // assume API returns { data: { data: [...] } }
      console.log('Fetched notices:', res.data.data);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 2️⃣ Add a new notice (you already had this)
export const addNotice = createAsyncThunk(
  'notice/addNotice',
  async ({ universityName, noticeData }, thunkAPI) => {
    try {
      const token = localStorage.getItem('University authToken');
      const res = await axios.post(
        `${BASE_URL}/notice`,
        noticeData,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 3️⃣ Update an existing notice
export const updateNotice = createAsyncThunk(
  'notice/updateNotice',
  async ({ universityName, noticeId, updateData }, thunkAPI) => {
    try {
      const token = localStorage.getItem('University authToken');
      await axios.put(
        `${BASE_URL}/notice/${noticeId}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      return noticeId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 4️⃣ Delete a notice
export const deleteNotice = createAsyncThunk(
  'notice/deleteNotice',
  async ({ universityName, noticeId }, thunkAPI) => {
    try {
      const token = localStorage.getItem('University authToken');
      await axios.delete(
        `${BASE_URL}/notice/${noticeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      return noticeId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

const noticeSlice = createSlice({
  name: 'notice',
  initialState: {
    items: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearNoticeState(state) {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (b) => {
    b
      // FETCH
      .addCase(fetchNotices.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchNotices.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.items = payload;
        s.error = null;
      })
      .addCase(fetchNotices.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      })

      // ADD
      .addCase(addNotice.pending, (s) => {
        s.loading = true;
        s.error = null;
        s.success = null;
      })
      .addCase(addNotice.fulfilled, (s) => {
        s.loading = false;
        s.success = 'Notice added!';
      })
      .addCase(addNotice.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      })

      // UPDATE
      .addCase(updateNotice.pending, (s) => {
        s.loading = true;
        s.error = null;
        s.success = null;
      })
      .addCase(updateNotice.fulfilled, (s, { payload: id }) => {
        s.loading = false;
        s.items = s.items.map((n) => (n._id === id ? { ...n, ...s.updating } : n));
        s.success = 'Notice updated!';
      })
      .addCase(updateNotice.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      })

      // DELETE
      .addCase(deleteNotice.pending, (s) => {
        s.loading = true;
        s.error = null;
        s.success = null;
      })
      .addCase(deleteNotice.fulfilled, (s, { payload: id }) => {
        s.loading = false;
        s.items = s.items.filter((n) => n._id !== id);
        s.success = 'Notice deleted!';
      })
      .addCase(deleteNotice.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      });
  },
});

export const { clearNoticeState } = noticeSlice.actions;
export default noticeSlice.reducer;

export const createNoticeReducer = noticeSlice.reducer;
