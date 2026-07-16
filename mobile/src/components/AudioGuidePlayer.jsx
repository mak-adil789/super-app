import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';

let Audio;
try {
  Audio = require('expo-av').Audio;
} catch (e) {
  console.warn('expo-av not found, audio playback will be disabled:', e.message);
}

export const AudioGuidePlayer = ({ url }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  async function playSound() {
    if (!Audio) {
      alert('Audio playback is not supported on this device/environment.');
      return;
    }
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
      return;
    }

    setLoading(true);
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Failed to load sound', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={playSound}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={20}
            color="#007AFF"
          />
        )}
        <ThemedText style={styles.text}>
          {isPlaying ? 'Pause Recitation' : 'Play Recitation'}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,122,255,0.1)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 10,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 13,
  }
});
