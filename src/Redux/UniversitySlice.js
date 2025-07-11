import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";



const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const editcollege = createAsyncThunk('/editcollege',
  async ()=>{
       
  }
)

export const updateCollege = createAsyncThunk('/updatecollege',
  async ({ token, universityName, id, selectedCollege }, thunkAPI) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    try {
      const res = await axios.put(
        `${BASE_URL}/college/colleges/${id}?universityName=${universityName}`,
        selectedCollege, // contains only changed fields
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("College Updated Successfully");
      return res.data.updatedCollege;
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue("Failed");
    }
  }
);





export const fetchColleges = createAsyncThunk('/fetchcollege',
    async ({token,universityName})=>{
        try {
      const response = await axios.get(
        `${BASE_URL}/college/colleges?universityName=${encodeURIComponent(universityName)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data
      
    } catch (err) {
      
      console.error(err);
      return thunkAPI.rejectWithValue( "Failed ");
    }
    }
)

export const fetchCollegeById = createAsyncThunk(
  '/fetchCollegeById',
  async ({ token, collegeId, universityName }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/college/colleges/${collegeId}?universityName=${universityName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue("Failed to fetch college by ID.");
    }
  }
);

export const addCollege=createAsyncThunk('/addcollege',async ({token,formData})=>{

    try {
      const response = await axios.post(
       
        `${BASE_URL}/college/addcollege?universityName=${formData.universityName}`,
        {
          name: formData.name,
          dean: formData.dean,
          location: {
            country: formData.country,
            state: formData.state,
            city: formData.city,
            address: formData.address,
          },
          adminEmail: formData.adminEmail,
          adminPassword: formData.adminPassword,
          university: formData.university,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        
      );
      alert("college Added Successfully")
      return response.data.college;
    } catch (err) {
      alert(err.response?.data?.error || "An error occurred while adding the college.")
      console.log(err.data)
      return thunkAPI.rejectWithValue( "Failed ");
        
    }
})


export const deleteCollege = createAsyncThunk('/delete',async ({token,collegeId,universityName})=>{
          try {
      await axios.delete(
        `${BASE_URL}/college/colleges/${collegeId}?universityName=${universityName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return collegeId
    } catch (err) {
      
      console.error(err);
      return thunkAPI.rejectWithValue( "Failed ");
    } 
})

const collegeslice=createSlice({
    name:'college',
    initialState:{colleges:[],loading:true, selectedCollege: null,},
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchColleges.fulfilled,(state,action)=>{
          
            state.colleges=action.payload
            console.log("ooo",JSON.parse(JSON.stringify(state.colleges)));
            state.loading=false
        })
        .addCase(fetchColleges.pending,(state,action)=>{
            
            state.loading=true
        })
        .addCase(fetchColleges.rejected,(state,action)=>{
             
            state.loading=false
        })

        .addCase(fetchCollegeById.fulfilled, (state, action) => {
  state.selectedCollege = action.payload; // optional if you want to store in state
  state.loading = false;
})
.addCase(fetchCollegeById.pending, (state) => {
  state.loading = true;
})
.addCase(fetchCollegeById.rejected, (state) => {
  state.loading = false;
})

        .addCase(addCollege.fulfilled,(state,action)=>{
          if(action.payload){state.colleges.push(action.payload)}
                 
                 state.loading=false
        })
        .addCase(addCollege.rejected,(state,action)=>{
            
                 state.loading=false
        })
        .addCase(addCollege.pending,(state,action)=>{
            
                 state.loading=true
        })
        .addCase(deleteCollege.fulfilled,(state,action)=>{
          alert('deleted college')
                    const newstate=state.colleges.filter(item=>item._id!=action.payload)
                    state.colleges=newstate 
        })
        .addCase(updateCollege.fulfilled,(state,action)=>{
               const newDept = action.payload
                for (let i = 0; i < state.colleges.length; i++) {
                          const oldDept = state.colleges[i];
                          if (oldDept._id === newDept._id) {
                                  state.colleges[i] = newDept; 
                                    break; 
                                              }
                   }
        })
        
    }


})


export const colleges=collegeslice.reducer 