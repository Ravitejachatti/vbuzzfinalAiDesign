import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { deleteCollege } from "./UniversitySlice";



//  handleUpdate
//  handleEdit
//  fetchDepartments();
//  handleDelete 


const BASE_URL = import.meta.env.VITE_API_BASE_URL


export const deptUpdate = createAsyncThunk('/updatedept',async ({token,selectedDepartment,formData,universityName, thunkAPI})=>{
      try {
     const res= await axios.put(`${BASE_URL}/department/updateDepartment/${selectedDepartment._id}?universityName=${universityName}`,
        {
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.updatedDepartment

    } catch (err) {
      
      console.error(err);
      return thunkAPI.rejectWithValue( "Failed ");
    }
})



export const fetchDept = createAsyncThunk('/fetchdept',async({token,universityName, thunkAPI})=>{
       try {
      const response = await axios.get(
        `${BASE_URL}/department/getAllDepartments?universityName=${encodeURIComponent(universityName)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      return response.data
      
    } catch (err) {
      
      console.error("err",err);
      return thunkAPI.rejectWithValue( "Failed ");
    }
})

export const deptDelete = createAsyncThunk('/deletedept',async ({token,id,universityName, thunkAPI})=>{
    try {
        const res = await axios.delete(`${BASE_URL}/department/deleteDepartment/${id}?universityName=${universityName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        return res.data.deletedDepartment
      } catch (err) {
        console.error("Failed to delete department", err);
        return thunkAPI.rejectWithValue( "Failed ");
      }
})
export const adddept = createAsyncThunk('/adddept',async ({token,formData,universityName, thunkAPI})=>{
      try {
      const departmentData = {
        ...formData,
        college: formData.college,  // Adding college ID
        universityId: formData.universityId  // Adding university ID
      };
      let res=await axios.post(`${BASE_URL}/department/addDepartment?universityName=${encodeURIComponent(universityName)}`,
       departmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
             return res.data.department
    } catch (err) {
      console.log("Error adding department:", err);
      return thunkAPI.rejectWithValue( "Failed ");
      
    }
       
})

const deptSlice = createSlice({
    name:'department',
    initialState:{departments:[],loading:false},
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchDept.fulfilled,(state,action)=>{
                  state.departments=action.payload
                  state.loading=false
        })
        .addCase(fetchDept.pending,(state,action)=>{
          state.loading=true
        })
        .addCase(fetchDept.rejected,(state,action)=>{
            state.loading=false
        })
        .addCase(deptDelete.fulfilled,(state,action)=>{
          alert("deleted dept")
          if(action.payload){
             let newstate= state.departments.filter((dept)=>dept._id!=action.payload._id)
             state.departments=newstate 
            }
            state.loading=false
        })
        .addCase(deptDelete.rejected,(state,action)=>{
            state.loading=false
        })
        .addCase(deptDelete.pending,(state,action)=>{
            state.loading=true
        })
        .addCase(adddept.fulfilled,(state,action)=>{
             if(action.payload){
              if(state.departments.length>0){
              state.departments.push(action.payload)}
              else{
                state.departments=[action.payload]
              }
             }
             state.loading=false
        })
        .addCase(deptUpdate.fulfilled,(state,action)=>{
                 alert("edit success")
                   for (let i = 0; i < state.departments.length; i++) {
                          const oldDept = state.departments[i];
                          if (oldDept._id === action.payload._id) {
                                  state.departments[i] = action.payload; 
                                    break; 
                                              }
                   }
                   state.loading=false
        })
        .addCase(adddept.pending,(state,action)=>{
            
             state.loading=true
        })
        .addCase(adddept.rejected,(state,action)=>{
             state.loading=false
        })
        .addCase(deptUpdate.pending,(state,action)=>{      
                   state.loading=true
        })
        .addCase(deptUpdate.rejected,(state,action)=>{
                   state.loading=false
        })
        
        
    }


})


export  const department= deptSlice.reducer
