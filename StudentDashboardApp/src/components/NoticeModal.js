import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function NoticeModal({ visible, notice, onClose }) {
  if (!notice) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={['#3B82F6', '#8B5CF6']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={styles.title}>{notice.title}</Text>
              <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={14} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.dateText}>
                  Posted: {new Date(notice.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.dateContainer}>
                <Ionicons name="time-outline" size={14} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.dateText}>
                  Expires: {new Date(notice.expiryDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content}>
          <Text style={styles.message}>{notice.message}</Text>
          
          {notice.link && (
            <TouchableOpacity style={styles.linkButton}>
              <Ionicons name="link-outline" size={20} color="#3B82F6" />
              <Text style={styles.linkText}>View Attachment</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.closeFooterButton} onPress={onClose}>
            <Text style={styles.closeFooterButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 6,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1F2937',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginLeft: 8,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  closeFooterButton: {
    backgroundColor: '#6B7280',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeFooterButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});