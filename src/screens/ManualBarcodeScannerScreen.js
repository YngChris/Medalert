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
  ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Feather';

export default function ManualBarcodeScannerScreen() {
  const [manualInput, setManualInput] = useState('');
  const [recentScans, setRecentScans] = useState([]);
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
    primaryColor: '#197ce5',
  };

  const handleManualScan = () => {
    if (manualInput.trim()) {
      handleBarCodeScanned({ type: 'manual', data: manualInput.trim() });
    } else {
      Alert.alert('Invalid Input', 'Please enter a barcode or QR code data.');
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    try {
      console.log('Raw scanned data:', data, 'Type:', type);
      
      // Process different barcode types
      let processedData = processBarcodeData(data, type);
      
      console.log('Processed scanned data:', processedData);
      
      // Add to recent scans
      setRecentScans(prev => [processedData, ...prev.slice(0, 4)]);
      
      // Navigate back with the scanned data
      navigation.navigate('ReportForm', { scannedMedication: processedData });
      
    } catch (error) {
      console.error('Error processing scanned data:', error);
      Alert.alert(
        'Invalid QR/Barcode', 
        'The scanned data could not be processed. Please ensure it contains valid medication information.',
        [
          { text: 'Try Again', onPress: () => setManualInput('') },
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

  const useRecentScan = (scanData) => {
    navigation.navigate('ReportForm', { scannedMedication: scanData });
  };

  const clearRecentScans = () => {
    setRecentScans([]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={dynamicStyles.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dynamicStyles.textColor }]}>
          Barcode Scanner
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Input Section */}
        <View style={[styles.inputSection, { backgroundColor: dynamicStyles.cardBackground, borderColor: dynamicStyles.borderColor }]}>
          <View style={styles.inputHeader}>
            <Icon name="edit-3" size={20} color={dynamicStyles.primaryColor} />
            <Text style={[styles.inputTitle, { color: dynamicStyles.textColor }]}>
              Enter Barcode Data
            </Text>
          </View>
          
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: dynamicStyles.inputBackground,
                color: dynamicStyles.textColor,
                borderColor: dynamicStyles.borderColor
              }
            ]}
            placeholder="Enter barcode, QR code, or medication data..."
            placeholderTextColor={dynamicStyles.mutedText}
            value={manualInput}
            onChangeText={setManualInput}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.scanButton, { backgroundColor: dynamicStyles.primaryColor }]}
            onPress={handleManualScan}
            disabled={!manualInput.trim()}
          >
            <Icon name="check" size={20} color="#ffffff" />
            <Text style={styles.scanButtonText}>Process Data</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Examples */}
        <View style={[styles.examplesSection, { backgroundColor: dynamicStyles.cardBackground, borderColor: dynamicStyles.borderColor }]}>
          <Text style={[styles.sectionTitle, { color: dynamicStyles.textColor }]}>
            Quick Examples
          </Text>
          
          <View style={styles.examplesGrid}>
            <TouchableOpacity
              style={[styles.exampleButton, { borderColor: dynamicStyles.borderColor }]}
              onPress={() => setManualInput('Aspirin 500mg')}
            >
              <Text style={[styles.exampleText, { color: dynamicStyles.textColor }]}>
                Aspirin 500mg
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.exampleButton, { borderColor: dynamicStyles.borderColor }]}
              onPress={() => setManualInput('{"medicationName":"Ibuprofen","batchNumber":"IBU123","manufacturer":"Generic Pharma"}')}
            >
              <Text style={[styles.exampleText, { color: dynamicStyles.textColor }]}>
                JSON Data
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.exampleButton, { borderColor: dynamicStyles.borderColor }]}
              onPress={() => setManualInput('1234567890123')}
            >
              <Text style={[styles.exampleText, { color: dynamicStyles.textColor }]}>
                Barcode Number
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <View style={[styles.recentSection, { backgroundColor: dynamicStyles.cardBackground, borderColor: dynamicStyles.borderColor }]}>
            <View style={styles.recentHeader}>
              <Text style={[styles.sectionTitle, { color: dynamicStyles.textColor }]}>
                Recent Scans
              </Text>
              <TouchableOpacity onPress={clearRecentScans}>
                <Text style={[styles.clearButton, { color: dynamicStyles.mutedText }]}>
                  Clear
                </Text>
              </TouchableOpacity>
            </View>
            
            {recentScans.map((scan, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.recentItem, { borderColor: dynamicStyles.borderColor }]}
                onPress={() => useRecentScan(scan)}
              >
                <View style={styles.recentItemContent}>
                  <Text style={[styles.recentItemTitle, { color: dynamicStyles.textColor }]}>
                    {scan.medicationName}
                  </Text>
                  <Text style={[styles.recentItemSubtitle, { color: dynamicStyles.mutedText }]}>
                    {scan.batchNumber && `Batch: ${scan.batchNumber}`}
                    {scan.manufacturer && ` • ${scan.manufacturer}`}
                  </Text>
                </View>
                <Icon name="arrow-right" size={16} color={dynamicStyles.mutedText} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Info Section */}
        <View style={[styles.infoSection, { backgroundColor: dynamicStyles.cardBackground, borderColor: dynamicStyles.borderColor }]}>
          <Icon name="info" size={20} color={dynamicStyles.primaryColor} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: dynamicStyles.textColor }]}>
              Supported Data Formats
            </Text>
            <Text style={[styles.infoText, { color: dynamicStyles.mutedText }]}>
              • Simple medication names (e.g., "Aspirin 500mg")
              • JSON data with structured information
              • Barcode numbers (EAN, UPC, etc.)
              • QR code text content
            </Text>
          </View>
        </View>
      </ScrollView>
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
  inputSection: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  examplesSection: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  examplesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  exampleButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  exampleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  recentSection: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearButton: {
    fontSize: 14,
    fontWeight: '500',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  recentItemContent: {
    flex: 1,
  },
  recentItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  recentItemSubtitle: {
    fontSize: 12,
  },
  infoSection: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
