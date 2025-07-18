// src/modules/admission/services/admission.api.js

import axios from '../../../utils/axios';

export const savePersonalDetails = (data) =>
  axios.post('/student/admission/personal', data);

export const saveAcademicDetails = (data) =>
  axios.post('/student/admission/academic', data);

export const saveProgramSelection = (data) =>
  axios.post('/student/admission/program', data);

export const uploadDocuments = (formData) =>
  axios.post('/student/admission/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

export const submitApplication = (draftId) =>
  axios.post(`/student/admission/submit/${draftId}`);

export const getDraftStatus = () =>
  axios.get('/student/admission/draft-status');

export const getMyApplications = () =>
  axios.get('/student/my-applications');