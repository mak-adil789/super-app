import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocation } from '../../hooks/useLocation';
import { fetchNearbyMosques } from '../../services/mosqueApi';
import useAuthStore from '../../store/useAuthStore';

export default function MosqueLocator() {
  const router = useRouter();
  const { token } = useAuthStore();
  const { location, loading: locLoading } = useLocation();
  const [mosques, setMosques] = useState([]);
  const [selectedMosque, setSelectedMosque] = useState(null);
  const [loading, setLoading] = useState(false);

  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const loadMosques = useCallback(async () => {
    if (!location || !token) return;
    setLoading(true);
    try {
      const data = await fetchNearbyMosques(
        token,
        location.coords.latitude,
        location.coords.longitude
      );
      setMosques(data);
    } catch (error) {
      console.error('Failed to load mosques:', error);
    } finally {
      setLoading(false);
    }
  }, [location, token]);

  useEffect(() => {
    // Wrap in a microtask/timer to avoid synchronous render warning
    const timer = setTimeout(() => {
      loadMosques();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadMosques]);

  const onMarkerPress = (mosque) => {
    setSelectedMosque(mosque);
    bottomSheetRef.current?.snapToIndex(0);
  };

  if (locLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={{ marginTop: 10 }}>Detecting Location...</ThemedText>
      </View>
    );
  }

  return (
    <ThemedView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: location?.coords?.latitude || 0,
            longitude: location?.coords?.longitude || 0,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {mosques.map((mosque) => (
            <Marker
              key={mosque.place_id}
              coordinate={{
                latitude: mosque.geometry.location.lat,
                longitude: mosque.geometry.location.lng,
              }}
              title={mosque.name}
              onPress={() => onMarkerPress(mosque)}
            >
              <View style={styles.markerContainer}>
                <Ionicons name="location" size={32} color="#007AFF" />
              </View>
            </Marker>
          ))}
        </MapView>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {loading && (
          <View style={styles.mapLoading}>
            <ActivityIndicator color="#007AFF" />
          </View>
        )}

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backgroundColor="white"
        >
          <BottomSheetView style={styles.sheetContent}>
            {selectedMosque ? (
              <View>
                <ThemedText type="title" style={styles.mosqueName}>
                  {selectedMosque.name}
                </ThemedText>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <ThemedText style={styles.ratingText}>
                    {selectedMosque.rating || 'N/A'} • Mosque
                  </ThemedText>
                </View>
                <ThemedText style={styles.addressText}>
                  {selectedMosque.vicinity}
                </ThemedText>

                <TouchableOpacity style={styles.directionsButton}>
                  <ThemedText style={styles.directionsText}>GET DIRECTIONS</ThemedText>
                </TouchableOpacity>
              </View>
            ) : (
              <ThemedText>Select a mosque to see details</ThemedText>
            )}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  mapLoading: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    elevation: 3,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetContent: {
    padding: 20,
  },
  mosqueName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  ratingText: {
    color: '#666',
  },
  addressText: {
    marginTop: 12,
    color: '#444',
    lineHeight: 20,
  },
  directionsButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  directionsText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
