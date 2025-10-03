import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppData } from '../data/AppContext';

// Import dinamicamente módulos do Expo quando disponíveis
let FileSystem: any = null;
let Sharing: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  FileSystem = require('expo-file-system');
  Sharing = require('expo-sharing');
} catch (e) {
  FileSystem = null;
  Sharing = null;
}

function toCSV(transactions: any[]) {
  const headers = ['id', 'date', 'description', 'amount'];
  const rows = transactions.map((t) => [t.id, t.date, `"${t.description.replace(/"/g, '""')}"`, t.amount].join(','));
  return [headers.join(','), ...rows].join('\n');
}

export default function DownloadPage() {
  const { transactions, inventory } = useAppData();
  const [status, setStatus] = useState('');

  const downloadCSV = async () => {
    setStatus('Gerando CSV...');
    const csv = toCSV(transactions);

    if (FileSystem && Sharing) {
      try {
        const path = FileSystem.cacheDirectory + `relatorio_transacoes_${Date.now()}.csv`;
        await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
        await Sharing.shareAsync(path, { mimeType: 'text/csv' });
        setStatus('Compartilhamento concluído.');
      } catch (e: any) {
        setStatus('Erro ao salvar/compartilhar: ' + (e?.message ?? e));
      }
    } else {
      // Fallback: mostrar CSV na tela para copiar
      setStatus('Módulos de arquivo não disponíveis. Mostrando CSV abaixo. Copie manualmente.');
    }
  };

  const downloadJSON = async () => {
    setStatus('Gerando JSON...');
    const json = JSON.stringify({ transactions, inventory }, null, 2);

    if (FileSystem && Sharing) {
      try {
        const path = FileSystem.cacheDirectory + `relatorio_${Date.now()}.json`;
        await FileSystem.writeAsStringAsync(path, json, { encoding: FileSystem.EncodingType.UTF8 });
        await Sharing.shareAsync(path, { mimeType: 'application/json' });
        setStatus('Compartilhamento concluído.');
      } catch (e: any) {
        setStatus('Erro ao salvar/compartilhar: ' + (e?.message ?? e));
      }
    } else {
      setStatus('Módulos de arquivo não disponíveis. Mostrando JSON abaixo. Copie manualmente.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Exportar relatórios</ThemedText>

      <View style={styles.box}>
        <TouchableOpacity style={styles.btn} onPress={downloadCSV}>
          <ThemedText style={{ color: '#fff' }}>Baixar CSV de transações</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { marginTop: 8 }]} onPress={downloadJSON}>
          <ThemedText style={{ color: '#fff' }}>Baixar JSON completo</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.box}>
        <ThemedText type="subtitle">Status</ThemedText>
        <Text style={{ marginTop: 8 }}>{status}</Text>
      </View>

      {!FileSystem && (
        <View style={styles.box}>
          <ThemedText type="subtitle">Fallback</ThemedText>
          <ThemedText>Instale/ative `expo-file-system` e `expo-sharing` para salvar e compartilhar arquivos diretamente.</ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  box: { marginTop: 12, padding: 12, backgroundColor: '#fff', borderRadius: 8 },
  btn: { backgroundColor: '#0e8f76', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
});
