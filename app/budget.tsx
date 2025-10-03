import SmallLineChart from '@/components/chart';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { BudgetItem, useAppData } from './data/AppContext';

function calcFinalPrice(b: BudgetItem, totalFixedCosts: number) {
  const directCost = b.materialCost + b.inkCost + b.laborHours * b.laborRate;
  const fixed = totalFixedCosts * b.fixedAllocation;
  const totalCost = directCost + fixed;
  const price = totalCost * (1 + b.markupPercent / 100);
  return { directCost, fixed, totalCost, price };
}

function emptyBudget(): BudgetItem {
  return {
    id: Date.now().toString(),
    name: '',
    materialCost: 0,
    inkCost: 0,
    laborHours: 0,
    laborRate: 0,
    fixedAllocation: 0,
    markupPercent: 0,
  };
}

export default function BudgetPage() {
  const { budgets, addBudget, updateBudget, removeBudget } = useAppData();

  // UI state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BudgetItem | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  // formulário controlado
  const [form, setForm] = useState<BudgetItem>(emptyBudget());

  // Exemplo: total de custos fixos — em produção viria de config/centro de custos
  const totalFixedCosts = 5000;

  // dados para gráfico (receita estimada / preço sugerido simplificado)
  const chartData = useMemo(() => budgets.map((b) => Math.round(calcFinalPrice(b, totalFixedCosts).price)), [budgets]);

  const openNew = () => {
    setForm(emptyBudget());
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (b: BudgetItem) => {
    setForm(b);
    setEditing(b);
    setModalOpen(true);
  };

  const saveForm = () => {
    if (!form.name.trim()) return Alert.alert('Validação', 'Informe um nome para o orçamento');

    if (editing) {
      updateBudget(form);
    } else {
      addBudget({ ...form, id: Date.now().toString() });
    }
    setModalOpen(false);
  };

  const confirmRemove = (id: string) => {
    // abre modal de confirmação customizado; fechamos modal de edição se aberto
    setModalOpen(false);
    setConfirmRemoveId(id);
  };

  const renderItem = ({ item }: { item: BudgetItem }) => {
    const r = calcFinalPrice(item, totalFixedCosts);
    return (
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <ThemedText type="defaultSemiBold">{item.name || 'Sem nome'}</ThemedText>
          <ThemedText style={{ marginTop: 6 }} type="subtitle">R$ {r.price.toFixed(2)}</ThemedText>
          <ThemedText style={{ marginTop: 6 }} type="default">Custo: R$ {r.totalCost.toFixed(2)}</ThemedText>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => openEdit(item)} style={styles.iconBtn}>
            <ThemedText type="link">Editar</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmRemove(item.id)} style={styles.iconBtn}>
            <ThemedText type="link">Remover</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Orçamentos</ThemedText>

      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <ThemedText type="default">Visão rápida dos preços sugeridos</ThemedText>
        </View>
        <TouchableOpacity onPress={openNew} style={styles.addBtn}>
          <ThemedText style={{ color: '#fff' }}>+ Novo</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 12 }}>
        <SmallLineChart data={chartData.length ? chartData : [10, 20, 30]} />
      </View>

      <View style={{ marginTop: 14 }}>
        <FlatList data={budgets} keyExtractor={(i) => i.id} renderItem={renderItem} ListEmptyComponent={() => <ThemedText>Nenhum orçamento salvo ainda.</ThemedText>} />
      </View>

      {/* modal simples em tela: implementamos com view condicional para manter compatibilidade */}
      {modalOpen && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <ThemedText type="title">{editing ? 'Editar' : 'Novo'} Orçamento</ThemedText>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
            />

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.inputRow]}
                placeholder="Custo material"
                keyboardType="numeric"
                value={String(form.materialCost)}
                onChangeText={(v) => setForm({ ...form, materialCost: parseFloat(v) || 0 })}
              />
              <View style={{ width: 8 }} />
              <TextInput
                style={[styles.input, styles.inputRow]}
                placeholder="Custo tinta"
                keyboardType="numeric"
                value={String(form.inkCost)}
                onChangeText={(v) => setForm({ ...form, inkCost: parseFloat(v) || 0 })}
              />
            </View>

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.inputRow]}
                placeholder="Horas"
                keyboardType="numeric"
                value={String(form.laborHours)}
                onChangeText={(v) => setForm({ ...form, laborHours: parseFloat(v) || 0 })}
              />
              <View style={{ width: 8 }} />
              <TextInput
                style={[styles.input, styles.inputRow]}
                placeholder="Valor hora"
                keyboardType="numeric"
                value={String(form.laborRate)}
                onChangeText={(v) => setForm({ ...form, laborRate: parseFloat(v) || 0 })}
              />
            </View>

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.inputRow]}
                placeholder="Alocação fixa (0-1)"
                keyboardType="numeric"
                value={String(form.fixedAllocation)}
                onChangeText={(v) => setForm({ ...form, fixedAllocation: parseFloat(v) || 0 })}
              />
              <View style={{ width: 8 }} />
              <TextInput
                style={[styles.input, styles.inputRow]}
                placeholder="Markup %"
                keyboardType="numeric"
                value={String(form.markupPercent)}
                onChangeText={(v) => setForm({ ...form, markupPercent: parseFloat(v) || 0 })}
              />
            </View>

            <View style={{ marginTop: 10 }}>
              <ThemedText type="subtitle">Preview</ThemedText>
              <ThemedText>Preço: R$ {calcFinalPrice(form, totalFixedCosts).price.toFixed(2)}</ThemedText>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: '#bbb' }]} onPress={() => setModalOpen(false)}>
                <ThemedText>Cancelar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: '#0e8f76' }]} onPress={saveForm}>
                <ThemedText style={{ color: '#fff' }}>{editing ? 'Salvar' : 'Adicionar'}</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* confirm remove modal (mock): remove em memória, um F5 restaura os mocks iniciais */}
      {confirmRemoveId && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <ThemedText type="title">Remover orçamento?</ThemedText>
            <ThemedText style={{ marginTop: 8 }}>Tem certeza que deseja remover este orçamento?</ThemedText>

            <View style={[styles.modalActions, { marginTop: 16 }]}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: '#bbb' }]} onPress={() => setConfirmRemoveId(null)}>
                <ThemedText>Cancelar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#d9534f' }]}
                onPress={() => {
                  removeBudget(confirmRemoveId);
                  setConfirmRemoveId(null);
                }}>
                <ThemedText style={{ color: '#fff' }}>Remover</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  addBtn: { backgroundColor: '#0e8f76', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  input: { borderWidth: 1, borderColor: '#e6e6e6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginTop: 10 },
  row: { flexDirection: 'row', gap: 8, marginTop: 10 },
  card: { padding: 12, borderRadius: 8, backgroundColor: '#f6f6f6', marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  cardActions: { marginLeft: 12, alignItems: 'flex-end' },
  iconBtn: { padding: 6 },
  modalOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.35)' },
  modal: { width: '92%', maxWidth: 700, backgroundColor: '#fff', padding: 16, borderRadius: 12 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 12 },
  btn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  inputRow: { minHeight: 44, paddingVertical: 6 },
});
