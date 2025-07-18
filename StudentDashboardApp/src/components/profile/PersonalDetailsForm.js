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
import { updatePersonalDetails } from '../../redux/slices/profileSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PersonalDetailsForm({ studentData }) {
  const dispatch = useDispatch();
  const { loading, updateStatus } = useSelector(state => state.profile);
  
  const [formData, setFormData] = useState({
    name: studentData?.name || '',
    email: studentData?.email || '',
    phone: studentData?.phone || '',
    dateOfBirth: studentData?.dateOfBirth ? studentData.dateOfBirth.split('T')[0] : '',
    gender: studentData?.gender || '',
    nationality: studentData?.nationality || '',
    bloodGroup: studentData?.bloodGroup || '',
    Bio: studentData?.Bio || '',
  });

  const handleSubmit = async () => {
    try {
      const studentId = await AsyncStorage.getItem('studentId');
      const universityName = await AsyncStorage.getItem('universityName');
      
      await dispatch(updatePersonalDetails({
        studentId,
        universityName,
        personalDetails: formData
      })).unwrap();
      
      Alert.alert('Success', 'Personal details updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update personal details');
    }
  };

  const renderInput = (label, key, placeholder, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={formData[key]}
        onChangeText={(value) => setFormData({ ...formData, [key]: value })}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-outline" size={24} color="#3B82F6" />
        <Text style={styles.headerTitle}>Personal Details</Text>
      </View>

      <View style={styles.form}>
        {renderInput('Full Name', 'name', 'Enter your full name')}
        {renderInput('Email', 'email', 'Enter your email', 'email-address')}
        {renderInput('Phone', 'phone', 'Enter your phone number', 'phone-pad')}
        {renderInput('Date of Birth', 'dateOfBirth', 'YYYY-MM-DD')}
        {renderInput('Gender', 'gender', 'Enter your gender')}
        {renderInput('Nationality', 'nationality', 'Enter your nationality')}
        {renderInput('Blood Group', 'bloodGroup', 'Enter your blood group')}
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.Bio}
            onChangeText={(value) => setFormData({ ...formData, Bio: value })}
            placeholder="Tell us about yourself"
            multiline
            numberOfLines={4}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Updating...' : 'Update Details'}
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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