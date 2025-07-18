import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchJobs } from '../../redux/slices/jobSlice';
import { fetchRounds } from '../../redux/slices/roundSlice';

export default function RoundsScreen() {
  const dispatch = useDispatch();
  const { jobs, loading: jobsLoading } = useSelector(state => state.job);
  const { rounds, loading: roundsLoading } = useSelector(state => state.round);
  const [universityName, setUniversityName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);

  useEffect(() => {
    loadUniversityName();
  }, []);

  useEffect(() => {
    if (universityName) {
      loadJobs();
    }
  }, [universityName]);

  const loadUniversityName = async () => {
    try {
      const name = await AsyncStorage.getItem('universityName');
      const department = await AsyncStorage.getItem('department');
      setUniversityName(name || 'Andhra University');
    } catch (error) {
      console.error('Error loading university name:', error);
    }
  };

  const loadJobs = () => {
    dispatch(fetchJobs({ universityName }));
  };

  const handleFetchRounds = async (job) => {
    try {
      const result = await dispatch(fetchRounds({ jobId: job._id, universityName })).unwrap();
      if (result && result.length > 0) {
        setSelectedJob(job);
        setCurrentRoundIndex(0);
        setModalVisible(true);
      } else {
        Alert.alert('No Rounds', 'No rounds have been added for this job yet.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch round status. Please try again later.');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'selected':
      case 'qualified':
        return '#10B981';
      case 'pending':
      case 'in progress':
        return '#F59E0B';
      default:
        return '#EF4444';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'selected':
      case 'qualified':
        return 'checkmark-circle';
      case 'pending':
      case 'in progress':
        return 'time';
      default:
        return 'close-circle';
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderJobItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => handleFetchRounds(item)}
    >
      <View style={styles.jobHeader}>
        <View style={styles.jobTitle}>
          <Text style={styles.jobIndex}>{index + 1}.</Text>
          <View style={styles.jobInfo}>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.companyText}>{item.company}</Text>
          </View>
        </View>
        <View style={styles.appliedBadge}>
          <Text style={styles.appliedText}>Applied</Text>
        </View>
      </View>

      <View style={styles.jobDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="people-outline" size={14} color="#6B7280" />
          <Text style={styles.detailText}>Min. {item.minPercentage}% required</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={14} color="#6B7280" />
          <Text style={styles.detailText}>
            Applied: {new Date(item.closingDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.viewRoundsButton}
        onPress={() => handleFetchRounds(item)}
      >
        <Ionicons name="trophy-outline" size={16} color="white" />
        <Text style={styles.viewRoundsText}>View Interview Rounds</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderRoundsModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{selectedJob?.title}</Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {rounds.length > 0 && (
          <View style={styles.modalContent}>
            <View style={styles.roundCard}>
              <Text style={styles.roundName}>{rounds[currentRoundIndex]?.roundName}</Text>
              <Text style={styles.roundDescription}>
                {rounds[currentRoundIndex]?.roundDescription}
              </Text>
              
              <View style={styles.statusContainer}>
                <Ionicons
                  name={getStatusIcon(rounds[currentRoundIndex]?.status)}
                  size={20}
                  color={getStatusColor(rounds[currentRoundIndex]?.status)}
                />
                <Text style={[
                  styles.statusText,
                  { color: getStatusColor(rounds[currentRoundIndex]?.status) }
                ]}>
                  {rounds[currentRoundIndex]?.status}
                </Text>
              </View>
            </View>

            <View style={styles.navigationContainer}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentRoundIndex === 0 && styles.disabledNavButton
                ]}
                onPress={() => setCurrentRoundIndex(Math.max(currentRoundIndex - 1, 0))}
                disabled={currentRoundIndex === 0}
              >
                <Ionicons name="chevron-back" size={20} color={currentRoundIndex === 0 ? "#9CA3AF" : "#3B82F6"} />
                <Text style={[
                  styles.navButtonText,
                  currentRoundIndex === 0 && styles.disabledNavButtonText
                ]}>
                  Previous
                </Text>
              </TouchableOpacity>

              <Text style={styles.roundCounter}>
                {currentRoundIndex + 1} of {rounds.length}
              </Text>

              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentRoundIndex === rounds.length - 1 && styles.disabledNavButton
                ]}
                onPress={() => setCurrentRoundIndex(Math.min(currentRoundIndex + 1, rounds.length - 1))}
                disabled={currentRoundIndex === rounds.length - 1}
              >
                <Text style={[
                  styles.navButtonText,
                  currentRoundIndex === rounds.length - 1 && styles.disabledNavButtonText
                ]}>
                  Next
                </Text>
                <Ionicons name="chevron-forward" size={20} color={currentRoundIndex === rounds.length - 1 ? "#9CA3AF" : "#3B82F6"} />
              </TouchableOpacity>
            </View>
          </View>
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
            placeholder="Search applied jobs..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <FlatList
        data={filteredJobs}
        renderItem={renderJobItem}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={jobsLoading} onRefresh={loadJobs} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No applied jobs found</Text>
            <Text style={styles.emptySubtext}>
              Apply to jobs to track your interview rounds here
            </Text>
          </View>
        }
      />

      {renderRoundsModal()}
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
  appliedBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  appliedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  viewRoundsButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  viewRoundsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
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
    flex: 1,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  roundCard: {
    backgroundColor: '#F8FAFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  roundName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  roundDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  disabledNavButton: {
    backgroundColor: '#F9FAFB',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  disabledNavButtonText: {
    color: '#9CA3AF',
  },
  roundCounter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});