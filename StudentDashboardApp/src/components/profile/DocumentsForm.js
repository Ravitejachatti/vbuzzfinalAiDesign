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

export default function DocumentsForm({ studentData }) {
  const [documents, setDocuments] = useState({
    resumeOrCV: studentData?.documents?.resumeOrCV || '',
    personalStatement: studentData?.documents?.personalStatement || '',
    coverLetter: studentData?.documents?.coverLetter || '',
    transcripts: studentData?.documents?.transcripts || [],
    lettersOfRecommendation: studentData?.documents?.lettersOfRecommendation || [],
    offerLetters: studentData?.documents?.offerLetters || [],
  });

  const [newLink, setNewLink] = useState('');
  const [activeSection, setActiveSection] = useState('');

  const addLink = (section) => {
    if (!newLink.trim()) return;
    
    setDocuments({
      ...documents,
      [section]: [...documents[section], newLink.trim()]
    });
    setNewLink('');
    setActiveSection('');
  };

  const removeLink = (section, index) => {
    setDocuments({
      ...documents,
      [section]: documents[section].filter((_, i) => i !== index)
    });
  };

  const handleSubmit = () => {
    Alert.alert('Success', 'Documents updated successfully!');
  };

  const renderSingleInput = (title, key, placeholder) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TextInput
        style={styles.input}
        value={documents[key]}
        onChangeText={(value) => setDocuments({ ...documents, [key]: value })}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );

  const renderMultipleLinks = (title, key) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      
      <View style={styles.addLinkContainer}>
        <TextInput
          style={styles.linkInput}
          value={activeSection === key ? newLink : ''}
          onChangeText={setNewLink}
          onFocus={() => setActiveSection(key)}
          placeholder={`Add ${title.toLowerCase()} link`}
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addLink(key)}
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.linksContainer}>
        {documents[key].map((link, index) => (
          <View key={index} style={styles.linkItem}>
            <Ionicons name="link-outline" size={16} color="#3B82F6" />
            <Text style={styles.linkText} numberOfLines={1}>
              {link}
            </Text>
            <TouchableOpacity
              onPress={() => removeLink(key, index)}
              style={styles.removeButton}
            >
              <Ionicons name="close" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="document-outline" size={24} color="#3B82F6" />
        <Text style={styles.headerTitle}>Documents</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.note}>
          📌 Please provide Google Drive shareable links for your documents
        </Text>

        {renderSingleInput('Resume/CV', 'resumeOrCV', 'Enter resume link')}
        {renderSingleInput('Personal Statement', 'personalStatement', 'Enter personal statement link')}
        {renderSingleInput('Cover Letter', 'coverLetter', 'Enter cover letter link')}
        
        {renderMultipleLinks('Transcripts', 'transcripts')}
        {renderMultipleLinks('Letters of Recommendation', 'lettersOfRecommendation')}
        {renderMultipleLinks('Offer Letters', 'offerLetters')}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Update Documents</Text>
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
  note: {
    fontSize: 14,
    color: '#DC2626',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
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
  addLinkContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  linkInput: {
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
  linksContainer: {
    marginTop: 8,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 8,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  submitButton: {
    backgroundColor: '#10B981',
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