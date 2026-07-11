import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import useRamadanStore from '../store/useRamadanStore';
import usePrayerStore from '../store/usePrayerStore';

export const RamadanDashboard = () => {
  const router = useRouter();
  const { isRamadanMode, checkRamadanStatus, checklists } = useRamadanStore();
  const { prayerTimes } = usePrayerStore();

  useEffect(() => {
    checkRamadanStatus();
  }, [checkRamadanStatus]);

  if (!isRamadanMode) {
    return null;
  }

  const today = dayjs().format('YYYY-MM-DD');
  const todayChecklist = checklists[today] || {
    taraweeh: false,
    charity: false,
    quran: 0,
    prayers: [false, false, false, false, false]
  };

  const completedPrayers = todayChecklist.prayers.filter((p) => p).length;
  const progressPercent = Math.round(((completedPrayers + (todayChecklist.taraweeh ? 1 : 0)) / 6) * 100);

  return (
    <TouchableOpacity onPress={() => router.push('/ramadan')} activeOpacity={0.9}>
      <ThemedView style={styles.card}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>RAMADAN MODE ACTIVE</ThemedText>
          </View>
          <Ionicons name="moon" size={20} color="white" />
        </View>

        <View style={styles.content}>
          <View style={styles.timeSection}>
            <View style={styles.timeBox}>
              <ThemedText style={styles.label}>SEHRI ENDS</ThemedText>
              <ThemedText style={styles.time}>{prayerTimes?.Fajr || '--:--'}</ThemedText>
            </View>
            <View style={styles.divider} />
            <View style={styles.timeBox}>
              <ThemedText style={styles.label}>IFTAR STARTS</ThemedText>
              <ThemedText style={styles.time}>{prayerTimes?.Maghrib || '--:--'}</ThemedText>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <ThemedText style={styles.progressLabel}>Daily Prayer Progress</ThemedText>
              <ThemedText style={styles.progressValue}>{progressPercent}%</ThemedText>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  content: {
    gap: 20,
  },
  timeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeBox: {
    flex: 1,
  },
  label: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: 'bold',
  },
  time: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 20,
  },
  progressContainer: {
    width: '100%',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  progressValue: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
  },
});
