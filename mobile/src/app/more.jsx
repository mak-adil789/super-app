import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';

const MENU_ITEMS = [
  { id: 'quran', title: 'Quran', icon: 'book', color: '#007AFF', route: '/quran' },
  { id: 'duas', title: 'Duas', icon: 'heart', color: '#34C759', route: '/duas' },
  { id: 'hajj', title: 'Hajj Guide', icon: 'map', color: '#FFCC00', route: '/hajj/guide' },
  { id: 'zakat', title: 'Zakat', icon: 'calculator', color: '#AF52DE', route: '/zakat/calculator' },
  { id: 'mosque', title: 'Mosques', icon: 'location', color: '#8E8E93', route: '/mosque/locator' },
  { id: 'qibla', title: 'Qibla', icon: 'compass', color: '#FF3B30', route: '/prayer/qibla' },
  { id: 'ramadan', title: 'Ramadan', icon: 'moon', color: '#FF9500', route: '/ramadan' },
  { id: 'family', title: 'Family', icon: 'people', color: '#FF2D55', route: '/profile/family' },
  { id: 'scanner', title: 'Scanner', icon: 'camera', color: '#5AC8FA', route: '/ai/ocr-scanner' },
  { id: 'login', title: 'Account', icon: 'person-circle', color: '#5856D6', route: '/auth/login' },
];

export default function MoreScreen() {
  const router = useRouter();

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, { backgroundColor: item.color + '15' }]}
      onPress={() => router.push(item.route)}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={24} color="white" />
      </View>
      <ThemedText style={styles.menuLabel}>{item.title}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="title">More Features</ThemedText>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {MENU_ITEMS.map(renderMenuItem)}
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
  safeArea: {
    flex: 1,
    paddingBottom: BottomTabInset,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  menuItem: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.6%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  menuLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
