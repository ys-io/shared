import { Text as RNText, StyleSheet } from "react-native";
import { useTheme } from "../theme";
import type { TextProps } from "../types";

export function Text({
  variant = "body",
  color,
  align,
  style,
  children,
  ...rest
}: TextProps) {
  const theme = useTheme();

  const variantStyles = StyleSheet.create({
    title: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.textPrimary,
    },
    subtitle: {
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.normal,
      color: theme.colors.textSecondary,
    },
    body: {
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.normal,
      color: theme.colors.textPrimary,
    },
    caption: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.normal,
      color: theme.colors.textTertiary,
    },
  });

  return (
    <RNText
      style={[
        variantStyles[variant],
        align && { textAlign: align },
        color && { color },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}
