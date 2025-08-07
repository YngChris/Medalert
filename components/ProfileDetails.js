import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import Icon from 'react-native-vector-icons/Feather';

const ProfileDetails = ({
  form,
  errors = {},
  editable = false,
  onChange = () => {},
  phoneInputRef,
  onPickImage,
  profileImage,
}) => {
  const renderInput = (label, value, key, placeholder, keyboardType = 'default') => (
    <View style={styles.inputGroup} key={key}>
      <Text style={styles.label}>{label}</Text>
      {editable ? (
        <TextInput
          style={[styles.input, errors[key] && styles.inputError]}
          value={value}
          onChangeText={(text) => onChange(key, text)}
          placeholder={placeholder}
          keyboardType={keyboardType}
        />
      ) : (
        <Text style={styles.readOnlyText}>{value}</Text>
      )}
      {editable && errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        {editable ? (
          <TouchableOpacity onPress={onPickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Icon name="camera" size={30} color="#666" />
              </View>
            )}
            <Text style={styles.changeText}>Change Photo</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.profileImage}>
            <Icon name="user" size={48} color="#555" />
          </View>
        )}
      </View>

      <View style={styles.row}>
        {renderInput('First Name', form.firstName, 'firstName', 'Enter first name')}
        {renderInput('Last Name', form.lastName, 'lastName', 'Enter last name')}
      </View>

      {renderInput('Email', form.email, 'email', 'Enter email', 'email-address')}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        {editable ? (
          <PhoneInput
            ref={phoneInputRef}
            defaultValue={form.phoneNumber}
            defaultCode="GH"
            layout="first"
            onChangeFormattedText={(text) => onChange('phoneNumber', text)}
            containerStyle={styles.phoneContainer}
            textContainerStyle={styles.phoneTextContainer}
            textInputStyle={styles.phoneTextInput}
            flagButtonStyle={styles.flagButton}
          />
        ) : (
          <Text style={styles.readOnlyText}>{form.phoneNumber}</Text>
        )}
        {editable && errors.phoneNumber && (
          <Text style={styles.errorText}>{errors.phoneNumber}</Text>
        )}
      </View>

      {renderInput('Location', form.location, 'location', 'Enter location')}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  changeText: {
    marginTop: 8,
    color: '#007AFF',
    fontSize: 14,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 15,
  },
  inputGroup: {
    flex: 1,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
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
  readOnlyText: {
    fontSize: 16,
    color: '#555',
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 8,
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
  },
  phoneTextInput: {
    color: '#000',
    fontSize: 14,
  },
  flagButton: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
});

export default ProfileDetails;
