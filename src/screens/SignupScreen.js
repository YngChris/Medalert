import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Platform } from 'react-native';
import Icon from "react-native-vector-icons/Feather";
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

const SignupScreen = ({ navigation }) => {
  const { getThemeColors } = useTheme();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    location: "",
    signupDate: new Date().toISOString().split("T")[0],
  });
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto-detect location when component mounts (if permission already granted)
  useEffect(() => {
    const checkAndAutoDetectLocation = async () => {
      try {
        // Check if location permission is already granted
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status === 'granted' && !form.location.trim()) {
          // Auto-detect without showing alerts
          setLocationLoading(true);
          try {
            let locationData = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced
            });
            
            const { latitude, longitude } = locationData.coords;
            let reverseGeocode = await Location.reverseGeocodeAsync({
              latitude,
              longitude
            });

            if (reverseGeocode && reverseGeocode.length > 0) {
              const address = reverseGeocode[0];
              const locationString = [
                address.city,
                address.region,
                address.country
              ].filter(Boolean).join(', ');

              setForm(prev => ({
                ...prev,
                location: locationString
              }));
            }
          } catch (error) {
            console.log('Auto-location detection failed:', error.message);
          } finally {
            setLocationLoading(false);
          }
        }
      } catch (error) {
        console.log('Permission check failed:', error.message);
      }
    };

    checkAndAutoDetectLocation();
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    // Google Forms style: Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Google Forms style: Validate on blur (when field loses focus)
  const handleBlur = (field) => {
    const newErrors = { ...errors };
    
    if (field === 'firstName') {
      if (!form.firstName.trim()) {
        newErrors.firstName = "This field is required";
      } else {
        delete newErrors.firstName;
      }
    }
    
    if (field === 'lastName') {
      if (!form.lastName.trim()) {
        newErrors.lastName = "This field is required";
      } else {
        delete newErrors.lastName;
      }
    }
    
    if (field === 'email') {
      if (!form.email.trim()) {
        newErrors.email = "This field is required";
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        newErrors.email = "Enter a valid email";
      } else {
        delete newErrors.email;
      }
    }
    
    if (field === 'password') {
      if (!form.password.trim()) {
        newErrors.password = "This field is required";
      } else if (form.password.length < 8) {
        newErrors.password = "Use 8 or more characters";
      } else {
        delete newErrors.password;
      }
    }
    
    setErrors(newErrors);
  };

  // Google Forms style: Validate all fields on form submission
  const validateForm = () => {
    const newErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "This field is required";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "This field is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "This field is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.password.trim()) {
      newErrors.password = "This field is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Use 8 or more characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Google Forms style: Minimal styling changes  
  const getInputBorderColor = (field) => {
    if (errors[field]) return dynamicStyles.errorColor;
    return dynamicStyles.borderColor;
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const getCurrentLocation = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not available on web', 'Automatic location detection requires a native device. Please type your location.');
      return;
    }
    try {
      setLocationLoading(true);
      
      // Request permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is needed to automatically detect your location.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get current position
      let locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      const { latitude, longitude } = locationData.coords;

      // Reverse geocode to get human-readable address
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const locationString = [
          address.city,
          address.region,
          address.country
        ].filter(Boolean).join(', ');

        setForm(prev => ({
          ...prev,
          location: locationString
        }));

        Alert.alert(
          'Location Detected',
          `Your location has been set to: ${locationString}`,
          [{ text: 'OK' }]
        );
      } else {
        throw new Error('Could not determine location address');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Unable to detect your location. Please enter it manually.',
        [{ text: 'OK' }]
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const onSignUpPress = async () => {
    // Google Forms style: Validate all fields on submit
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
             // Test different field name combinations to find what backend expects
       const userData = {
         // Test 1: camelCase (most common in Node.js)
         firstName: form.firstName.trim(),
         lastName: form.lastName.trim(),
         email: form.email.trim().toLowerCase(),
         password: form.password,
         phoneNumber: form.phoneNumber.trim() || null,
         location: form.location.trim() || null,
         profileImage: profileImage,
       };

       // Test 2: snake_case (common in Python/PHP backends)
       const userDataSnake = {
         first_name: form.firstName.trim(),
         last_name: form.lastName.trim(),
         email: form.email.trim().toLowerCase(),
         password: form.password,
         phone_number: form.phoneNumber.trim() || null,
         location: form.location.trim() || null,
         profile_image: profileImage,
       };

               // Try camelCase first, if it fails, try snake_case
        let response;
        let lastError;
        
        try {
          console.log("Trying camelCase fields:", JSON.stringify(userData, null, 2));
          response = await register(userData);
          console.log("✅ camelCase registration SUCCESS!");
        } catch (error) {
          console.log("❌ camelCase failed:", error.response?.data?.message || error.message);
          lastError = error;
          
          // Only try snake_case if it's a 400 error (field validation issue)
          if (error.response?.status === 400 && error.response?.data?.message !== "User with this email already exists") {
            try {
              console.log("🔄 Trying snake_case fields...");
              console.log("Trying snake_case fields:", JSON.stringify(userDataSnake, null, 2));
              response = await register(userDataSnake);
              console.log("✅ snake_case registration SUCCESS!");
            } catch (snakeError) {
              console.log("❌ snake_case also failed:", snakeError.response?.data?.message || snakeError.message);
              lastError = snakeError;
            }
          }
        }

        // Log final result and response structure
        console.log("🔍 Response structure:", JSON.stringify(response, null, 2));
        if (response && response.user) {
          console.log("🎉 Registration successful with user:", response.user.email);
        } else if (response && response.success) {
          console.log("🎉 Registration successful with success flag");
        } else {
          console.log("💥 All registration attempts failed");
          console.log("Response type:", typeof response);
          console.log("Response keys:", response ? Object.keys(response) : "null");
        }

                     if (response && (response.user || response.success)) {
          // Registration successful
          const userData = response.user || {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim().toLowerCase(),
            phoneNumber: form.phoneNumber.trim() || null,
            location: form.location.trim() || null,
            profileImage: profileImage,
            signupDate: new Date().toISOString().split("T")[0],
          };
          
          console.log("🎉 Registration successful! Navigating to Profile with user data:", userData);
          console.log("📱 Navigation params will be:", {
            user: userData,
            updated: true,
            fromSignup: true,
          });
          
          Alert.alert(
            "Success!",
            "Account created successfully!",
            [
              {
                text: "Continue",
                onPress: () => {
                  // Navigate to Home screen with the user data
                  navigation.navigate("Home", {
                    user: userData,
                    updated: true,
                    fromSignup: true,
                  });
                },
              },
            ]
          );
        } else {
          Alert.alert("Error", "Registration failed. Please try again.");
        }
         } catch (error) {
       // Use the last error from our attempts, or the current error
       const finalError = lastError || error;
       
       console.error("Error during signup:", finalError);
       console.error("Error response:", finalError.response?.data);
       console.error("Error status:", finalError.response?.status);
       
       let errorMessage = "Failed to create account. Please try again.";
       
       if (finalError.response?.data?.message) {
         errorMessage = finalError.response.data.message;
       } else if (finalError.response?.data?.error) {
         errorMessage = finalError.response.data.error;
       } else if (finalError.message) {
         errorMessage = finalError.message;
       }
       
       // Show more detailed error info
       Alert.alert(
         "Registration Error", 
         `${errorMessage}\n\nStatus: ${finalError.response?.status || 'Unknown'}\n\nCheck console for details.`
       );
    } finally {
      setLoading(false);
    }
  };

  const dynamicStyles = getThemeColors();

  return (
    <KeyboardAvoidingWrapper
      style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.imagePlaceholder} />
      <Text style={[styles.title, { color: dynamicStyles.textColor }]}>Create Your Account</Text>

      {/* Profile Picture Upload Section */}
      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={pickImage}>
          {profileImage ? (
            <View style={styles.profileImageWrapper}>
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
              <View style={styles.checkmarkOverlay}>
                <Icon name="check-circle" size={20} color={dynamicStyles.successColor} />
              </View>
            </View>
          ) : (
            <View style={styles.placeholderImage}>
              <Icon name="camera" size={30} color={dynamicStyles.mutedText} />
            </View>
          )}
          <Text style={styles.changeText}>
            {profileImage ? 'Change Profile Photo' : 'Upload Profile Photo'}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.optionalText, { color: dynamicStyles.mutedText }]}>
          {profileImage ? 'Profile photo selected ✓' : 'Profile photo is optional'}
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>First Name *</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: dynamicStyles.inputBackground, 
              color: dynamicStyles.textColor,
              borderColor: getInputBorderColor('firstName'),
              borderWidth: 1
            }]}
            value={form.firstName}
            onChangeText={(value) => handleChange("firstName", value)}
            onBlur={() => handleBlur("firstName")}
            placeholder="Enter your first name"
            placeholderTextColor={dynamicStyles.mutedText}
          />
          {errors.firstName && (
            <Text style={[styles.errorText, { color: dynamicStyles.errorColor }]}>
              {errors.firstName}
            </Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>Last Name *</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: dynamicStyles.inputBackground, 
              color: dynamicStyles.textColor,
              borderColor: getInputBorderColor('lastName'),
              borderWidth: 1
            }]}
            value={form.lastName}
            onChangeText={(value) => handleChange("lastName", value)}
            onBlur={() => handleBlur("lastName")}
            placeholder="Enter your last name"
            placeholderTextColor={dynamicStyles.mutedText}
          />
          {errors.lastName && (
            <Text style={[styles.errorText, { color: dynamicStyles.errorColor }]}>
              {errors.lastName}
            </Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>Email *</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: dynamicStyles.inputBackground, 
              color: dynamicStyles.textColor,
              borderColor: getInputBorderColor('email'),
              borderWidth: 1
            }]}
            value={form.email}
            onChangeText={(value) => handleChange("email", value)}
            onBlur={() => handleBlur("email")}
            placeholder="Enter your email"
            placeholderTextColor={dynamicStyles.mutedText}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && (
            <Text style={[styles.errorText, { color: dynamicStyles.errorColor }]}>
              {errors.email}
            </Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>Password *</Text>
          <View style={[styles.passwordInputContainer, { 
            backgroundColor: dynamicStyles.inputBackground, 
            borderColor: getInputBorderColor('password'),
            borderWidth: 1
          }]}>
            <TextInput
              style={[styles.passwordInput, { 
                color: dynamicStyles.textColor
              }]}
              value={form.password}
              onChangeText={(value) => handleChange("password", value)}
              onBlur={() => handleBlur("password")}
              placeholder="Enter your password"
              placeholderTextColor={dynamicStyles.mutedText}
              secureTextEntry={!showPassword}
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
          </View>
          {errors.password && (
            <Text style={[styles.errorText, { color: dynamicStyles.errorColor }]}>
              {errors.password}
            </Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>Phone Number</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: dynamicStyles.inputBackground, 
              color: dynamicStyles.textColor,
              borderColor: dynamicStyles.borderColor 
            }]}
            value={form.phoneNumber}
            onChangeText={(value) => handleChange("phoneNumber", value)}
            placeholder="Enter your phone number"
            placeholderTextColor={dynamicStyles.mutedText}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>Location</Text>
          <View style={styles.locationInputContainer}>
            <TextInput
              style={[styles.locationInput, { 
                backgroundColor: dynamicStyles.inputBackground, 
                color: dynamicStyles.textColor,
                borderColor: dynamicStyles.borderColor 
              }]}
              value={form.location}
              onChangeText={(value) => handleChange("location", value)}
              placeholder="Enter your location or tap to detect"
              placeholderTextColor={dynamicStyles.mutedText}
              editable={!locationLoading}
            />
            <TouchableOpacity
              style={[styles.locationButton, { 
                backgroundColor: locationLoading ? dynamicStyles.mutedText : dynamicStyles.primaryColor 
              }]}
              onPress={getCurrentLocation}
              disabled={locationLoading}
            >
              {locationLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Icon name="map-pin" size={16} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={[styles.locationHint, { color: dynamicStyles.mutedText }]}>
            Tap the location icon to automatically detect your current location
          </Text>
        </View>

        <TouchableOpacity style={styles.signupButton} onPress={onSignUpPress} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signupButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={[styles.loginLinkText, { color: dynamicStyles.primaryColor }]}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backToIntroButton}
          onPress={() => navigation.navigate("GetStarted")}
        >
          <Text style={[styles.backToIntroText, { color: dynamicStyles.mutedText }]}>
            Back to Introduction
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  singleInputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#fafafa",
    color: "#000",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  phoneContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fafafa",
  },
  phoneTextContainer: {
    backgroundColor: "transparent",
    paddingVertical: 0,
  },
  phoneTextInput: {
    color: "#000",
    height: 45,
    fontSize: 14,
  },
  flagButton: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  passwordInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordToggleInside: {
    position: "absolute",
    right: 10,
    padding: 4,
  },
  passwordToggleText: {
    color: "#007AFF",
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  googleButton: {
    backgroundColor: "#DB4437",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginText: {
    marginTop: 20,
    color: "#007AFF",
    textAlign: "center",
    fontSize: 14,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  checkmarkOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: '#28a745',
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  changeText: {
    color: "#007AFF",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  optionalText: {
    marginTop: 5,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  formContainer: {
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  signupButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },
  loginLinkText: {
    fontSize: 14,
  },
  backToIntroButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  backToIntroText: {
    fontSize: 14,
    fontWeight: "500",
  },
  locationInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  locationInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#fafafa",
    color: "#000",
    marginRight: 8,
  },
  locationButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  locationHint: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fafafa",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    color: "#000",
  },
  passwordToggle: {
    padding: 4,
    marginLeft: 8,
  },
});

export default SignupScreen;
