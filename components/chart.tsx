import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

// Tentamos carregar react-native-chart-kit se estiver disponível; caso contrário, usamos um fallback simples.
let LineChart: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('react-native-chart-kit');
  LineChart = mod?.LineChart ?? null;
} catch (e) {
  LineChart = null;
}

export default function SmallLineChart({ data }: { data: number[] }) {
  const screenWidth = Math.min(Dimensions.get('window').width - 48, 600);

  if (LineChart) {
    const chartConfig = {
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo: '#ffffff',
      color: (opacity = 1) => `rgba(14,143,118, ${opacity})`,
      strokeWidth: 2,
      decimalPlaces: 0,
    } as any;

    return (
      <View>
        <LineChart
          data={{ labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'], datasets: [{ data }] }}
          width={screenWidth}
          height={120}
          chartConfig={chartConfig}
          withHorizontalLines={false}
          withVerticalLines={false}
          withDots={false}
          withShadow={false}
          bezier
          style={{ borderRadius: 8 }}
        />
      </View>
    );
  }

  // Fallback visual simples (sem dependência extra)
  return (
    <View style={styles.fallback}>
      <Text style={styles.fallbackText}>Gráfico (instale react-native-chart-kit para visualização detalhada)</Text>
      <View style={styles.bars}>
        {data.slice(0, 6).map((v, i) => (
          <View key={i} style={[styles.bar, { height: Math.max(20, Math.min(100, Math.round(v / 25))) }]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { paddingTop: 8 },
  fallbackText: { fontSize: 12, color: '#666' },
  bars: { flexDirection: 'row', gap: 8, marginTop: 8, alignItems: 'flex-end' as any },
  bar: { width: 20, backgroundColor: '#0e8f76', borderRadius: 4 },
});

