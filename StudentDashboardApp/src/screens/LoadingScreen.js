import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoadingScreen() {
  return (
    <LinearGradient
      colors={['#3B82F6', '#8B5CF6']}
      style={styles.container}
    >
      <ActivityIndicator size="large" color="white" />
      <Text style={styles.text}>Loading...</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    marginTop: 20,
    fontWeight: '600',
  },
});