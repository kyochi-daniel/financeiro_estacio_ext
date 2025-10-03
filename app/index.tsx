import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import SmallLineChart from '@/components/chart';
import { useAppData } from './data/AppContext';

export default function HomePage() {
  const { transactions } = useAppData();

  // Cálculos rápidos
  const revenue = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0);
  const profit = revenue + expenses;

  const fmt = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const recent = transactions.slice(0, 4);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Resumo Financeiro
      </ThemedText>

      <View style={styles.cardRow}>
        <View style={[styles.card, styles.revenueCard]}>
          <ThemedText type="subtitle">Receitas</ThemedText>
          <ThemedText style={styles.amount}>{fmt(revenue)}</ThemedText>
        </View>

        <View style={[styles.card, styles.expensesCard]}>
          <ThemedText type="subtitle">Despesas</ThemedText>
          <ThemedText style={styles.amount}>{fmt(Math.abs(expenses))}</ThemedText>
        </View>
      </View>

      {/* Lucro removido do dashboard conforme solicitado */}

      {/* Quick actions */}
      <View style={styles.actionsRow}>
        <Link href="/budget">
          <TouchableOpacity style={styles.actionBtn}>
            <ThemedText>Orçamentos</ThemedText>
          </TouchableOpacity>
        </Link>
        <Link href="/finance">
          <TouchableOpacity style={styles.actionBtn}>
            <ThemedText>Financeiro</ThemedText>
          </TouchableOpacity>
        </Link>
        <Link href="/inventory">
          <TouchableOpacity style={styles.actionBtn}>
            <ThemedText>Estoque</ThemedText>
          </TouchableOpacity>
        </Link>
        <Link href="/reports">
          <TouchableOpacity style={styles.actionBtn}>
            <ThemedText>Relatórios</ThemedText>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Gráfico placeholder */}
      <View style={styles.chartBox}>
        <ThemedText type="subtitle">Gráfico de receitas x despesas (mensal)</ThemedText>
        {/* exemplo simples: gerar dados a partir de transações */}
        <SmallLineChart data={[1200, 900, 1500, 1800, 2000, 1700]} />
      </View>

      {/* Recent transactions preview */}
      <View style={styles.listBox}>
        <ThemedText type="subtitle">Movimentações recentes</ThemedText>
        {recent.length === 0 ? (
          <ThemedText>Nenhuma movimentação ainda</ThemedText>
        ) : (
          recent.map((r) => (
            <View key={r.id} style={styles.txRow}>
              <ThemedText>{r.description}</ThemedText>
              <ThemedText style={{ color: r.amount < 0 ? '#d9534f' : '#2e7d32' }}>{fmt(r.amount)}</ThemedText>
            </View>
          ))
        )}
        <Link href="/finance" style={styles.link}>
          <TouchableOpacity style={styles.button}>
            <ThemedText type="defaultSemiBold">Ver tudo</ThemedText>
          </TouchableOpacity>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  actionBtn: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#e6e6e6', marginRight: 8, marginTop: 8 },
  chartBox: { marginTop: 12, padding: 12, backgroundColor: '#fff', borderRadius: 8 },
  chartPlaceholder: { height: 120, backgroundColor: '#f2f6f4', borderRadius: 8, marginTop: 8 },
  listBox: { marginTop: 12, padding: 12, backgroundColor: '#fff', borderRadius: 8 },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  revenueCard: {
    backgroundColor: '#e6f8f7',
  },
  expensesCard: {
    backgroundColor: '#fff3e6',
  },
  amount: {
    marginTop: 8,
    fontSize: 20,
  },
  link: {
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
});
