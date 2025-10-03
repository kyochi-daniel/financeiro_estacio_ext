import React, { useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppData, Transaction } from './data/AppContext';

export default function FinancePage() {
  const { transactions, addTransaction } = useAppData();
  const [desc, setDesc] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [date, setDate] = useState('');
  const [isExpense, setIsExpense] = useState(true);

  const add = () => {
    const amount = parseFloat(amountStr.replace(',', '.')) || 0;
    const signed = isExpense ? -Math.abs(amount) : Math.abs(amount);
    const tx: Transaction = {
      id: Date.now().toString(),
      date: date || new Date().toISOString().slice(0, 10),
      description: desc || (isExpense ? 'Despesa' : 'Receita'),
      amount: signed,
    };
    addTransaction(tx);
    setDesc('');
    setAmountStr('');
    setDate('');
  };

  const balance = transactions.reduce((s, t) => s + t.amount, 0);

  return (
    <ThemedView enableScroll={false} style={styles.container}>
      <ThemedText type="title">Painel Financeiro</ThemedText>

      <View style={styles.rowInputs}>
        <TextInput style={[styles.input, { flex: 2 }]} placeholder="Descrição" value={desc} onChangeText={setDesc} />
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="Valor" value={amountStr} onChangeText={setAmountStr} keyboardType="numeric" />
      </View>

      <View style={styles.rowInputs}>
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="Data (YYYY-MM-DD)" value={date} onChangeText={setDate} />
        <TouchableOpacity style={[styles.toggle, isExpense ? styles.toggleActive : undefined]} onPress={() => setIsExpense(true)}>
          <ThemedText>Despesa</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggle, !isExpense ? styles.toggleActive : undefined]} onPress={() => setIsExpense(false)}>
          <ThemedText>Receita</ThemedText>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btn} onPress={add}>
        <ThemedText style={{ color: '#fff' }}>Registrar</ThemedText>
      </TouchableOpacity>

      <View style={styles.balanceBox}>
        <ThemedText type="subtitle">Saldo atual</ThemedText>
        <ThemedText style={{ fontSize: 20, fontWeight: '700', marginTop: 6 }}>{balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</ThemedText>
      </View>

      <FlatList data={transactions} keyExtractor={(i) => i.id} renderItem={({ item }) => (
        <View style={styles.txRow}>
          <ThemedText>{item.description}</ThemedText>
          <ThemedText style={{ color: item.amount < 0 ? '#d9534f' : '#2e7d32' }}>{item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</ThemedText>
        </View>
      )} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  rowInputs: { flexDirection: 'row', gap: 8, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#e6e6e6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  toggle: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#e6e6e6', marginLeft: 6 },
  toggleActive: { backgroundColor: '#e6f6f2' },
  btn: { marginTop: 10, backgroundColor: '#0e8f76', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  balanceBox: { marginTop: 12, padding: 12, borderRadius: 8, backgroundColor: '#f6f6f6' },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' },
});
