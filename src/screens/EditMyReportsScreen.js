import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export const EditMyReportsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { report, user } = route.params || {};

  const [formData, setFormData] = useState({
    medicationName: '',
    description: '',
    location: '',
    storeName: '',
    category: '',
    severity: 'medium',
    expirationDate: '',
    batchNumber: '',
    manufacturer: '',
  });

  // Theme-aware styles
  const dynamicStyles = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    textColor: theme === 'dark' ? '#ffffff' : '#121417',
    mutedText: theme === 'dark' ? '#a0a0a0' : '#637587',
    borderColor: theme === 'dark' ? '#404040' : '#e2e8f0',
    cardBackground: theme === 'dark' ? '#2d2d2d' : '#ffffff',
    inputBackground: theme === 'dark' ? '#2d2d2d' : '#f9fafb',
    primaryColor: '#197ce5',
  };

  useEffect(() => {
    if (report) {
      setFormData({
        medicationName: report.medicationName || '',
        description: report.description || '',
        location: report.location || '',
        storeName: report.storeName || '',
        category: report.category || '',
        severity: report.severity || 'medium',
        expirationDate: report.expirationDate || '',
        batchNumber: report.batchNumber || '',
        manufacturer: report.manufacturer || '',
      });
    }
  }, [report]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.medicationName.trim()) {
      Alert.alert('Error', 'Medication name is required');
      return;
    }

    Alert.alert(
      'Save Changes',
      'Are you sure you want to save these changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: () => {
            // Here you would typically update the report in your database
            Alert.alert('Success', 'Report updated successfully', [
              { text: 'OK', onPress: () => navigation.goBack() }
            ]);
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Changes',
      'Are you sure you want to cancel? All unsaved changes will be lost.',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: () => navigation.goBack() }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={handleCancel}>
          <Icon name="x" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>Edit Report</Text>
        <TouchableOpacity style={styles.iconButton} onPress={handleSave}>
          <Icon name="check" size={24} color={dynamicStyles.primaryColor} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Form Fields */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: dynamicStyles.textColor }]}>Report Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: dynamicStyles.textColor }]}>Medication Name *</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: dynamicStyles.inputBackground,
                color: dynamicStyles.textColor,
                borderColor: dynamicStyles.borderColor
              }]}
              value={formData.medicationName}
              onChangeText={(value) => handleInputChange('medicationName', value)}
              placeholder="Enter medication name"
              placeholderTextColor={dynamicStyles.mutedText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: dynamicStyles.textColor }]}>Description</Text>
            <TextInput
              style={[styles.textArea, { 
                backgroundColor: dynamicStyles.inputBackground,
                color: dynamicStyles.textColor,
                borderColor: dynamicStyles.borderColor
              }]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Describe the issue..."
              placeholderTextColor={dynamicStyles.mutedText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: dynamicStyles.textColor }]}>Location</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: dynamicStyles.inputBackground,
                color: dynamicStyles.textColor,
                borderColor: dynamicStyles.borderColor
              }]}
              value={formData.location}
              onChangeText={(value) => handleInputChange('location', value)}
              placeholder="Where did you find this?"
              placeholderTextColor={dynamicStyles.mutedText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: dynamicStyles.textColor }]}>Store/Pharmacy</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: dynamicStyles.inputBackground,
                color: dynamicStyles.textColor,
                borderColor: dynamicStyles.borderColor
              }]}
              value={formData.storeName}
              onChangeText={(value) => handleInputChange('storeName', value)}
              placeholder="Store or pharmacy name"
              placeholderTextColor={dynamicStyles.mutedText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: dynamicStyles.textColor }]}>Category</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: dynamicStyles.inputBackground,
                color: dynamicStyles.textColor,
                borderColor: dynamicStyles.borderColor
              }]}
              value={formData.category}
              onChangeText={(value) => handleInputChange('category', value)}
              placeholder="e.g., Over-the-Counter, Prescription"
              placeholderTextColor={dynamicStyles.mutedText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: dynamicStyles.textColor }]}>Severity</Text>
            <View style={styles.severityContainer}>
              {['low', 'medium', 'high', 'critical'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.severityButton,
                    formData.severity === level && { backgroundColor: dynamicStyles.primaryColor }
                  ]}
                  onPress={() => handleInputChange('severity', level)}
                >
                  <Text style={[
                    styles.severityButtonText,
                    { color: formData.severity === level ? '#ffffff' : dynamicStyles.textColor }
                  ]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: dynamicStyles.textColor }]}>Expiration Date</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: dynamicStyles.inputBackground,
                color: dynamicStyles.textColor,
                borderColor: dynamicStyles.borderColor
              }]}
              value={formData.expirationDate}
              onChangeText={(value) => handleInputChange('expirationDate', value)}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={dynamicStyles.mutedText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: dynamicStyles.textColor }]}>Batch Number</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: dynamicStyles.inputBackground,
                color: dynamicStyles.textColor,
                borderColor: dynamicStyles.borderColor
              }]}
              value={formData.batchNumber}
              onChangeText={(value) => handleInputChange('batchNumber', value)}
              placeholder="Batch number if available"
              placeholderTextColor={dynamicStyles.mutedText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: dynamicStyles.textColor }]}>Manufacturer</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: dynamicStyles.inputBackground,
                color: dynamicStyles.textColor,
                borderColor: dynamicStyles.borderColor
              }]}
              value={formData.manufacturer}
              onChangeText={(value) => handleInputChange('manufacturer', value)}
              placeholder="Manufacturer name"
              placeholderTextColor={dynamicStyles.mutedText}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  iconButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formSection: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  severityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  severityButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
