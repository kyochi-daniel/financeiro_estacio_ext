import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppData } from './data/AppContext';

function calcDRE(transactions: any[]) {
  // Simplificado: receitas = soma positivos, despesas = soma negativos
  const revenue = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0);
  const profit = revenue + expenses;
  return { revenue, expenses: Math.abs(expenses), profit };
}

export default function ReportsPage() {
  const { transactions, inventory } = useAppData();
  const dre = calcDRE(transactions);

  // Ponto de equilíbrio (simplificado): custos fixos estimados / margem de contribuição média
  const fixedCostsEstimate = 5000; // placeholder
  const avgContributionRatio = 0.4; // 40% margem média
  const breakeven = avgContributionRatio > 0 ? fixedCostsEstimate / avgContributionRatio : 0;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Relatórios</ThemedText>

      <View style={styles.box}>
        <ThemedText type="subtitle">DRE (Resumo)</ThemedText>
        <ThemedText>Receitas: {dre.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</ThemedText>
        <ThemedText>Despesas: {dre.expenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</ThemedText>
        <ThemedText>Lucro/Prejuízo: {dre.profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</ThemedText>
      </View>

      <View style={styles.box}>
        <ThemedText type="subtitle">Ponto de equilíbrio (estimado)</ThemedText>
        <ThemedText>{breakeven.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</ThemedText>
      </View>

      <View style={styles.box}>
        <ThemedText type="subtitle">Alertas de estoque</ThemedText>
        {inventory.filter((i) => i.quantity <= i.reorderThreshold).length === 0 ? (
          <ThemedText>Nenhum item abaixo do limiar</ThemedText>
        ) : (
          inventory.filter((i) => i.quantity <= i.reorderThreshold).map((it) => (
            <ThemedText key={it.id}>{it.name} — peça: {it.quantity} {it.unit}</ThemedText>
          ))
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  box: { marginTop: 12, padding: 12, backgroundColor: '#fff', borderRadius: 8 },
});
