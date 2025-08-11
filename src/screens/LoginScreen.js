import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Image,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import Toast from "react-native-toast-message";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // New state for validation errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const HEADER_IMAGE_URI = useMemo(
    () => ({
      uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkwxoamnqNPTkg3MmOncnFrtNFULzurA1NL7xGJ8UfraqnGv9nWZfWrI3snTZC2hYEP0ivU4n1EmKiJ4NvFwdePPKRomw-_awubyb1j2kxf8B8AA6IFcm_3icQRbReoW8pLpjrFOBAa6TviWhXs51zgf15ZYjCTn6fmo5hhY5ZVeWhadlnPkm7Idj8dw-V1y01cDwRv8iql19Hlkj5jnjvi7gHKVm-7pTrAVZ3lb3WFXSccuvSzvE3AUvZPCH2TEH798lfVoZ9JkM",
    }),
    []
  );

  const GOOGLE_LOGO_URI = useMemo(
    () => ({
      uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png",
    }),
    []
  );

  // Event Handlers
  const onLoginPress = useCallback(async () => {
    // Reset errors
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email or username is required");
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
    }

    if (!password) {
      setPasswordError("Password is required");
    }

    try {
      // Call the login API through context
      const response = await login({
        email,
        password,
      });

      console.log("Login response", response);

      Toast.show({
        type: "success",
        text1: "Login successful!",
        text2: `Welcome back, ${response.user?.firstName || "User"}!`,
      });

      // Navigate to Home
      navigation.navigate("Home");
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Login failed. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: errorMessage,
      });
    }
  }, [email, password, rememberMe, navigation]);

  const onGoogleSignInPress = () => {
    console.log("Google Sign-In pressed");
  };

  const onForgotPasswordPress = () => {
    navigation.navigate("ForgotPassword");
  };

  const onSignUpPress = () => {
    navigation.navigate("Signup");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <ImageBackground
            source={HEADER_IMAGE_URI}
            style={styles.headerImageBackground}
            imageStyle={styles.headerImageStyle}
          />
          <Text style={styles.welcomeText}>Welcome back</Text>

          <View style={styles.formContainer}>
            {/* Email/Username */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                placeholder="Enter your email"
                placeholderTextColor="#677583"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="username"
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={[styles.input, passwordError ? styles.inputError : null]}
                placeholder="Enter your password"
                placeholderTextColor="#677583"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                textContentType="password"
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Text style={styles.toggleText}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            {/* Remember Me Switch */}
            <View style={styles.rememberMeContainer}>
              <Text style={styles.rememberMeText}>Remember Me</Text>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                thumbColor={rememberMe ? "#d2e2f3" : "#f4f3f4"}
                trackColor={{ false: "#dde0e4", true: "#d2e2f3" }}
              />
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={onForgotPasswordPress}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            {/* Google Sign-in */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={onGoogleSignInPress}
            >
              <Image
                source={GOOGLE_LOGO_URI}
                style={styles.googleLogo}
                resizeMode="contain"
              />
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            {/* Sign Up */}
            <TouchableOpacity
              onPress={onSignUpPress}
              style={styles.signUpContainer}
            >
              <Text style={styles.signUpText}>
                Don't have an account? Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerImageBackground: {
    width: "100%",
    height: 218,
    justifyContent: "flex-end",
  },
  headerImageStyle: {
    borderRadius: 12,
  },
  welcomeText: {
    color: "#121417",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 16,
  },
  formContainer: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: "#121417",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f1f2f4",
    borderRadius: 20,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#121417",
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  rememberMeText: {
    color: "#121417",
    fontSize: 16,
  },
  forgotPasswordContainer: {
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#677583",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: "#d2e2f3",
    borderRadius: 20,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#121417",
    fontSize: 18,
    fontWeight: "700",
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    gap: 8,
  },
  googleLogo: {
    width: 24,
    height: 24,
  },
  googleButtonText: {
    color: "#121417",
    fontSize: 18,
    fontWeight: "700",
  },
  signUpContainer: {
    alignItems: "center",
  },
  signUpText: {
    color: "#677583",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  passwordToggle: {
    position: "absolute",
    right: 16,
    top: 38,
    padding: 4,
  },
  toggleText: {
    color: "#677583",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default LoginScreen;
