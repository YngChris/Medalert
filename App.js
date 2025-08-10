import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import { ReportformScreen } from "./src/screens/ReportformScreen";
import LocationsScreen from "./src/screens/LocationsScreen";
import { AlertsScreen } from "./src/screens/AlertsScreen";
import { EducationScreen } from "./src/screens/EducationScreen";
import { ForumScreen } from "./src/screens/ForumScreen";
import { MyReportsScreen } from "./src/screens/MyReportsScreen";
import { RecycleBinScreen } from "./src/screens/RecycleBinScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import ReplyScreen from "./src/screens/ReplyScreen";
import DiscussionScreen from "./src/screens/DiscussionsScreen";
import { ContentDetailScreen } from "./src/screens/ContentScreem";
import BarcodeScannerScreen from "./src/screens/BarcodeScannerScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
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
          name="Locations"
          component={LocationsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Alerts"
          component={AlertsScreen}
          options={{ headershown: false }}
        />
        <Stack.Screen
          name="Education"
          component={EducationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Forum"
          component={ForumScreen}
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
          options={{ title: "Profile", headerBackTitle: "Back" }}
        />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen
          name="Reply"
          component={ReplyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Discussion" component={DiscussionScreen} />
        <Stack.Screen
          name="ContentDetail"
          component={ContentDetailScreen}
          options={{ title: "Details" }}
        />
        <Stack.Screen
          name="BarcodeScannerScreen"
          component={BarcodeScannerScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
