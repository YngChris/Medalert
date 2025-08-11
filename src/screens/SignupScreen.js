import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import PhoneInput from "react-native-phone-number-input";
import Toast from "react-native-toast-message";
import { useAuth } from "../context/AuthContext";

WebBrowser.maybeCompleteAuthSession();

const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  ...props
}) => (
  <View style={styles.singleInputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, error && styles.inputError]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#6a7581"
      {...props}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const SignupScreen = ({ navigation }) => {
  const phoneInput = useRef(null);
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    location: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "<YOUR_EXPO_CLIENT_ID>",
    iosClientId: "<YOUR_IOS_CLIENT_ID>",
    androidClientId: "<YOUR_ANDROID_CLIENT_ID>",
    webClientId: "<YOUR_WEB_CLIENT_ID>",
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        fetchUserInfo(authentication.accessToken);
      } else {
        Alert.alert("Google Sign-In Error", "No access token received");
      }
    }
  }, [response]);

  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      Toast.show({
        type: "success",
        text1: `Signed in as ${data.email}`,
      });
    } catch (err) {
      Alert.alert("Error", "Failed to fetch user info");
    }
  };

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onSignUpPress = async () => {
    setLoading(true);
    try {
      // Call the register API through context
      const response = await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
        location: form.location,
      });

      console.log("Signup response", response);

      Toast.show({
        type: "success",
        text1: "Signup successful!",
        text2: `Welcome, ${form.firstName}!`,
      });

      // Navigate to Home
      navigation.navigate("Home");
    } catch (error) {
      console.error("Signup error:", error);

      let errorMessage = "Signup failed. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Toast.show({
        type: "error",
        text1: "Signup Failed",
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.imagePlaceholder} />
      <Text style={styles.title}>Create Your Account</Text>

      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <FormInput
            label="First Name"
            value={form.firstName}
            onChangeText={(text) => handleChange("firstName", text)}
            placeholder="Enter first name"
            error={errors.firstName}
          />
        </View>
        <View style={styles.inputContainer}>
          <FormInput
            label="Last Name"
            value={form.lastName}
            onChangeText={(text) => handleChange("lastName", text)}
            placeholder="Enter last name"
            error={errors.lastName}
          />
        </View>
      </View>

      <FormInput
        label="Email"
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
        placeholder="Enter email"
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.singleInputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <PhoneInput
          ref={phoneInput}
          defaultValue={form.phoneNumber}
          defaultCode="GH"
          layout="first"
          onChangeFormattedText={(text) => handleChange("phoneNumber", text)}
          withShadow
          containerStyle={styles.phoneContainer}
          textContainerStyle={styles.phoneTextContainer}
          textInputStyle={styles.phoneTextInput}
          flagButtonStyle={styles.flagButton}
        />
        {errors.phoneNumber && (
          <Text style={styles.errorText}>{errors.phoneNumber}</Text>
        )}
      </View>

      <View style={styles.singleInputContainer}>
        <Text style={styles.label}>Password</Text>
        <View
          style={[
            styles.input,
            styles.passwordInputWrapper,
            errors.password && styles.inputError,
          ]}
        >
          <TextInput
            style={{ flex: 1, paddingRight: 50 }}
            placeholder="Enter password"
            value={form.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry={!passwordVisible}
            placeholderTextColor="#6a7581"
          />
          <TouchableOpacity
            style={styles.passwordToggleInside}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Text style={styles.passwordToggleText}>
              {passwordVisible ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>

      <FormInput
        label="Location"
        value={form.location}
        onChangeText={(text) => handleChange("location", text)}
        placeholder="Enter location"
        error={errors.location}
      />

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={onSignUpPress}
        disabled={loading}
      >
        <Text style={styles.signUpButtonText}>
          {loading ? "Signing Up..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Text style={styles.googleButtonText}>Sign up with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
    flexGrow: 1,
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
});
