import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const { getThemeColors } = useTheme();
  const { user } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dynamicStyles = getThemeColors();

  const validatePasswords = () => {
    if (!currentPassword.trim()) {
      Alert.alert('Error', 'Please enter your current password');
      return false;
    }

    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return false;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long');
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return false;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePasswords()) return;

    setLoading(true);
    try {
      console.log('🔐 Attempting to change password...');
      
      const response = await authAPI.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      console.log('✅ Password change response:', response);

      Alert.alert(
        'Success',
        'Your password has been changed successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear form
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              // Navigate back to settings
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ Password change error:', error);
      
      let errorMessage = 'Failed to change password. Please try again.';
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid current password';
      } else if (error.response?.status === 401) {
        errorMessage = 'Current password is incorrect';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    showPassword, 
    toggleShowPassword 
  }) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: dynamicStyles.textColor }]}>
        {label}
      </Text>
      <View style={[styles.passwordInputWrapper, { backgroundColor: dynamicStyles.inputBackground, borderColor: dynamicStyles.borderColor }]}>
        <TextInput
          style={[styles.passwordInput, { color: dynamicStyles.textColor }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={dynamicStyles.mutedText}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={toggleShowPassword}
        >
          <Icon
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color={dynamicStyles.mutedText}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: dynamicStyles.borderColor }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>
          Change Password
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.description, { color: dynamicStyles.mutedText }]}>
          Enter your current password and choose a new secure password for your account.
        </Text>

        <PasswordInput
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Enter your current password"
          showPassword={showCurrentPassword}
          toggleShowPassword={() => setShowCurrentPassword(!showCurrentPassword)}
        />

        <PasswordInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter new password (min. 6 characters)"
          showPassword={showNewPassword}
          toggleShowPassword={() => setShowNewPassword(!showNewPassword)}
        />

        <PasswordInput
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your new password"
          showPassword={showConfirmPassword}
          toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        {/* Password Requirements */}
        <View style={styles.requirementsContainer}>
          <Text style={[styles.requirementsTitle, { color: dynamicStyles.textColor }]}>
            Password Requirements:
          </Text>
          <Text style={[styles.requirement, { color: dynamicStyles.mutedText }]}>
            • At least 6 characters long
          </Text>
          <Text style={[styles.requirement, { color: dynamicStyles.mutedText }]}>
            • Different from your current password
          </Text>
          <Text style={[styles.requirement, { color: dynamicStyles.mutedText }]}>
            • Should contain a mix of letters and numbers
          </Text>
        </View>

        {/* Change Password Button */}
        <TouchableOpacity
          style={[
            styles.changePasswordButton,
            { backgroundColor: dynamicStyles.primaryColor },
            loading && styles.disabledButton,
          ]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={dynamicStyles.buttonText} />
          ) : (
            <Text style={[styles.changePasswordButtonText, { color: dynamicStyles.buttonText }]}>
              Change Password
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  eyeButton: {
    padding: 8,
  },
  requirementsContainer: {
    marginTop: 10,
    marginBottom: 30,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  requirement: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  changePasswordButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  changePasswordButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default ChangePasswordScreen;
