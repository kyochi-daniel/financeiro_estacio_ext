import { ScrollView, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  /** Habilita/desabilita scroll automático. Padrão: true */
  enableScroll?: boolean;
};

const NAVBAR_SAFE_BOTTOM = 80; // espaço reservado para a barra inferior (ajustado)

export function ThemedView({ style, lightColor, darkColor, children, enableScroll = true, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  // Se scroll estiver habilitado, usamos SafeAreaView + ScrollView para permitir rolagem
  if (enableScroll) {
    return (
      <SafeAreaView style={[{ flex: 1, backgroundColor }]}>
        <ScrollView contentContainerStyle={[{ paddingBottom: NAVBAR_SAFE_BOTTOM }, style as any]} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Caso contrário, apenas SafeAreaView normal (para páginas com FlatList/Scroll nativo)
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor }, style]} {...otherProps}>
      <View style={{ flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
}
