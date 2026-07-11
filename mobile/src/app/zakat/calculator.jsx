import React, { useEffect, useState, useMemo } from 'react';
import { View, ScrollView, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { fetchNisabPrices, downloadZakatReport } from '../../services/zakatApi';
import useAuthStore from '../../store/useAuthStore';

export default function ZakatCalculator() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [nisab, setNisab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [form, setForm] = useState({
    cash: '0',
    metals: '0',
    investments: '0',
    receivables: '0',
    liabilities: '0',
  });

  useEffect(() => {
    const loadNisab = async () => {
      try {
        const data = await fetchNisabPrices(token);
        setNisab(data);
      } catch (error) {
        console.error('Failed to load nisab:', error);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      loadNisab();
    }
  }, [token]);

  const totals = useMemo(() => {
    const cash = parseFloat(form.cash) || 0;
    const metals = parseFloat(form.metals) || 0;
    const investments = parseFloat(form.investments) || 0;
    const receivables = parseFloat(form.receivables) || 0;
    const liabilities = parseFloat(form.liabilities) || 0;

    const totalAssets = cash + metals + investments + receivables;
    const netAssets = Math.max(0, totalAssets - liabilities);

    let zakatDue = 0;
    if (nisab && netAssets >= nisab.nisab_silver) {
      zakatDue = netAssets * 0.025;
    }

    return { totalAssets, netAssets, zakatDue, cash, metals, investments, receivables, liabilities };
  }, [form, nisab]);

  const handleExport = async () => {
    setExporting(true);
    try {
      await downloadZakatReport(token, totals);
    } catch (_error) {
      Alert.alert('Export Failed', 'Could not generate PDF report.');
    } finally {
      setExporting(false);
    }
  };

  const renderField = (label, key, icon) => (
    <View style={styles.fieldContainer}>
      <View style={styles.labelRow}>
        <Ionicons name={icon} size={18} color="#007AFF" />
        <ThemedText style={styles.label}>{label}</ThemedText>
      </View>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form[key]}
        onChangeText={(val) => setForm({ ...form, [key]: val })}
        placeholder="0.00"
      />
    </View>
  );

  return (
    <ThemedView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="gray" />
          </TouchableOpacity>
          <ThemedText type="title">Zakat Calculator</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {loading ? (
            <ActivityIndicator color="#007AFF" style={{ marginBottom: 20 }} />
          ) : nisab && (
            <View style={styles.nisabCard} className="bg-el-light dark:bg-el-dark">
              <ThemedText style={styles.nisabTitle}>Current Nisab (Silver)</ThemedText>
              <ThemedText style={styles.nisabValue}>${nisab.nisab_silver.toLocaleString(undefined, { minimumFractionDigits: 2 })}</ThemedText>
              <ThemedText style={styles.nisabNote}>Based on 612.36g of Silver</ThemedText>
            </View>
          )}

          <ThemedText style={styles.sectionTitle}>Your Wealth</ThemedText>
          <View style={styles.formCard} className="bg-el-light dark:bg-el-dark">
            {renderField('Cash (Hand & Bank)', 'cash', 'cash-outline')}
            {renderField('Gold & Silver Value', 'metals', 'medal-outline')}
            {renderField('Investments / Shares', 'investments', 'trending-up-outline')}
            {renderField('Money Owed to You', 'receivables', 'receipt-outline')}
          </View>

          <ThemedText style={styles.sectionTitle}>Liabilities</ThemedText>
          <View style={styles.formCard} className="bg-el-light dark:bg-el-dark">
            {renderField('Debts & Bills Due', 'liabilities', 'calendar-outline')}
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Total Assets</ThemedText>
              <ThemedText style={styles.summaryValue}>${totals.totalAssets.toLocaleString()}</ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Net Wealth</ThemedText>
              <ThemedText style={styles.summaryValue}>${totals.netAssets.toLocaleString()}</ThemedText>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <ThemedText style={[styles.summaryLabel, styles.zakatLabel]}>Zakat Due (2.5%)</ThemedText>
              <ThemedText style={[styles.summaryValue, styles.zakatValue]}>${totals.zakatDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</ThemedText>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.exportButton, exporting && styles.disabledButton]}
            onPress={handleExport}
            disabled={exporting}
          >
            {exporting ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="share-social" size={20} color="white" />
                <ThemedText style={styles.exportText}>EXPORT AS PDF</ThemedText>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
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
  scrollContent: {
    padding: 20,
  },
  nisabCard: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  nisabTitle: {
    fontSize: 12,
    color: '#888',
    fontWeight: 'bold',
  },
  nisabValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34C759',
    marginTop: 4,
  },
  nisabNote: {
    fontSize: 10,
    color: '#aaa',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  formCard: {
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingVertical: 8,
    fontSize: 18,
    fontWeight: '500',
  },
  summaryCard: {
    padding: 20,
    borderRadius: 20,
    marginTop: 10,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#eee',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryLabel: {
    color: '#666',
  },
  summaryValue: {
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 12,
  },
  zakatLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  zakatValue: {
    fontSize: 20,
    color: '#34C759',
  },
  exportButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 30,
    marginBottom: 40,
  },
  disabledButton: {
    opacity: 0.7,
  },
  exportText: {
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
