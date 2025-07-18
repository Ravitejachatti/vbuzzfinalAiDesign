import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PlacementReportsScreen() {
  const studentData = useSelector(state => state.student.data);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const placements = studentData?.placements || [];
  const totalApplied = placements.length;
  const selectedCompanies = placements.filter(p => p.status === 'Hired');
  const totalSelected = selectedCompanies.length;
  const totalOfferLetters = selectedCompanies.filter(p => p.offerLetterLink).length;
  const pendingApplications = placements.filter(p => ['Applied', 'In Progress'].includes(p.status)).length;

  const avgCTC = totalSelected > 0 
    ? selectedCompanies.reduce((sum, p) => sum + (p.ctc || 0), 0) / totalSelected
    : 0;

  const highestCTC = totalSelected > 0 
    ? Math.max(...selectedCompanies.map(p => p.ctc || 0))
    : 0;

  const stats = [
    { 
      title: 'Total Applications', 
      value: totalApplied, 
      icon: 'briefcase-outline', 
      color: '#3B82F6',
      bgColor: '#EBF4FF'
    },
    { 
      title: 'Companies Selected', 
      value: totalSelected, 
      icon: 'people-outline', 
      color: '#10B981',
      bgColor: '#ECFDF5'
    },
    { 
      title: 'Offer Letters', 
      value: totalOfferLetters, 
      icon: 'trophy-outline', 
      color: '#8B5CF6',
      bgColor: '#F3E8FF'
    },
    { 
      title: 'Pending Applications', 
      value: pendingApplications, 
      icon: 'time-outline', 
      color: '#F59E0B',
      bgColor: '#FFFBEB'
    }
  ];

  const getStatusIcon = (status) => {
    if (status === 'Hired') return 'checkmark-circle';
    if (['Applied', 'In Progress'].includes(status)) return 'time';
    return 'close-circle';
  };

  const getStatusColor = (status) => {
    if (status === 'Hired') return '#10B981';
    if (['Applied', 'In Progress'].includes(status)) return '#F59E0B';
    return '#EF4444';
  };

  const onRefresh = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => setLoading(false), 1000);
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Success Rate</Text>
          <Text style={styles.metricValue}>
            {totalApplied > 0 ? Math.round((totalSelected / totalApplied) * 100) : 0}%
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Offer Conversion</Text>
          <Text style={styles.metricValue}>
            {totalSelected > 0 ? Math.round((totalOfferLetters / totalSelected) * 100) : 0}%
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Active Applications</Text>
          <Text style={styles.metricValue}>{pendingApplications}</Text>
        </View>
      </View>

      {totalSelected > 0 && (
        <View style={styles.ctcContainer}>
          <View style={styles.ctcCard}>
            <Ionicons name="trending-up-outline" size={24} color="#10B981" />
            <Text style={styles.ctcTitle}>Average CTC</Text>
            <Text style={styles.ctcValue}>₹{avgCTC.toLocaleString()}</Text>
          </View>
          <View style={styles.ctcCard}>
            <Ionicons name="trophy-outline" size={24} color="#3B82F6" />
            <Text style={styles.ctcTitle}>Highest CTC</Text>
            <Text style={styles.ctcValue}>₹{highestCTC.toLocaleString()}</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderApplicationsTab = () => (
    <View style={styles.tabContent}>
      {placements.length > 0 ? (
        placements.map((placement, index) => (
          <View key={index} style={styles.applicationCard}>
            <View style={styles.applicationHeader}>
              <View style={styles.applicationInfo}>
                <Text style={styles.applicationCompany}>
                  {placement.companyName || 'N/A'}
                </Text>
                <Text style={styles.applicationRole}>
                  {placement.role || 'N/A'}
                </Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(placement.status) }
              ]}>
                <Ionicons
                  name={getStatusIcon(placement.status)}
                  size={16}
                  color="white"
                />
                <Text style={styles.statusText}>{placement.status}</Text>
              </View>
            </View>
            
            <View style={styles.applicationDetails}>
              <Text style={styles.applicationCTC}>
                CTC: {placement.ctc ? `₹${placement.ctc.toLocaleString()}` : 'N/A'}
              </Text>
              {placement.offerLetterLink && (
                <TouchableOpacity style={styles.offerLetterButton}>
                  <Ionicons name="document-outline" size={16} color="#3B82F6" />
                  <Text style={styles.offerLetterText}>View Offer</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="briefcase-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>No applications yet</Text>
        </View>
      )}
    </View>
  );

  const renderOffersTab = () => (
    <View style={styles.tabContent}>
      {selectedCompanies.length > 0 ? (
        selectedCompanies.map((offer, index) => (
          <View key={index} style={styles.offerCard}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.offerGradient}
            >
              <Text style={styles.offerCompany}>{offer.companyName}</Text>
              <Text style={styles.offerRole}>{offer.role}</Text>
              <Text style={styles.offerCTC}>₹{offer.ctc?.toLocaleString()}</Text>
              {offer.offerLetterLink && (
                <TouchableOpacity style={styles.viewOfferButton}>
                  <Text style={styles.viewOfferText}>View Offer Letter</Text>
                </TouchableOpacity>
              )}
            </LinearGradient>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="trophy-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>No offers yet</Text>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <LinearGradient
        colors={['#3B82F6', '#8B5CF6']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Placement Analysis</Text>
        <Text style={styles.headerSubtitle}>Track your placement journey</Text>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={[styles.statCard, { backgroundColor: stat.bgColor }]}>
            <View style={styles.statContent}>
              <View>
                <Text style={styles.statTitle}>{stat.title}</Text>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              </View>
              <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                <Ionicons name={stat.icon} size={24} color="white" />
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabButtons}>
          {[
            { id: 'overview', label: 'Overview', icon: 'analytics-outline' },
            { id: 'applications', label: 'Applications', icon: 'list-outline' },
            { id: 'offers', label: 'Offers', icon: 'trophy-outline' }
          ].map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                activeTab === tab.id && styles.activeTabButton
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons
                name={tab.icon}
                size={20}
                color={activeTab === tab.id ? '#3B82F6' : '#6B7280'}
              />
              <Text style={[
                styles.tabButtonText,
                activeTab === tab.id && styles.activeTabButtonText
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'applications' && renderApplicationsTab()}
        {activeTab === 'offers' && renderOffersTab()}
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
    padding: 24,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    marginTop: -20,
  },
  statCard: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tabButtons: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 8,
  },
  activeTabButtonText: {
    color: '#3B82F6',
  },
  tabContent: {
    padding: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  ctcContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ctcCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  ctcTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
  },
  ctcValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  applicationCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  applicationInfo: {
    flex: 1,
  },
  applicationCompany: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  applicationRole: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  applicationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applicationCTC: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  offerLetterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerLetterText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  offerCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  offerGradient: {
    padding: 20,
  },
  offerCompany: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  offerRole: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  offerCTC: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  viewOfferButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  viewOfferText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
  },
});