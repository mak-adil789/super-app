import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as aiApi from '../../services/aiApi';
import { savePrayerTimes } from '../../utils/sqliteDb';
import useAuthStore from '../../store/useAuthStore';

export default function OCRScanner() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [preview, setPreview] = useState(null);
  const cameraRef = useRef(null);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <ThemedView className="flex-1 justify-center items-center p-10">
        <ThemedText style={{ textAlign: 'center', marginBottom: 20 }}>
          We need your permission to show the camera
        </ThemedText>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <ThemedText style={styles.buttonText}>GRANT PERMISSION</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || scanning) return;

    try {
      setScanning(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: true,
      });

      setPreview(photo.uri);

      const extractedData = await aiApi.uploadTimetableImage(token, photo.base64);

      if (extractedData && extractedData.length > 0) {
        const monthGroups = {};
        extractedData.forEach(item => {
          const parts = item.date.split('-');
          if (parts.length === 3) {
            const [, month, year] = parts;
            const key = `${year}-${month}`;
            if (!monthGroups[key]) monthGroups[key] = [];

            monthGroups[key].push({
              date: { gregorian: { date: item.date } },
              timings: item.timings
            });
          }
        });

        Object.entries(monthGroups).forEach(([monthKey, data]) => {
          savePrayerTimes(monthKey, data);
        });

        Alert.alert('Success', `Extracted ${extractedData.length} prayer days and saved to offline storage.`, [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        throw new Error('No data found in image');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      Alert.alert('Scanning Failed', 'Could not parse the timetable. Please try a clearer photo.');
      setPreview(null);
    } finally {
      setScanning(false);
    }
  };

  return (
    <ThemedView className="flex-1 bg-black">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Scan Timetable</ThemedText>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.cameraContainer}>
          {preview ? (
            <Image source={{ uri: preview }} style={styles.camera} />
          ) : (
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="back"
            />
          )}

          <View style={styles.overlay}>
            <View style={styles.guideFrame} />
            <ThemedText style={styles.guideText}>
              Align the timetable within the frame
            </ThemedText>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.captureButton, scanning && styles.disabledButton]}
            onPress={handleCapture}
            disabled={scanning}
          >
            {scanning ? (
              <ActivityIndicator color="white" />
            ) : (
              <View style={styles.innerCircle} />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 20,
    marginHorizontal: 10,
    backgroundColor: '#111',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideFrame: {
    width: '80%',
    height: '60%',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    borderStyle: 'dashed',
  },
  guideText: {
    color: 'white',
    marginTop: 20,
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  footer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  }
});
