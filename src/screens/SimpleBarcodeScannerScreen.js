import React, { useState } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform,
  TextInput,
  Modal
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function SimpleBarcodeScannerScreen() {
  const [scanned, setScanned] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Theme-aware styles
  const dynamicStyles = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    textColor: theme === 'dark' ? '#ffffff' : '#121417',
    mutedText: theme === 'dark' ? '#a0a0a0' : '#637587',
    borderColor: theme === 'dark' ? '#404040' : '#e2e8f0',
    cardBackground: theme === 'dark' ? '#2d2d2d' : '#ffffff',
    inputBackground: theme === 'dark' ? '#2d2d2d' : '#f9fafb',
  };

  const handleManualScan = () => {
    if (manualInput.trim()) {
      handleBarCodeScanned({ type: 'manual', data: manualInput.trim() });
    } else {
      Alert.alert('Invalid Input', 'Please enter a barcode or QR code data.');
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    try {
      console.log('Raw scanned data:', data, 'Type:', type);
      
      // Process different barcode types
      let processedData = processBarcodeData(data, type);
      
      console.log('Processed scanned data:', processedData);
      
      // Navigate back with the scanned data
      navigation.navigate('ReportForm', { scannedMedication: processedData });
      
    } catch (error) {
      console.error('Error processing scanned data:', error);
      Alert.alert(
        'Invalid QR/Barcode', 
        'The scanned data could not be processed. Please ensure it contains valid medication information.',
        [
          { text: 'Try Again', onPress: () => setScanned(false) },
          { text: 'Cancel', onPress: () => navigation.goBack() }
        ]
      );
    }
  };

  const processBarcodeData = (data, type) => {
    // Add timestamp
    const timestamp = new Date().toISOString();
    
    // Try to parse as JSON first (for QR codes with structured data)
    try {
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        return {
          ...parsed,
          scannedAt: timestamp,
          barcodeType: type,
          rawData: data
        };
      }
    } catch (e) {
      // Not JSON, continue with other processing
    }

    // Handle different barcode types
    switch (type) {
      case 'qr':
      case 'manual':
        // For QR codes and manual input, try to extract medication info from text
        return extractMedicationInfo(data, type, timestamp);
      
      case 'ean13':
      case 'ean8':
      case 'upc_a':
      case 'upc_e':
        // For product barcodes, use the barcode as product identifier
        return {
          medicationName: `Product ${data}`,
          barcodeNumber: data,
          barcodeType: type,
          scannedAt: timestamp,
          rawData: data
        };
      
      case 'code128':
      case 'code39':
      case 'code93':
        // For other barcodes, treat as generic identifier
        return {
          medicationName: data,
          barcodeType: type,
          scannedAt: timestamp,
          rawData: data
        };
      
      default:
        // Default fallback
        return {
          medicationName: data,
          barcodeType: type,
          scannedAt: timestamp,
          rawData: data
        };
    }
  };

  const extractMedicationInfo = (data, type, timestamp) => {
    // Try to extract medication information from text
    const lowerData = data.toLowerCase();
    
    // Look for common medication patterns
    const medicationPatterns = [
      /medication[:\s]+([^\n\r,]+)/i,
      /drug[:\s]+([^\n\r,]+)/i,
      /medicine[:\s]+([^\n\r,]+)/i,
      /name[:\s]+([^\n\r,]+)/i
    ];
    
    let medicationName = null;
    for (const pattern of medicationPatterns) {
      const match = data.match(pattern);
      if (match && match[1]) {
        medicationName = match[1].trim();
        break;
      }
    }
    
    // Look for batch number patterns
    const batchPatterns = [
      /batch[:\s]+([^\n\r,]+)/i,
      /lot[:\s]+([^\n\r,]+)/i,
      /batch\s*#?\s*([^\n\r,]+)/i
    ];
    
    let batchNumber = null;
    for (const pattern of batchPatterns) {
      const match = data.match(pattern);
      if (match && match[1]) {
        batchNumber = match[1].trim();
        break;
      }
    }
    
    // Look for manufacturer patterns
    const manufacturerPatterns = [
      /manufacturer[:\s]+([^\n\r,]+)/i,
      /made\s+by[:\s]+([^\n\r,]+)/i,
      /producer[:\s]+([^\n\r,]+)/i
    ];
    
    let manufacturer = null;
    for (const pattern of manufacturerPatterns) {
      const match = data.match(pattern);
      if (match && match[1]) {
        manufacturer = match[1].trim();
        break;
      }
    }
    
    return {
      medicationName: medicationName || data,
      batchNumber,
      manufacturer,
      barcodeType: type,
      scannedAt: timestamp,
      rawData: data
    };
  };

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Barcode scanning is not available on web.</Text>
        <Text style={{ opacity: 0.7, textAlign: 'center', paddingHorizontal: 24 }}>
          Please use a mobile device or the native app to scan barcodes.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>
          Barcode Scanner
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={[styles.scannerPlaceholder, { backgroundColor: dynamicStyles.cardBackground, borderColor: dynamicStyles.borderColor }]}>
          <MaterialIcons name="qr-code-scanner" size={80} color={dynamicStyles.mutedText} />
          <Text style={[styles.placeholderText, { color: dynamicStyles.textColor }]}>
            Camera Scanner
          </Text>
          <Text style={[styles.placeholderSubtext, { color: dynamicStyles.mutedText }]}>
            Camera functionality temporarily unavailable
          </Text>
        </View>

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: dynamicStyles.borderColor }]} />
          <Text style={[styles.dividerText, { color: dynamicStyles.mutedText }]}>OR</Text>
          <View style={[styles.dividerLine, { backgroundColor: dynamicStyles.borderColor }]} />
        </View>

        <TouchableOpacity
          style={[styles.manualButton, { backgroundColor: dynamicStyles.primaryColor }]}
          onPress={() => setShowManualInput(true)}
        >
          <MaterialIcons name="keyboard" size={24} color="#ffffff" />
          <Text style={styles.manualButtonText}>Enter Manually</Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <MaterialIcons name="info" size={20} color={dynamicStyles.mutedText} />
          <Text style={[styles.infoText, { color: dynamicStyles.mutedText }]}>
            You can enter barcode data manually or use the camera scanner when available.
          </Text>
        </View>
      </View>

      {/* Manual Input Modal */}
      <Modal
        visible={showManualInput}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: dynamicStyles.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: dynamicStyles.textColor }]}>
              Enter Barcode Data
            </Text>
            
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: dynamicStyles.inputBackground,
                  color: dynamicStyles.textColor,
                  borderColor: dynamicStyles.borderColor
                }
              ]}
              placeholder="Enter barcode or QR code data..."
              placeholderTextColor={dynamicStyles.mutedText}
              value={manualInput}
              onChangeText={setManualInput}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: dynamicStyles.borderColor }]}
                onPress={() => {
                  setShowManualInput(false);
                  setManualInput('');
                }}
              >
                <Text style={[styles.cancelButtonText, { color: dynamicStyles.textColor }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: dynamicStyles.primaryColor }]}
                onPress={() => {
                  handleManualScan();
                  setShowManualInput(false);
                  setManualInput('');
                }}
              >
                <Text style={styles.confirmButtonText}>Scan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e6ed',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scannerPlaceholder: {
    height: 300,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  placeholderSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 24,
  },
  manualButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
    // backgroundColor set dynamically
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
