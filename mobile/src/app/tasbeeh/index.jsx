import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withSequence } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import useTasbeehStore from '../../store/useTasbeehStore';

const { width } = Dimensions.get('window');

export default function TasbeehScreen() {
  const router = useRouter();
  const { count, dailyTotal, goal, increment, resetSession, setGoal, checkDateChange } = useTasbeehStore();

  const scale = useSharedValue(1);

  useEffect(() => {
    checkDateChange();
  }, [checkDateChange]);

  const handleIncrement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(withSpring(0.95), withSpring(1));
    increment();
  };

  const handleReset = () => {
    Alert.alert('Reset Counter', 'Are you sure you want to reset the current session?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: resetSession },
    ]);
  };

  const handleEditGoal = () => {
    Alert.prompt('Set Daily Goal', 'Enter your daily tasbeeh goal', (text) => {
      const newGoal = parseInt(text);
      if (!isNaN(newGoal) && newGoal > 0) {
        setGoal(newGoal);
      }
    }, 'plain-text', goal.toString());
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const progress = Math.min(dailyTotal / goal, 1);

  return (
    <ThemedView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="gray" />
          </TouchableOpacity>
          <ThemedText type="title">Tasbeeh</ThemedText>
          <TouchableOpacity onPress={handleEditGoal}>
            <Ionicons name="settings-outline" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <ThemedText style={styles.statLabel}>DAILY TOTAL</ThemedText>
              <ThemedText style={styles.statValue}>{dailyTotal}</ThemedText>
            </View>
            <View style={styles.statBox}>
              <ThemedText style={styles.statLabel}>GOAL</ThemedText>
              <ThemedText style={styles.statValue}>{goal}</ThemedText>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
            <ThemedText style={styles.progressText}>
              {Math.round(progress * 100)}% of daily goal
            </ThemedText>
          </View>

          <View style={styles.counterContainer}>
            <Animated.View style={[styles.counterWrapper, animatedStyle]}>
              <TouchableOpacity
                style={styles.counterButton}
                activeOpacity={1}
                onPress={handleIncrement}
              >
                <ThemedText style={styles.countText}>{count}</ThemedText>
                <ThemedText style={styles.tapPrompt}>TAP TO COUNT</ThemedText>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Ionicons name="refresh-outline" size={20} color="#FF3B30" />
            <ThemedText style={styles.resetText}>RESET SESSION</ThemedText>
          </TouchableOpacity>
        </View>
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
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#888',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
    lineHeight: 30,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
  },
  progressBar: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34C759',
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  counterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterWrapper: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  counterButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: (width * 0.7) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#FFF',
    lineHeight: 90,
  },
  tapPrompt: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 10,
    letterSpacing: 2,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 8,
  },
  resetText: {
    color: '#FF3B30',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
