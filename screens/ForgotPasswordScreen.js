import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = () => {
    setError('');
    setSuccessMessage('');
    if (!email) {
      setError('Email is required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    // Simulate async operation for password reset
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('If this email is registered, you will receive password reset instructions.');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Recovery</Text>
      <Text style={styles.subtitle}>Enter your email to reset your password</Text>

      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

      <TouchableOpacity
        style={[styles.continueButton, loading ? styles.buttonDisabled : null]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#121417" /> : <Text style={styles.continueButtonText}>Reset Password</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>I Remember Password, Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#677583',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dde0e4',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff4d4d',
  },
  errorText: {
    color: '#ff4d4d',
    marginBottom: 10,
    textAlign: 'center',
  },
  successText: {
    color: '#4BB543',
    marginBottom: 10,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#d2e2f3',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonDisabled: {
    backgroundColor: '#a0bcd8',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#121417',
  },
  loginText: {
    color: '#677583',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default ForgotPasswordScreen;
