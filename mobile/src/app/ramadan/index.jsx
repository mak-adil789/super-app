import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import dayjs from 'dayjs';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import useRamadanStore from '../../store/useRamadanStore';
import usePrayerStore from '../../store/usePrayerStore';

export default function RamadanScreen() {
  const router = useRouter();
  const { checklists, updateChecklist, togglePrayer, toggleForceMode, forceRamadanMode } = useRamadanStore();
  const { prayerTimes } = usePrayerStore();

  const today = dayjs().format('YYYY-MM-DD');
  const data = checklists[today] || {
    taraweeh: false,
    charity: false,
    quran: 0,
    prayers: [false, false, false, false, false]
  };

  const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  const renderPrayerItem = (name, index) => (
    <TouchableOpacity
      key={name}
      style={styles.checklistRow}
      onPress={() => togglePrayer(index)}
    >
      <ThemedText>{name}</ThemedText>
      <Ionicons
        name={data.prayers[index] ? 'checkbox' : 'square-outline'}
        size={24}
        color={data.prayers[index] ? '#34C759' : '#888'}
      />
    </TouchableOpacity>
  );

  return (
    <ThemedView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="gray" />
          </TouchableOpacity>
          <ThemedText type="title">Ramadan Planner</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.infoCard} className="bg-el-light dark:bg-el-dark">
            <View style={styles.infoRow}>
              <View>
                <ThemedText style={styles.infoLabel}>SEHRI ENDS</ThemedText>
                <ThemedText style={styles.infoValue}>{prayerTimes?.Fajr || '--:--'}</ThemedText>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <ThemedText style={styles.infoLabel}>IFTAR STARTS</ThemedText>
                <ThemedText style={styles.infoValue}>{prayerTimes?.Maghrib || '--:--'}</ThemedText>
              </View>
            </View>
          </View>

          <ThemedText style={styles.sectionTitle}>Daily Prayers</ThemedText>
          <View style={styles.card} className="bg-el-light dark:bg-el-dark">
            {prayerNames.map((name, index) => renderPrayerItem(name, index))}
            <TouchableOpacity
              style={styles.checklistRow}
              onPress={() => updateChecklist('taraweeh', !data.taraweeh)}
            >
              <ThemedText style={{ fontWeight: 'bold', color: '#007AFF' }}>Taraweeh</ThemedText>
              <Ionicons
                name={data.taraweeh ? 'checkbox' : 'square-outline'}
                size={24}
                color={data.taraweeh ? '#007AFF' : '#888'}
              />
            </TouchableOpacity>
          </View>

          <ThemedText style={styles.sectionTitle}>Spiritual Goals</ThemedText>
          <View style={styles.card} className="bg-el-light dark:bg-el-dark">
            <TouchableOpacity
              style={styles.checklistRow}
              onPress={() => updateChecklist('charity', !data.charity)}
            >
              <ThemedText>Daily Sadaqah (Charity)</ThemedText>
              <Ionicons
                name={data.charity ? 'checkbox' : 'square-outline'}
                size={24}
                color={data.charity ? '#AF52DE' : '#888'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.debugCard} className="bg-el-light dark:bg-el-dark">
            <ThemedText style={{ fontSize: 12, color: '#888' }}>DEBUG: Force Ramadan Mode</ThemedText>
            <Switch value={forceRamadanMode} onValueChange={toggleForceMode} />
          </View>
        </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  infoCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#888',
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    borderRadius: 20,
    padding: 10,
    marginBottom: 25,
  },
  checklistRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  debugCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    opacity: 0.5,
  }
});
