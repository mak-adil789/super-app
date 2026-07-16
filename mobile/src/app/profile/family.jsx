import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as familyApi from '../../services/familyApi';
import useAuthStore from '../../store/useAuthStore';

export default function FamilyDashboard() {
  const router = useRouter();
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [familyName, setFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const loadFamily = useCallback(async () => {
    setLoading(true);
    try {
      const freshToken = await useAuthStore.getState().getFreshToken();
      if (!freshToken) return;
      const data = await familyApi.fetchFamilyData(freshToken);
      setFamily(data);
    } catch (error) {
      console.warn('No family found or error:', error.message);
      setFamily(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadFamily();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadFamily]);

  const handleCreate = async () => {
    if (!familyName) return Alert.alert('Error', 'Please enter a family name');
    setActionLoading(true);
    try {
      const freshToken = await useAuthStore.getState().getFreshToken();
      const data = await familyApi.createFamily(freshToken, familyName);
      setFamily(data);
      Alert.alert('Success', 'Family group created!');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create family');
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!inviteCode) return Alert.alert('Error', 'Please enter an invite code');
    setActionLoading(true);
    try {
      const freshToken = await useAuthStore.getState().getFreshToken();
      const data = await familyApi.joinFamily(freshToken, inviteCode);
      setFamily(data);
      Alert.alert('Success', 'Joined family group!');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to join family');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = () => {
    Alert.alert('Leave Family', 'Are you sure you want to leave this family group?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Leave',
        style: 'destructive',
        onPress: async () => {
          try {
            const freshToken = await useAuthStore.getState().getFreshToken();
            await familyApi.leaveFamily(freshToken);
            setFamily(null);
          } catch (_error) {
            Alert.alert('Error', 'Failed to leave family');
          }
        }
      },
    ]);
  };

  const renderNoFamily = () => (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <View style={styles.welcomeSection}>
        <Ionicons name="people-circle-outline" size={80} color="#007AFF" />
        <ThemedText type="title" style={styles.welcomeTitle}>Family Groups</ThemedText>
        <ThemedText style={styles.welcomeDesc}>
          Create or join a family group to track progress together and encourage each other.
        </ThemedText>
      </View>

      <ThemedView style={styles.card} className="bg-el-light dark:bg-el-dark">
        <ThemedText style={styles.cardTitle}>Create New Family</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Family Name (e.g. The Abdullahs)"
          value={familyName}
          onChangeText={setFamilyName}
        />
        <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={actionLoading}>
          {actionLoading ? <ActivityIndicator color="white" /> : <ThemedText style={styles.buttonText}>CREATE FAMILY</ThemedText>}
        </TouchableOpacity>
      </ThemedView>

      <View style={styles.dividerRow}>
        <View style={styles.line} />
        <ThemedText style={styles.dividerText}>OR</ThemedText>
        <View style={styles.line} />
      </View>

      <ThemedView style={styles.card} className="bg-el-light dark:bg-el-dark">
        <ThemedText style={styles.cardTitle}>Join Existing Family</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Enter 8-digit Invite Code"
          value={inviteCode}
          onChangeText={setInviteCode}
          autoCapitalize="characters"
        />
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleJoin} disabled={actionLoading}>
          {actionLoading ? <ActivityIndicator color="white" /> : <ThemedText style={styles.buttonText}>JOIN FAMILY</ThemedText>}
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );

  const renderInFamily = () => (
    <View style={styles.familyContainer}>
      <View style={styles.familyHeader}>
        <ThemedText type="title">{family.name}</ThemedText>
        <View style={styles.inviteBadge}>
          <ThemedText style={styles.inviteLabel}>INVITE CODE: </ThemedText>
          <ThemedText style={styles.inviteValue}>{family.inviteCode}</ThemedText>
        </View>
      </View>

      <ThemedText style={styles.sectionTitle}>Family Members</ThemedText>
      <FlatList
        data={family.members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={styles.memberCard} className="bg-el-light dark:bg-el-dark">
            <View style={styles.memberInfo}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={20} color="#888" />
              </View>
              <View>
                <ThemedText style={styles.memberName}>{item.displayName || 'User'}</ThemedText>
                <ThemedText style={styles.memberSub}>{item.email}</ThemedText>
              </View>
            </View>
            <View style={styles.memberProgress}>
               <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            </View>
          </ThemedView>
        )}
        contentContainerStyle={styles.memberList}
      />

      <TouchableOpacity style={styles.leaveButton} onPress={handleLeave}>
        <ThemedText style={styles.leaveText}>LEAVE FAMILY GROUP</ThemedText>
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="gray" />
          </TouchableOpacity>
          <ThemedText type="title">Family Group</ThemedText>
          <TouchableOpacity onPress={loadFamily}>
            <Ionicons name="refresh" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : family ? (
          renderInFamily()
        ) : (
          renderNoFamily()
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    marginTop: 15,
  },
  welcomeDesc: {
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#5856D6',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginBottom: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#aaa',
    fontWeight: 'bold',
  },
  familyContainer: {
    flex: 1,
    padding: 20,
  },
  familyHeader: {
    marginBottom: 30,
  },
  inviteBadge: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,122,255,0.1)',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  inviteLabel: {
    fontSize: 12,
    color: '#666',
  },
  inviteValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  memberList: {
    gap: 12,
  },
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 16,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberName: {
    fontWeight: 'bold',
  },
  memberSub: {
    fontSize: 11,
    color: '#888',
  },
  leaveButton: {
    padding: 20,
    alignItems: 'center',
  },
  leaveText: {
    color: '#FF3B30',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
