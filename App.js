import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { ReportformScreen } from "./screens/ReportformScreen";
import LocationsScreen from "./screens/LocationsScreen";
import { AlertsScreen } from "./screens/AlertsScreen";
import { EducationScreen } from "./screens/EducationScreen";
import { ForumScreen } from "./screens/ForumScreen";
import { MyReportsScreen } from "./screens/MyReportsScreen";
import { RecycleBinScreen } from "./screens/RecycleBinScreen";
import ProfileScreen from "./screens/ProfileScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import ReplyScreen from "./screens/ReplyScreen";
import DiscussionScreen from "./screens/DiscussionsScreen";
import { ContentDetailScreen } from "./screens/ContentScreen";
import BarcodeScannerScreen from "./screens/BarcodeScannerScreen";
 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen}options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Report" component={MyReportsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ReportForm" component={ReportformScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Locations" component={LocationsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Alerts" component={AlertsScreen} options={{ headershown: false }}/>
        <Stack.Screen name="Education" component={EducationScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Forum" component={ForumScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="RecycleBin" component={RecycleBinScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Reply" component={ReplyScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Discussion" component={DiscussionScreen} />
        <Stack.Screen name="ContentDetail" component={ContentDetailScreen} options={{ title: "Details" }}/>
        <Stack.Screen name="BarcodeScannerScreen" component={BarcodeScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}