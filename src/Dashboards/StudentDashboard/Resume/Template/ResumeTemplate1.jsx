import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { useSelector } from "react-redux";

const styles = StyleSheet.create({

  page: { padding: 40, fontFamily: "Helvetica", fontSize: 11 },
  header: { 
    fontSize: 24, 
    textAlign: "center", 
    fontWeight: "bold", 
    marginBottom: 4,
    color: "#2c3e50",
    textTransform: "uppercase"
  },
  contact: {
    textAlign: "center",
    fontSize: 10,
    marginBottom: 10,
    color: "#7f8c8d",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    borderBottom: "1px solid #2c3e50",
    paddingBottom: 4,
    marginBottom: 8,
    color: "#2c3e50",
    textTransform: "uppercase"
  },
  itemHeader: {
    fontSize: 12,
    fontWeight: "semibold",
    marginBottom: 2
  },
  itemSub: {
    fontSize: 10,
    color: "#7f8c8d",
    marginBottom: 4
  },
  bulletItem: {
    marginLeft: 10,
    marginBottom: 4
  },
  skillPill: {
    backgroundColor: "#ecf0f1",
    borderRadius: 4,
    padding: "2px 6px",
    marginRight: 4,
    marginBottom: 4
  },
  loadingText: {
    textAlign: "center",
    fontSize: 14,
    color: "#666"
  }
});

const ResumeTemplate1 = ({studentData}) => {
  // Safely destructure with fallback values
const student = studentData || {};  
console.log("Student Data:", student);

  // const studentData = localStorage.getItem("studentData");
  // const students = JSON.parse(studentData);
  // // console.log("Student Data in localStorage:", student);
  // console.log("Student Data in localStorage:", students);

  // // NAME OF THE studnet in console
  // console.log("Student Name:",students?.name);
  // const student = students || {};
  // console.log("Student Object:", student);


  const safeSkills = student?.skillsAndCompetencies || {};
  
  // Critical data validation
  const hasValidData = student && Object.keys(student).length > 0;
  
  // Create safe versions of all values
  const safeName = student?.name ? student.name.toUpperCase() : 'PROFESSIONAL RESUME';
  const safeContact = student?.contactInfo?.address || {};

 // Get all education levels sorted by importance
 const educationLevels = [
  { level: 5, data: student?.phd },
  { level: 4, data: student?.masters },
  { level: 3, data: student?.bachelors },
  { level: 2, data: student?.diploma },
  { level: 1, data: student?.twelfth },
  { level: 0, data: student?.tenth }
];

// Filter out empty education entries and keep top 3
const highestEducation = educationLevels
  .filter(edu => edu.data && Object.keys(edu.data).length > 0)
  .sort((a, b) => b.level - a.level)
  .slice(0, 3);

  

  const safeEmail = student?.email || 'email@example.com';
  const safePhone = student?.phone || '+91 XXXXX XXXXX';

  // Conditional rendering flags
  const hasWorkExp = student?.workExperience?.length > 0;
  const hasProjects = student?.academicProjects?.length > 0;
  const hasCertifications = student?.certification?.length > 0;
  const hasLanguages = safeSkills?.languagesKnown?.length > 0;


console.log("safeName:", safeName);

  // Show loading state if no valid data
  if (!hasValidData) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text style={styles.loadingText}>Loading resume data...</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header Section with Safe Values */}
        <Text style={styles.header}>{safeName}</Text>
        
        {/* Contact Information with Fallbacks */}
        <View style={styles.contact}>
          <Text>
             {safeContact.city || 'City'}, {safeContact.country || 'Country'} | 
          </Text>
          <Text>{safeEmail} | </Text>
          <Text>{safePhone}</Text>
        </View>

        {/* Professional Summary */}
        {student.Bio && (
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.sectionHeader}>Objective</Text>
            <Text>{student.Bio}</Text>
          </View>
        )}

        {/* Technical Skills */}
        {safeSkills.technicalSkills?.length > 0 && (
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.sectionHeader}>Technical Skills</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {safeSkills.technicalSkills.map((skill, i) => (
                <Text key={i} style={styles.skillPill}>{skill}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Professional Experience */}
        {hasWorkExp && (
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.sectionHeader}>Professional Experience</Text>
            {student.workExperience.map((exp, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <Text style={styles.itemHeader}>{exp?.position || 'Position'}</Text>
                <Text style={styles.itemSub}>
                  {exp?.companyName || 'Company'} ({exp?.duration || 'Duration'})
                </Text>
                {exp?.responsibilitiesAndAchievements?.map((resp, idx) => (
                  <Text key={idx} style={styles.bulletItem}>• {resp}</Text>
                ))}
                {exp?.skillsAcquired?.length > 0 && (
                  <Text style={{ marginTop: 4 }}>
                    <Text style={{ fontWeight: "semibold" }}>Tech Used: </Text>
                    {exp.skillsAcquired.join(", ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education Section */}
        {highestEducation.length > 0 && (
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.sectionHeader}>Education</Text>
            
            {highestEducation.map((edu, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.itemHeader}>
                  {edu.data?.degree || 'Degree'} in {edu.data?.specialization || 'Specialization'}
                </Text>
                <Text style={styles.itemSub}>
                  {edu.data?.institutionName || 'Institution'} | 
                  {edu.data?.yearOfCompletion || 'Year'} | 
                  {edu.data?.percentageOrCGPA ? `CGPA: ${edu.data.percentageOrCGPA}` : ''}
                </Text>
                {edu.data?.notableAchievements && (
                  <Text style={styles.bulletItem}>• {edu.data.notableAchievements}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {hasCertifications && (
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.sectionHeader}>Certifications</Text>
            {student.certification.map((cert, i) => (
              <Text key={i} style={styles.bulletItem}>
                • {cert?.courseName || 'Course'} ({cert?.institutionName || 'Issuer'}) - {cert?.completionYear || 'Year'}
              </Text>
            ))}
          </View>
        )}

        {/* Academic Projects */}
        {hasProjects && (
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.sectionHeader}>Academic Projects</Text>
            {student.academicProjects.map((proj, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text style={styles.itemHeader}>{proj?.title || 'Project Title'}</Text>
                <Text style={styles.itemSub}>{proj?.role || 'Role'}</Text>
                {proj?.description && (
                  <Text style={styles.bulletItem}>• {proj.description}</Text>
                )}
                {proj?.toolsOrTechnologiesUsed?.length > 0 && (
                  <Text style={{ marginTop: 4 }}>
                    <Text style={{ fontWeight: "semibold" }}>Technologies: </Text>
                    {proj.toolsOrTechnologiesUsed.join(", ")}
                  </Text>
                )}
                {proj?.outcomesOrResults && (
                  <Text style={{ marginTop: 4 }}>
                    <Text style={{ fontWeight: "semibold" }}>Outcome: </Text>
                    {proj.outcomesOrResults}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Languages */}
        {hasLanguages && (
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.sectionHeader}>Languages</Text>
            <Text>
              {safeSkills.languagesKnown.map(lang => 
                `${lang?.language || 'Language'} (${lang?.proficiency || 'Proficiency'})`
              ).join(", ")}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumeTemplate1;