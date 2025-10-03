import React, { useMemo, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppData } from './data/AppContext';
import { Link, useRouter } from 'expo-router';

function groupByMonth(transactions: any[]) {
  const map: Record<string, number> = {};
  transactions.forEach((t) => {
    const month = t.date?.slice(0, 7) ?? 'unknown';
    map[month] = (map[month] || 0) + t.amount;
  });
  return map;
}

export default function ReportsPage() {
  const { transactions, inventory } = useAppData();
  const [fixedCosts, setFixedCosts] = useState('5000');
  const [avgContribution, setAvgContribution] = useState('0.4');

  const dre = useMemo(() => {
    const revenue = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0);
    return { revenue, expenses: Math.abs(expenses), profit: revenue + expenses };
  }, [transactions]);

  const monthly = useMemo(() => groupByMonth(transactions), [transactions]);

  const fixed = parseFloat(fixedCosts) || 0;
  const contrib = parseFloat(avgContribution) || 0.001;
  const breakeven = contrib > 0 ? fixed / contrib : 0;

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedText type="title">Relatórios</ThemedText>

        <View style={styles.box}>
          <ThemedText type="subtitle">DRE (Resumo)</ThemedText>
          <ThemedText>Receitas: {dre.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</ThemedText>
          <ThemedText>Despesas: {dre.expenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</ThemedText>
          <ThemedText>Resultado: {dre.profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</ThemedText>
        </View>

        <View style={styles.box}>
          <ThemedText type="subtitle">DRE por mês</ThemedText>
          {Object.keys(monthly).length === 0 ? (
            <ThemedText>Nenhum dado mensal disponível</ThemedText>
          ) : (
            Object.entries(monthly)
              .sort((a, b) => (a[0] < b[0] ? 1 : -1))
              .map(([m, v]) => (
                <ThemedText key={m}>
                  {m}: {v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </ThemedText>
              ))
          )}
        </View>

        <View style={styles.box}>
          <ThemedText type="subtitle">Ponto de equilíbrio</ThemedText>
          <View style={{ marginTop: 8 }}>
            <ThemedText>Custos fixos estimados</ThemedText>
            <TextInput value={fixedCosts} onChangeText={setFixedCosts} style={styles.input} keyboardType="numeric" />
            <ThemedText style={{ marginTop: 8 }}>Margem de contribuição média (0-1)</ThemedText>
            <TextInput value={avgContribution} onChangeText={setAvgContribution} style={styles.input} keyboardType="numeric" />
            <ThemedText style={{ marginTop: 8 }}>Ponto de equilíbrio: {breakeven.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</ThemedText>
          </View>
        </View>

        <View style={styles.box}>
          <ThemedText type="subtitle">Alertas de estoque</ThemedText>
          {inventory.filter((i) => i.quantity <= i.reorderThreshold).length === 0 ? (
            <ThemedText>Nenhum item abaixo do limiar</ThemedText>
          ) : (
            inventory.filter((i) => i.quantity <= i.reorderThreshold).map((it) => (
              <ThemedText key={it.id}>{it.name} — {it.quantity} {it.unit} (limiar {it.reorderThreshold})</ThemedText>
            ))
          )}
        </View>

        <View style={styles.box}>
          <ThemedText type="subtitle">Exportar / Baixar</ThemedText>
          <View style={{ marginTop: 8 }}>
            {/* usamos router.push para evitar erro de tipagem do Link com rotas aninhadas */}
            <DownloadButton />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function DownloadButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        router.push('/reports/download');
      }}>
      <ThemedText style={{ color: '#fff' }}>Ir para página de download</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  box: { marginTop: 12, padding: 12, backgroundColor: '#fff', borderRadius: 8 },
  input: { borderWidth: 1, borderColor: '#e6e6e6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginTop: 6 },
  btn: { backgroundColor: '#0e8f76', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 8, marginTop: 8, alignItems: 'center' },
});
