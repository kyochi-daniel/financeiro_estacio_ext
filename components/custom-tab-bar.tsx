import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            // @ts-ignore navigation typing for route navigate
            if (!isFocused && !event.defaultPrevented) {
              // navigate by name — use any to satisfy typing across different navigator setups
              // @ts-ignore
              navigation.navigate(route.name);
            }
          };

          const icon = (() => {
            if (route.name === 'Home') return <MaterialCommunityIcons name="home" size={20} color={isFocused ? '#0e8f76' : '#9aa0a6'} />;
            if (route.name === 'Explore') return <Feather name="search" size={20} color={isFocused ? '#0e8f76' : '#9aa0a6'} />;
            return <Feather name="circle" size={20} color={isFocused ? '#0e8f76' : '#9aa0a6'} />;
          })();

          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.tab} activeOpacity={0.8}>
              <View style={[styles.iconWrap, isFocused ? styles.iconActive : undefined]}>{icon}</View>
              <Text style={[styles.label, isFocused ? styles.labelActive : undefined]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: 'transparent' },
  inner: {
    marginHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 6,
  },
  tab: { alignItems: 'center', justifyContent: 'center' },
  iconWrap: { padding: 8 },
  iconActive: { backgroundColor: '#e6f6f2', borderRadius: 10 },
  label: { fontSize: 12, color: '#9aa0a6', marginTop: 4 },
  labelActive: { color: '#0e8f76', fontWeight: '600' },
});
