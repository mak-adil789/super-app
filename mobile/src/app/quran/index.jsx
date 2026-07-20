import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import useQuranStore from '../../store/useQuranStore';

export default function QuranIndex() {
  const router = useRouter();
  const { chapters, juzList, fetchChapters, fetchJuzList, isLoading, syncUserData } = useQuranStore();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('surah'); // 'surah' or 'juz'

  useEffect(() => {
    fetchChapters();
    fetchJuzList();
  }, [fetchChapters, fetchJuzList]);

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
      onPress={() => router.push({ pathname: `/quran/${item.id}`, params: { type: 'surah' } })}
    >
      <View style={styles.surahNumber}>
        <ThemedText style={styles.numberText}>{item.id}</ThemedText>
      </View>
      <View style={styles.surahInfo}>
        <ThemedText style={styles.nameSimple}>{item.name_simple}</ThemedText>
        <ThemedText style={styles.revelationInfo}>
          {item.revelation_place.toUpperCase()} • {item.verses_count} VERSES
        </ThemedText>
      </View>
      <View style={styles.surahArabic}>
        <ThemedText style={styles.nameArabic}>{item.name_arabic}</ThemedText>
      </View>
    </TouchableOpacity>
  );

  const renderJuzItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push({ pathname: `/quran/${item.juz_number}`, params: { type: 'juz' } })}
    >
      <View style={styles.surahNumber}>
        <ThemedText style={styles.numberText}>{item.juz_number}</ThemedText>
      </View>
      <View style={styles.surahInfo}>
        <ThemedText style={styles.nameSimple}>Juz {item.juz_number}</ThemedText>
        <ThemedText style={styles.revelationInfo}>
          {Object.keys(item.verse_mapping).length} SURAHS
        </ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#007AFF" />
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

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, tab === 'surah' && styles.activeTab]}
            onPress={() => setTab('surah')}
          >
            <ThemedText style={[styles.tabText, tab === 'surah' && styles.activeTabText]}>SURAH</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, tab === 'juz' && styles.activeTab]}
            onPress={() => setTab('juz')}
          >
            <ThemedText style={[styles.tabText, tab === 'juz' && styles.activeTabText]}>PARAH</ThemedText>
          </TouchableOpacity>
        </View>

        {tab === 'surah' && (
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Surah..."
              value={search}
              onChangeText={setSearch}
            />
          </View>
        )}

        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={tab === 'surah' ? filteredChapters : juzList}
            renderItem={tab === 'surah' ? renderSurahItem : renderJuzItem}
            keyExtractor={(item) => (tab === 'surah' ? item.id.toString() : item.juz_number.toString())}
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#888',
  },
  activeTabText: {
    color: '#007AFF',
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
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 16,
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
