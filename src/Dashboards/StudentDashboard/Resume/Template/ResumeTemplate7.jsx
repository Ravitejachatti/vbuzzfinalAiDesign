import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },
  section: { marginBottom: 15, paddingBottom: 10, borderBottom: "1px solid #ccc" },
  header: { fontSize: 26, textAlign: "center", fontWeight: "bold", marginBottom: 10 },
  contact: { textAlign: "center", fontSize: 12, marginBottom: 10 },
  subHeader: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#333" },
  text: { fontSize: 12, marginBottom: 3, color: "#555" },
  listItem: { marginLeft: 10, fontSize: 12 },
  line: { marginVertical: 10, borderBottom: "1px solid #000" }
});

const ResumeTemplate7 = ({ studentData }) => (
  <Document>
    <Page style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>{studentData?.name?.toUpperCase()}</Text>
      <Text style={styles.contact}>{studentData.email} | {studentData.phone}</Text>
      <View style={styles.line} />

      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Profile</Text>
        <Text style={styles.text}>{studentData.summary}</Text>
      </View>

      {/* Work Experience */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Work Experience</Text>
        {studentData.workExperience.map((exp, index) => (
          <View key={index} style={{ marginBottom: 5 }}>
            <Text style={styles.text}>{exp.position} - {exp.companyName}</Text>
            <Text style={styles.listItem}>Duration: {exp.duration}</Text>
            <Text style={styles.listItem}>Responsibilities: {exp.responsibilitiesAndAchievements}</Text>
          </View>
        ))}
      </View>

      {/* Education */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Education</Text>
        <Text style={styles.text}>{studentData.bachelors.degree} in {studentData.bachelors.specialization}</Text>
        <Text style={styles.listItem}>{studentData.bachelors.institutionName} | {studentData.bachelors.yearOfCompletion} | CGPA: {studentData.bachelors.percentageOrCGPA}</Text>
      </View>

      {/* Skills */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Skills</Text>
        <Text style={styles.text}>Technical: {studentData.skillsAndCompetencies.technicalSkills.join(", ")}</Text>
        <Text style={styles.text}>Soft Skills: {studentData.skillsAndCompetencies.softSkills.join(", ")}</Text>
      </View>

      {/* Certifications */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Certifications</Text>
        {studentData.certification.map((cert, index) => (
          <Text key={index} style={styles.text}>{cert.courseName} - {cert.institutionName} ({cert.completionYear})</Text>
        ))}
      </View>

      {/* Projects */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Projects</Text>
        {studentData.academicProjects.map((proj, index) => (
          <View key={index} style={{ marginBottom: 5 }}>
            <Text style={styles.text}>{proj.title} - {proj.role}</Text>
            <Text style={styles.listItem}>{proj.description}</Text>
            <Text style={styles.listItem}>Tech Used: {proj.toolsOrTechnologiesUsed.join(", ")}</Text>
          </View>
        ))}
      </View>

      {/* Extracurricular Activities */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Extracurricular Activities</Text>
        {studentData.extracurricularActivities.map((activity, index) => (
          <View key={index} style={{ marginBottom: 5 }}>
            <Text style={styles.text}>{activity.activityName} - {activity.role}</Text>
            <Text style={styles.listItem}>Achievements: {activity.achievements}</Text>
            <Text style={styles.listItem}>Organization: {activity.organizationName}</Text>
            <Text style={styles.listItem}>Impact: {activity.impact}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
const ResumeTemplate8 = ({ studentData }) => (
  <Document>
    <Page style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>{studentData?.name?.toUpperCase()}</Text>
      <Text style={styles.contact}>{studentData.email} | {studentData.phone}</Text>
      <View style={styles.line} />

      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Profile</Text>
        <Text style={styles.text}>{studentData.summary}</Text>
      </View>

      {/* Work Experience */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Work Experience</Text>
        {studentData.workExperience.map((exp, index) => (
          <View key={index} style={{ marginBottom: 5 }}>
            <Text style={styles.text}>{exp.position} - {exp.companyName}</Text>
            <Text style={styles.listItem}>Duration: {exp.duration}</Text>
            <Text style={styles.listItem}>Responsibilities: {exp.responsibilitiesAndAchievements}</Text>
          </View>
        ))}
      </View>

      {/* Education */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Education</Text>
        <Text style={styles.text}>{studentData.bachelors.degree} in {studentData.bachelors.specialization}</Text>
        <Text style={styles.listItem}>{studentData.bachelors.institutionName} | {studentData.bachelors.yearOfCompletion} | CGPA: {studentData.bachelors.percentageOrCGPA}</Text>
      </View>

      {/* Skills */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Skills</Text>
        <Text style={styles.text}>Technical: {studentData.skillsAndCompetencies.technicalSkills.join(", ")}</Text>
        <Text style={styles.text}>Soft Skills: {studentData.skillsAndCompetencies.softSkills.join(", ")}</Text>
      </View>

      {/* Certifications */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Certifications</Text>
        {studentData.certification.map((cert, index) => (
          <Text key={index} style={styles.text}>{cert.courseName} - {cert.institutionName} ({cert.completionYear})</Text>
        ))}
      </View>

      {/* Projects */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Projects</Text>
        {studentData.academicProjects.map((proj, index) => (
          <View key={index} style={{ marginBottom: 5 }}>
            <Text style={styles.text}>{proj.title} - {proj.role}</Text>
            <Text style={styles.listItem}>{proj.description}</Text>
            <Text style={styles.listItem}>Tech Used: {proj.toolsOrTechnologiesUsed.join(", ")}</Text>
          </View>
        ))}
      </View>

      {/* Extracurricular Activities */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Extracurricular Activities</Text>
        {studentData.extracurricularActivities.map((activity, index) => (
          <View key={index} style={{ marginBottom: 5 }}>
            <Text style={styles.text}>{activity.activityName} - {activity.role}</Text>
            <Text style={styles.listItem}>Achievements: {activity.achievements}</Text>
            <Text style={styles.listItem}>Organization: {activity.organizationName}</Text>
            <Text style={styles.listItem}>Impact: {activity.impact}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);


const styles1 = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },
  header: { textAlign: "center", marginBottom: 20 },
  name: { fontSize: 24, fontWeight: "bold" },
  jobTitle: { fontSize: 14, marginBottom: 10, color: "gray" },
  contact: { fontSize: 12, marginBottom: 5 },
  section: { marginBottom: 15, paddingBottom: 10, borderBottom: "1px solid #ccc" },
  subHeader: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  text: { fontSize: 12, marginBottom: 3, color: "#555" },
  listItem: { marginLeft: 10, fontSize: 12 },
});

const ResumeTemplate3 = ({ studentData }) => (
  <Document>
    <Page style={styles1.page}>
      {/* Header Section */}
      <View style={styles1.header}>
        <Text style={styles1.name}>{studentData?.name?.toUpperCase()}</Text>
        <Text style={styles1.jobTitle}>{studentData.futurePlan}</Text>
        <Text style={styles1.contact}>{studentData.email} | {studentData.phone}</Text>
        <Text style={styles1.contact}>{studentData.contactInfo.address.city}, {studentData.contactInfo.address.state}</Text>
        <Text style={styles1.contact}>{studentData.socialMedia.linkedIn}</Text>
      </View>

      {/* Work Experience Section */}
      <View style={styles1.section}>
        <Text style={styles1.subHeader}>Work Experience</Text>
        {studentData.workExperience.map((exp, index) => (
          <View key={index}>
            <Text style={styles1.text}>{exp.companyName} - {exp.position}</Text>
            <Text style={styles1.listItem}>Duration: {exp.duration}</Text>
            <Text style={styles1.listItem}>Responsibilities: {exp.responsibilitiesAndAchievements}</Text>
          </View>
        ))}
      </View>

      {/* Education Section */}
      <View style={styles1.section}>
        <Text style={styles1.subHeader}>Education</Text>
        <Text style={styles1.text}>{studentData.bachelors.degree} in {studentData.bachelors.specialization}</Text>
        <Text style={styles1.listItem}>{studentData.bachelors.institutionName} | {studentData.bachelors.yearOfCompletion}</Text>
      </View>

      {/* Skills Section */}
      <View style={styles1.section}>
        <Text style={styles1.subHeader}>Skills</Text>
        <Text style={styles1.text}>{studentData.skillsAndCompetencies.technicalSkills.join(", ")}</Text>
      </View>

      {/* Hobbies/Interests Section */}
      <View style={styles1.section}>
        <Text style={styles1.subHeader}>Hobbies/Interests</Text>
        {studentData.extracurricularActivities.map((activity, index) => (
          <Text key={index} style={styles1.text}>• {activity.activityName} - {activity.impact}</Text>
        ))}
      </View>
    </Page>
  </Document>
);



const styles4 = StyleSheet.create({
  page: { padding: 50, fontFamily: "Helvetica" },
  header: { textAlign: "center", marginBottom: 25 },
  name: { fontSize: 30, fontWeight: "bold", letterSpacing: 1.5, color: "#2C3E50" },
  jobTitle: { fontSize: 16, marginBottom: 8, color: "#34495E" },
  contactSection: { textAlign: "center", fontSize: 12, marginBottom: 20, color: "#7F8C8D" },
  contact: { marginBottom: 5 },
  section: { marginBottom: 25, paddingBottom: 12, borderBottom: "3px solid #2C3E50" },
  subHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 6, color: "#2980B9" },
  text: { fontSize: 12, marginBottom: 5, color: "#2C3E50" },
  listItem: { marginLeft: 15, fontSize: 12, color: "#2C3E50" },
  link: { fontSize: 12, color: "#2980B9", textDecoration: "underline" }
});

const ResumeTemplate4 = ({ studentData }) => (
  <Document>
    <Page style={styles4.page}>
      {/* Header Section */}
      <View style={styles4.header}>
        <Text style={styles4.name}>{studentData?.name?.toUpperCase()}</Text>
        <Text style={styles4.jobTitle}>{studentData.futurePlan}</Text>
      </View>
      
      {/* Contact Information */}
      <View style={styles4.contactSection}>
        <Text style={styles4.contact}>{studentData.email} | {studentData.phone}</Text>
        <Text style={styles4.contact}>{studentData.contactInfo.address.city}, {studentData.contactInfo.address.state}</Text>
        <Text style={styles4.link}>{studentData.socialMedia.linkedIn}</Text>
      </View>

      {/* Summary/Objective Section */}
      <View style={styles4.section}>
        <Text style={styles4.subHeader}>Summary/Objective</Text>
        <Text style={styles4.text}>{studentData.summary}</Text>
      </View>

      {/* Education Section */}
      <View style={styles4.section}>
        <Text style={styles4.subHeader}>Education</Text>
        <Text style={styles4.text}>{studentData.bachelors.degree} in {studentData.bachelors.specialization}</Text>
        <Text style={styles4.listItem}>{studentData.bachelors.institutionName} | {studentData.bachelors.yearOfCompletion}</Text>
      </View>

      {/* Work Experience Section */}
      <View style={styles4.section}>
        <Text style={styles4.subHeader}>Work Experience</Text>
        {studentData.workExperience.map((exp, index) => (
          <View key={index}>
            <Text style={styles4.text}>{exp.position} - {exp.companyName} ({exp.duration})</Text>
            <Text style={styles4.listItem}>{exp.responsibilitiesAndAchievements}</Text>
          </View>
        ))}
      </View>

      {/* Skills Section */}
      <View style={styles4.section}>
        <Text style={styles4.subHeader}>Skills</Text>
        <Text style={styles4.text}>Technical: {studentData.skillsAndCompetencies.technicalSkills.join(", ")}</Text>
        <Text style={styles4.text}>Soft Skills: {studentData.skillsAndCompetencies.softSkills.join(", ")}</Text>
      </View>

      {/* Interests Section */}
      <View style={styles4.section}>
        <Text style={styles4.subHeader}>Interests</Text>
        {studentData.extracurricularActivities.map((activity, index) => (
          <Text key={index} style={styles4.text}>• {activity.activityName} - {activity.impact}</Text>
        ))}
      </View>

      {/* Certifications/Licenses Section */}
      <View style={styles4.section}>
        <Text style={styles4.subHeader}>Certifications/Licenses</Text>
        {studentData.certification.map((cert, index) => (
          <Text key={index} style={styles4.text}>{cert.courseName} - {cert.institutionName} ({cert.completionYear})</Text>
        ))}
      </View>
      
    </Page>
  </Document>
);



const styles5 = StyleSheet.create({
  page: { flexDirection: "row", padding: 40, fontFamily: "Helvetica" },
  leftColumn: { width: "35%", paddingRight: 20, backgroundColor: "#f0f0f0", padding: 20 },
  rightColumn: { width: "65%", paddingLeft: 20 },
  profile: {marginBottom: 20},
  name: { fontSize: 24, fontWeight: "bold", letterSpacing: 1.2, color: "#333", marginBottom: 8, textTransform: 'uppercase' },
  jobTitle: { fontSize: 14, marginBottom: 8, color: "#555" },
  contact: { fontSize: 10, marginBottom: 4, color: "#777" },
  section: { marginBottom: 20 },
  subHeader: { fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#3366cc", textTransform: 'uppercase', borderBottom: "1px solid #ddd", paddingBottom: 5 },
  text: { fontSize: 10, marginBottom: 3, color: "#333", lineHeight: 1.3 },
  headText: {fontSize: 12},
  listItem: { marginLeft: 10, fontSize: 10, color: "#333", marginBottom: 2, lineHeight: 1.3 },
  link: { fontSize: 10, color: "#3366cc", textDecoration: "underline" },
  experienceTitle: { fontSize: 12, fontWeight: "bold", color: "#444", marginBottom: 2 },
  experienceDetails: { fontSize: 10, color: "#666", marginBottom: 5 },
  projectTitle: { fontSize: 12, fontWeight: "bold", color: "#444", marginBottom: 2 },
  projectDetails: { fontSize: 10, color: "#666", marginBottom: 5 },
  educationTitle: { fontSize: 12, fontWeight: "bold", color: "#444", marginBottom: 2 },
  educationDetails: { fontSize: 10, color: "#666", marginBottom: 5 },
});

const ResumeTemplate5 = ({ studentData }) => (
  <Document>
    <Page style={styles5.page}>
      {/* Left Column - Contact & Skills */}
      <View style={styles5.leftColumn}>
        <View style={styles5.profile}>
        <Text style={styles5.name}>{studentData?.name?.toUpperCase()}</Text>
        <Text style={styles5.jobTitle}>{studentData.futurePlan}</Text>
        <Text style={styles5.contact}>{studentData.email}</Text>
        <Text style={styles5.contact}>{studentData.phone}</Text>
        <Text style={styles5.contact}>{studentData.contactInfo.address.city}, {studentData.contactInfo.address.state}</Text>
        <Text style={styles5.link}>{studentData.socialMedia.linkedIn}</Text>
        </View>

        
        {/* Skills */}
        <View style={styles5.section}>
          <Text style={styles5.subHeader}>Skills</Text>
          <Text style={styles5.text}><Text style={styles5.headText}>Technical: </Text>{studentData.skillsAndCompetencies.technicalSkills.join(", ")}</Text>
          <Text style={styles5.text}><Text style={styles5.headText}>SoftSkills: </Text>{studentData.skillsAndCompetencies.softSkills.join(", ")}</Text>
        </View>
        
        {/* Certifications */}
        <View style={styles5.section}>
          <Text style={styles5.subHeader}>Certifications</Text>
          {studentData.certification.map((cert, index) => (
            <Text key={index} style={styles5.text}>{cert.courseName} - {cert.institutionName} ({cert.completionYear})</Text>
          ))}
        </View>
      </View>
      
      {/* Right Column - Work Experience, Education, and Projects */}
      <View style={styles5.rightColumn}>
        {/* Work Experience */}
        <View style={styles5.section}>
          <Text style={styles5.subHeader}>Work Experience</Text>
          {studentData.workExperience.map((exp, index) => (
            <View key={index}>
              <Text style={styles5.experienceTitle}>{exp.position}</Text>
              <Text style={styles5.experienceDetails}>{exp.companyName} ({exp.duration})</Text>
              <Text style={styles5.listItem}>{exp.responsibilitiesAndAchievements}</Text>
            </View>
          ))}
        </View>

        {/* Education */}
        <View style={styles5.section}>
          <Text style={styles5.subHeader}>Education</Text>
          <Text style={styles5.educationTitle}>{studentData.bachelors.degree} in {studentData.bachelors.specialization}</Text>
          <Text style={styles5.educationDetails}>{studentData.bachelors.institutionName} | {studentData.bachelors.yearOfCompletion}</Text>
        </View>

        {/* Projects */}
        <View style={styles5.section}>
          <Text style={styles5.subHeader}>Projects</Text>
          {studentData.academicProjects.map((proj, index) => (
            <View key={index}>
              <Text style={styles5.projectTitle}>{proj.title}</Text>
              <Text style={styles5.projectDetails}>{proj.role}</Text>
              <Text style={styles5.listItem}>{proj.description}</Text>
              <Text style={styles5.listItem}>Tech Used: {proj.toolsOrTechnologiesUsed.join(", ")}</Text>
            </View>
          ))}
        </View>

      {/* Extracurricular Activities */}
      <View style={styles5.section}>
        <Text style={styles5.subHeader}>Extracurricular Activities</Text>
        {studentData.extracurricularActivities.map((activity, index) => (
          <View key={index} style={{ marginBottom: 5 }}>
            <Text style={styles5.text}>{activity.activityName} - {activity.role}</Text>
            <Text style={styles5.listItem}>Achievements: {activity.achievements}</Text>
            <Text style={styles5.listItem}>Organization: {activity.organizationName}</Text>
            <Text style={styles5.listItem}>Impact: {activity.impact}</Text>
          </View>
        ))}
      </View>
      </View>
    </Page>
  </Document>
);


export { ResumeTemplate7, ResumeTemplate8, ResumeTemplate3, ResumeTemplate4, ResumeTemplate5 };