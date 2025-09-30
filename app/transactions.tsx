import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
};

const INITIAL_DATA: Transaction[] = [
  { id: '1', date: '2025-09-01', description: 'Impressão cartazes', amount: 2500 },
  { id: '2', date: '2025-09-05', description: 'Compra de papel', amount: -420 },
  { id: '3', date: '2025-09-12', description: 'Serviço terceirizado', amount: -800 },
  { id: '4', date: '2025-09-20', description: 'Venda flyers', amount: 1200 },
];

function Item({ item }: { item: Transaction }) {
  const fmt = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <View style={styles.item}>
      <View>
        <ThemedText type="defaultSemiBold">{item.description}</ThemedText>
        <ThemedText style={styles.date}>{item.date}</ThemedText>
      </View>
      <ThemedText style={[styles.amount, { color: item.amount < 0 ? '#d9534f' : '#2e7d32' }]}>
        {fmt(item.amount)}
      </ThemedText>
    </View>
  );
}

export default function TransactionsScreen() {
  const [data, setData] = useState<Transaction[]>(INITIAL_DATA);
  const [modalVisible, setModalVisible] = useState(false);
  const [desc, setDesc] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [date, setDate] = useState('');
  const [isExpense, setIsExpense] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const addTransaction = () => {
    const amount = parseFloat(amountStr.replace(',', '.')) || 0;
    const signed = isExpense ? -Math.abs(amount) : Math.abs(amount);
    const newTx: Transaction = {
      id: Date.now().toString(),
      date: date || new Date().toISOString().slice(0, 10),
      description: desc || 'Nova transação',
      amount: signed,
    };
    setData((prev) => [newTx, ...prev]);
    // reset
    setDesc('');
    setAmountStr('');
    setDate('');
    setIsExpense(true);
    setModalVisible(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Movimentações
      </ThemedText>

      <View style={styles.addRow}>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
          <ThemedText style={styles.addButtonText}>Adicionar +</ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Item item={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <Link href="/" style={styles.link}>
        <ThemedText type="link">Voltar ao resumo</ThemedText>
      </Link>

      {/* Add button moved above the list */}

      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="title">Nova transação</ThemedText>

            <TextInput
              placeholder="Descrição"
              value={desc}
              onChangeText={setDesc}
              style={styles.input}
            />

            <TextInput
              placeholder="Valor"
              value={amountStr}
              onChangeText={setAmountStr}
              keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
              style={styles.input}
            />

            <TextInput
              placeholder="Data (YYYY-MM-DD)"
              value={date}
              onChangeText={setDate}
              style={styles.input}
            />

            <View style={styles.rowBetween}
            >
              <ThemedText>Tipo</ThemedText>
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  activeOpacity={0.8}
                  onPress={() => setShowDropdown((s) => !s)}>
                  <ThemedText>{isExpense ? 'Despesa' : 'Receita'}</ThemedText>
                </TouchableOpacity>

                {showDropdown && (
                  <View style={styles.dropdown}>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setIsExpense(true);
                        setShowDropdown(false);
                      }}>
                      <ThemedText style={isExpense ? styles.dropdownItemActive : undefined}>Despesa</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setIsExpense(false);
                        setShowDropdown(false);
                      }}>
                      <ThemedText style={!isExpense ? styles.dropdownItemActive : undefined}>Receita</ThemedText>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btn} onPress={() => setModalVisible(false)}>
                <ThemedText>Cancelar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={addTransaction}>
                <ThemedText style={{ color: '#fff' }}>Adicionar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  date: {
    marginTop: 4,
    fontSize: 13,
    color: '#666',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#e6e6e6',
  },
  link: {
    marginTop: 16,
  },
  addRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 },
  addButton: { backgroundColor: '#0e8f76', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  addButtonText: { color: '#fff', fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
  },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 8 },
  btn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8 },
  btnPrimary: { backgroundColor: '#0e8f76' },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    overflow: 'hidden',
  },
  dropdownItem: { paddingVertical: 8, paddingHorizontal: 10 },
  dropdownItemActive: { color: '#0e8f76', fontWeight: '600' },
});
