import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';

export const ReportformScreen = () => {
  const navigation = useNavigation();

  const [medicationName, setMedicationName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [storeName, setStoreName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [reportAnonymously, setReportAnonymously] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleBack = () => navigation.goBack();
  const handleSettings = () => navigation.navigate('SettingsScreen');

  const handleScanBarcode = () => {
    Alert.alert('Scan Barcode', 'This would open the barcode scanner.');
  };

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
    Alert.alert('Success', 'Your report has been submitted.');

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
      year: 'numeric', month: 'long', day: 'numeric'
    }).format(date);
    setExpirationDate(formattedDate);
    hideDatePicker();
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

      {/* Form Fields */}
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

      <View style={styles.formGroup}>
        <Text style={styles.label}>Store/Pharmacy Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter store or pharmacy name"
          placeholderTextColor="#637588"
          value={storeName}
          onChangeText={setStoreName}
        />
      </View>

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
            <Icon name="map-pin" size={24} color="#637588" />
          </View>
        </View>
      </View>

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

      {/* Barcode Scanner Button */}
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

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={expirationDate ? new Date(expirationDate) : new Date()}
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
    paddingTop:20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111418',
    paddingTop:9,
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

