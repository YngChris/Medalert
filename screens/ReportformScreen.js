import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert,} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';

export const ReportformScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [medicationName, setMedicationName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [storeName, setStoreName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [reportAnonymously, setReportAnonymously] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Handle scanned barcode input
  useEffect(() => {
    if (route.params?.scannedData) {
      setMedicationName(route.params.scannedData);
    }
  }, [route.params?.scannedData]);

  const handleBack = () => navigation.goBack();

  const handleSubmit = () => {
    if (!medicationName || !expirationDate || !storeName || !location || !description) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    const reportData = {
      medicationName,
      expirationDate,
      storeName,
      location,
      description,
      reportAnonymously,
    };

    console.log('Report Submitted:', reportData);
    Alert.alert('Success', 'Your report has been submitted.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);

    // Reset form
    setMedicationName('');
    setExpirationDate('');
    setStoreName('');
    setLocation('');
    setDescription('');
    setReportAnonymously(false);
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
    setExpirationDate(formattedDate);
    hideDatePicker();
  };

  const handleScanBarcode = () => {
    navigation.navigate('BarcodeScannerScreen');
  };

  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required.');
      return;
    }

    let locationData = await Location.getCurrentPositionAsync({});
    const coords = locationData.coords;
    setLocation(`Lat: ${coords.latitude.toFixed(4)}, Lon: ${coords.longitude.toFixed(4)}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={handleBack}>
          <Icon name="arrow-left" size={24} color="#111418" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Medication</Text>
      </View>

      {/* Medication Name */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Medication Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter medication name"
          placeholderTextColor="#637588"
          value={medicationName}
          onChangeText={setMedicationName}
        />
      </View>

      {/* Expiration Date */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Expiration Date</Text>
        <View style={styles.dateInputContainer}>
          <TouchableOpacity onPress={showDatePicker} style={{ flex: 1 }}>
            <TextInput
              style={[styles.input, styles.dateInput]}
              placeholder="Select date"
              placeholderTextColor="#637588"
              value={expirationDate}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateIconContainer} onPress={showDatePicker}>
            <Icon name="calendar" size={24} color="#637588" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Store/Pharmacy */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Store/Manufacturer Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter store or pharmacy name"
          placeholderTextColor="#637588"
          value={storeName}
          onChangeText={setStoreName}
        />
      </View>

      {/* Location */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Location</Text>
        <View style={styles.locationInputContainer}>
          <TextInput
            style={[styles.input, styles.locationInput]}
            placeholder="Tag location"
            placeholderTextColor="#637588"
            value={location}
            onChangeText={setLocation}
          />
          <View style={styles.locationIconContainer}>
            <TouchableOpacity onPress={fetchLocation}>
              <Icon name="map-pin" size={24} color="#637588" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Add details about the report"
          placeholderTextColor="#637588"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>

      {/* Barcode Button */}
      <View style={styles.barcodeButtonContainer}>
        <TouchableOpacity style={styles.barcodeButton} onPress={handleScanBarcode}>
          <Icon name="camera" size={20} color="#111418" />
          <Text style={styles.barcodeButtonText}>Scan Barcode/QR Code</Text>
        </TouchableOpacity>
      </View>

      {/* Anonymous Switch */}
      <View style={styles.anonymousContainer}>
        <Text style={styles.anonymousText}>Report Anonymously</Text>
        <Switch
          value={reportAnonymously}
          onValueChange={setReportAnonymously}
          trackColor={{ false: '#f0f2f4', true: '#197ce5' }}
          thumbColor="#ffffff"
        />
      </View>

      {/* Submit Button */}
      <View style={styles.submitButtonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={expirationDate ? new Date(Date.parse(expirationDate)) : new Date()}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
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
    color: '#111418',
    paddingTop: 9,
    paddingRight: 100,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#111418',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e6ed',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111418',
    backgroundColor: '#f9fafb',
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
    alignItems: 'center',
    marginBottom: 20,
  },
  barcodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f4',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  barcodeButtonText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#111418',
  },
  anonymousContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  anonymousText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111418',
  },
  submitButtonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#197ce5',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
