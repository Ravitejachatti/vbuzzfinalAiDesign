import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:3003/api';

export default function LoginScreen({ navigation }) {
  const [registeredNumber, setRegisteredNumber] = useState('');
  const [password, setPassword] = useState('');
  const [universityName, setUniversityName] = useState('Andhra University');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!registeredNumber || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/student/login?universityName=${encodeURIComponent(universityName)}`,
        {
          registered_number: registeredNumber,
          password: password,
        }
      );

      // Store authentication data
      await AsyncStorage.setItem('Student_token', response.data.token);
      await AsyncStorage.setItem('Student_User', JSON.stringify(response.data.student));
      await AsyncStorage.setItem('studentAuth', 'true');
      await AsyncStorage.setItem('studentName', response.data.student.name);
      await AsyncStorage.setItem('universityName', universityName);
      await AsyncStorage.setItem('registeredNumber', registeredNumber);

      Alert.alert('Success', 'Login successful!');
      navigation.replace('Main');
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'An error occurred during login.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#3B82F6', '#8B5CF6']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.loginContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Student Login</Text>
              <Text style={styles.subtitle}>Welcome back to your dashboard</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons name="school-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="University Name"
                  value={universityName}
                  onChangeText={setUniversityName}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="card-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Registered Number"
                  value={registeredNumber}
                  onChangeText={setRegisteredNumber}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loginContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1F2937',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '500',
  },
});