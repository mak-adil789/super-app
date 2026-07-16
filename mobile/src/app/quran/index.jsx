import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import useQuranStore from '../../store/useQuranStore';
import useAuthStore from '../../store/useAuthStore';

export default function QuranIndex() {
  const router = useRouter();
  const { chapters, fetchChapters, isLoading, syncUserData } = useQuranStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  useEffect(() => {
    syncUserData();
  }, [syncUserData]);

  const filteredChapters = chapters.filter(c =>
    c.name_simple.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toString() === search
  );

  const renderSurahItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push(`/quran/${item.id}`)}
    >
      <View style={styles.surahNumber}>
        <ThemedText style={styles.numberText}>{item.id}</ThemedText>
      </View>
      <View style={styles.surahInfo}>
        <ThemedText type="subtitle" style={styles.nameSimple}>{item.name_simple}</ThemedText>
        <ThemedText style={styles.revelationInfo}>
          {item.revelation_place.toUpperCase()} • {item.verses_count} VERSES
        </ThemedText>
      </View>
      <View style={styles.surahArabic}>
        <ThemedText style={styles.nameArabic}>{item.name_arabic}</ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="gray" />
          </TouchableOpacity>
          <ThemedText type="title">Al-Quran</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Surah..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={filteredChapters}
            renderItem={renderSurahItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  surahNumber: {
    width: 35,
    height: 35,
    borderRadius: 8,
    backgroundColor: 'rgba(0,122,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  numberText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  surahInfo: {
    flex: 1,
  },
  nameSimple: {
    fontWeight: 'bold',
  },
  revelationInfo: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  surahArabic: {
    alignItems: 'flex-end',
  },
  nameArabic: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});
