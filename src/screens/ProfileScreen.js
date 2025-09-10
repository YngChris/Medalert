import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import ProfileDetails from '../components/ProfileDetails';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = ({ navigation, route }) => {
  const { getThemeColors } = useTheme();
  const { logout, user: authUser, isAuthenticated, refreshUserData } = useAuth();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    location: '',
    profileImage: null,
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log("🔄 Loading user data...");
        console.log("Route params:", route.params);
        console.log("Auth user:", authUser);
        console.log("Auth user phoneNumber:", authUser?.phoneNumber);
        console.log("Is authenticated:", isAuthenticated);
        
        // Priority 1: Navigation params (for new registrations/updates)
        if (route.params?.user) {
          console.log("📱 Using user data from navigation params");
          console.log("📱 Navigation user phoneNumber:", route.params.user.phoneNumber);
          setUser(route.params.user);
          await AsyncStorage.setItem('userData', JSON.stringify(route.params.user));
        } 
        // Priority 2: Authenticated user from AuthContext
        else if (authUser && isAuthenticated) {
          console.log("🔐 Using authenticated user data from AuthContext");
          console.log("🔐 AuthContext user phoneNumber:", authUser.phoneNumber);
          setUser(authUser);
          await AsyncStorage.setItem('userData', JSON.stringify(authUser));
        } 
        // Priority 3: Fallback to AsyncStorage
        else {
          console.log("💾 Loading user data from AsyncStorage");
          const savedUserData = await AsyncStorage.getItem('userData');
          if (savedUserData) {
            const parsedUser = JSON.parse(savedUserData);
            console.log("📖 Parsed user data from storage:", parsedUser);
            console.log("📖 Parsed user phoneNumber:", parsedUser.phoneNumber);
            setUser(parsedUser);
          } else {
            console.log("❌ No user data found in storage");
          }
        }
        
        // If user is authenticated but no fresh data, try to refresh from database
        if (isAuthenticated && !route.params?.user && (!authUser || Object.keys(authUser).length === 0)) {
          console.log("🔄 No fresh user data, attempting to refresh from database...");
          setTimeout(async () => {
            const refreshedUser = await refreshUserData();
            if (refreshedUser) {
              setUser(refreshedUser);
              console.log("✅ User data refreshed from database on Profile load");
            }
          }, 1000); // Small delay to ensure auth is fully established
        }
        
        // If coming from login, always refresh from database to ensure latest data
        if (route.params?.fromLogin && isAuthenticated) {
          console.log("🔄 Coming from login, refreshing user data from database...");
          setTimeout(async () => {
            const refreshedUser = await refreshUserData();
            if (refreshedUser) {
              setUser(refreshedUser);
              console.log("✅ User data refreshed from database after login");
            }
          }, 500); // Shorter delay for login flow
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [route.params, authUser, isAuthenticated, refreshUserData]);

  // Refresh user data when returning from EditProfileScreen or when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      console.log("📱 Profile screen focused");
      
      if (route.params?.updated) {
        console.log("🔄 Profile updated, reloading data");
        loadUserData();
      } else if (isAuthenticated && !route.params?.fromLogin) {
        // If coming from login (not fresh registration), refresh from database
        console.log("🔄 Coming from login, refreshing user data from database");
        const refreshedUser = await refreshUserData();
        if (refreshedUser) {
          setUser(refreshedUser);
          console.log("✅ User data refreshed from database on focus");
        }
      }
    });

    return unsubscribe;
  }, [navigation, route.params, isAuthenticated, refreshUserData]);

  const loadUserData = async () => {
    try {
      // Prioritize authenticated user data from AuthContext
      if (authUser && isAuthenticated) {
        setUser(authUser);
        await AsyncStorage.setItem('userData', JSON.stringify(authUser));
      } else {
        // Fall back to AsyncStorage
        const savedUserData = await AsyncStorage.getItem('userData');
        if (savedUserData) {
          setUser(JSON.parse(savedUserData));
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleEditProfile = () => {
    console.log("🔄 Attempting to navigate to EditProfile");
    console.log("📱 Current user data:", user);
    console.log("📱 User data being passed:", { ...user, profileImage: user.profileImage });
    
    // Check if user data is available
    if (!user || !user.email) {
      Alert.alert(
        'Profile Not Loaded',
        'Please wait for your profile to load completely before editing.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    try {
      navigation.navigate('EditProfile', { user: { ...user, profileImage: user.profileImage } });
      console.log("✅ Navigation to EditProfile initiated");
    } catch (error) {
      console.error("❌ Navigation error:", error);
      Alert.alert(
        'Navigation Error',
        'Unable to open edit profile screen. Please try again.',
        [
          { text: 'Cancel' },
          { 
            text: 'Retry', 
            onPress: () => {
              setTimeout(() => {
                navigation.navigate('EditProfile', { user: { ...user, profileImage: user.profileImage } });
              }, 500);
            }
          }
        ]
      );
    }
  };





  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Call the logout function from AuthContext
              await logout();
              
              // Clear all authentication-related data from AsyncStorage
              await AsyncStorage.multiRemove([
                'userData',
                'authToken', 
                'refreshToken',
                'user'
              ]);
              
              // Navigate to Login screen and reset navigation stack
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
              // Even if there's an error, clear all local data and navigate to login
              try {
                await AsyncStorage.multiRemove([
                  'userData',
                  'authToken', 
                  'refreshToken',
                  'user'
                ]);
              } catch (clearError) {
                console.error('Error clearing storage:', clearError);
              }
              
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          },
        },
      ]
    );
  };

  const dynamicStyles = getThemeColors();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>My Profile</Text>
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="settings" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>
      </View>

      <ProfileDetails form={user} editable={false} profileImage={user.profileImage || user.avatar} />

      <TouchableOpacity 
        style={[styles.editButton, { backgroundColor: dynamicStyles.primaryColor }]} 
        onPress={handleEditProfile}
        disabled={!user || !user.email}
      >
        <Text style={[styles.editButtonText, { color: dynamicStyles.buttonText }]}>
          {(!user || !user.email) ? 'Loading...' : 'Edit Profile'}
        </Text>
      </TouchableOpacity>



      <TouchableOpacity style={[styles.homeButton, { backgroundColor: dynamicStyles.successColor }]} onPress={() => navigation.navigate('Home', { user: { ...user, profileImage: user.profileImage } })}>
        <Text style={[styles.homeButtonText, { color: dynamicStyles.buttonText }]}>Go to Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: dynamicStyles.errorColor }]} onPress={handleLogout}>
        <Text style={[styles.logoutButtonText, { color: dynamicStyles.buttonText }]}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginBottom: 50,
    paddingTop:30,
    paddingRight: 40,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  settingsIcon: {
    position: 'absolute',
    top: 25,
    right: 16,
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  editButton: {
    marginTop: 20,
    width: '100%',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },


  homeButton: {
    marginTop: 15,
    width: '100%',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 15,
    width: '100%',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
