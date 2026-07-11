import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocation } from '../../hooks/useLocation';
import { useQiblaCompass } from '../../hooks/useQiblaCompass';

const { width } = Dimensions.get('window');

export default function QiblaScreen() {
  const router = useRouter();
  const { location } = useLocation();
  const { heading, qiblaDirection } = useQiblaCompass(
    location?.coords?.latitude,
    location?.coords?.longitude
  );

  const rotation = useSharedValue(0);

  const isAligned = useMemo(() => {
    const diff = Math.abs(heading - qiblaDirection);
    return diff < 5 || diff > 355;
  }, [heading, qiblaDirection]);

  useEffect(() => {
    rotation.value = withSpring(360 - heading, { damping: 15 });
  }, [heading, rotation]);

  useEffect(() => {
    if (isAligned) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  }, [isAligned]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${qiblaDirection}deg` }],
  }));

  return (
    <ThemedView className="flex-1 bg-bg-light dark:bg-bg-dark" style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="gray" />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>Qibla Finder</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.compassContainer}>
        <Animated.View style={[styles.compassBody, animatedStyle]}>
          {[0, 90, 180, 270].map((deg) => (
            <View key={deg} style={[styles.marker, { transform: [{ rotate: `${deg}deg` }] }]}>
              <ThemedText style={styles.markerText}>
                {deg === 0 ? 'N' : deg === 90 ? 'E' : deg === 180 ? 'S' : 'W'}
              </ThemedText>
            </View>
          ))}

          <Animated.View style={[styles.arrowContainer, arrowStyle]}>
            <Ionicons name="navigate" size={width * 0.4} color={isAligned ? '#4CAF50' : '#FF5722'} />
          </Animated.View>
        </Animated.View>
      </View>

      <View style={styles.infoContainer}>
        <ThemedText style={[styles.alignmentText, { color: isAligned ? '#4CAF50' : '#888' }]}>
          {isAligned ? 'You are facing the Qibla' : 'Rotate your phone'}
        </ThemedText>
        <ThemedText style={styles.degreeText}>
          {Math.round(qiblaDirection)}° from North
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  compassContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassBody: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  marker: {
    position: 'absolute',
    top: 10,
    alignItems: 'center',
    height: width * 0.8 - 20,
  },
  markerText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  arrowContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 40,
    alignItems: 'center',
  },
  alignmentText: {
    fontSize: 18,
    fontWeight: '600',
  },
  degreeText: {
    fontSize: 14,
    marginTop: 5,
    color: '#888',
  },
});
