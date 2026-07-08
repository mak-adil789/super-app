import React, { useState } from 'react';
import { View, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DuaCategoryCard } from '../../components/DuaCategoryCard';
import duaData from '../../assets/data/duas.json';

export default function DuaLibrary() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredCategories = duaData.filter(cat =>
    cat.title.toLowerCase().includes(search.toLowerCase()) ||
    cat.duas.some(d => d.translation.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <ThemedView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="gray" />
          </TouchableOpacity>
          <ThemedText type="title">Dua Library</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Duas..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <FlatList
          data={filteredCategories}
          renderItem={({ item }) => (
            <DuaCategoryCard
              title={item.title}
              icon={item.icon}
              count={item.duas.length}
              onPress={() => router.push(`/duas/${item.id}`)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
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
    paddingBottom: 20,
  },
});
