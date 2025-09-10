import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../context/ThemeContext';

const ProfileDetails = ({
  form,
  errors = {},
  editable = false,
  onChange = () => {},
  phoneInputRef,
  onPickImage,
  profileImage,
}) => {
  const { getThemeColors } = useTheme();
  const dynamicStyles = getThemeColors();

  // Debug logging
  console.log("📋 ProfileDetails - form data:", form);
  console.log("📋 ProfileDetails - phoneNumber:", form?.phoneNumber);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {editable ? (
          <TouchableOpacity onPress={onPickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Icon name="camera" size={30} color={dynamicStyles.mutedText} />
              </View>
            )}
            <Text style={[styles.changeText, { color: dynamicStyles.primaryColor }]}>Change Photo</Text>
          </TouchableOpacity>
        ) : (
          profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImage}>
              <Icon name="user" size={48} color={dynamicStyles.mutedText} />
            </View>
          )
        )}
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>First Name *</Text>
          {editable ? (
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: dynamicStyles.inputBackground, 
                  color: dynamicStyles.textColor,
                  borderColor: errors.firstName ? dynamicStyles.errorColor : dynamicStyles.borderColor 
                }
              ]}
              value={form.firstName}
              onChangeText={(value) => onChange('firstName', value)}
              placeholder="Enter your first name"
              placeholderTextColor={dynamicStyles.mutedText}
            />
          ) : (
            <Text style={[styles.displayText, { color: dynamicStyles.textColor }]}>{form.firstName || 'Not provided'}</Text>
          )}
          {errors.firstName && <Text style={[styles.errorText, { color: dynamicStyles.errorColor }]}>{errors.firstName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>Last Name *</Text>
          {editable ? (
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: dynamicStyles.inputBackground, 
                  color: dynamicStyles.textColor,
                  borderColor: errors.lastName ? dynamicStyles.errorColor : dynamicStyles.borderColor 
                }
              ]}
              value={form.lastName}
              onChangeText={(value) => onChange('lastName', value)}
              placeholder="Enter your last name"
              placeholderTextColor={dynamicStyles.mutedText}
            />
          ) : (
            <Text style={[styles.displayText, { color: dynamicStyles.textColor }]}>{form.lastName || 'Not provided'}</Text>
          )}
          {errors.lastName && <Text style={[styles.errorText, { color: dynamicStyles.errorColor }]}>{errors.lastName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>Email *</Text>
          {editable ? (
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: dynamicStyles.inputBackground, 
                  color: dynamicStyles.textColor,
                  borderColor: errors.email ? dynamicStyles.errorColor : dynamicStyles.borderColor 
                }
              ]}
              value={form.email}
              onChangeText={(value) => onChange('email', value)}
              placeholder="Enter your email"
              placeholderTextColor={dynamicStyles.mutedText}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text style={[styles.displayText, { color: dynamicStyles.textColor }]}>{form.email || 'Not provided'}</Text>
          )}
          {errors.email && <Text style={[styles.errorText, { color: dynamicStyles.errorColor }]}>{errors.email}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>Phone Number</Text>
          {editable ? (
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: dynamicStyles.inputBackground, 
                  color: dynamicStyles.textColor,
                  borderColor: errors.phoneNumber ? dynamicStyles.errorColor : dynamicStyles.borderColor 
                }
              ]}
              value={form.phoneNumber}
              onChangeText={(value) => onChange('phoneNumber', value)}
              placeholder="Enter your phone number"
              placeholderTextColor={dynamicStyles.mutedText}
              keyboardType="phone-pad"
              ref={phoneInputRef}
            />
          ) : (
            <Text style={[styles.displayText, { color: dynamicStyles.textColor }]}>{form.phoneNumber || 'Not provided'}</Text>
          )}
          {errors.phoneNumber && <Text style={[styles.errorText, { color: dynamicStyles.errorColor }]}>{errors.phoneNumber}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>Location</Text>
          {editable ? (
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: dynamicStyles.inputBackground, 
                  color: dynamicStyles.textColor,
                  borderColor: errors.location ? dynamicStyles.errorColor : dynamicStyles.borderColor 
                }
              ]}
              value={form.location}
              onChangeText={(value) => onChange('location', value)}
              placeholder="Enter your location"
              placeholderTextColor={dynamicStyles.mutedText}
            />
          ) : (
            <Text style={[styles.displayText, { color: dynamicStyles.textColor }]}>{form.location || 'Not provided'}</Text>
          )}
          {errors.location && <Text style={[styles.errorText, { color: dynamicStyles.errorColor }]}>{errors.location}</Text>}
        </View>

        
      </View>
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
  formContainer: {
    // This style is no longer needed as the form is now in ScrollView
  },
  displayText: {
    fontSize: 16,
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 8,
  },
});

export default ProfileDetails;
