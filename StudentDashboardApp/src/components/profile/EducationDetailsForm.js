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
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { updateEducationDetails } from '../../redux/slices/profileSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EducationDetailsForm({ studentData }) {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.profile);
  
  const [formData, setFormData] = useState({
    tenth: studentData?.tenth || {
      institutionName: '',
      board: '',
      yearOfCompletion: '',
      percentageOrCGPA: '',
    },
    twelfth: studentData?.twelfth || {
      institutionName: '',
      board: '',
      yearOfCompletion: '',
      percentageOrCGPA: '',
    },
    bachelors: studentData?.bachelors || {
      institutionName: '',
      university: '',
      degree: '',
      specialization: '',
      yearOfCompletion: '',
      percentageOrCGPA: '',
    },
  });

  const handleSubmit = async () => {
    try {
      const studentId = await AsyncStorage.getItem('studentId');
      const universityName = await AsyncStorage.getItem('universityName');
      
      await dispatch(updateEducationDetails({
        studentId,
        universityName,
        educationDetails: formData
      })).unwrap();
      
      Alert.alert('Success', 'Education details updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update education details');
    }
  };

  const updateNestedField = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    });
  };

  const renderEducationSection = (title, sectionKey, fields) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {fields.map(field => (
        <View key={field.key} style={styles.inputContainer}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            style={styles.input}
            value={formData[sectionKey][field.key]}
            onChangeText={(value) => updateNestedField(sectionKey, field.key, value)}
            placeholder={field.placeholder}
            keyboardType={field.keyboardType || 'default'}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      ))}
    </View>
  );

  const tenthFields = [
    { key: 'institutionName', label: 'School Name', placeholder: 'Enter school name' },
    { key: 'board', label: 'Board', placeholder: 'Enter board name' },
    { key: 'yearOfCompletion', label: 'Year of Completion', placeholder: 'Enter year', keyboardType: 'numeric' },
    { key: 'percentageOrCGPA', label: 'Percentage/CGPA', placeholder: 'Enter percentage or CGPA' },
  ];

  const twelfthFields = [
    { key: 'institutionName', label: 'School Name', placeholder: 'Enter school name' },
    { key: 'board', label: 'Board', placeholder: 'Enter board name' },
    { key: 'yearOfCompletion', label: 'Year of Completion', placeholder: 'Enter year', keyboardType: 'numeric' },
    { key: 'percentageOrCGPA', label: 'Percentage/CGPA', placeholder: 'Enter percentage or CGPA' },
  ];

  const bachelorsFields = [
    { key: 'institutionName', label: 'College Name', placeholder: 'Enter college name' },
    { key: 'university', label: 'University', placeholder: 'Enter university name' },
    { key: 'degree', label: 'Degree', placeholder: 'Enter degree' },
    { key: 'specialization', label: 'Specialization', placeholder: 'Enter specialization' },
    { key: 'yearOfCompletion', label: 'Year of Completion', placeholder: 'Enter year', keyboardType: 'numeric' },
    { key: 'percentageOrCGPA', label: 'Percentage/CGPA', placeholder: 'Enter percentage or CGPA' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="school-outline" size={24} color="#3B82F6" />
        <Text style={styles.headerTitle}>Education Details</Text>
      </View>

      <View style={styles.form}>
        {renderEducationSection('10th Grade', 'tenth', tenthFields)}
        {renderEducationSection('12th Grade', 'twelfth', twelfthFields)}
        {renderEducationSection("Bachelor's Degree", 'bachelors', bachelorsFields)}

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Updating...' : 'Update Education Details'}
          </Text>
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
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});