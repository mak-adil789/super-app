import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useLocation } from '../hooks/useLocation';
import usePrayerStore from '../store/usePrayerStore';
import { fetchDailyHadith } from '../services/hadithApi';
import { RamadanDashboard } from '../components/RamadanDashboard';
import dayjs from 'dayjs';

export default function HomeScreen() {
  const router = useRouter();
  const { location, errorMsg: locError, loading: locLoading } = useLocation();
  const { prayerTimes, nextPrayer, updatePrayerTimes, isLoading, error: prayerError } = usePrayerStore();

  const [hadith, setHadith] = useState(null);
  const [hadithLoading, setHadithLoading] = useState(true);

  useEffect(() => {
    if (location) {
      updatePrayerTimes(location.coords.latitude, location.coords.longitude);
    }
  }, [location, updatePrayerTimes]);

  useEffect(() => {
    const loadHadith = async () => {
      const data = await fetchDailyHadith();
      setHadith(data);
      setHadithLoading(false);
    };
    loadHadith();
  }, []);

  const renderPrayerRow = (name, time) => (
    <View key={name} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
      <ThemedText className="text-txt-light dark:text-txt-dark">{name}</ThemedText>
      <ThemedText className="text-txt-light dark:text-txt-dark font-bold">{time}</ThemedText>
    </View>
  );

  return (
    <ThemedView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <SafeAreaView
        className="flex-1 px-6 gap-4"
        style={{ paddingBottom: BottomTabInset + Spacing.three }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <ThemedView className="py-4 items-center">
            <RamadanDashboard />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <ThemedText type="title" className="text-txt-light dark:text-txt-dark">
                Prayer Times
              </ThemedText>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity onPress={() => router.push('/prayer/qibla')} className="bg-el-light dark:bg-el-dark p-2 rounded-full">
                  <Ionicons name="compass-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/ai/ocr-scanner')} className="bg-el-light dark:bg-el-dark p-2 rounded-full">
                  <Ionicons name="camera-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>

            {nextPrayer && (
              <View className="mt-4 items-center bg-el-light dark:bg-el-dark p-6 rounded-2xl w-full">
                <ThemedText className="text-txt-sec-light dark:text-txt-sec-dark uppercase text-xs font-bold">
                  Next Prayer: {nextPrayer.name}
                </ThemedText>
                <ThemedText className="text-3xl font-bold mt-2 text-txt-light dark:text-txt-dark">
                  {nextPrayer.time.format('HH:mm')}
                </ThemedText>
                <ThemedText className="text-xs text-txt-sec-light dark:text-txt-sec-dark mt-1">
                  {dayjs(nextPrayer.time).fromNow()}
                </ThemedText>
              </View>
            )}

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 12, width: '100%' }}>
              <TouchableOpacity
                onPress={() => router.push('/quran')}
                style={{ flex: 1, backgroundColor: '#007AFF', padding: 20, borderRadius: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 }}
              >
                <Ionicons name="book" size={24} color="white" />
                <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>Quran</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/duas')}
                style={{ flex: 1, backgroundColor: '#34C759', padding: 20, borderRadius: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 }}
              >
                <Ionicons name="heart" size={24} color="white" />
                <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>Duas</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 12, width: '100%' }}>
              <TouchableOpacity
                onPress={() => router.push('/tasbeeh')}
                style={{ flex: 1, backgroundColor: '#FF9500', padding: 20, borderRadius: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 }}
              >
                <Ionicons name="finger-print" size={24} color="white" />
                <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>Tasbeeh</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/ai/chat')}
                style={{ flex: 1, backgroundColor: '#5856D6', padding: 20, borderRadius: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 }}
              >
                <Ionicons name="sparkles" size={24} color="white" />
                <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>AI Bot</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 12, width: '100%' }}>
              <TouchableOpacity
                onPress={() => router.push('/zakat/calculator')}
                style={{ flex: 1, backgroundColor: '#AF52DE', padding: 20, borderRadius: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 }}
              >
                <Ionicons name="calculator" size={24} color="white" />
                <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>Zakat</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/profile/family')}
                style={{ flex: 1, backgroundColor: '#FF2D55', padding: 20, borderRadius: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 }}
              >
                <Ionicons name="people" size={24} color="white" />
                <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>Family</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={{ width: '100%', marginTop: 12 }}>
              <TouchableOpacity
                onPress={() => router.push('/hajj/guide')}
                style={{ flex: 1, backgroundColor: '#FFCC00', padding: 20, borderRadius: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 }}
              >
                <Ionicons name="map" size={24} color="white" />
                <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>Hajj & Umrah Guide</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={{ width: '100%', marginTop: 12 }}>
              <TouchableOpacity
                onPress={() => router.push('/mosque/locator')}
                style={{ flex: 1, backgroundColor: '#8E8E93', padding: 15, borderRadius: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 }}
              >
                <Ionicons name="location" size={20} color="white" />
                <ThemedText style={{ color: 'white', fontSize: 12 }}>Find Nearby Mosques</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>

          <ThemedView className="mt-2 p-6 rounded-3xl bg-el-light dark:bg-el-dark">
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 }}>
              <Ionicons name="chatbox-ellipses" size={20} color="#007AFF" />
              <ThemedText type="subtitle">Hadith of the Day</ThemedText>
            </View>

            {hadithLoading ? (
              <ActivityIndicator color="#007AFF" />
            ) : hadith ? (
              <View>
                <ThemedText style={styles.hadithArabic}>{hadith.arabic}</ThemedText>
                <ThemedText style={styles.hadithText}>"{hadith.text}"</ThemedText>
                <ThemedText style={styles.hadithSource}>— {hadith.narrator}, {hadith.book}</ThemedText>
              </View>
            ) : (
              <ThemedText>Could not load Hadith</ThemedText>
            )}
          </ThemedView>

          {(locLoading || isLoading) && <ActivityIndicator size="large" color="#007AFF" />}

          {locError && <ThemedText className="text-red-500 text-center">{locError}</ThemedText>}
          {prayerError && <ThemedText className="text-orange-500 text-center italic">{prayerError}</ThemedText>}

          <ThemedView className="mt-4 p-4 rounded-2xl bg-el-light dark:bg-el-dark">
            {prayerTimes ? (
              Object.entries(prayerTimes).map(([name, time]) => renderPrayerRow(name, time))
            ) : (
              !isLoading && <ThemedText className="text-center">No prayer times available</ThemedText>
            )}
          </ThemedView>

          <ThemedView className="mt-6 p-4 rounded-2xl bg-el-light dark:bg-el-dark">
            <ThemedText className="text-xs text-center text-txt-sec-light dark:text-txt-sec-dark">
              {location ? `Location: ${location.coords.latitude.toFixed(2)}, ${location.coords.longitude.toFixed(2)}` : 'Detecting location...'}
            </ThemedText>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  hadithArabic: {
    fontSize: 20,
    textAlign: 'right',
    marginBottom: 10,
    lineHeight: 32,
    color: '#007AFF',
  },
  hadithText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    fontStyle: 'italic',
  },
  hadithSource: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    textAlign: 'right',
  }
});
