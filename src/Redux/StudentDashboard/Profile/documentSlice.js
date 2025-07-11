import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch documents
export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async ({ studentId, universityName, token, BASE_URL }, thunkAPI) => {
    const response = await axios.get(
      `${BASE_URL}/student/${studentId}?universityName=${encodeURIComponent(universityName)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.student.documents || {
      transcripts: [],
      resumeOrCV: "",
      personalStatement: "",
      coverLetter: "",
      lettersOfRecommendation: [],
      offerLetters: [],
      testScores: [{ testName: "", score: "" }],
    };
  }
);

// Update documents
export const updateDocuments = createAsyncThunk(
  'documents/updateDocuments',
  async ({ studentId, universityName, token, BASE_URL, documents }, thunkAPI) => {
    const response = await axios.put(
      `${BASE_URL}/student/${studentId}/update-documents?universityName=${encodeURIComponent(universityName)}`,
      { documents },
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

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    clearUpdateStatus: (state) => {
      state.updateStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateStatus = null;
      })
      .addCase(updateDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.updateStatus = 'success';
      })
      .addCase(updateDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.updateStatus = 'failed';
      });
  },
});

export const { clearUpdateStatus } = documentsSlice.actions;
export default documentsSlice.reducer;
export const documentsReducer = documentsSlice.reducer;