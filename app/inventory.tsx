import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { InventoryItem, useAppData } from './data/AppContext';

export default function InventoryPage() {
  const { inventory, updateInventory } = useAppData();
  const [editing, setEditing] = useState<InventoryItem | null>(null);

  const save = () => {
    if (editing) {
      updateInventory(editing);
      setEditing(null);
    }
  };

  return (
    <ThemedView enableScroll={false} style={styles.container}>
      <ThemedText type="title">Estoque</ThemedText>

      <FlatList
        data={inventory}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 110 }}
        renderItem={({ item }) => {
          const low = item.quantity <= item.reorderThreshold;
          return (
            <TouchableOpacity style={styles.item} onPress={() => setEditing(item)}>
              <View>
                <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                <ThemedText style={{ color: '#666' }}>{item.quantity} {item.unit}</ThemedText>
              </View>
              <ThemedText style={{ color: low ? '#d9534f' : '#2e7d32' }}>{low ? 'Repor' : 'OK'}</ThemedText>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />

      {/* Editor em modal para ficar sempre visível e próximo ao centro da tela */}
      <Modal visible={!!editing} animationType="slide" transparent={true} onRequestClose={() => setEditing(null)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalContentWrapper}>
            <View style={styles.editor}>
              <ThemedText type="subtitle">Editar: {editing?.name}</ThemedText>
              <TextInput value={editing?.quantity.toString() ?? ''} onChangeText={(t) => editing && setEditing({ ...editing, quantity: parseFloat(t) || 0 })} keyboardType="numeric" style={styles.input} />
              <TextInput value={editing?.reorderThreshold.toString() ?? ''} onChangeText={(t) => editing && setEditing({ ...editing, reorderThreshold: parseFloat(t) || 0 })} keyboardType="numeric" style={styles.input} />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={styles.btn} onPress={() => setEditing(null)}>
                  <ThemedText>Cancelar</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={save}>
                  <ThemedText style={{ color: '#fff' }}>Salvar</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#fff', borderRadius: 8 },
  editor: { marginTop: 12, padding: 12, backgroundColor: '#fff', borderRadius: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContentWrapper: { padding: 20 },
  input: { borderWidth: 1, borderColor: '#e6e6e6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginTop: 8 },
  btn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginTop: 10 },
  btnPrimary: { backgroundColor: '#0e8f76' },
});
