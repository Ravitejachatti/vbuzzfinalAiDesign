import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, Typography, Box, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const UploadStudents = () => {
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("University authToken");   
  console.log("token in upload students:",token);  

  const formik = useFormik({
    initialValues: {
      college: '',
      department: '',
      program: '',
      excelFile: null,
    },
    validationSchema: Yup.object({
      college: Yup.string().required('College is required'),
      department: Yup.string().required('Department is required'),
      program: Yup.string().required('program  is required'),
      excelFile: Yup.mixed().required('Excel file is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('college', values.college);
      formData.append('department', values.department);
      formData.append('program', values.specialization);
      formData.append('file', values.excelFile); 
      
      if(!token){
          alert("Authentication token is missing.");
          return;
        }

      try {
      
        const response = await axios.post('/api/placement/upload-students', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('File uploaded successfully!');
        console.log(response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ p: 3, maxWidth: '500px', mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Upload Students Information
      </Typography>

      <TextField
        label="College Name"
        name="college"
        fullWidth
        select
        value={formik.values.college}
        onChange={formik.handleChange}
        error={formik.touched.college && Boolean(formik.errors.college)}
        helperText={formik.touched.college && formik.errors.college}
        margin="normal"
      >
        <MenuItem value="College A">College A</MenuItem>
        <MenuItem value="College B">College B</MenuItem>
      </TextField>

      <TextField
        label="Department Name"
        name="department"
        fullWidth
        select
        value={formik.values.department}
        onChange={formik.handleChange}
        error={formik.touched.department && Boolean(formik.errors.department)}
        helperText={formik.touched.department && formik.errors.department}
        margin="normal"
      >
        <MenuItem value="Department A">Department A</MenuItem>
        <MenuItem value="Department B">Department B</MenuItem>
      </TextField>

      <TextField
        label="Specialization"
        name="specialization"
        fullWidth
        select
        value={formik.values.specialization}
        onChange={formik.handleChange}
        error={formik.touched.specialization && Boolean(formik.errors.specialization)}
        helperText={formik.touched.specialization && formik.errors.specialization}
        margin="normal"
      >
        <MenuItem value="Specialization A">Specialization A</MenuItem>
        <MenuItem value="Specialization B">Specialization B</MenuItem>
      </TextField>

      <Button
        variant="outlined"
        component="label"
        fullWidth
        sx={{ mt: 2 }}
        color={formik.errors.excelFile ? 'error' : 'primary'}
      >
        {formik.values.excelFile ? formik.values.excelFile.name : 'Upload Excel File'}
        <input
          type="file"
          hidden
          accept=".xlsx, .xls"
          onChange={(event) => formik.setFieldValue('excelFile', event.target.files[0])}
        />
      </Button>
      {formik.errors.excelFile && <Typography color="error">{formik.errors.excelFile}</Typography>}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Submit'}
      </Button>
    </Box>
  );
};

export default UploadStudents;
