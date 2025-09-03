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
    signupDate: '',
    profileImage: null,
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log("🔄 Loading user data...");
        console.log("Route params:", route.params);
        console.log("Auth user:", authUser);
        console.log("Is authenticated:", isAuthenticated);
        
        // Priority 1: Navigation params (for new registrations/updates)
        if (route.params?.user) {
          console.log("📱 Using user data from navigation params");
          setUser(route.params.user);
          await AsyncStorage.setItem('userData', JSON.stringify(route.params.user));
        } 
        // Priority 2: Authenticated user from AuthContext
        else if (authUser && isAuthenticated) {
          console.log("🔐 Using authenticated user data from AuthContext");
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
    navigation.navigate('EditProfile', { user: { ...user, profileImage: user.profileImage } });
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

      <ProfileDetails form={user} editable={false} profileImage={user.profileImage} />

      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>



      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home', { user: { ...user, profileImage: user.profileImage } })}>
        <Text style={styles.homeButtonText}>Go to Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
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
    color: '#333',
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
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },


  homeButton: {
    marginTop: 15,
    width: '100%',
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#28a745',
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 15,
    width: '100%',
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#dc3545',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
