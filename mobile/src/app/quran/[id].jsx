import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as quranApi from '../../services/quranApi';
import useQuranStore from '../../store/useQuranStore';

export default function QuranReader() {
  const { id, type } = useLocalSearchParams();
  const router = useRouter();
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const {
    chapters,
    juzList,
    bookmarks,
    toggleBookmark,
    updateProgress,
    fontSize,
    setFontSize,
    translationId,
    setTranslation
  } = useQuranStore();

  const title = type === 'surah'
    ? chapters.find(c => c.id.toString() === id)?.name_simple || 'Surah'
    : `Juz ${id}`;

  const loadVerses = useCallback(async (pageNum) => {
    try {
      const data = type === 'surah'
        ? await quranApi.fetchVerses(id, pageNum, translationId)
        : await quranApi.fetchVersesByJuz(id, pageNum, translationId);

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
  }, [id, type, translationId]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setVerses([]);
      setPage(1);
      setHasMore(true);
      await loadVerses(1);
    })();
  }, [loadVerses, translationId]);

  const renderVerseItem = ({ item }) => {
    const isBookmarked = bookmarks.some(b => b.surahId === parseInt(id) && b.verseId === item.verse_number);

    return (
      <View style={styles.verseContainer}>
        {/* Arabic Block - Classic Light Green */}
        <View style={styles.arabicBlock}>
          <View style={styles.verseHeader}>
            <View style={styles.verseBadge}>
              <ThemedText style={styles.verseNumber}>{item.verse_key}</ThemedText>
            </View>
            <TouchableOpacity onPress={() => toggleBookmark(parseInt(id), item.verse_number)}>
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color="#2E7D32"
              />
            </TouchableOpacity>
          </View>
          <ThemedText style={[styles.arabicText, { fontSize: fontSize * 1.2 }]}>
            {item.text_uthmani}
          </ThemedText>
        </View>

        {/* Translation Block - Clean White */}
        <View style={styles.translationBlock}>
          <ThemedText style={[styles.translationText, { fontSize }]}>
            {item.translations?.[0]?.text?.replace(/ <sup>.*?<\/sup>/g, '') || 'Translation not available'}
          </ThemedText>
        </View>
      </View>
    );
  };

  return (
    <ThemedView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="gray" />
          </TouchableOpacity>
          <ThemedText type="subtitle" style={styles.headerTitle}>{title}</ThemedText>
          <TouchableOpacity onPress={() => setSettingsVisible(true)}>
            <Ionicons name="settings-outline" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        {loading && page === 1 ? (
          <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 50 }} />
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
            ListFooterComponent={hasMore ? <ActivityIndicator color="#2E7D32" style={{ padding: 20 }} /> : null}
          />
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={settingsVisible}
          onRequestClose={() => setSettingsVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>Reader Settings</ThemedText>
                <TouchableOpacity onPress={() => setSettingsVisible(false)}>
                  <Ionicons name="close" size={24} color="gray" />
                </TouchableOpacity>
              </View>

              <ScrollView>
                <ThemedText style={styles.sectionTitle}>Font Size ({fontSize}px)</ThemedText>
                <View style={styles.fontSizeRow}>
                  <TouchableOpacity style={styles.sizeBtn} onPress={() => setFontSize(Math.max(16, fontSize - 2))}>
                    <Ionicons name="remove-circle-outline" size={30} color="#2E7D32" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sizeBtn} onPress={() => setFontSize(Math.min(48, fontSize + 2))}>
                    <Ionicons name="add-circle-outline" size={30} color="#2E7D32" />
                  </TouchableOpacity>
                </View>

                <ThemedText style={styles.sectionTitle}>Translation Language</ThemedText>
                <View style={styles.langList}>
                  {Object.entries(quranApi.TRANSLATIONS).map(([key, value]) => (
                    <TouchableOpacity
                      key={key}
                      style={[styles.langBtn, translationId === value && styles.activeLang]}
                      onPress={() => {
                        setTranslation(value);
                        setSettingsVisible(false);
                      }}
                    >
                      <ThemedText style={[styles.langText, translationId === value && styles.activeLangText]}>
                        {key.toUpperCase()}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
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
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    backgroundColor: '#F5F5F5',
  },
  verseContainer: {
    marginBottom: 8,
  },
  arabicBlock: {
    backgroundColor: '#F0FFF0', // Light green
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  translationBlock: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  verseBadge: {
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verseNumber: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '600',
  },
  arabicText: {
    textAlign: 'right',
    lineHeight: 55,
    color: '#1B5E20',
    fontFamily: 'System',
  },
  translationText: {
    lineHeight: 30,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    marginTop: 10,
    fontWeight: 'bold',
  },
  fontSizeRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  langList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  langBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  activeLang: {
    backgroundColor: '#2E7D32',
    borderColor: '#1B5E20',
  },
  langText: {
    fontWeight: '600',
    color: '#666',
  },
  activeLangText: {
    color: 'white',
  },
});
