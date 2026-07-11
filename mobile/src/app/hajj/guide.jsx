import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AudioGuidePlayer } from '../../components/AudioGuidePlayer';
import ritualsData from '../../assets/data/rituals.json';

export default function HajjGuideScreen() {
  const router = useRouter();
  const [mode, setMode] = useState('umrah'); // 'umrah' or 'hajj'
  const [completed, setCompleted] = useState([]);

  const toggleComplete = (id) => {
    if (completed.includes(id)) {
      setCompleted(completed.filter(i => i !== id));
    } else {
      setCompleted([...completed, id]);
    }
  };

  const renderRitualStep = ({ item, index }) => {
    const isCompleted = completed.includes(item.id);

    return (
      <View style={styles.stepWrapper}>
        <View style={styles.timeline}>
          <View style={[styles.dot, isCompleted && styles.completedDot]} />
          {index < ritualsData[mode].length - 1 && <View style={styles.line} />}
        </View>

        <ThemedView style={styles.card} className="bg-el-light dark:bg-el-dark">
          <View style={styles.cardHeader}>
            <ThemedText style={styles.stepTitle}>{item.title}</ThemedText>
            <TouchableOpacity onPress={() => toggleComplete(item.id)}>
              <Ionicons
                name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={isCompleted ? '#34C759' : '#888'}
              />
            </TouchableOpacity>
          </View>

          <ThemedText style={styles.description}>{item.description}</ThemedText>

          <View style={styles.duaSection}>
            <ThemedText style={styles.arabic}>{item.arabic}</ThemedText>
            <ThemedText style={styles.translation}>{item.translation}</ThemedText>
            <AudioGuidePlayer url={item.audioUrl} />
          </View>
        </ThemedView>
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
          <ThemedText type="title">Pilgrimage Guide</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, mode === 'umrah' && styles.activeToggle]}
            onPress={() => setMode('umrah')}
          >
            <ThemedText style={[styles.toggleText, mode === 'umrah' && styles.activeToggleText]}>UMRAH</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, mode === 'hajj' && styles.activeToggle]}
            onPress={() => setMode('hajj')}
          >
            <ThemedText style={[styles.toggleText, mode === 'hajj' && styles.activeToggleText]}>HAJJ</ThemedText>
          </TouchableOpacity>
        </View>

        <FlatList
          data={ritualsData[mode]}
          renderItem={renderRitualStep}
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
  toggleContainer: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeToggle: {
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#888',
  },
  activeToggleText: {
    color: '#007AFF',
  },
  list: {
    padding: 20,
  },
  stepWrapper: {
    flexDirection: 'row',
  },
  timeline: {
    width: 20,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ddd',
    zIndex: 1,
  },
  completedDot: {
    backgroundColor: '#34C759',
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#eee',
    marginVertical: 4,
  },
  card: {
    flex: 1,
    marginLeft: 15,
    marginBottom: 30,
    padding: 20,
    borderRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  duaSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  arabic: {
    fontSize: 22,
    lineHeight: 35,
    textAlign: 'right',
    marginBottom: 10,
  },
  translation: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
  }
});
