import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchJobs, applyToJob, clearApplyStatus } from '../../redux/slices/jobSlice';

export default function JobsScreen() {
  const dispatch = useDispatch();
  const { jobs, loading, applyingJobIds, applyError, applySuccessMessage } = useSelector(state => state.job);
  const [universityName, setUniversityName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadUniversityName();
  }, []);

  useEffect(() => {
    if (universityName) {
      loadJobs();
    }
  }, [universityName]);

  useEffect(() => {
    if (applyError) {
      Alert.alert('Application Failed', applyError);
      dispatch(clearApplyStatus());
    } else if (applySuccessMessage) {
      Alert.alert('Success', applySuccessMessage);
      dispatch(clearApplyStatus());
    }
  }, [applyError, applySuccessMessage]);

  const loadUniversityName = async () => {
    try {
      const name = await AsyncStorage.getItem('universityName');
      setUniversityName(name || 'Andhra University');
    } catch (error) {
      console.error('Error loading university name:', error);
    }
  };

  const loadJobs = () => {
    dispatch(fetchJobs({ universityName }));
  };

  const handleApply = (job) => {
    if (job.status === 'Closed' || applyingJobIds.includes(job._id)) return;
    
    Alert.alert(
      'Apply for Job',
      `Are you sure you want to apply for ${job.title} at ${job.company}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Apply', 
          onPress: () => dispatch(applyToJob({ jobId: job._id, universityName }))
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return '#10B981';
      case 'closed': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm
      ? (job.title + job.company + job.description)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;

    const matchesStatus = statusFilter === 'all'
      ? true
      : job.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const renderJobItem = ({ item, index }) => {
    const isApplying = applyingJobIds.includes(item._id);
    const isExpired = new Date(item.closingDate) < new Date();

    return (
      <TouchableOpacity
        style={styles.jobCard}
        onPress={() => {
          setSelectedJob(item);
          setModalVisible(true);
        }}
      >
        <View style={styles.jobHeader}>
          <View style={styles.jobTitle}>
            <Text style={styles.jobIndex}>{index + 1}.</Text>
            <View style={styles.jobInfo}>
              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.companyText}>{item.company}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.jobDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.jobDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={14} color="#6B7280" />
            <Text style={styles.detailText}>{item.location || 'Not specified'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={14} color="#6B7280" />
            <Text style={styles.detailText}>{item.ctc} LPA</Text>
          </View>
        </View>

        <View style={styles.jobFooter}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.dateText}>
              Closes: {new Date(item.closingDate).toLocaleDateString()}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.applyButton,
              (isApplying || item.status === 'Closed' || isExpired) && styles.disabledButton
            ]}
            onPress={() => handleApply(item)}
            disabled={isApplying || item.status === 'Closed' || isExpired}
          >
            {isApplying ? (
              <Text style={styles.applyButtonText}>Applying...</Text>
            ) : (
              <Text style={styles.applyButtonText}>Apply</Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderJobModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Job Details</Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
        
        {selectedJob && (
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalJobTitle}>{selectedJob.title}</Text>
            <Text style={styles.modalCompany}>{selectedJob.company}</Text>
            
            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.sectionContent}>{selectedJob.description}</Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailValue}>{selectedJob.location || 'Not specified'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>CTC:</Text>
                <Text style={styles.detailValue}>{selectedJob.ctc} LPA</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type:</Text>
                <Text style={styles.detailValue}>{selectedJob.type}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Min Percentage:</Text>
                <Text style={styles.detailValue}>{selectedJob.minPercentage}%</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.modalApplyButton,
                (applyingJobIds.includes(selectedJob._id) || selectedJob.status === 'Closed') && styles.disabledButton
              ]}
              onPress={() => {
                handleApply(selectedJob);
                setModalVisible(false);
              }}
              disabled={applyingJobIds.includes(selectedJob._id) || selectedJob.status === 'Closed'}
            >
              <Text style={styles.modalApplyButtonText}>
                {applyingJobIds.includes(selectedJob._id) ? 'Applying...' : 'Apply Now'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        
        <View style={styles.filterContainer}>
          {['all', 'open', 'closed'].map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                statusFilter === filter && styles.activeFilterButton
              ]}
              onPress={() => setStatusFilter(filter)}
            >
              <Text style={[
                styles.filterButtonText,
                statusFilter === filter && styles.activeFilterButtonText
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredJobs}
        renderItem={renderJobItem}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadJobs} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="briefcase-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No jobs found</Text>
          </View>
        }
      />

      {renderJobModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#1F2937',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  activeFilterButton: {
    backgroundColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  listContainer: {
    padding: 16,
  },
  jobCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
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
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 8,
  },
  jobIndex: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
    marginRight: 8,
    marginTop: 2,
  },
  jobInfo: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  companyText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  jobDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalJobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  modalCompany: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    width: 120,
  },
  detailValue: {
    fontSize: 16,
    color: '#6B7280',
    flex: 1,
  },
  modalApplyButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  modalApplyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});