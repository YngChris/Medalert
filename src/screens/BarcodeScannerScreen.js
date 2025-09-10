import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Camera } from 'expo-camera';

export default function BarcodeScannerScreen() {
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

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Theme-aware styles
  const dynamicStyles = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    textColor: theme === 'dark' ? '#ffffff' : '#121417',
    mutedText: theme === 'dark' ? '#a0a0a0' : '#637587',
    borderColor: theme === 'dark' ? '#404040' : '#e2e8f0',
    cardBackground: theme === 'dark' ? '#2d2d2d' : '#ffffff',
    overlayBackground: theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
  };

  // Request camera permissions
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

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
        // For QR codes, try to extract medication info from text
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

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
        <View style={styles.permissionContainer}>
          <Text style={[styles.permissionText, { color: dynamicStyles.textColor }]}>
            Requesting camera permission...
          </Text>
          <Text style={[styles.permissionSubtext, { color: dynamicStyles.mutedText }]}>
            Please wait while we set up the camera...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
        <View style={styles.permissionContainer}>
          <Text style={[styles.permissionText, { color: dynamicStyles.textColor }]}>
            No access to camera
          </Text>
          <Text style={[styles.permissionSubtext, { color: dynamicStyles.mutedText }]}>
            Please enable camera permissions in your device settings
          </Text>
          <TouchableOpacity 
            style={styles.rescanButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.rescanText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        flashMode={flashOn ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
        barCodeScannerSettings={{
          barCodeTypes: [
            Camera.Constants.BarCodeType.qr,
            Camera.Constants.BarCodeType.code128,
            Camera.Constants.BarCodeType.code39,
            Camera.Constants.BarCodeType.code93,
            Camera.Constants.BarCodeType.ean13,
            Camera.Constants.BarCodeType.ean8,
            Camera.Constants.BarCodeType.upc_a,
            Camera.Constants.BarCodeType.upc_e,
            Camera.Constants.BarCodeType.pdf417,
            Camera.Constants.BarCodeType.aztec,
            Camera.Constants.BarCodeType.datamatrix,
          ],
        }}
      >
        <View style={styles.overlay}>
          {/* Scanning Frame */}
          <View style={styles.scanBox} />
          
          {/* Instructions */}
          <Text style={styles.instructionText}>
            Position the barcode within the frame
          </Text>
          
          {/* Flashlight Toggle */}
          <TouchableOpacity style={styles.flashToggle} onPress={toggleFlash}>
            <MaterialIcons
              name={flashOn ? 'flash-on' : 'flash-off'}
              size={28}
              color="white"
            />
          </TouchableOpacity>
          
          {/* Scan again button */}
          {scanned && (
            <TouchableOpacity style={styles.rescanButton} onPress={() => setScanned(false)}>
              <Text style={styles.rescanText}>Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  permissionSubtext: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#00ff00',
    backgroundColor: 'transparent',
    borderRadius: 12,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  flashToggle: {
    position: 'absolute',
    top: 100,
    right: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    borderRadius: 25,
  },
  rescanButton: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: '#197ce5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  rescanText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

