import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './slices/studentSlice';
import jobReducer from './slices/jobSlice';
import noticeReducer from './slices/noticeSlice';
import roundReducer from './slices/roundSlice';
import profileReducer from './slices/profileSlice';

const store = configureStore({
  reducer: {
    student: studentReducer,
    job: jobReducer,
    notice: noticeReducer,
    round: roundReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;