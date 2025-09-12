
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  Alert, 
  Image,
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { reportsStorage } from '../utils/reportsStorage';

const { width } = Dimensions.get('window');

export const ReportformScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { user } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    medicationName: '',
    expirationDate: '',
    storeName: '',
    location: '',
    description: '',
    category: '',
    severity: 'medium',
    batchNumber: '',
    manufacturer: '',
    reportAnonymously: false,
  });

  // UI state
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImages, setAttachedImages] = useState([]);
  const [formProgress, setFormProgress] = useState(0);
  const [errors, setErrors] = useState({});

  // Constants
  const categories = [
    'Prescription Drugs',
    'Over-the-Counter',
    'Supplements',
    'Herbal Medicine',
    'Medical Devices',
    'Other'
  ];

  const getSeverityLevels = (dynamicStyles) => [
    { key: 'low', label: 'Low', color: dynamicStyles.successColor, icon: 'alert-circle' },
    { key: 'medium', label: 'Medium', color: dynamicStyles.warningColor, icon: 'alert-triangle' },
    { key: 'high', label: 'High', color: dynamicStyles.orangeColor, icon: 'alert-octagon' },
    { key: 'critical', label: 'Critical', color: dynamicStyles.dangerColor, icon: 'alert-octagon' }
  ];

  // Handle scanned barcode input
  useEffect(() => {
    if (route.params?.scannedMedication) {
      const scannedData = route.params.scannedMedication;
      console.log('Scanned medication data:', scannedData);
      
      // Auto-fill form with scanned data
      const updatedFormData = { ...formData };
      
      if (scannedData.medicationName) {
        updatedFormData.medicationName = scannedData.medicationName;
      }
      if (scannedData.expirationDate) {
        updatedFormData.expirationDate = scannedData.expirationDate;
      }
      if (scannedData.batchNumber) {
        updatedFormData.batchNumber = scannedData.batchNumber;
      }
      if (scannedData.manufacturer) {
        updatedFormData.manufacturer = scannedData.manufacturer;
      }
      if (scannedData.category) {
        updatedFormData.category = scannedData.category;
      }
      if (scannedData.storeName) {
        updatedFormData.storeName = scannedData.storeName;
      }
      
      setFormData(updatedFormData);
      
      // Show success message
      Alert.alert(
        'Barcode Scanned Successfully!',
        `Medication: ${scannedData.medicationName || 'Unknown'}\nBatch: ${scannedData.batchNumber || 'Unknown'}\nManufacturer: ${scannedData.manufacturer || 'Unknown'}`,
        [{ text: 'OK' }]
      );
    }
  }, [route.params?.scannedMedication]);

  // Calculate form progress
  useEffect(() => {
    const requiredFields = ['medicationName', 'expirationDate', 'storeName', 'location', 'description'];
    const filledFields = requiredFields.filter(field => formData[field]?.trim());
    const progress = (filledFields.length / requiredFields.length) * 100;
    setFormProgress(progress);
  }, [formData]);

  // Use theme context for consistent styling
  const { getThemeColors } = useTheme();
  const dynamicStyles = getThemeColors();

  const severityLevels = getSeverityLevels(dynamicStyles);

  const handleBack = () => navigation.goBack();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.medicationName.trim()) {
      newErrors.medicationName = 'Medication name is required';
    }

    if (!formData.expirationDate) {
      newErrors.expirationDate = 'Expiration date is required';
    }

    if (!formData.storeName.trim()) {
      newErrors.storeName = 'Store name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before submitting.');
      return;
    }

    setIsLoading(true);

    try {
      // Create report data
      const reportData = {
        ...formData,
        attachedImages,
        userId: formData.reportAnonymously ? 'anonymous' : (user?.id || 'user123'),
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      // Save report to storage
      const savedReport = await reportsStorage.saveReport(reportData);
      console.log('Report Saved:', savedReport);
      
      Alert.alert(
        'Success!', 
        'Your report has been submitted successfully. We will review it and take appropriate action.',
        [
          { 
            text: 'View My Reports', 
            onPress: () => navigation.navigate('MyReports', { user })
          },
          { 
            text: 'Submit Another', 
            onPress: () => resetForm()
          }
        ]
      );

    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      medicationName: '',
      expirationDate: '',
      storeName: '',
      location: '',
      description: '',
      category: '',
      severity: 'medium',
      batchNumber: '',
      manufacturer: '',
      reportAnonymously: false,
    });
    setAttachedImages([]);
    setErrors({});
  };

  const saveDraft = () => {
    // Save form data to AsyncStorage or local state
    Alert.alert('Draft Saved', 'Your report has been saved as a draft.');
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
    handleInputChange('expirationDate', formattedDate);
    hideDatePicker();
  };

  const handleScanBarcode = () => {
    try {
      // Check if we're on web platform
      if (Platform.OS === 'web') {
        Alert.alert(
          'Barcode Scanner Not Available',
          'Barcode scanning is not available on web. Please use the manual entry option or switch to a mobile device.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Navigate directly to manual barcode scanner (no camera dependencies)
      navigation.navigate('ManualBarcodeScannerScreen');
    } catch (error) {
      console.error('Error navigating to barcode scanner:', error);
      Alert.alert(
        'Navigation Error', 
        'Failed to open barcode scanner. Please try again or use manual entry.',
        [
          { text: 'Try Again', onPress: handleScanBarcode },
          { text: 'Manual Entry', onPress: handleManualBarcodeInput },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  const handleManualBarcodeInput = () => {
    // Navigate to the manual barcode scanner screen
    navigation.navigate('ManualBarcodeScannerScreen');
  };

  const handleScannedData = (scannedData) => {
    console.log('Processing scanned data:', scannedData);
    
    // Validate scanned data
    if (!scannedData || typeof scannedData !== 'object') {
      Alert.alert('Invalid Data', 'The scanned data is not in the expected format.');
      return;
    }

    // Ensure we have at least a medication name
    if (!scannedData.medicationName && !scannedData.rawData) {
      Alert.alert('Invalid Data', 'No medication information found in the scanned data.');
      return;
    }

    // Auto-fill form with scanned data
    const updatedFormData = { ...formData };
    let fieldsUpdated = 0;
    
    if (scannedData.medicationName) {
      updatedFormData.medicationName = scannedData.medicationName;
      fieldsUpdated++;
    }
    if (scannedData.expirationDate) {
      updatedFormData.expirationDate = scannedData.expirationDate;
      fieldsUpdated++;
    }
    if (scannedData.batchNumber) {
      updatedFormData.batchNumber = scannedData.batchNumber;
      fieldsUpdated++;
    }
    if (scannedData.manufacturer) {
      updatedFormData.manufacturer = scannedData.manufacturer;
      fieldsUpdated++;
    }
    if (scannedData.category) {
      updatedFormData.category = scannedData.category;
      fieldsUpdated++;
    }
    if (scannedData.storeName) {
      updatedFormData.storeName = scannedData.storeName;
      fieldsUpdated++;
    }
    
    setFormData(updatedFormData);
    
    // Show success message with more details
    const successMessage = [
      `Medication: ${scannedData.medicationName || 'Not provided'}`,
      scannedData.batchNumber ? `Batch: ${scannedData.batchNumber}` : null,
      scannedData.manufacturer ? `Manufacturer: ${scannedData.manufacturer}` : null,
      scannedData.barcodeType ? `Type: ${scannedData.barcodeType.toUpperCase()}` : null,
      `Fields updated: ${fieldsUpdated}`
    ].filter(Boolean).join('\n');
    
    Alert.alert(
      'Data Processed Successfully!',
      successMessage,
      [
        { 
          text: 'OK',
          onPress: () => {
            // Clear any existing errors when data is successfully processed
            setErrors({});
          }
        }
      ]
    );
  };

  const fetchLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to auto-fill your location.');
        return;
      }

      setIsLoading(true);
      let locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      
      const coords = locationData.coords;
      const address = `Lat: ${coords.latitude.toFixed(4)}, Lon: ${coords.longitude.toFixed(4)}`;
      
      handleInputChange('location', address);
      Alert.alert('Location Updated', 'Your current location has been added to the report.');
      
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Error', 'Failed to get your location. Please enter it manually.');
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 600,
      });

      if (!result.canceled && result.assets[0]) {
        const newImage = {
          uri: result.assets[0].uri,
          id: Date.now().toString(),
          type: 'image'
        };
        setAttachedImages(prev => [...prev, newImage]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removeImage = (imageId) => {
    setAttachedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={[styles.progressText, { color: dynamicStyles.textColor }]}>
          Form Completion
        </Text>
        <Text style={[styles.progressPercentage, { color: dynamicStyles.primaryColor }]}>
          {Math.round(formProgress)}%
        </Text>
      </View>
      <View style={[styles.progressBar, { backgroundColor: dynamicStyles.borderColor }]}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${formProgress}%`,
              backgroundColor: formProgress === 100 ? dynamicStyles.successColor : dynamicStyles.primaryColor
            }
          ]} 
        />
      </View>
    </View>
  );

  const renderImageAttachments = () => (
    <View style={styles.formGroup}>
      <Text style={[styles.label, { color: dynamicStyles.textColor }]}>
        Attach Photos ({attachedImages.length}/5)
      </Text>
      <View style={styles.imageContainer}>
        {attachedImages.map((image) => (
          <View key={image.id} style={styles.imageWrapper}>
            <Image source={{ uri: image.uri }} style={styles.attachedImage} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => removeImage(image.id)}
            >
              <Icon name="x" size={16} color={dynamicStyles.whiteColor} />
            </TouchableOpacity>
          </View>
        ))}
        {attachedImages.length < 5 && (
          <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
            <Icon name="camera" size={24} color={dynamicStyles.primaryColor} />
            <Text style={[styles.addImageText, { color: dynamicStyles.primaryColor }]}>
              Add Photo
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingWrapper
      style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={handleBack}>
          <Icon name="arrow-left" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>
          Report Medication Issue
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.draftButton} onPress={saveDraft}>
            <Icon name="save" size={20} color={dynamicStyles.primaryColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      {renderProgressBar()}

      {/* Medication Name */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: dynamicStyles.textColor }]}>
          Medication Name *
        </Text>
        <TextInput
          style={[
            styles.input, 
            { 
              backgroundColor: dynamicStyles.inputBackground, 
              color: dynamicStyles.textColor,
              borderColor: errors.medicationName ? dynamicStyles.dangerColor : dynamicStyles.borderColor 
            }
          ]}
          placeholder="Enter medication name"
          placeholderTextColor={dynamicStyles.mutedText}
          value={formData.medicationName}
          onChangeText={(value) => handleInputChange('medicationName', value)}
        />
        {errors.medicationName && (
          <Text style={[styles.errorText, { color: dynamicStyles.dangerColor }]}>
            {errors.medicationName}
          </Text>
        )}
      </View>

      {/* Category Selection */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: dynamicStyles.textColor }]}>
          Medication Category
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                { 
                  backgroundColor: formData.category === category 
                    ? dynamicStyles.primaryColor 
                    : dynamicStyles.inputBackground,
                  borderColor: dynamicStyles.borderColor
                }
              ]}
              onPress={() => handleInputChange('category', category)}
            >
              <Text style={[
                styles.categoryChipText,
                { 
                  color: formData.category === category 
                    ? dynamicStyles.whiteColor 
                    : dynamicStyles.textColor 
                }
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Severity Level */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: dynamicStyles.textColor }]}>
          Issue Severity *
        </Text>
        <View style={styles.severityContainer}>
          {severityLevels.map((level) => (
            <TouchableOpacity
              key={level.key}
              style={[
                styles.severityChip,
                { 
                  backgroundColor: formData.severity === level.key 
                    ? level.color 
                    : dynamicStyles.inputBackground,
                  borderColor: dynamicStyles.borderColor
                }
              ]}
              onPress={() => handleInputChange('severity', level.key)}
            >
              <Icon 
                name={level.icon} 
                size={16} 
                color={formData.severity === level.key ? dynamicStyles.whiteColor : level.color} 
              />
              <Text style={[
                styles.severityChipText,
                { 
                  color: formData.severity === level.key 
                    ? dynamicStyles.whiteColor 
                    : dynamicStyles.textColor 
                }
              ]}>
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Expiration Date */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: dynamicStyles.textColor }]}>
          Expiration Date *
        </Text>
        <View style={styles.dateInputContainer}>
          <TouchableOpacity onPress={showDatePicker} style={{ flex: 1 }}>
            <TextInput
              style={[
                styles.input, 
                styles.dateInput,
                { 
                  backgroundColor: dynamicStyles.inputBackground, 
                  color: dynamicStyles.textColor,
                  borderColor: errors.expirationDate ? dynamicStyles.dangerColor : dynamicStyles.borderColor 
                }
              ]}
              placeholder="Select expiration date"
              placeholderTextColor={dynamicStyles.mutedText}
              value={formData.expirationDate}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateIconContainer} onPress={showDatePicker}>
            <Icon name="calendar" size={24} color={dynamicStyles.mutedText} />
          </TouchableOpacity>
        </View>
        {errors.expirationDate && (
          <Text style={[styles.errorText, { color: dynamicStyles.dangerColor }]}>
            {errors.expirationDate}
          </Text>
        )}
      </View>

      {/* Store/Pharmacy */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: dynamicStyles.textColor }]}>
          Store/Pharmacy Name *
        </Text>
        <TextInput
          style={[
            styles.input, 
            { 
              backgroundColor: dynamicStyles.inputBackground, 
              color: dynamicStyles.textColor,
              borderColor: errors.storeName ? dynamicStyles.dangerColor : dynamicStyles.borderColor 
            }
          ]}
          placeholder="Enter store or pharmacy name"
          placeholderTextColor={dynamicStyles.mutedText}
          value={formData.storeName}
          onChangeText={(value) => handleInputChange('storeName', value)}
        />
        {errors.storeName && (
          <Text style={[styles.errorText, { color: dynamicStyles.dangerColor }]}>
            {errors.storeName}
          </Text>
        )}
      </View>

      {/* Location */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: dynamicStyles.textColor }]}>
          Location *
        </Text>
        <View style={styles.locationInputContainer}>
          <TextInput
            style={[
              styles.input, 
              styles.locationInput,
              { 
                backgroundColor: dynamicStyles.inputBackground, 
                color: dynamicStyles.textColor,
                borderColor: errors.location ? dynamicStyles.dangerColor : dynamicStyles.borderColor 
              }
            ]}
            placeholder="Enter location or use GPS"
            placeholderTextColor={dynamicStyles.mutedText}
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
          />
          <TouchableOpacity style={styles.locationIconContainer} onPress={fetchLocation}>
            <Icon name="map-pin" size={24} color={dynamicStyles.primaryColor} />
          </TouchableOpacity>
        </View>
        {errors.location && (
          <Text style={[styles.errorText, { color: dynamicStyles.dangerColor }]}>
            {errors.location}
          </Text>
        )}
      </View>

      {/* Additional Fields */}
      <View style={styles.rowContainer}>
        <View style={[styles.formGroup, styles.halfWidth]}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>
            Batch Number
          </Text>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: dynamicStyles.inputBackground, 
                color: dynamicStyles.textColor,
                borderColor: dynamicStyles.borderColor 
              }
            ]}
            placeholder="Optional"
            placeholderTextColor={dynamicStyles.mutedText}
            value={formData.batchNumber}
            onChangeText={(value) => handleInputChange('batchNumber', value)}
          />
        </View>

        <View style={[styles.formGroup, styles.halfWidth]}>
          <Text style={[styles.label, { color: dynamicStyles.textColor }]}>
            Manufacturer
          </Text>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: dynamicStyles.inputBackground, 
                color: dynamicStyles.textColor,
                borderColor: dynamicStyles.borderColor 
              }
            ]}
            placeholder="Optional"
            placeholderTextColor={dynamicStyles.mutedText}
            value={formData.manufacturer}
            onChangeText={(value) => handleInputChange('manufacturer', value)}
          />
        </View>
      </View>

      {/* Description */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: dynamicStyles.textColor }]}>
          Description *
        </Text>
        <TextInput
          style={[
            styles.input, 
            styles.textArea,
            { 
              backgroundColor: dynamicStyles.inputBackground, 
              color: dynamicStyles.textColor,
              borderColor: errors.description ? dynamicStyles.dangerColor : dynamicStyles.borderColor 
            }
          ]}
          placeholder="Describe the issue in detail (minimum 10 characters)"
          placeholderTextColor={dynamicStyles.mutedText}
          value={formData.description}
          onChangeText={(value) => handleInputChange('description', value)}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
        {errors.description && (
          <Text style={[styles.errorText, { color: dynamicStyles.dangerColor }]}>
            {errors.description}
          </Text>
        )}
        <Text style={[styles.characterCount, { color: dynamicStyles.mutedText }]}>
          {formData.description.length}/500 characters
        </Text>
      </View>

      {/* Image Attachments */}
      {renderImageAttachments()}

      {/* Barcode Button */}
      <View style={styles.barcodeButtonContainer}>
        <Text style={[styles.label, { color: dynamicStyles.textColor, marginBottom: 12 }]}>
          Medication Identification
        </Text>
        
        {/* Primary Barcode Button */}
        <TouchableOpacity 
          style={[
            styles.barcodeButton, 
            { backgroundColor: dynamicStyles.primaryColor }
          ]} 
          onPress={handleScanBarcode}
        >
          <Icon name="camera" size={20} color={dynamicStyles.whiteColor} />
          <Text style={[styles.barcodeButtonText, { color: dynamicStyles.whiteColor }]}>
            Scan Barcode/QR Code
          </Text>
        </TouchableOpacity>
        
        {/* Manual Entry Button */}
        <TouchableOpacity 
          style={[
            styles.manualBarcodeButton, 
            { borderColor: dynamicStyles.borderColor }
          ]} 
          onPress={handleManualBarcodeInput}
        >
          <Icon name="edit-3" size={18} color={dynamicStyles.primaryColor} />
          <Text style={[styles.manualBarcodeButtonText, { color: dynamicStyles.primaryColor }]}>
            Enter Manually
          </Text>
        </TouchableOpacity>
        
        {/* Scanned Data Preview */}
        {route.params?.scannedMedication && (
          <View style={[styles.scannedDataPreview, { backgroundColor: dynamicStyles.cardBackground, borderColor: dynamicStyles.borderColor }]}>
            <View style={styles.scannedDataHeader}>
              <Icon name="check-circle" size={20} color={dynamicStyles.successColor} />
              <Text style={[styles.scannedDataTitle, { color: dynamicStyles.textColor }]}>
                Scanned Data
              </Text>
              <TouchableOpacity 
                style={styles.clearScannedDataButton}
                onPress={() => {
                  // Clear the scanned data by navigating back to the same screen without params
                  navigation.replace('ReportForm');
                }}
              >
                <Icon name="x" size={16} color={dynamicStyles.mutedText} />
              </TouchableOpacity>
            </View>
            <View style={styles.scannedDataContent}>
              {route.params.scannedMedication.medicationName && (
                <Text style={[styles.scannedDataText, { color: dynamicStyles.textColor }]}>
                  <Text style={{ fontWeight: '600' }}>Medication:</Text> {route.params.scannedMedication.medicationName}
                </Text>
              )}
              {route.params.scannedMedication.batchNumber && (
                <Text style={[styles.scannedDataText, { color: dynamicStyles.textColor }]}>
                  <Text style={{ fontWeight: '600' }}>Batch:</Text> {route.params.scannedMedication.batchNumber}
                </Text>
              )}
              {route.params.scannedMedication.manufacturer && (
                <Text style={[styles.scannedDataText, { color: dynamicStyles.textColor }]}>
                  <Text style={{ fontWeight: '600' }}>Manufacturer:</Text> {route.params.scannedMedication.manufacturer}
                </Text>
              )}
              {route.params.scannedMedication.barcodeNumber && (
                <Text style={[styles.scannedDataText, { color: dynamicStyles.textColor }]}>
                  <Text style={{ fontWeight: '600' }}>Barcode:</Text> {route.params.scannedMedication.barcodeNumber}
                </Text>
              )}
              {route.params.scannedMedication.barcodeType && (
                <Text style={[styles.scannedDataText, { color: dynamicStyles.textColor }]}>
                  <Text style={{ fontWeight: '600' }}>Type:</Text> {route.params.scannedMedication.barcodeType.toUpperCase()}
                </Text>
              )}
              {route.params.scannedMedication.scannedAt && (
                <Text style={[styles.scannedDataText, { color: dynamicStyles.mutedText, fontSize: 12 }]}>
                  Scanned at: {new Date(route.params.scannedMedication.scannedAt).toLocaleString()}
                </Text>
              )}
            </View>
          </View>
        )}
        
        {/* Barcode Info */}
        <View style={styles.barcodeInfoContainer}>
          <Icon name="info" size={16} color={dynamicStyles.mutedText} />
          <Text style={[styles.barcodeInfoText, { color: dynamicStyles.mutedText }]}>
            Scan medication barcode or QR code to auto-fill form fields
          </Text>
        </View>
      </View>

      {/* Anonymous Switch */}
      <View style={styles.anonymousContainer}>
        <View style={styles.anonymousTextContainer}>
          <Text style={[styles.anonymousText, { color: dynamicStyles.textColor }]}>
            Report Anonymously
          </Text>
          <Text style={[styles.anonymousSubtext, { color: dynamicStyles.mutedText }]}>
            Your personal information will not be shared
          </Text>
        </View>
        <Switch
          value={formData.reportAnonymously}
          onValueChange={(value) => handleInputChange('reportAnonymously', value)}
          trackColor={{ false: dynamicStyles.borderColor, true: dynamicStyles.primaryColor }}
          thumbColor={dynamicStyles.whiteColor}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={[styles.secondaryButton, { borderColor: dynamicStyles.borderColor }]} 
          onPress={resetForm}
        >
          <Text style={[styles.secondaryButtonText, { color: dynamicStyles.textColor }]}>
            Reset Form
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.submitButton, 
            { 
              backgroundColor: formProgress === 100 ? dynamicStyles.successColor : dynamicStyles.primaryColor,
              opacity: isLoading ? 0.7 : 1
            }
          ]} 
          onPress={handleSubmit}
          disabled={isLoading || formProgress < 100}
        >
          {isLoading ? (
            <ActivityIndicator color={dynamicStyles.whiteColor} />
          ) : (
            <Text style={styles.submitButtonText}>
              Submit Report
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={formData.expirationDate ? new Date(Date.parse(formData.expirationDate)) : new Date()}
        minimumDate={new Date()}
      />
    </KeyboardAvoidingWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  iconButton: {
    padding: 10,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    paddingTop: 9,
    paddingRight: 100,
  },
  headerActions: {
    padding: 10,
  },
  draftButton: {
    padding: 8,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
  },
  dateIconContainer: {
    padding: 8,
    marginLeft: 8,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInput: {
    flex: 1,
  },
  locationIconContainer: {
    padding: 8,
    marginLeft: 8,
  },
  textArea: {
    height: 120,
  },
  barcodeButtonContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  barcodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minWidth: 200,
  },
  barcodeButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  manualBarcodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 12,
    minWidth: 150,
  },
  manualBarcodeButtonText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  barcodeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(25, 124, 229, 0.05)',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    maxWidth: 300,
  },
  barcodeInfoText: {
    marginLeft: 8,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    flex: 1,
  },
  anonymousContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  anonymousTextContainer: {
    marginRight: 10,
  },
  anonymousText: {
    fontSize: 14,
    fontWeight: '500',
  },
  anonymousSubtext: {
    fontSize: 12,
  },
  severityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  severityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  severityChipText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  attachedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e6ed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  addImageText: {
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  characterCount: {
    fontSize: 12,
    marginTop: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  halfWidth: {
    width: '48%',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderColor: '#e0e6ed',
    width: '48%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '48%',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scannedDataPreview: {
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e6ed',
    width: '100%',
    maxWidth: 300,
  },
  scannedDataHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scannedDataTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  clearScannedDataButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  scannedDataContent: {
    marginTop: 8,
  },
  scannedDataText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
