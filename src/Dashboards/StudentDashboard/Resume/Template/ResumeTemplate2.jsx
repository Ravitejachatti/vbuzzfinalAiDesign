import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { useSelector } from "react-redux";


const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: "Helvetica",
    fontSize: 12,
    lineHeight: 1.5,
  },
  header: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
    color: "#2c3e50"
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#34495e",
    borderBottom: "1px solid #bdc3c7",
    paddingBottom: 4
  },
  subHeader: {
    fontSize: 14,
    fontWeight: "semibold",
    marginBottom: 6,
    color: "#2c3e50"
  },
  contact: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: 15,
    color: "#7f8c8d"
  },
  item: {
    marginBottom: 10
  },
  bulletItem: {
    marginLeft: 10,
    fontSize: 12,
    marginBottom: 4
  },
  skillPill: {
    backgroundColor: "#ecf0f1",
    borderRadius: 4,
    padding: "4px 8px",
    marginRight: 6,
    marginBottom: 6,
    display: "inline-block"
  },
  twoColumn: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  column: {
    width: "48%"
  }
});

const ResumeTemplate2 = ({studentData}) => {
  const student = studentData || {};


  // console.log("Student Data in localStorage:", student);

  console.log("Student Data in localStorage in  2nd template:", student);


  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>
          {student?.name?.toUpperCase() || "YOUR NAME"}
        </Text>
        <Text style={styles.contact}>
          {student?.contactInfo?.address?.city || "Hyderabad"},{" "}
          {student?.contactInfo?.address?.country || "India"} |{" "}
          {student?.email || "email@example.com"} |{" "}
          {student?.phone || student?.contactInfo?.phone || "123-456-7890"} |{" "}
          Reg No: {student?.registered_number || "XXXXXX"}
        </Text>

        {/* Professional Summary */}
        <View style={styles.item}>
          <Text style={styles.sectionHeader}>PROFESSIONAL PROFILE</Text>
          <Text style={styles.bulletItem}>
            {student?.Bio || "Results-driven professional with expertise in multiple technical domains..."}
          </Text>
        </View>

        {/* Education */}
        <View style={styles.item}>
          <Text style={styles.sectionHeader}>EDUCATION</Text>
          
          {student?.bachelors && (
            <View style={styles.item}>
              <Text style={styles.subHeader}>{student?.bachelors?.degree} in {student?.bachelors.specialization}</Text>
              <Text style={styles.bulletItem}>
                {student?.bachelors?.institutionName}, {student?.bachelors?.university} | {student?.bachelors?.yearOfCompletion}
              </Text>
              <Text style={styles.bulletItem}>
                GPA: {student?.bachelors?.percentageOrCGPA} | {student?.bachelors?.notableAchievements}
              </Text>
            </View>
          )}

          {student?.masters && (
            <View style={styles.item}>
              <Text style={styles.subHeader}>{student.masters.degree} in {student.masters.specialization}</Text>
              <Text style={styles.bulletItem}>
                {student.masters.institutionName}, {student?.masters.university} | {student.masters.yearOfCompletion}
              </Text>
              <Text style={styles.bulletItem}>
                GPA: {student.masters.percentageOrCGPA} | {student.masters.notableAchievements}
              </Text>
            </View>
          )}
        </View>

        {/* Skills */}
        <View style={styles.item}>
          <Text style={styles.sectionHeader}>TECHNICAL SKILLS</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {student?.skillsAndCompetencies?.technicalSkills?.map((skill, index) => (
              <Text key={index} style={styles.skillPill}>{skill}</Text>
            ))}
          </View>
        </View>

        {/* Professional Experience */}
        <View style={styles.item}>
          <Text style={styles.sectionHeader}>PROFESSIONAL EXPERIENCE</Text>
          {student?.workExperience?.map((exp, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={styles.subHeader}>{exp.position} at {exp.companyName}</Text>
              <Text style={styles.bulletItem}>{exp.duration}</Text>
              {exp.responsibilitiesAndAchievements?.map((resp, idx) => (
                <Text key={idx} style={styles.bulletItem}>• {resp}</Text>
              ))}
              {exp.skillsAcquired?.length > 0 && (
                <Text style={styles.bulletItem}>
                  Skills: {exp.skillsAcquired.join(", ")}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Projects */}
        <View style={styles.item}>
          <Text style={styles.sectionHeader}>ACADEMIC PROJECTS</Text>
          {student?.academicProjects?.map((project, index) => (
            <View key={index} style={{ marginBottom: 8 }}>
              <Text style={styles.subHeader}>• {project.title} ({project.level})</Text>
              <Text style={styles.bulletItem}>{project.description}</Text>
              <Text style={styles.bulletItem}>Role: {project.role}</Text>
              {project.toolsOrTechnologiesUsed?.length > 0 && (
                <Text style={styles.bulletItem}>
                  Technologies: {project.toolsOrTechnologiesUsed.filter(Boolean).join(", ")}
                </Text>
              )}
              <Text style={styles.bulletItem}>Outcome: {project.outcomesOrResults}</Text>
            </View>
          ))}
        </View>

        {/* Two Column Layout for Certifications and Languages */}
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            {/* Certifications */}
            <View style={styles.item}>
              <Text style={styles.sectionHeader}>CERTIFICATIONS</Text>
              {student?.certification?.map((cert, index) => (
                <View key={index} style={{ marginBottom: 6 }}>
                  <Text style={styles.bulletItem}>• {cert.courseName}</Text>
                  <Text style={[styles.bulletItem, { marginLeft: 20 }]}>
                    {cert.institutionName} ({cert.completionYear})
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.column}>
            {/* Languages */}
            <View style={styles.item}>
              <Text style={styles.sectionHeader}>LANGUAGES</Text>
              {student?.skillsAndCompetencies?.languagesKnown?.map((lang, index) => (
                <Text key={index} style={styles.bulletItem}>
                  • {lang.language} ({lang.proficiency})
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Placements */}
        {student?.placements?.length > 0 && (
          <View style={styles.item}>
            <Text style={styles.sectionHeader}>PLACEMENT OFFERS</Text>
            {student?.placements
              .filter(offer => offer.companyName && offer.role)
              .slice(0, 3) // Show only top 3 offers
              .map((offer, index) => (
                <View key={index} style={{ marginBottom: 6 }}>
                  <Text style={styles.subHeader}>{offer.role} at {offer.companyName}</Text>
                  <Text style={styles.bulletItem}>CTC: ₹{offer.ctc?.toLocaleString() || 'Not specified'}</Text>
                  {offer.additionalDetails && (
                    <Text style={styles.bulletItem}>{offer.additionalDetails}</Text>
                  )}
                </View>
              ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumeTemplate2;