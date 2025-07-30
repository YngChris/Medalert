import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import Toast from 'react-native-toast-message';

const FormInput = ({ label, value, onChangeText, placeholder, error, ...props }) => (
  <View style={styles.singleInputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, error && styles.inputError]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#6a7581"
      {...props}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

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

  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email address';

    const isPhoneValid = phoneInput.current?.isValidNumber(
      phoneInput.current?.getNumberAfterPossiblyEliminatingZero()?.formattedNumber
    );
    if (!isPhoneValid) newErrors.phoneNumber = 'Invalid phone number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSavePress = () => {
    if (!validate()) return;

    Toast.show({
      type: 'success',
      text1: 'Profile updated!',
    });

    navigation.navigate('Profile', { user: form });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Edit Your Profile</Text>

      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <FormInput
            label="First Name"
            value={form.firstName}
            onChangeText={(text) => handleChange('firstName', text)}
            placeholder="Enter first name"
            error={errors.firstName}
          />
        </View>
        <View style={styles.inputContainer}>
          <FormInput
            label="Last Name"
            value={form.lastName}
            onChangeText={(text) => handleChange('lastName', text)}
            placeholder="Enter last name"
            error={errors.lastName}
          />
        </View>
      </View>

      <FormInput
        label="Email"
        value={form.email}
        onChangeText={(text) => handleChange('email', text)}
        placeholder="Enter email"
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.singleInputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <PhoneInput
          ref={phoneInput}
          defaultValue={form.phoneNumber}
          defaultCode="GH"
          layout="first"
          onChangeFormattedText={(text) => handleChange('phoneNumber', text)}
          withShadow
          containerStyle={styles.phoneContainer}
          textContainerStyle={styles.phoneTextContainer}
          textInputStyle={styles.phoneTextInput}
          flagButtonStyle={styles.flagButton}
        />
        {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
      </View>

      <FormInput
        label="Location"
        value={form.location}
        onChangeText={(text) => handleChange('location', text)}
        placeholder="Enter location"
        error={errors.location}
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  singleInputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#fafafa',
    color: '#000',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  phoneContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fafafa',
  },
  phoneTextContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
  },
  phoneTextInput: {
    color: '#000',
    height: 45,
    fontSize: 14,
  },
  flagButton: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
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
