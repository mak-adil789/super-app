import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Markdown from 'react-native-markdown-display';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as aiApi from '../../services/aiApi';
import useAuthStore from '../../store/useAuthStore';

export default function AIAssistantChat() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [messages, setMessages] = useState([
    { id: 'initial-1', role: 'ai', content: 'Assalamu Alaikum! I am your AI Assistant and Quran Tutor. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  const suggestions = [
    'Help me with Surah Fatiha',
    'How to calculate Zakat?',
    'Tell me a Hadith about patience',
  ];

  const handleSend = async (text = input) => {
    if (!text.trim() || loading) return;

    const userMessage = { id: `u-${messages.length}`, role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const history = newMessages.slice(-5).map(m => ({ role: m.role, content: m.content }));
      const response = await aiApi.sendChatMessage(token, history, text);

      setMessages(prev => [...prev, { id: `ai-${prev.length}`, role: 'ai', content: response }]);
    } catch (_error) {
      setMessages(prev => [...prev, {
        id: `err-${prev.length}`,
        role: 'ai',
        content: 'I apologize, but I encountered an error. Please try again.',
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  }, [messages, loading]);

  const renderMessage = ({ item }) => (
    <View style={[styles.messageBubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
      <ThemedText style={[styles.messageLabel, item.role === 'user' ? styles.userLabel : styles.aiLabel]}>
        {item.role === 'user' ? 'YOU' : 'ASSISTANT'}
      </ThemedText>
      {item.role === 'user' ? (
        <ThemedText style={styles.userText}>{item.content}</ThemedText>
      ) : (
        <Markdown style={markdownStyles}>{item.content}</Markdown>
      )}
    </View>
  );

  return (
    <ThemedView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="gray" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.headerTitle}>AI Assistant</ThemedText>
          <TouchableOpacity onPress={() => setMessages([messages[0]])}>
            <Ionicons name="trash-outline" size={22} color="gray" />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          ListFooterComponent={loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#007AFF" />
              <ThemedText style={styles.loadingText}>Assistant is thinking...</ThemedText>
            </View>
          )}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={10}
        >
          {messages.length === 1 && (
            <View style={styles.suggestionsRow}>
              {suggestions.map(s => (
                <TouchableOpacity key={s} style={styles.chip} onPress={() => handleSend(s)}>
                  <ThemedText style={styles.chipText}>{s}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your question here..."
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, !input.trim() && styles.disabledSend]}
              onPress={() => handleSend()}
              disabled={!input.trim() || loading}
            >
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const markdownStyles = {
  body: { color: '#333', fontSize: 15, lineHeight: 22 },
  strong: { fontWeight: 'bold' },
  em: { fontStyle: 'italic' },
  paragraph: { marginBottom: 10 },
};

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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageList: {
    padding: 20,
    paddingBottom: 40,
  },
  messageBubble: {
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 2,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#F2F2F7',
    borderBottomLeftRadius: 2,
  },
  messageLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 5,
    letterSpacing: 1,
  },
  userLabel: { color: 'rgba(255,255,255,0.7)' },
  aiLabel: { color: '#888' },
  userText: { color: 'white', fontSize: 15 },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 5,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: 'rgba(0,122,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,122,255,0.2)',
  },
  chipText: {
    fontSize: 12,
    color: '#007AFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  disabledSend: {
    opacity: 0.5,
  }
});
