import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  User, GraduationCap, BookOpen, Award, Phone, Users,
  FileText, Shield, Settings, CheckCircle, Clock, AlertCircle
} from 'lucide-react';

import UpdatePersonalDetails from "./Profile/PersonalDetails";
import UpdateEducationDetails from "./Profile/EducationDetails";
import UpdateAcademicProjects from "./Profile/AcademicProjects";
import UpdatePreferences from "./Profile/JobPreferences";
import UpdateContactInfo from "./Profile/ContactInfo";
import UpdateSkills from "./Profile/Skills";
import UpdateExperience from "./Profile/WorkExperience";
import UpdateDocuments from "./Profile/Documents";
import UpdateParentDetails from "./Profile/ParentDetails";
import UpdateDocumentVerification from "./Profile/UploadDocumentVerification";
import ResumeBuilder from "./Resume/Resume/ResumeBuilder";

const ProfileManagement = () => {
  const { universityName } = useParams();
  const studentData = useSelector((state) => state.student.data);

  const [activeSection, setActiveSection] = useState("personal");

  const profileSections = [
    { id: "personal", name: "Personal Details", icon: User, description: "Basic personal information" },
    { id: "education", name: "Education", icon: GraduationCap, description: "Academic qualifications" },
    { id: "projects", name: "Projects", icon: BookOpen, description: "Academic and personal projects" },
    { id: "skills", name: "Skills", icon: Award, description: "Technical and soft skills" },
    { id: "experience", name: "Experience", icon: Settings, description: "Work experience" },
    { id: "contact", name: "Contact Info", icon: Phone, description: "Contact and address info" },
    { id: "parents", name: "Parent Details", icon: Users, description: "Parent and guardian details" },
    { id: "resume", name: "Resume Builder", icon: FileText, description: "Create your resume" },
    { id: "documents", name: "Documents", icon: FileText, description: "Upload important docs" },
    { id: "verification", name: "Verification", icon: Shield, description: "Identity verification" },
  ];

  const renderActiveSection = () => {
    const goToNext = () => {
      const idx = profileSections.findIndex(s => s.id === activeSection);
      const next = profileSections[idx + 1];
      if (next) setActiveSection(next.id);
    };
    const props = { goToNext, studentData };
    localStorage.setItem("studentData", JSON.stringify(studentData));

    switch (activeSection) {
      case "personal": return <UpdatePersonalDetails {...props} />;
      case "education": return <UpdateEducationDetails {...props} />;
      case "projects": return <UpdateAcademicProjects {...props} />;
      case "preferences": return <UpdatePreferences {...props} />;
      case "contact": return <UpdateContactInfo {...props} />;
      case "skills": return <UpdateSkills {...props} />;
      case "experience": return <UpdateExperience {...props} />;
      case "resume": return <ResumeBuilder {...props} />;
      case "documents": return <UpdateDocuments {...props} />;
      case "parents": return <UpdateParentDetails {...props} />;
      case "verification": return <UpdateDocumentVerification {...props} />;
      default: return <UpdatePersonalDetails {...props} />;
    }
  };

  const getCompletionIcon = (percentage) => {
    if (percentage === 100) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (percentage > 0) return <Clock className="w-4 h-4 text-yellow-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  const getCompletionColor = (percentage) => {
    if (percentage === 100) return "bg-green-100 text-green-600";
    if (percentage > 0) return "bg-yellow-100 text-yellow-600";
    return "bg-red-100 text-red-600";
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
            <h3 className="text-xl font-bold">Profile Sections</h3>
            <p className="text-blue-100 mt-1">Manage your profile details</p>
          </div>
          <div className="p-4 space-y-2">
            {profileSections.map(section => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              const completion = 0; // Static for now (optional: replace with logic later)
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-500'}`} />
                      <span className="font-medium text-sm">{section.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${isActive ? 'bg-white/20 text-white' : getCompletionColor(completion)}`}>
                        {completion}%
                      </span>
                      {getCompletionIcon(completion)}
                    </div>
                  </div>
                  <p className={`text-xs mt-1 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>{section.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 p-6 flex items-center space-x-3">
              {profileSections.find(s => s.id === activeSection) && (
                <>
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    {React.createElement(profileSections.find(s => s.id === activeSection).icon, { className: "w-6 h-6 text-white" })}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{profileSections.find(s => s.id === activeSection).name}</h3>
                    <p className="text-sm text-gray-500">{profileSections.find(s => s.id === activeSection).description}</p>
                  </div>
                </>
              )}
            </div>
            <div className="p-6">{renderActiveSection()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;