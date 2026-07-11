import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export const DuaCategoryCard = ({ title, icon, count, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <ThemedView style={styles.card} className="bg-el-light dark:bg-el-dark">
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={28} color="#007AFF" />
        </View>
        <View style={styles.content}>
          <ThemedText type="subtitle" style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.count}>{count} Supplications</ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#888" />
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(0,122,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});
