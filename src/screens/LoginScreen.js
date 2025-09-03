import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Icon from "react-native-vector-icons/Feather";
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// Complete the auth session for web
WebBrowser.maybeCompleteAuthSession();

const GOOGLE_LOGO_URI = {
  uri: "https://developers.google.com/identity/images/g-logo.png",
};

export default function LoginScreen() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const navigation = useNavigation();
  const { login } = useAuth();
  const { theme } = useTheme();

  // Google OAuth configuration using the new API
  const redirectUri = makeRedirectUri({
    scheme: 'medalert',
    path: 'auth/callback'
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual Google Client ID
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: 'code',
      extraParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' }
  );

  // Handle Google OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleAuthSuccess(response.params.code);
    } else if (response?.type === 'error') {
      console.error('Google OAuth error:', response.error);
      Alert.alert(
        "Google Sign-In Failed", 
        "Authentication was cancelled or failed. Please try again.",
        [{ text: "OK" }]
      );
      setGoogleLoading(false);
    }
  }, [response]);

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
    
    // Password validation
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    // Only show errors if user has attempted to submit
    if (hasAttemptedSubmit) {
      setErrors(newErrors);
    }
    setIsFormValid(Object.keys(newErrors).length === 0 && form.email.trim() !== "" && form.password.trim() !== "");
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
  };

  const handleLogin = async () => {
    // Mark that user has attempted to submit
    setHasAttemptedSubmit(true);
    
    // Force validation to show errors
    validateForm();
    
    if (!isFormValid) {
      Alert.alert("Validation Error", "Please fix the errors in the form before proceeding.");
      return;
    }

    setLoading(true);
    
    try {
      const success = await login(form.email, form.password);
      if (success) {
        // Login successful - navigation will be handled by AuthContext
        console.log("Login successful");
      } else {
        Alert.alert("Login Failed", "Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    
    try {
      // Use the new promptAsync method
      const result = await promptAsync();
      
      if (result.type === 'cancel') {
        console.log('Google Sign-In was cancelled');
        setGoogleLoading(false);
      }
      // Response will be handled by useEffect
    } catch (error) {
      console.error('Google Sign-In error:', error);
      Alert.alert(
        "Google Sign-In Failed", 
        "Unable to start Google authentication. Please try again.",
        [{ text: "OK" }]
      );
      setGoogleLoading(false);
    }
  };

  const handleGoogleAuthSuccess = async (code) => {
    try {
      // Exchange the code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual Google Client ID
          client_secret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET', // Replace with your actual Google Client Secret
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenResponse.json();

      if (tokenData.access_token) {
        // Get user info using the access token
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`
        );
        const userInfo = await userInfoResponse.json();

        // Create a user object from Google data
        const googleUser = {
          id: userInfo.id,
          email: userInfo.email,
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          fullName: userInfo.name,
          profilePicture: userInfo.picture,
          provider: 'google',
          googleId: userInfo.id,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
        };

        console.log('Google Sign-In successful:', googleUser);
        
        // Show success and navigate
        Alert.alert(
          "Google Sign-In Successful", 
          `Welcome, ${googleUser.firstName}!`,
          [
            {
              text: "Continue",
              onPress: () => {
                // Navigate to Home with Google user data
                navigation.navigate("Home", { 
                  user: googleUser,
                  fromGoogleSignIn: true 
                });
              }
            }
          ]
        );
      } else {
        throw new Error('Failed to get access token');
      }
    } catch (error) {
      console.error('Token exchange error:', error);
      Alert.alert(
        "Google Sign-In Failed", 
        "Unable to complete authentication. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const onSignUpPress = () => {
    navigation.navigate("Signup");
  };

  const onForgotPasswordPress = () => {
    navigation.navigate("ForgotPassword");
  };

  const onBackToIntroPress = () => {
    navigation.navigate("GetStarted");
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
              <Icon name="shield" size={48} color="#ffffff" />
            </View>
            <Text style={[styles.welcomeText, { color: dynamicStyles.textColor }]}>
              Welcome Back
            </Text>
            <Text style={[styles.subtitleText, { color: dynamicStyles.mutedText }]}>
              Sign in to continue to MedAlert
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

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: dynamicStyles.textColor }]}>
                Password
              </Text>
              <View style={[
                styles.inputContainer,
                { 
                  backgroundColor: dynamicStyles.inputBackground,
                  borderColor: getInputBorderColor('password'),
                  borderWidth: 2
                }
              ]}>
                <Icon 
                  name="lock" 
                  size={20} 
                  color={getInputIconColor('password')} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    { color: dynamicStyles.textColor }
                  ]}
                  value={form.password}
                  onChangeText={(value) => handleChange("password", value)}
                  placeholder="Enter your password"
                  placeholderTextColor={dynamicStyles.mutedText}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Icon 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color={dynamicStyles.mutedText} 
                  />
                </TouchableOpacity>
                {form.password.trim() && !errors.password && (
                  <Icon name="check-circle" size={20} color={dynamicStyles.successColor} />
                )}
              </View>
              {errors.password && (
                <Text style={[styles.errorText, { color: dynamicStyles.errorColor }]}>
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.rememberMeContainer}>
              <TouchableOpacity
                style={styles.rememberMeButton}
                onPress={() => setRememberMe(!rememberMe)}
                disabled={loading}
              >
                <View style={[
                  styles.checkbox,
                  { 
                    backgroundColor: rememberMe ? dynamicStyles.primaryColor : 'transparent',
                    borderColor: rememberMe ? dynamicStyles.primaryColor : dynamicStyles.borderColor
                  }
                ]}>
                  {rememberMe && (
                    <Icon name="check" size={16} color="#ffffff" />
                  )}
                </View>
                <Text style={[styles.rememberMeText, { color: dynamicStyles.textColor }]}>
                  Remember me
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={onForgotPasswordPress}
                disabled={loading}
              >
                <Text style={[styles.forgotPasswordText, { color: dynamicStyles.primaryColor }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity 
              style={[
                styles.loginButton, 
                { 
                  backgroundColor: isFormValid ? dynamicStyles.primaryColor : dynamicStyles.mutedText,
                  opacity: loading ? 0.7 : 1
                }
              ]} 
              onPress={handleLogin}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: dynamicStyles.borderColor }]} />
              <Text style={[styles.dividerText, { color: dynamicStyles.mutedText }]}>
                or continue with
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: dynamicStyles.borderColor }]} />
            </View>

            {/* Google Sign-in */}
            <TouchableOpacity
              style={[
                styles.googleButton, 
                { 
                  borderColor: dynamicStyles.borderColor,
                  opacity: googleLoading ? 0.7 : 1
                }
              ]}
              onPress={handleGoogleSignIn}
              disabled={googleLoading || loading || !request}
            >
              {googleLoading ? (
                <ActivityIndicator color={dynamicStyles.primaryColor} size="small" />
              ) : (
                <>
                  <Image
                    source={GOOGLE_LOGO_URI}
                    style={styles.googleLogo}
                    resizeMode="contain"
                  />
                  <Text style={[styles.googleButtonText, { color: dynamicStyles.textColor }]}>
                    Sign in with Google
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <TouchableOpacity
              onPress={onSignUpPress}
              style={styles.signUpContainer}
              disabled={loading}
            >
              <Text style={[styles.signUpText, { color: dynamicStyles.mutedText }]}>
                Don't have an account?{" "}
                <Text style={{ color: dynamicStyles.primaryColor, fontWeight: '600' }}>
                  Sign Up
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Back to Introduction */}
            <TouchableOpacity
              style={styles.backToIntroButton}
              onPress={onBackToIntroPress}
              disabled={loading}
            >
              <Text style={[styles.backToIntroText, { color: dynamicStyles.primaryColor }]}>
                Back to Introduction
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
  );
}

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
    marginBottom: 8,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    color: "#677583",
    textAlign: "center",
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
  passwordToggle: {
    padding: 4,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 14,
    marginTop: 6,
    marginLeft: 4,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  rememberMeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rememberMeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  forgotPasswordButton: {
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  loginButton: {
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
  loginButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e6ed",
  },
  dividerText: {
    fontSize: 14,
    marginHorizontal: 16,
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "transparent",
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#e0e6ed",
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  signUpContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  signUpText: {
    fontSize: 16,
    textAlign: "center",
  },
  backToIntroButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  backToIntroText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
