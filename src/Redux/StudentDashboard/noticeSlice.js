import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("Student token");

// Thunk to fetch all notices for a given universityName
export const fetchNotices = createAsyncThunk(
  "notice/fetchNotices",
  
  async ({ universityName }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Student token");
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

// Thunk to mark a single notice as read
export const markNoticeAsRead = createAsyncThunk(
  "notice/markNoticeAsRead",
  async ({ noticeId, universityName }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Student token");
      await axios.patch(
        `${BASE_URL}/notice/notices/${noticeId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      // Return the ID so reducer can flip its isRead flag
      return noticeId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const noticeSlice = createSlice({
  name: "notice",
  initialState: {
    notices: [],
    loading: false,
    error: null,
    markingReadIds: [], // track which notice-IDs are currently being marked
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchNotices
      .addCase(fetchNotices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loading = false;
        // sort by createdAt (newest first)
        state.notices = action.payload.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // markNoticeAsRead
      .addCase(markNoticeAsRead.pending, (state, action) => {
        // add this noticeId to markingReadIds
        state.markingReadIds.push(action.meta.arg.noticeId);
      })
      .addCase(markNoticeAsRead.fulfilled, (state, action) => {
        const id = action.payload;
        // flip its isRead flag locally
        const idx = state.notices.findIndex((n) => n._id === id);
        if (idx !== -1) {
          state.notices[idx].isRead = true;
        }
        // remove from markingReadIds
        state.markingReadIds = state.markingReadIds.filter(
          (nid) => nid !== id
        );
      })
      .addCase(markNoticeAsRead.rejected, (state, action) => {
        const id = action.meta.arg.noticeId;
        state.markingReadIds = state.markingReadIds.filter(
          (nid) => nid !== id
        );
        state.error = action.payload;
      });
  },
});


export const noticeReducer = noticeSlice.reducer;
export default noticeSlice.reducer;



