import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      <View style={styles.avatar}>
        <Icon name="user" size={48} color="#555" />
      </View>
      <Text style={styles.name}>{`${user.firstName} ${user.lastName}`}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Phone Number</Text>
        <Text style={styles.value}>{user.phoneNumber}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Location</Text>
        <Text style={styles.value}>{user.location}</Text>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

// Your original styles stay the same


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    backgroundColor: '#e6e6e6',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  infoBox: {
    width: '100%',
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f7f7f7',
  },
  label: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: '#333',
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
