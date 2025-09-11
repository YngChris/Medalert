import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import ProfileDetails from '../components/ProfileDetails';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { getThemeColors } = useTheme();
  const { user: authUser, isAuthenticated, refreshUserData } = useAuth();
  const { t } = useLanguage();
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
        console.log("Auth user:", authUser);
        console.log("Auth user phoneNumber:", authUser?.phoneNumber);
        console.log("Is authenticated:", isAuthenticated);
        
        // Priority 1: Authenticated user from AuthContext
        if (authUser && isAuthenticated) {
          console.log("🔐 Using authenticated user data from AuthContext");
          console.log("🔐 AuthContext user phoneNumber:", authUser.phoneNumber);
          setUser(authUser);
          await AsyncStorage.setItem('userData', JSON.stringify(authUser));
        } 
        // Priority 2: Fallback to AsyncStorage
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
        if (isAuthenticated && !authUser && Object.keys(authUser).length === 0) {
          console.log("🔄 No fresh user data, attempting to refresh from database...");
          setTimeout(async () => {
            const refreshedUser = await refreshUserData();
            if (refreshedUser) {
              setUser(refreshedUser);
              console.log("✅ User data refreshed from database on Profile load");
            }
          }, 1000); // Small delay to ensure auth is fully established
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [authUser, isAuthenticated, refreshUserData]);

  // Refresh user data when returning from EditProfileScreen or when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      console.log("📱 Profile screen focused");
      
      if (isAuthenticated && !authUser) {
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
  }, [navigation, isAuthenticated, refreshUserData]);

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

  const dynamicStyles = getThemeColors();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>{t('profile.title')}</Text>
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
          {(!user || !user.email) ? t('loading') : t('profile.editProfile')}
        </Text>
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
    marginBottom:20,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    paddingBottom: 20,

  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    
  },
});
