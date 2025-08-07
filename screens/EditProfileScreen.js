import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Feather';
import ProfileDetails from '../components/ProfileDetails';

const EditProfileScreen = ({ navigation, route }) => {
  const phoneInput = useRef(null);
  const existingUser = route.params?.user;

  const [form, setForm] = useState({
    firstName: existingUser?.firstName || '',
    lastName: existingUser?.lastName || '',
    email: existingUser?.email || '',
    phoneNumber: existingUser?.phoneNumber || '',
    location: existingUser?.location || '',
  });

  const [profileImage, setProfileImage] = useState(existingUser?.profileImage || null);
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email address';
    if (!form.location.trim()) newErrors.location = 'Location is required';

    let isPhoneValid = false;
    if (phoneInput.current) {
      const numberInfo = phoneInput.current.getNumberAfterPossiblyEliminatingZero();
      isPhoneValid = phoneInput.current.isValidNumber(numberInfo?.formattedNumber);
    }
    if (!isPhoneValid) newErrors.phoneNumber = 'Invalid phone number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Camera roll permission is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const onSavePress = () => {
    if (!validate()) return;

    Toast.show({
      type: 'success',
      text1: 'Profile updated!',
    });

    navigation.navigate('Profile', { user: { ...form, profileImage } });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Your Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ProfileDetails
        form={form}
        errors={errors}
        editable={true}
        onChange={handleChange}
        phoneInputRef={phoneInput}
        profileImage={profileImage}
        onPickImage={pickImage}
      />

      <TouchableOpacity style={styles.saveButton} onPress={onSavePress}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop:30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
