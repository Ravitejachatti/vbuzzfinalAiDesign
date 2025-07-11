import { configureStore } from "@reduxjs/toolkit";
import { colleges } from "./UniversitySlice";
import { department } from "./DepartmentSlice";
import { placements } from "./PlacementSlice";
import { programs } from "./programs";
import { jobs } from "./Jobslice";
import { students} from "./Placement/StudentsSlice.js";

import { noticeReducer } from "./StudentDashboard/noticeSlice";
import studentReducer from "./StudentDashboard/StudentSlice.js";
import jobReducer from "./StudentDashboard/jobSlice.js";
import { roundReducer } from "./StudentDashboard/roundSlice.js";

import { educationDetailsReducer } from "./StudentDashboard/Profile/educationDetailsSlice.js";
import { personalDetailsReducer } from "./StudentDashboard/Profile/personalDetaillsSlice.js";
import { academicProjectsReducer } from "./StudentDashboard/Profile/academicProjectsSlice";
import { skillsReducer } from "./StudentDashboard/Profile/skillsSlice";
import { workExperienceReducer } from "./StudentDashboard/Profile/workExperienceSlice";
import { contactInfoReducer } from "./StudentDashboard/Profile/contactInfoSlice";
import { parentDetailsReducer } from "./StudentDashboard/Profile/parentDetailsSlice";
import { documentsReducer } from "./StudentDashboard/Profile/documentSlice.js";



// This is the store for the placement director dashboard
import { addStudentReducer } from "./Placement/student/singleStudentadd.js";
import { bulkUploadReducer  } from "./Placement/student/bulkUploadStudents.js";
import {roundsReducer} from "./Placement/roundsSlice.js"
import { placementReportsReducer } from "./Placement/placementReportsSlice.js";
import { uploadPlacementReducer } from "./Placement/uploadPlacementSlice.js";
import { createNoticeReducer } from "./Placement/noticeSlice.js";
import { documentVerificationReducer } from "./StudentDashboard/Profile/documentVerificationSlice.js";


// This is the store for the college ddashboard
import { facultyReducer } from "./College/faculty.jsx";


const store=configureStore({
       
        reducer:{
            colleges:colleges,
            department:department,
            placements:placements,
            programs:programs,

            jobs:jobs,
            notice: noticeReducer,
            job:jobReducer,
            round:roundReducer,

            student:studentReducer,   // This is the student slice for the particular student dashboard 
            personalDetails:personalDetailsReducer,
            educationDetails: educationDetailsReducer,
            academicProjects: academicProjectsReducer,
            skills: skillsReducer,
            workExperience: workExperienceReducer,
            contactInfo: contactInfoReducer,
            parentDetails: parentDetailsReducer,
            documents: documentsReducer,
            documentVerification: documentVerificationReducer, // This is the document verification slice for the student dashboard


           students: students,   // This is the students slice for the placement director dashboard
           addStudent:addStudentReducer, // This is the add student slice for the placement director dashboard  
           bulkUpload:bulkUploadReducer , // This is the bulk upload students slice for the placement director dashboard
           roundsData:roundsReducer, // This is the rounds data slice for the placement director dashboard
           placementReports: placementReportsReducer,
           uploadPlacement: uploadPlacementReducer, // This is the upload placement data slice for the placement director dashboard
           createNotice: createNoticeReducer, // This is the create notice slice for the placement director dashboard       

           
           faculty: facultyReducer, // This is the faculty slice for the college dashboard

        }
})

export default store