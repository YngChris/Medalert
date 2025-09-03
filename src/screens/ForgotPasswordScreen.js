import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Feather';

const ForgotPasswordScreen = () => {
  const [form, setForm] = useState({
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const navigation = useNavigation();
  const { theme } = useTheme();

  // Theme-aware dynamic styles
  const dynamicStyles = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    textColor: theme === 'dark' ? '#ffffff' : '#121417',
    mutedText: theme === 'dark' ? '#a0a0a0' : '#677583',
    borderColor: theme === 'dark' ? '#404040' : '#e0e6ed',
    inputBackground: theme === 'dark' ? '#2d2d2d' : '#f9fafb',
    cardBackground: theme === 'dark' ? '#2d2d2d' : '#ffffff',
    primaryColor: '#197ce5',
    errorColor: '#dc3545',
    successColor: '#28a745',
    warningColor: '#ffc107',
  };

  // Real-time form validation
  useEffect(() => {
    validateForm();
  }, [form, hasAttemptedSubmit]);

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Only show errors if user has attempted to submit
    if (hasAttemptedSubmit) {
      setErrors(newErrors);
    }
    setIsFormValid(Object.keys(newErrors).length === 0 && form.email.trim() !== "");
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing (only if they've attempted to submit)
    if (hasAttemptedSubmit && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleResetPassword = async () => {
    // Mark that user has attempted to submit
    setHasAttemptedSubmit(true);
    
    // Force validation to show errors
    validateForm();
    
    if (!isFormValid) {
      Alert.alert("Validation Error", "Please fix the errors in the form before proceeding.");
      return;
    }

    setLoading(true);
    // setError(''); // This line was removed from the new_code, so it's removed here.
    // setSuccessMessage(''); // This line was removed from the new_code, so it's removed here.
    
    try {
      // Simulate API call for password reset
      // In a real app, you would call your backend API here
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful response
      setSuccessMessage('Password reset instructions have been sent to your email address. Please check your inbox and follow the instructions to reset your password.');
      
      // Clear form after successful submission
      setForm({ email: '' });
      
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert(
        "Password Reset Failed", 
        "Unable to process your request. Please check your internet connection and try again.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const onBackToLoginPress = () => {
    navigation.navigate('Login');
  };

  const onBackToIntroPress = () => {
    navigation.navigate('GetStarted');
  };

  const getInputBorderColor = (field) => {
    if (errors[field]) return dynamicStyles.errorColor;
    if (form[field].trim()) return dynamicStyles.successColor;
    return dynamicStyles.borderColor;
  };

  const getInputIconColor = (field) => {
    if (errors[field]) return dynamicStyles.errorColor;
    if (form[field].trim()) return dynamicStyles.successColor;
    return dynamicStyles.mutedText;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={[styles.logoContainer, { backgroundColor: dynamicStyles.primaryColor }]}>
              <Icon name="lock" size={48} color="#ffffff" />
            </View>
            <Text style={[styles.welcomeText, { color: dynamicStyles.textColor }]}>
              Forgot Password?
            </Text>
            <Text style={[styles.subtitleText, { color: dynamicStyles.mutedText }]}>
              Don't worry! Enter your email address and we'll send you instructions to reset your password.
            </Text>
          </View>

          {/* Form Container */}
          <View style={[styles.formContainer, { backgroundColor: dynamicStyles.cardBackground }]}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: dynamicStyles.textColor }]}>
                Email Address
              </Text>
              <View style={[
                styles.inputContainer,
                { 
                  backgroundColor: dynamicStyles.inputBackground,
                  borderColor: getInputBorderColor('email'),
                  borderWidth: 2
                }
              ]}>
                <Icon 
                  name="mail" 
                  size={20} 
                  color={getInputIconColor('email')} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    { color: dynamicStyles.textColor }
                  ]}
                  value={form.email}
                  onChangeText={(value) => handleChange("email", value)}
                  placeholder="Enter your email address"
                  placeholderTextColor={dynamicStyles.mutedText}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                {form.email.trim() && !errors.email && (
                  <Icon name="check-circle" size={20} color={dynamicStyles.successColor} />
                )}
              </View>
              {errors.email && (
                <Text style={[styles.errorText, { color: dynamicStyles.errorColor }]}>
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Success Message */}
            {successMessage && (
              <View style={[styles.successContainer, { backgroundColor: `${dynamicStyles.successColor}15` }]}>
                <Icon name="check-circle" size={20} color={dynamicStyles.successColor} />
                <Text style={[styles.successText, { color: dynamicStyles.successColor }]}>
                  {successMessage}
                </Text>
              </View>
            )}

            {/* Reset Password Button */}
            <TouchableOpacity 
              style={[
                styles.resetButton, 
                { 
                  backgroundColor: isFormValid ? dynamicStyles.primaryColor : dynamicStyles.mutedText,
                  opacity: loading ? 0.7 : 1
                }
              ]} 
              onPress={handleResetPassword}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Icon name="send" size={20} color="#ffffff" style={styles.buttonIcon} />
                  <Text style={styles.resetButtonText}>Send Reset Instructions</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Help Text */}
            <View style={styles.helpContainer}>
              <Icon name="info" size={16} color={dynamicStyles.warningColor} />
              <Text style={[styles.helpText, { color: dynamicStyles.mutedText }]}>
                Check your spam folder if you don't receive the email within a few minutes
              </Text>
            </View>

            {/* Navigation Links */}
            <View style={styles.navigationContainer}>
              <TouchableOpacity
                onPress={onBackToLoginPress}
                style={styles.navigationButton}
                disabled={loading}
              >
                <Icon name="arrow-left" size={16} color={dynamicStyles.primaryColor} />
                <Text style={[styles.navigationText, { color: dynamicStyles.primaryColor }]}>
                  Back to Login
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onBackToIntroPress}
                style={styles.navigationButton}
                disabled={loading}
              >
                <Icon name="home" size={16} color={dynamicStyles.primaryColor} />
                <Text style={[styles.navigationText, { color: dynamicStyles.primaryColor }]}>
                  Back to Introduction
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerSection: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    elevation: 8,
    shadowColor: "#197ce5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    color: "#677583",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  errorText: {
    fontSize: 14,
    marginTop: 6,
    marginLeft: 4,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  successText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  resetButton: {
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  resetButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  helpContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    backgroundColor: "#fff3cd20",
  },
  helpText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  navigationContainer: {
    gap: 16,
  },
  navigationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e6ed",
  },
  navigationText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
});

export default ForgotPasswordScreen;
