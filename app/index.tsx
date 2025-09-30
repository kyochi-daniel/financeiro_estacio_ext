import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomePage() {
  // Dados de exemplo — substitua por dados reais quando integrar com backend/local storage
  const revenue = 125430.5; // receitas
  const expenses = 82340.2; // despesas
  const profit = revenue - expenses;

  const fmt = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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
          <ThemedText style={styles.amount}>{fmt(expenses)}</ThemedText>
        </View>
      </View>

      <View style={[styles.card, styles.profitCard]}>
        <ThemedText type="subtitle">Lucro</ThemedText>
        <ThemedText style={styles.amount}>{fmt(profit)}</ThemedText>
      </View>

      <Link href="/transactions" style={styles.link}>
        <TouchableOpacity style={styles.button}>
          <ThemedText type="defaultSemiBold">Ver movimentações</ThemedText>
        </TouchableOpacity>
      </Link>
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
  profitCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#eef6ff',
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
