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

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    location: '',
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to load user data', err);
      }
    };

    loadUserData();
  }, []);

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { user });
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        onPress: () => navigation.replace('Login'),
        style: 'destructive',
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ProfileDetails form={user} editable={false} />

      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
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
    marginBottom: 20,
    marginBottom: 50,
    paddingTop:30,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingLeft: 75,
    alignItems: 'center'
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
});
