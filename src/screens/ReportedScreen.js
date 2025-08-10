import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert, ScrollView,} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const ReportformScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [medicationName, setMedicationName] = useState('');
  const [dose, setDose] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (route.params?.scannedMedication) {
      const { name, dose, manufacturer } = route.params.scannedMedication;
      if (name) setMedicationName(name);
      if (dose) setDose(dose);
      if (manufacturer) setManufacturer(manufacturer);
    }
  }, [route.params?.scannedMedication]);

  const handleSubmit = () => {
    if (!medicationName || !dose || !manufacturer || !description) {
      Alert.alert('Incomplete Form', 'Please fill in all fields.');
      return;
    }

    // Submit logic (e.g., send to backend or context)
    Alert.alert('Report Submitted', 'Thank you for your report!');
    setMedicationName('');
    setDose('');
    setManufacturer('');
    setDescription('');
  };

  const handleScanBarcode = () => {
    navigation.navigate('BarcodeScannerScreen');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Medication Name</Text>
      <TextInput
        style={styles.input}
        value={medicationName}
        onChangeText={setMedicationName}
        placeholder="e.g., Paracetamol"
      />

      <Text style={styles.label}>Dose</Text>
      <TextInput
        style={styles.input}
        value={dose}
        onChangeText={setDose}
        placeholder="e.g., 500mg"
      />

      <Text style={styles.label}>Manufacturer</Text>
      <TextInput
        style={styles.input}
        value={manufacturer}
        onChangeText={setManufacturer}
        placeholder="e.g., Pfizer"
      />

      <Text style={styles.label}>Description of Issue</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe the issue or side effect..."
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.scanButton} onPress={handleScanBarcode}>
        <Text style={styles.scanButtonText}>Scan Medication QR Code</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export { ReportformScreen };

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  label: {
    marginTop: 20,
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  scanButton: {
    marginTop: 30,
    backgroundColor: '#2d98da',
    paddingVertical: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#20bf6b',
    paddingVertical: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
