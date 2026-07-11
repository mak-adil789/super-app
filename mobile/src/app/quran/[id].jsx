import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as quranApi from '../../services/quranApi';
import useQuranStore from '../../store/useQuranStore';
import useAuthStore from '../../store/useAuthStore';

export default function SurahReader() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { chapters, bookmarks, toggleBookmark, updateProgress } = useQuranStore();
  const { token } = useAuthStore();

  const surah = chapters.find(c => c.id.toString() === id);

  const loadVerses = useCallback(async (pageNum) => {
    try {
      const data = await quranApi.fetchVerses(id, pageNum);
      if (data.verses.length === 0) {
        setHasMore(false);
      } else {
        setVerses(prev => (pageNum === 1 ? data.verses : [...prev, ...data.verses]));
      }
    } catch (error) {
      console.error('Error loading verses:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // Using a timeout to move setState out of the synchronous render/effect cycle
    const timer = setTimeout(() => {
      loadVerses(1);
    }, 0);
    return () => clearTimeout(timer);
  }, [loadVerses]);

  const handleScroll = (event) => {
    if (!surah) return;
    const scrollY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const viewHeight = event.nativeEvent.layoutMeasurement.height;

    // Approximate percentage
    const percentage = (scrollY / (contentHeight - viewHeight)) * 100;
    const verseIndex = Math.floor((percentage / 100) * surah.verses_count) + 1;

    if (verseIndex > 0 && verseIndex <= surah.verses_count) {
      updateProgress(token, parseInt(id), verseIndex, surah.verses_count);
    }
  };

  const renderVerseItem = ({ item }) => {
    const isBookmarked = bookmarks.some(b => b.surahId === parseInt(id) && b.verseId === item.verse_number);

    return (
      <View style={styles.verseItem}>
        <View style={styles.verseHeader}>
          <View style={styles.verseBadge}>
            <ThemedText style={styles.verseNumber}>{id}:{item.verse_number}</ThemedText>
          </View>
          <TouchableOpacity onPress={() => toggleBookmark(token, parseInt(id), item.verse_number)}>
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isBookmarked ? '#007AFF' : '#888'}
            />
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.arabicText}>
          {item.text_uthmani}
        </ThemedText>

        <ThemedText style={styles.translationText}>
          {item.translations[0].text.replace(/ <sup>.*?<\/sup>/g, '')}
        </ThemedText>
      </View>
    );
  };

  return (
    <ThemedView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="gray" />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <ThemedText type="subtitle">{surah?.name_simple}</ThemedText>
            <ThemedText style={styles.headerArabic}>{surah?.name_arabic}</ThemedText>
          </View>
          <View style={{ width: 24 }} />
        </View>

        {loading && page === 1 ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={verses}
            renderItem={renderVerseItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            onEndReached={() => {
              if (hasMore && !loading) {
                const nextPage = page + 1;
                setPage(nextPage);
                loadVerses(nextPage);
              }
            }}
            onEndReachedThreshold={0.5}
            onMomentumScrollEnd={handleScroll}
            ListFooterComponent={hasMore ? <ActivityIndicator color="#007AFF" style={{ padding: 20 }} /> : null}
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerArabic: {
    fontSize: 12,
    color: '#007AFF',
  },
  list: {
    padding: 20,
  },
  verseItem: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  verseBadge: {
    backgroundColor: 'rgba(0,122,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verseNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  arabicText: {
    fontSize: 28,
    lineHeight: 50,
    textAlign: 'right',
    fontFamily: 'System', // In a real app, use a specific Uthmani font
    marginBottom: 15,
    color: '#000',
  },
  translationText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
});
