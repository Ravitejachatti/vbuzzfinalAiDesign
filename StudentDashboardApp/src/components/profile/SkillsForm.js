import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SkillsForm({ studentData }) {
  const [skills, setSkills] = useState({
    technicalSkills: studentData?.skillsAndCompetencies?.technicalSkills || [],
    softSkills: studentData?.skillsAndCompetencies?.softSkills || [],
    languagesKnown: studentData?.skillsAndCompetencies?.languagesKnown || [],
  });

  const [newSkill, setNewSkill] = useState('');
  const [activeSkillType, setActiveSkillType] = useState('technical');

  const addSkill = (type) => {
    if (!newSkill.trim()) return;
    
    setSkills({
      ...skills,
      [type]: [...skills[type], newSkill.trim()]
    });
    setNewSkill('');
  };

  const removeSkill = (type, index) => {
    setSkills({
      ...skills,
      [type]: skills[type].filter((_, i) => i !== index)
    });
  };

  const handleSubmit = () => {
    Alert.alert('Success', 'Skills updated successfully!');
  };

  const renderSkillSection = (title, type, skills) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      
      <View style={styles.addSkillContainer}>
        <TextInput
          style={styles.skillInput}
          value={activeSkillType === type ? newSkill : ''}
          onChangeText={setNewSkill}
          onFocus={() => setActiveSkillType(type)}
          placeholder={`Add ${title.toLowerCase()}`}
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addSkill(type)}
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.skillsContainer}>
        {skills.map((skill, index) => (
          <View key={index} style={styles.skillChip}>
            <Text style={styles.skillText}>{skill}</Text>
            <TouchableOpacity
              onPress={() => removeSkill(type, index)}
              style={styles.removeButton}
            >
              <Ionicons name="close" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="star-outline" size={24} color="#3B82F6" />
        <Text style={styles.headerTitle}>Skills & Competencies</Text>
      </View>

      <View style={styles.form}>
        {renderSkillSection('Technical Skills', 'technicalSkills', skills.technicalSkills)}
        {renderSkillSection('Soft Skills', 'softSkills', skills.softSkills)}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Update Skills</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 12,
  },
  form: {
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  addSkillContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  skillInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  removeButton: {
    marginLeft: 6,
    padding: 2,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});