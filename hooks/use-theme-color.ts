/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';

export function useThemeColor(
  props: { light?: string },
  colorName: keyof typeof Colors.light
) {
  // Forçamos sempre o tema claro para evitar variações entre dispositivos
  const colorFromProps = props.light;
  if (colorFromProps) return colorFromProps;
  return Colors.light[colorName];
}
