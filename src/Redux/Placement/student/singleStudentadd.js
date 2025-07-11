// src/Redux/Placement/student/singleStudentAddSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 1️⃣ Add student
export const addStudent = createAsyncThunk(
  "students/addStudent",
  async ({ formData, token, universityName, BASE_URL }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/student?universityName=${universityName}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to add student"
      );
    }
  }
);

// 2️⃣ Edit student
export const editStudent = createAsyncThunk(
  "students/editStudent",
  async ({ studentId, data, token, universityName, BASE_URL }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/student/${studentId}?universityName=${universityName}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;  // assume returns updated student
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to update student"
      );
    }
  }
);

// 3️⃣ Delete student
export const deleteStudent = createAsyncThunk(
  "students/deleteStudent",
  async ({ studentId, token, universityName, BASE_URL }, thunkAPI) => {
    try {
      await axios.delete(
        `${BASE_URL}/student/${studentId}?universityName=${universityName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return studentId;  // return the deleted id
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to delete student"
      );
    }
  }
);

const addStudentSlice = createSlice({
  name: "addStudent",
  initialState: {
    status: "idle",    // idle | pending | succeeded | failed
    error: null,
    student: null,
    updatedStudent: null,
    deletedStudentId: null,
    students: [], // to hold all students if needed
  },
  reducers: {
    resetAddStudentStatus: (state) => {
      state.status = "idle";
      state.error = null;
      state.student = null;
      state.updatedStudent = null;
      state.deletedStudentId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add
      .addCase(addStudent.pending, (state) => {
        state.status = "pending";
        state.error = null;
        state.student = null;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.student = action.payload;
         state.students.push(action.payload);
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.student = null;
      })

      // Edit
      .addCase(editStudent.pending, (state) => {
        state.status = "pending";
        state.error = null;
        state.updatedStudent = null;
      })
      .addCase(editStudent.fulfilled, (state, { payload }) => {
    const idx = state.students.findIndex(s => s._id === payload._id);
    if (idx !== -1) state.students[idx] = payload;
  })
      .addCase(editStudent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.updatedStudent = null;
      })

      // Delete
      .addCase(deleteStudent.pending, (state) => {
        state.status = "pending";
        state.error = null;
        state.deletedStudentId = null;
      })
       .addCase(deleteStudent.fulfilled, (state, { payload: id }) => {
    state.students = state.students.filter(s => s._id !== id);
  })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.deletedStudentId = null;
      });
      
   
  },
  
});

export const { resetAddStudentStatus } = addStudentSlice.actions;
export default addStudentSlice.reducer;
export const addStudentReducer = addStudentSlice.reducer;
export const addStudentActions = addStudentSlice.actions;

// Existing selectors
export const selectAddStudentStatus       = (state) => state.addStudent.status;
export const selectAddStudentError        = (state) => state.addStudent.error;
export const selectAddedStudent           = (state) => state.addStudent.student;

// New selectors for edit/delete
export const selectUpdatedStudent         = (state) => state.addStudent.updatedStudent;
export const selectDeletedStudentId       = (state) => state.addStudent.deletedStudentId;

// Keep the old naming convenience exports
export const selectAddStudent             = (state) => state.addStudent;
export const selectAddStudentState        = (state) => state.addStudent;
export const selectAddStudentLoading      = (state) => state.addStudent.status === "pending";
export const selectAddStudentSuccess      = (state) => state.addStudent.status === "succeeded";
export const selectAddStudentFailed       = (state) => state.addStudent.status === "failed";
export const selectAddStudentData         = (state) => state.addStudent.student;
export const selectAddStudentErrorMessage = (state) => state.addStudent.error;

// export these two : selectSingleStatus, selectSingleError,
export const selectSingleStatus = (state) => state.addStudent.status;
export const selectSingleError = (state) => state.addStudent.error;