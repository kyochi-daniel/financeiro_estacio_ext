import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { BottomNavbar } from '@/components/bottom-navbar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppDataProvider } from './data/AppContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppDataProvider>
        {/* Hide header by default (so index won't show a back button). Enable header only for screens that need it. */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
        </Stack>
        <BottomNavbar />
        <StatusBar style="auto" />
      </AppDataProvider>
    </ThemeProvider>
  );
}
