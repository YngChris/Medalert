import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();
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
              <View style={[styles.placeholderImage, { backgroundColor: dynamicStyles.inputBackground, borderColor: dynamicStyles.borderColor }]}>
                <Icon name="camera" size={30} color={dynamicStyles.mutedText} />
              </View>
            )}
            <Text style={[styles.changeText, { color: dynamicStyles.primaryColor }]}>{t('editProfile.changePhoto')}</Text>
          </TouchableOpacity>
        ) : (
          profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, { backgroundColor: dynamicStyles.inputBackground, borderColor: dynamicStyles.borderColor }]}>
              <Icon name="user" size={48} color={dynamicStyles.mutedText} />
            </View>
          )
        )}
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>{t('editProfile.firstName')} *</Text>
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
              placeholder={t('editProfile.firstName')}
              placeholderTextColor={dynamicStyles.mutedText}
            />
          ) : (
            <Text style={[styles.displayText, { color: dynamicStyles.textColor, backgroundColor: dynamicStyles.inputBackground }]}>{form.firstName || t('profile.name')}</Text>
          )}
          {errors.firstName && <Text style={[styles.errorText, { color: dynamicStyles.errorColor }]}>{errors.firstName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>{t('editProfile.lastName')} *</Text>
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
              placeholder={t('editProfile.lastName')}
              placeholderTextColor={dynamicStyles.mutedText}
            />
          ) : (
            <Text style={[styles.displayText, { color: dynamicStyles.textColor, backgroundColor: dynamicStyles.inputBackground }]}>{form.lastName || t('profile.name')}</Text>
          )}
          {errors.lastName && <Text style={[styles.errorText, { color: dynamicStyles.errorColor }]}>{errors.lastName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>{t('editProfile.email')} *</Text>
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
              placeholder={t('editProfile.email')}
              placeholderTextColor={dynamicStyles.mutedText}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text style={[styles.displayText, { color: dynamicStyles.textColor, backgroundColor: dynamicStyles.inputBackground }]}>{form.email || t('profile.email')}</Text>
          )}
          {errors.email && <Text style={[styles.errorText, { color: dynamicStyles.errorColor }]}>{errors.email}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>{t('editProfile.phone')}</Text>
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
              placeholder={t('editProfile.phone')}
              placeholderTextColor={dynamicStyles.mutedText}
              keyboardType="phone-pad"
              ref={phoneInputRef}
            />
          ) : (
            <Text style={[styles.displayText, { color: dynamicStyles.textColor, backgroundColor: dynamicStyles.inputBackground }]}>{form.phoneNumber || t('profile.phone')}</Text>
          )}
          {errors.phoneNumber && <Text style={[styles.errorText, { color: dynamicStyles.errorColor }]}>{errors.phoneNumber}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>{t('editProfile.address')}</Text>
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
              placeholder={t('editProfile.address')}
              placeholderTextColor={dynamicStyles.mutedText}
            />
          ) : (
            <Text style={[styles.displayText, { color: dynamicStyles.textColor, backgroundColor: dynamicStyles.inputBackground }]}>{form.location || t('profile.address')}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  changeText: {
    marginTop: 8,
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
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  inputError: {
  },
  readOnlyText: {
    fontSize: 16,
    padding: 10,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  phoneContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  phoneTextContainer: {
    backgroundColor: 'transparent',
  },
  phoneTextInput: {
    fontSize: 14,
  },
  flagButton: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  formContainer: {
    // This style is no longer needed as the form is now in ScrollView
  },
  displayText: {
    fontSize: 16,
    padding: 10,
    borderRadius: 8,
  },
});

export default ProfileDetails;
