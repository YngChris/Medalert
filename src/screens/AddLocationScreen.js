import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { locationsStorage } from '../utils/locationsStorage';
import Toast from 'react-native-toast-message';

const AddLocationScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: 'Pharmacy',
    address: '',
    phone: '',
    lat: '',
    lng: '',
    status: 'Clear',
  });
  const [errors, setErrors] = useState({});

  // Theme-aware styles
  const dynamicStyles = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    textColor: theme === 'dark' ? '#ffffff' : '#111418',
    mutedText: theme === 'dark' ? '#a0a0a0' : '#637588',
    borderColor: theme === 'dark' ? '#404040' : '#e2e8f0',
    cardBackground: theme === 'dark' ? '#2d2d2d' : '#f9fafb',
    inputBackground: theme === 'dark' ? '#2d2d2d' : '#ffffff',
    primaryColor: '#197ce5',
    successColor: '#28a745',
    errorColor: '#dc3545',
  };

  const locationTypes = ['Pharmacy', 'Clinic', 'Hospital', 'Wellness Center', 'Drug Store', 'Medical Center'];
  const statusOptions = ['Clear', 'Under Review', 'Warning', 'Flagged'];

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Location name is required';
    }

    if (!form.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (form.phone && !/^\+?[\d\s\-\(\)]+$/.test(form.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (form.lat && (isNaN(parseFloat(form.lat)) || parseFloat(form.lat) < -90 || parseFloat(form.lat) > 90)) {
      newErrors.lat = 'Latitude must be between -90 and 90';
    }

    if (form.lng && (isNaN(parseFloat(form.lng)) || parseFloat(form.lng) < -180 || parseFloat(form.lng) > 180)) {
      newErrors.lng = 'Longitude must be between -180 and 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const locationData = {
        name: form.name.trim(),
        type: form.type,
        address: form.address.trim(),
        phone: form.phone.trim() || null,
        lat: form.lat ? parseFloat(form.lat) : 5.6037, // Default to Accra coordinates
        lng: form.lng ? parseFloat(form.lng) : -0.187,
        status: form.status,
      };

      await locationsStorage.addLocation(locationData);

      Toast.show({
        type: 'success',
        text1: 'Location Added',
        text2: `${locationData.name} has been added successfully.`,
      });

      navigation.goBack();
    } catch (error) {
      console.error('Error adding location:', error);
      Alert.alert('Error', 'Failed to add location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderDropdown = (label, value, options, field) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: dynamicStyles.textColor }]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dropdownContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.dropdownOption,
              {
                backgroundColor: value === option ? dynamicStyles.primaryColor : dynamicStyles.inputBackground,
                borderColor: dynamicStyles.borderColor,
              }
            ]}
            onPress={() => handleInputChange(field, option)}
          >
            <Text style={[
              styles.dropdownOptionText,
              { color: value === option ? '#ffffff' : dynamicStyles.textColor }
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>Add Location</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Location Name */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>Location Name *</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: dynamicStyles.inputBackground,
                color: dynamicStyles.textColor,
                borderColor: errors.name ? dynamicStyles.errorColor : dynamicStyles.borderColor,
              }
            ]}
            value={form.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="Enter location name"
            placeholderTextColor={dynamicStyles.mutedText}
          />
          {errors.name && <Text style={[styles.errorText, { color: dynamicStyles.errorColor }]}>{errors.name}</Text>}
        </View>

        {/* Location Type */}
        {renderDropdown('Location Type', form.type, locationTypes, 'type')}

        {/* Address */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>Address *</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: dynamicStyles.inputBackground,
                color: dynamicStyles.textColor,
                borderColor: errors.address ? dynamicStyles.errorColor : dynamicStyles.borderColor,
              }
            ]}
            value={form.address}
            onChangeText={(value) => handleInputChange('address', value)}
            placeholder="Enter full address"
            placeholderTextColor={dynamicStyles.mutedText}
            multiline
            numberOfLines={3}
          />
          {errors.address && <Text style={[styles.errorText, { color: dynamicStyles.errorColor }]}>{errors.address}</Text>}
        </View>

        {/* Phone Number */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>Phone Number</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: dynamicStyles.inputBackground,
                color: dynamicStyles.textColor,
                borderColor: errors.phone ? dynamicStyles.errorColor : dynamicStyles.borderColor,
              }
            ]}
            value={form.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            placeholder="Enter phone number"
            placeholderTextColor={dynamicStyles.mutedText}
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={[styles.errorText, { color: dynamicStyles.errorColor }]}>{errors.phone}</Text>}
        </View>

        {/* Coordinates */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={[styles.label, { color: dynamicStyles.textColor }]}>Latitude</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: dynamicStyles.inputBackground,
                  color: dynamicStyles.textColor,
                  borderColor: errors.lat ? dynamicStyles.errorColor : dynamicStyles.borderColor,
                }
              ]}
              value={form.lat}
              onChangeText={(value) => handleInputChange('lat', value)}
              placeholder="5.6037"
              placeholderTextColor={dynamicStyles.mutedText}
              keyboardType="numeric"
            />
            {errors.lat && <Text style={[styles.errorText, { color: dynamicStyles.errorColor }]}>{errors.lat}</Text>}
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={[styles.label, { color: dynamicStyles.textColor }]}>Longitude</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: dynamicStyles.inputBackground,
                  color: dynamicStyles.textColor,
                  borderColor: errors.lng ? dynamicStyles.errorColor : dynamicStyles.borderColor,
                }
              ]}
              value={form.lng}
              onChangeText={(value) => handleInputChange('lng', value)}
              placeholder="-0.187"
              placeholderTextColor={dynamicStyles.mutedText}
              keyboardType="numeric"
            />
            {errors.lng && <Text style={[styles.errorText, { color: dynamicStyles.errorColor }]}>{errors.lng}</Text>}
          </View>
        </View>

        {/* Status */}
        {renderDropdown('Status', form.status, statusOptions, 'status')}

        {/* Info Text */}
        <View style={[styles.infoContainer, { backgroundColor: `${dynamicStyles.primaryColor}15` }]}>
          <Icon name="info" size={16} color={dynamicStyles.primaryColor} />
          <Text style={[styles.infoText, { color: dynamicStyles.textColor }]}>
            If you don't provide coordinates, the location will be placed at default coordinates in Accra.
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: dynamicStyles.borderColor }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.cancelButtonText, { color: dynamicStyles.textColor }]}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: dynamicStyles.successColor }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>Add Location</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 20,
  },
  iconButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dropdownContainer: {
    flexDirection: 'row',
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  dropdownOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default AddLocationScreen;
