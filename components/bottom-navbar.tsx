import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export function BottomNavbar() {
  const router = useRouter();

  const pathname = usePathname?.() ?? '';

  const tabs = [
    { name: 'Home', href: '/', iconName: 'home' },
    { name: 'Orçamento', href: '/budget', iconName: 'calculator' },
    { name: 'Financeiro', href: '/finance', iconName: 'bank' },
    { name: 'Estoque', href: '/inventory', iconName: 'package-variant' },
    { name: 'Relatórios', href: '/reports', iconName: 'file-chart' },
  ];

  return (
    <View style={styles.outer} pointerEvents="box-none">
      <View style={styles.container}>
        {tabs.map((t) => {
          const isActive = pathname === t.href || (t.href !== '/' && pathname?.startsWith(t.href));
          const iconColor = isActive ? '#ffffff' : '#9aa0a6';
          const bg = isActive ? styles.tabActiveBg : undefined;

          return (
            <TouchableOpacity
              key={t.name}
              style={[styles.tab, bg]}
              activeOpacity={0.8}
              onPress={() => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                router.push(t.href);
              }}>
              <View style={[styles.iconBox, isActive ? styles.iconBoxActive : undefined]}>
                <MaterialCommunityIcons name={t.iconName as any} size={22} color={isActive ? '#0e8f76' : '#9aa0a6'} />
              </View>
              {/* Remover rótulos — apenas ícones para interferir menos */}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { position: 'absolute', left: 12, right: 12, bottom: 12, alignItems: 'center' },
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 16,
    width: '96%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 6,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  label: { fontSize: 11, color: '#9aa0a6', marginTop: 4 },
  labelActive: { color: '#0e8f76', fontWeight: '600' },
  tabActiveBg: { backgroundColor: '#e6f6f2', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  iconBox: { padding: 6, borderRadius: 10 },
  iconBoxActive: { backgroundColor: '#ffffff' },
});
