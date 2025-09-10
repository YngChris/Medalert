import React, { useEffect, useState, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "./src/context/AuthContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import Toast from "react-native-toast-message";
import KeyboardAvoidingWrapper from "./src/components/KeyboardAvoidingWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import { ReportformScreen } from "./src/screens/ReportformScreen";
import { ReportedScreen } from "./src/screens/ReportedScreen";
import { GetStartedScreen } from "./src/screens/GetStartedScreen";
import LocationsScreen from "./src/screens/LocationsScreen";
import { MyReportsScreen } from "./src/screens/MyReportsScreen";
import { RecycleBinScreen } from "./src/screens/RecycleBinScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import BarcodeScannerScreen from "./src/screens/BarcodeScannerScreen";
import SimpleBarcodeScannerScreen from "./src/screens/SimpleBarcodeScannerScreen";
import ManualBarcodeScannerScreen from "./src/screens/ManualBarcodeScannerScreen";
import { ReportDetailScreen } from "./src/screens/ReportDetailScreen";
import { EditMyReportsScreen } from "./src/screens/EditMyReportsScreen";
import AddLocationScreen from "./src/screens/AddLocationScreen";

const Stack = createNativeStackNavigator();
const NAV_STATE_KEY = "navState_v1";

export default function App() {
  const [initialNavState, setInitialNavState] = useState();
  const [navReady, setNavReady] = useState(false);

  // Load persisted navigation state early
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(NAV_STATE_KEY);
        if (saved) {
          setInitialNavState(JSON.parse(saved));
        }
      } catch (e) {
        // ignore parse/storage errors
      } finally {
        setNavReady(true);
      }
    })();
  }, []);

  const handleStateChange = useCallback(async (state) => {
    try {
      await AsyncStorage.setItem(NAV_STATE_KEY, JSON.stringify(state));
    } catch (_) {}
  }, []);

  if (!navReady) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <KeyboardAvoidingWrapper
          behavior="padding"
          keyboardVerticalOffset={0}
          enableOnAndroid={true}
        >
          <NavigationContainer initialState={initialNavState} onStateChange={handleStateChange}>
            <Stack.Navigator initialRouteName="GetStarted">
                <Stack.Screen
                  name="GetStarted"
                  component={GetStartedScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Signup"
                  component={SignupScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ForgotPassword"
                  component={ForgotPasswordScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Settings"
                  component={SettingsScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Report"
                  component={MyReportsScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ReportForm"
                  component={ReportformScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Reported"
                  component={ReportedScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Locations"
                  component={LocationsScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="RecycleBin"
                  component={RecycleBinScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Profile"
                  component={ProfileScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                <Stack.Screen
                  name="BarcodeScannerScreen"
                  component={BarcodeScannerScreen}
                />
                <Stack.Screen
                  name="SimpleBarcodeScannerScreen"
                  component={SimpleBarcodeScannerScreen}
                />
                <Stack.Screen
                  name="ManualBarcodeScannerScreen"
                  component={ManualBarcodeScannerScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ReportDetail"
                  component={ReportDetailScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="EditMyReports"
                  component={EditMyReportsScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AddLocation"
                  component={AddLocationScreen}
                  options={{ headerShown: false }}
                />
            </Stack.Navigator>
            <Toast />
          </NavigationContainer>
        </KeyboardAvoidingWrapper>
      </AuthProvider>
    </ThemeProvider>
  );
}
