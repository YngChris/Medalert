import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import ProfileDetails from '../components/ProfileDetails';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

const EditProfileScreen = ({ navigation, route }) => {
  const { getThemeColors } = useTheme();
  const { updateProfile } = useAuth();
  const { t } = useLanguage();
  const existingUser = route.params?.user;
  const [loading, setLoading] = useState(false);

  console.log("🔄 EditProfileScreen - Screen loaded");
  console.log("📱 EditProfileScreen - Route params:", route.params);
  console.log("👤 EditProfileScreen - Existing user:", existingUser);
  const [form, setForm] = useState({
    firstName: existingUser?.firstName || '',
    lastName: existingUser?.lastName || '',
    email: existingUser?.email || '',
    phoneNumber: existingUser?.phoneNumber || '',
    location: existingUser?.location || '',
  });
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(existingUser?.profileImage || null);
  const phoneInput = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('editProfile.title'),
      headerStyle: {
        backgroundColor: getThemeColors().backgroundColor,
      },
      headerTintColor: getThemeColors().textColor,
    });
  }, [navigation, getThemeColors, t]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSavePress = async () => {
    if (validateForm()) {
      setLoading(true);
      
      try {
        // Prepare profile data for update
        const profileData = {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          phoneNumber: form.phoneNumber.trim() || null,
          location: form.location.trim() || null,
          profileImage: profileImage,
        };

        // Call the updateProfile API through AuthContext
        const response = await updateProfile(profileData);

        if (response && response.user) {
          // Profile update successful
          Alert.alert(
            t('success'),
            t('editProfile.profileSaved'),
            [
              {
                text: t('ok'),
                onPress: () => {
                  // Navigate to Home screen with updated user data
                  navigation.navigate('Home', {
                    user: response.user,
                    updated: true
                  });
                },
              },
            ]
          );
        } else {
          Alert.alert(t('error'), t('editProfile.saveError'));
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        
        let errorMessage = t('editProfile.saveError');
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        Alert.alert(t('error'), errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const dynamicStyles = getThemeColors();

  return (
    <KeyboardAvoidingWrapper
      style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
    >
      <ProfileDetails
        form={form}
        errors={errors}
        editable={true}
        onChange={handleChange}
        phoneInputRef={phoneInput}
        profileImage={profileImage}
        onPickImage={pickImage}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: dynamicStyles.primaryColor }]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={dynamicStyles.buttonText} />
          ) : (
            <Text style={[styles.saveButtonText, { color: dynamicStyles.buttonText }]}>{t('editProfile.saveChanges')}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.cancelButton, { borderColor: dynamicStyles.borderColor }]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.cancelButtonText, { color: dynamicStyles.textColor }]}>{t('editProfile.cancel')}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingWrapper>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 30,
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
    paddingHorizontal:20,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16, 
    fontWeight: '600',
  },
});
