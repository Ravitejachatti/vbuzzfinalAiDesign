import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PersonalDetailsForm from '../../components/profile/PersonalDetailsForm';
import EducationDetailsForm from '../../components/profile/EducationDetailsForm';
import SkillsForm from '../../components/profile/SkillsForm';
import DocumentsForm from '../../components/profile/DocumentsForm';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const studentData = useSelector(state => state.student.data);
  const [activeSection, setActiveSection] = useState('overview');

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'Student_token',
                'Student_User',
                'studentAuth',
                'studentName',
                'universityName',
                'registeredNumber'
              ]);
              navigation.replace('Login');
            } catch (error) {
              console.error('Error during logout:', error);
            }
          }
        }
      ]
    );
  };

  const profileSections = [
    { 
      id: 'overview', 
      name: 'Overview', 
      icon: 'person-outline', 
      description: 'Profile summary' 
    },
    { 
      id: 'personal', 
      name: 'Personal Details', 
      icon: 'card-outline', 
      description: 'Basic information' 
    },
    { 
      id: 'education', 
      name: 'Education', 
      icon: 'school-outline', 
      description: 'Academic qualifications' 
    },
    { 
      id: 'skills', 
      name: 'Skills', 
      icon: 'star-outline', 
      description: 'Technical & soft skills' 
    },
    { 
      id: 'documents', 
      name: 'Documents', 
      icon: 'document-outline', 
      description: 'Important documents' 
    },
  ];

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      <LinearGradient
        colors={['#3B82F6', '#8B5CF6']}
        style={styles.profileHeader}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {(studentData?.name || 'S').charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.profileName}>{studentData?.name || 'Student Name'}</Text>
        <Text style={styles.profileEmail}>{studentData?.email || 'student@email.com'}</Text>
        <Text style={styles.profileId}>{studentData?.registered_number || 'REG123'}</Text>
      </LinearGradient>

      <View style={styles.infoCards}>
        <View style={styles.infoCard}>
          <Ionicons name="school-outline" size={24} color="#3B82F6" />
          <Text style={styles.infoCardTitle}>University</Text>
          <Text style={styles.infoCardValue}>Andhra University</Text>
        </View>
        <View style={styles.infoCard}>
          <Ionicons name="calendar-outline" size={24} color="#10B981" />
          <Text style={styles.infoCardTitle}>Graduation Year</Text>
          <Text style={styles.infoCardValue}>{studentData?.graduation_year || '2024'}</Text>
        </View>
        <View style={styles.infoCard}>
          <Ionicons name="call-outline" size={24} color="#F59E0B" />
          <Text style={styles.infoCardTitle}>Phone</Text>
          <Text style={styles.infoCardValue}>{studentData?.phone || 'Not provided'}</Text>
        </View>
        <View style={styles.infoCard}>
          <Ionicons name="location-outline" size={24} color="#EF4444" />
          <Text style={styles.infoCardTitle}>Department</Text>
          <Text style={styles.infoCardValue}>{studentData?.department || 'Not specified'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'personal':
        return <PersonalDetailsForm studentData={studentData} />;
      case 'education':
        return <EducationDetailsForm studentData={studentData} />;
      case 'skills':
        return <SkillsForm studentData={studentData} />;
      case 'documents':
        return <DocumentsForm studentData={studentData} />;
      default:
        return renderOverview();
    }
  };

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <Text style={styles.sidebarTitle}>Profile Sections</Text>
        {profileSections.map(section => (
          <TouchableOpacity
            key={section.id}
            style={[
              styles.sidebarItem,
              activeSection === section.id && styles.activeSidebarItem
            ]}
            onPress={() => setActiveSection(section.id)}
          >
            <Ionicons
              name={section.icon}
              size={20}
              color={activeSection === section.id ? '#3B82F6' : '#6B7280'}
            />
            <View style={styles.sidebarItemText}>
              <Text style={[
                styles.sidebarItemTitle,
                activeSection === section.id && styles.activeSidebarItemTitle
              ]}>
                {section.name}
              </Text>
              <Text style={styles.sidebarItemDescription}>
                {section.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {renderActiveSection()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
  },
  sidebar: {
    width: 120,
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    paddingVertical: 16,
  },
  sidebarTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  sidebarItem: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 12,
  },
  activeSidebarItem: {
    backgroundColor: '#EBF4FF',
  },
  sidebarItemText: {
    alignItems: 'center',
    marginTop: 4,
  },
  sidebarItemTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  activeSidebarItemTitle: {
    color: '#3B82F6',
  },
  sidebarItemDescription: {
    fontSize: 8,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  overviewContainer: {
    padding: 20,
  },
  profileHeader: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  profileId: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  infoCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
});