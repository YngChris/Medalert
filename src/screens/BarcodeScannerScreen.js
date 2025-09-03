import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

// Try different import approaches
import * as ExpoCamera from 'expo-camera';

export default function BarcodeScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [flash, setFlash] = useState('off');
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const cameraRef = useRef(null);
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

  // Check camera availability and request permissions
  useEffect(() => {
    const checkCameraAvailability = async () => {
      try {
        console.log('Checking camera availability...');
        console.log('Camera import:', ExpoCamera);
        console.log('Camera type:', typeof ExpoCamera);
        console.log('Camera constructor:', ExpoCamera?.constructor?.name);
        console.log('Camera prototype:', ExpoCamera?.prototype);
        console.log('Camera keys:', Object.keys(ExpoCamera || {}));
        console.log('Camera.Constants:', ExpoCamera?.Constants);
        console.log('CameraType:', ExpoCamera.CameraType);
        
        // Check if Camera component is available
        if (ExpoCamera && ExpoCamera.Camera && typeof ExpoCamera.Camera === 'function') {
          console.log('Camera component available:', ExpoCamera.Camera);
          setCameraAvailable(true);
          
          // Request camera permissions
          try {
            if (ExpoCamera.requestCameraPermissionsAsync) {
              const { status } = await ExpoCamera.requestCameraPermissionsAsync();
              setHasPermission(status === 'granted');
            } else {
              console.error('Camera permission request not available');
              setHasPermission(false);
            }
          } catch (permissionError) {
            console.error('Error requesting camera permission:', permissionError);
            setHasPermission(false);
          }
        } else {
          console.error('Camera component not available or not a function');
          console.log('Camera type:', typeof ExpoCamera);
          console.log('Camera value:', ExpoCamera);
          console.log('ExpoCamera.Camera:', ExpoCamera?.Camera);
          console.log('ExpoCamera.Camera type:', typeof ExpoCamera?.Camera);
          setCameraAvailable(false);
        }
      } catch (error) {
        console.error('Error checking camera availability:', error);
        setCameraAvailable(false);
      }
    };

    // Add a small delay to ensure the component is fully mounted
    const timer = setTimeout(checkCameraAvailability, 100);
    return () => clearTimeout(timer);
  }, []);

  // Debug logging for Camera state
  useEffect(() => {
    console.log('Camera state updated:', {
      cameraAvailable,
      hasCamera: !!ExpoCamera,
      cameraType: typeof ExpoCamera,
      cameraIsFunction: typeof ExpoCamera === 'object'
    });
  }, [cameraAvailable]);

  // Show loading state while checking camera availability
  if (hasPermission === null || !cameraAvailable) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
        <View style={styles.permissionContainer}>
          <Text style={[styles.permissionText, { color: dynamicStyles.textColor }]}>
            {!cameraAvailable ? 'Camera not available' : 'Requesting camera permission...'}
          </Text>
          <Text style={[styles.permissionSubtext, { color: dynamicStyles.mutedText }]}>
            {!cameraAvailable 
              ? 'Please check your device camera settings or reinstall the app'
              : 'Please wait while we set up the camera...'
            }
          </Text>
          {!cameraAvailable && (
            <TouchableOpacity 
              style={styles.rescanButton} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.rescanText}>Go Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // If camera is not available, show fallback
  if (!ExpoCamera || !ExpoCamera.Camera) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
        <View style={styles.permissionContainer}>
          <Text style={[styles.permissionText, { color: dynamicStyles.textColor }]}>
            Camera Component Error
          </Text>
          <Text style={[styles.permissionSubtext, { color: dynamicStyles.mutedText }]}>
            The camera component could not be loaded. This might be due to a compatibility issue.
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

  // Safe access to Camera constants
  const getFlashMode = () => {
    try {
      // Use the correct Camera constants
      if (ExpoCamera && ExpoCamera.Constants && ExpoCamera.Constants.FlashMode) {
        return ExpoCamera.Constants.FlashMode;
      }
      // Fallback values if Camera constants are not available
      return {
        off: 'off',
        torch: 'torch'
      };
    } catch (error) {
      console.log('Camera constants not available, using fallback values');
      return {
        off: 'off',
        torch: 'torch'
      };
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    try {
      console.log('Raw scanned data:', data);
      
      // Try to parse as JSON first
      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch (e) {
        // If not JSON, create a simple object with the data
        parsed = { 
          medicationName: data,
          rawData: data,
          scannedAt: new Date().toISOString()
        };
      }
      
      // Validate the parsed data
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid data format');
      }
      
      // Ensure we have at least a medication name
      if (!parsed.medicationName && !parsed.rawData) {
        throw new Error('No medication information found');
      }
      
      // Add timestamp if not present
      if (!parsed.scannedAt) {
        parsed.scannedAt = new Date().toISOString();
      }
      
      console.log('Processed scanned data:', parsed);
      
      // Navigate back with the scanned data
      navigation.navigate('ReportForm', { scannedMedication: parsed });
      
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

  const toggleFlash = () => {
    const flashModes = getFlashMode();
    setFlash(
      flash === flashModes.torch
        ? flashModes.off
        : flashModes.torch
    );
  };

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
      {cameraAvailable && ExpoCamera && ExpoCamera.Camera && typeof ExpoCamera.Camera === 'function' ? (
        (() => {
          try {
            return (
              <ExpoCamera.Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFillObject}
                flashMode={flash}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                barCodeScannerSettings={{
                  barCodeTypes: [
                    'qr',
                    'code128',
                    'code39',
                    'code93',
                    'ean13',
                    'ean8',
                    'upc_a',
                    'upc_e',
                    'pdf417',
                    'aztec',
                    'datamatrix',
                    'itf14',
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
                      name={flash === 'torch' ? 'flash-on' : 'flash-off'}
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
              </ExpoCamera.Camera>
            );
          } catch (error) {
            console.error('Error rendering Camera component:', error);
            return (
              <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={[styles.permissionText, { color: dynamicStyles.textColor }]}>
                  Camera Render Error
                </Text>
                <Text style={[styles.permissionSubtext, { color: dynamicStyles.mutedText }]}>
                  There was an error rendering the camera. Please try again.
                </Text>
                <TouchableOpacity 
                  style={styles.rescanButton} 
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.rescanText}>Go Back</Text>
                </TouchableOpacity>
              </View>
            );
          }
        })()
      ) : (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={[styles.permissionText, { color: dynamicStyles.textColor }]}>
            {!cameraAvailable ? 'Camera not available' : 'Loading camera...'}
          </Text>
          <Text style={[styles.permissionSubtext, { color: dynamicStyles.mutedText }]}>
            {!cameraAvailable 
              ? 'Please check your device camera settings or reinstall the app'
              : 'Please wait while we set up the camera...'
            }
          </Text>
          {!cameraAvailable && (
            <TouchableOpacity 
              style={styles.rescanButton} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.rescanText}>Go Back</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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

