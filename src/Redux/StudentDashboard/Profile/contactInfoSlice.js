import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch contact info
export const fetchContactInfo = createAsyncThunk(
  'contactInfo/fetchContactInfo',
  async ({ studentId, universityName, token, BASE_URL }, thunkAPI) => {
    const response = await axios.get(
      `${BASE_URL}/student/${studentId}?universityName=${encodeURIComponent(universityName)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.student.contactInfo || {
      phone: "",
      email: "",
      address: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
      },
    };
  }
);

// Update contact info
export const updateContactInfo = createAsyncThunk(
  'contactInfo/updateContactInfo',
  async ({ studentId, universityName, token, BASE_URL, contactInfo }, thunkAPI) => {
    const response = await axios.put(
      `${BASE_URL}/student/${studentId}/update-contact?universityName=${encodeURIComponent(universityName)}`,
      { contactInfo },
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

const contactInfoSlice = createSlice({
  name: 'contactInfo',
  initialState,
  reducers: {
    clearUpdateStatus: (state) => {
      state.updateStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchContactInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateContactInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateStatus = null;
      })
      .addCase(updateContactInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.updateStatus = 'success';
      })
      .addCase(updateContactInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.updateStatus = 'failed';
      });
  },
});

export const { clearUpdateStatus } = contactInfoSlice.actions;
export default contactInfoSlice.reducer;
export const contactInfoReducer = contactInfoSlice.reducer;