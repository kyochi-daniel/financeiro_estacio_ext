import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { BudgetItem, useAppData } from './data/AppContext';

function calcFinalPrice(b: BudgetItem, totalFixedCosts: number) {
  // Calcula custo direto
  const directCost = b.materialCost + b.inkCost + b.laborHours * b.laborRate;
  // aloca parcela dos custos fixos
  const fixed = totalFixedCosts * b.fixedAllocation;
  const totalCost = directCost + fixed;
  const price = totalCost * (1 + b.markupPercent / 100);
  return { directCost, fixed, totalCost, price };
}

export default function BudgetPage() {
  const { addBudget } = useAppData();
  const [name, setName] = useState('Banner 1x2m');
  const [materialCost, setMaterialCost] = useState('50');
  const [inkCost, setInkCost] = useState('25');
  const [laborHours, setLaborHours] = useState('1');
  const [laborRate, setLaborRate] = useState('25');
  const [fixedAlloc, setFixedAlloc] = useState('0.05');
  const [markup, setMarkup] = useState('40');

  // Em uma implementação real, viria de dados do negócio
  const totalFixedCosts = 5000; // exemplo

  const preview: BudgetItem = {
    id: 'preview',
    name,
    materialCost: parseFloat(materialCost) || 0,
    inkCost: parseFloat(inkCost) || 0,
    laborHours: parseFloat(laborHours) || 0,
    laborRate: parseFloat(laborRate) || 0,
    fixedAllocation: parseFloat(fixedAlloc) || 0,
    markupPercent: parseFloat(markup) || 0,
  };

  const r = calcFinalPrice(preview, totalFixedCosts);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Orçamento</ThemedText>

      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nome do produto" />

      <View style={styles.row}>
        <TextInput style={[styles.input, { flex: 1 }]} value={materialCost} onChangeText={setMaterialCost} keyboardType="numeric" placeholder="Custo material" />
        <View style={{ width: 8 }} />
        <TextInput style={[styles.input, { flex: 1 }]} value={inkCost} onChangeText={setInkCost} keyboardType="numeric" placeholder="Custo tinta" />
      </View>

      <View style={styles.row}>
        <TextInput style={[styles.input, { flex: 1 }]} value={laborHours} onChangeText={setLaborHours} keyboardType="numeric" placeholder="Horas de mão-de-obra" />
        <View style={{ width: 8 }} />
        <TextInput style={[styles.input, { flex: 1 }]} value={laborRate} onChangeText={setLaborRate} keyboardType="numeric" placeholder="Valor hora" />
      </View>

      <View style={styles.row}>
        <TextInput style={[styles.input, { flex: 1 }]} value={fixedAlloc} onChangeText={setFixedAlloc} keyboardType="numeric" placeholder="Alocação custos fixos (0-1)" />
        <View style={{ width: 8 }} />
        <TextInput style={[styles.input, { flex: 1 }]} value={markup} onChangeText={setMarkup} keyboardType="numeric" placeholder="Markup %" />
      </View>

      <View style={styles.previewBox}>
        <ThemedText type="subtitle">Custo direto: R$ {r.directCost.toFixed(2)}</ThemedText>
        <ThemedText type="subtitle">Custo fixo alocado: R$ {r.fixed.toFixed(2)}</ThemedText>
        <ThemedText type="subtitle">Custo total: R$ {r.totalCost.toFixed(2)}</ThemedText>
        <ThemedText type="subtitle">Preço sugerido: R$ {r.price.toFixed(2)}</ThemedText>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          addBudget({ ...preview, id: Date.now().toString() });
        }}>
        <ThemedText style={{ color: '#fff' }}>Salvar orçamento</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: '#e6e6e6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginTop: 10 },
  row: { flexDirection: 'row', gap: 8, marginTop: 10 },
  previewBox: { marginTop: 12, padding: 12, borderRadius: 8, backgroundColor: '#f6f6f6' },
  btn: { marginTop: 14, backgroundColor: '#0e8f76', paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
});
