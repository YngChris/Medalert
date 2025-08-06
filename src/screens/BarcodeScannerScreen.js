import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
console.log(Camera); // Should show an object with "Constants"
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BarcodeScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    try {
      const parsed = JSON.parse(data); // Expecting JSON string
      navigation.navigate('ReportForm', { scannedMedication: parsed });
    } catch (e) {
      Alert.alert('Invalid QR/Barcode', 'Make sure it contains valid medication data.');
      setScanned(false); // allow rescan
    }
  };

  const toggleFlash = () => {
    setFlash(
      flash === Camera.Constants.FlashMode.torch
        ? Camera.Constants.FlashMode.off
        : Camera.Constants.FlashMode.torch
    );
  };

  if (hasPermission === null) return <Text>Requesting camera permission...</Text>;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      <Camera
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
          {/* Flashlight Toggle */}
          <TouchableOpacity style={styles.flashToggle} onPress={toggleFlash}>
            <MaterialIcons
              name={flash === Camera.Constants.FlashMode.torch ? 'flash-on' : 'flash-off'}
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
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#00FF00',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  flashToggle: {
    position: 'absolute',
    top: 60,
    right: 30,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    borderRadius: 30,
  },
  rescanButton: {
    position: 'absolute',
    bottom: 60,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  rescanText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

