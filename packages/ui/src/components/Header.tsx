import { View, StyleSheet } from "react-native";
import { useTheme } from "../theme";
import type { HeaderProps } from "../types";

export function Header({ children, style }: HeaderProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    header: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
  });

  return <View style={[styles.header, style]}>{children}</View>;
}
