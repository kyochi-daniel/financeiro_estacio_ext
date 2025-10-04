import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Transaction, useAppData } from './data/AppContext';

export default function FinancePage() {
  const { transactions, addTransaction } = useAppData();
  const [desc, setDesc] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [date, setDate] = useState('');
  const [isExpense, setIsExpense] = useState(true);

  const [descError, setDescError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [dateError, setDateError] = useState('');

  // Helpers: máscara de moeda BRL e máscara de data DD/MM/YYYY
  const formatCurrency = (raw: string) => {
    // keep only digits
    const digits = raw.replace(/[^0-9]/g, '');
    const num = parseInt(digits || '0', 10);
    const cents = (num % 100).toString().padStart(2, '0');
    const intPart = Math.floor(num / 100).toString();
    // add thousand separators
    const intWithSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${intWithSep},${cents}`;
  };

  const parseCurrencyToNumber = (masked: string) => {
    if (!masked) return 0;
    const only = masked.replace(/[^0-9]/g, '');
    const num = parseInt(only || '0', 10);
    return num / 100;
  };

  const formatDateMask = (raw: string) => {
    // only digits and limit to 8
    const d = raw.replace(/[^0-9]/g, '').slice(0, 8);
    const parts = [] as string[];
    if (d.length >= 2) {
      parts.push(d.slice(0, 2));
      if (d.length >= 4) {
        parts.push(d.slice(2, 4));
        if (d.length > 4) parts.push(d.slice(4));
      } else if (d.length > 2) {
        parts.push(d.slice(2));
      }
    } else if (d.length > 0) {
      parts.push(d);
    }
    return parts.join('/');
  };

  const isValidDateDMY = (s: string) => {
    const re = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!re.test(s)) return false;
    const [dd, mm, yyyy] = s.split('/').map((x) => parseInt(x, 10));
    const date = new Date(yyyy, mm - 1, dd);
    return date.getFullYear() === yyyy && date.getMonth() === mm - 1 && date.getDate() === dd;
  };

  const convertDMYtoISO = (s: string) => {
    // input DD/MM/YYYY -> YYYY-MM-DD
    const [dd, mm, yyyy] = s.split('/');
    if (!dd || !mm || !yyyy) return new Date().toISOString().slice(0, 10);
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  };

  const validate = () => {
    let ok = true;
    if (!desc.trim()) {
      setDescError('Descrição é obrigatória');
      ok = false;
    } else {
      setDescError('');
    }

    const amt = parseCurrencyToNumber(amountStr);
    if (!amountStr.trim() || Number.isNaN(amt) || amt === 0) {
      setAmountError('Informe um valor maior que zero');
      ok = false;
    } else {
      setAmountError('');
    }

    // Data no formato DD/MM/YYYY
    if (!date.trim() || !isValidDateDMY(date)) {
      setDateError('Informe a data no formato DD/MM/YYYY');
      ok = false;
    } else {
      setDateError('');
    }

    return ok;
  };

  const add = () => {
    if (!validate()) return;

    const amount = parseCurrencyToNumber(amountStr) || 0;
    const signed = isExpense ? -Math.abs(amount) : Math.abs(amount);
    const tx: Transaction = {
      id: Date.now().toString(),
      date: convertDMYtoISO(date),
      description: desc,
      amount: signed,
    };
    addTransaction(tx);
    setDesc('');
    setAmountStr('');
    setDate('');
  };

  const balance = transactions.reduce((s, t) => s + t.amount, 0);

  const isFormValid = () => {
    const amt = parseCurrencyToNumber(amountStr);
    return desc.trim() !== '' && amountStr.trim() !== '' && !Number.isNaN(amt) && amt !== 0 && isValidDateDMY(date);
  };

  return (
    <ThemedView enableScroll={false} style={styles.container}>
      <ThemedText type="title">Painel Financeiro</ThemedText>

      <View style={styles.rowInputs}>
        <TextInput style={[styles.input, { flex: 2 }]} placeholder="Descrição" value={desc} onChangeText={(t) => { setDesc(t); if (descError) setDescError(''); }} />
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="Valor (R$)" value={amountStr} onChangeText={(t) => { const masked = formatCurrency(t); setAmountStr(masked); if (amountError) setAmountError(''); }} keyboardType="numeric" />
      </View>
      {descError ? <ThemedText style={styles.errorText}>{descError}</ThemedText> : null}
      {amountError ? <ThemedText style={styles.errorText}>{amountError}</ThemedText> : null}

      <View style={styles.rowInputs}>
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="Data (DD/MM/YYYY)" value={date} onChangeText={(t) => { const masked = formatDateMask(t); setDate(masked); if (dateError) setDateError(''); }} keyboardType="numeric" />
        <TouchableOpacity style={[styles.toggle, isExpense ? styles.toggleActive : undefined]} onPress={() => setIsExpense(true)}>
          <ThemedText>Despesa</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggle, !isExpense ? styles.toggleActive : undefined]} onPress={() => setIsExpense(false)}>
          <ThemedText>Receita</ThemedText>
        </TouchableOpacity>
      </View>
      {dateError ? <ThemedText style={styles.errorText}>{dateError}</ThemedText> : null}

      <TouchableOpacity style={[styles.btn, !isFormValid() ? styles.btnDisabled : null]} onPress={add} disabled={!isFormValid()}>
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
  input: { borderWidth: 1, borderColor: '#e6e6e6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, color: '#000' },
  toggle: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#e6e6e6', marginLeft: 6 },
  toggleActive: { backgroundColor: '#e6f6f2' },
  btn: { marginTop: 10, backgroundColor: '#0e8f76', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#9aa0a6' },
  balanceBox: { marginTop: 12, padding: 12, borderRadius: 8, backgroundColor: '#f6f6f6' },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' },
  errorText: { color: '#d9534f', marginTop: 6 },
});
