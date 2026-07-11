import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import duaData from '../../assets/data/duas.json';

export default function DuaCategoryView() {
  const { category } = useLocalSearchParams();
  const router = useRouter();

  const categoryData = duaData.find((cat) => cat.id === category);

  if (!categoryData) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText>Category not found</ThemedText>
      </ThemedView>
    );
  }

  const renderDuaItem = ({ item }) => (
    <View style={styles.duaCard} className="bg-el-light dark:bg-el-dark">
      <ThemedText style={styles.arabicText}>{item.arabic}</ThemedText>
      <ThemedText style={styles.transliterationText}>{item.transliteration}</ThemedText>
      <View style={styles.divider} />
      <ThemedText style={styles.translationText}>{item.translation}</ThemedText>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="copy-outline" size={20} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ThemedView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="gray" />
          </TouchableOpacity>
          <ThemedText type="title">{categoryData.title}</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <FlatList
          data={categoryData.duas}
          renderItem={renderDuaItem}
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  list: {
    padding: 20,
  },
  duaCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  arabicText: {
    fontSize: 24,
    lineHeight: 40,
    textAlign: 'right',
    marginBottom: 15,
  },
  transliterationText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 10,
  },
  translationText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    gap: 15,
  },
  actionButton: {
    padding: 5,
  }
});
