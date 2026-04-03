import { View, StyleSheet } from "react-native";
import { useTheme } from "../theme";
import type { FooterProps } from "../types";

export function Footer({ children, style }: FooterProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    footer: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderLight,
    },
  });

  return <View style={[styles.footer, style]}>{children}</View>;
}
