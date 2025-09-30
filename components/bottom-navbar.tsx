import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

export function BottomNavbar() {
  const router = useRouter();

  const pathname = usePathname?.() ?? '';

  const tabs = [
    { name: 'Home', href: '/', iconName: 'home' },
    { name: 'Transactions', href: '/transactions', iconName: 'format-list-bulleted' },
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
                <MaterialCommunityIcons name={t.iconName as any} size={20} color={isActive ? '#0e8f76' : '#9aa0a6'} />
              </View>
              <Text style={[styles.label, isActive ? styles.labelActive : undefined]}>{t.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { position: 'absolute', left: 0, right: 0, bottom: 12, alignItems: 'center' },
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 28,
    width: '92%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  label: { fontSize: 12, color: '#9aa0a6', marginTop: 4 },
  labelActive: { color: '#0e8f76', fontWeight: '600' },
  tabActiveBg: { backgroundColor: '#e6f6f2', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  iconBox: { padding: 6, borderRadius: 12 },
  iconBoxActive: { backgroundColor: '#ffffff' },
});
