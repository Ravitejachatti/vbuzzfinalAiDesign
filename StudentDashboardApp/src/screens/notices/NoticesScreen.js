import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchNotices, markNoticeAsRead } from '../../redux/slices/noticeSlice';
import NoticeModal from '../../components/NoticeModal';

export default function NoticesScreen() {
  const dispatch = useDispatch();
  const { notices, loading, error } = useSelector(state => state.notice);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState('all');
  const [universityName, setUniversityName] = useState('');

  useEffect(() => {
    loadUniversityName();
  }, []);

  useEffect(() => {
    if (universityName) {
      loadNotices();
    }
  }, [universityName]);

  const loadUniversityName = async () => {
    try {
      const name = await AsyncStorage.getItem('universityName');
      setUniversityName(name || 'Andhra University');
    } catch (error) {
      console.error('Error loading university name:', error);
    }
  };

  const loadNotices = () => {
    dispatch(fetchNotices({ universityName }));
  };

  const handleNoticePress = (notice) => {
    setSelectedNotice(notice);
    setModalVisible(true);
    if (!notice.isRead) {
      dispatch(markNoticeAsRead({ noticeId: notice._id, universityName }));
    }
  };

  const getFilteredNotices = () => {
    if (filter === 'read') return notices.filter(n => n.isRead);
    if (filter === 'unread') return notices.filter(n => !n.isRead);
    return notices;
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const renderNoticeItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.noticeCard,
        !item.isRead && styles.unreadNotice
      ]}
      onPress={() => handleNoticePress(item)}
    >
      <View style={styles.noticeHeader}>
        <View style={styles.noticeTitle}>
          <Text style={styles.noticeIndex}>{index + 1}.</Text>
          <Text style={[styles.titleText, !item.isRead && styles.unreadTitle]}>
            {item.title}
          </Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
      </View>

      <Text style={styles.noticeMessage} numberOfLines={2}>
        {item.message}
      </Text>

      <View style={styles.noticeFooter}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={14} color="#6B7280" />
          <Text style={styles.dateText}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <Ionicons name="time-outline" size={14} color="#6B7280" />
          <Text style={styles.dateText}>
            Expires: {new Date(item.expiryDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      {['all', 'unread', 'read'].map(filterType => (
        <TouchableOpacity
          key={filterType}
          style={[
            styles.filterButton,
            filter === filterType && styles.activeFilterButton
          ]}
          onPress={() => setFilter(filterType)}
        >
          <Text style={[
            styles.filterButtonText,
            filter === filterType && styles.activeFilterButtonText
          ]}>
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadNotices}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const filteredNotices = getFilteredNotices();

  return (
    <View style={styles.container}>
      {renderFilterButtons()}
      
      <FlatList
        data={filteredNotices}
        renderItem={renderNoticeItem}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadNotices} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No {filter} notices available</Text>
          </View>
        }
      />

      <NoticeModal
        visible={modalVisible}
        notice={selectedNotice}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 20,
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
  noticeCard: {
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
    borderLeftWidth: 4,
    borderLeftColor: '#E5E7EB',
  },
  unreadNotice: {
    borderLeftColor: '#3B82F6',
    backgroundColor: '#F8FAFF',
  },
  noticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noticeTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  noticeIndex: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
    marginRight: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  unreadTitle: {
    color: '#1E40AF',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginLeft: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  noticeMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  noticeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
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
});