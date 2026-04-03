import { View, StyleSheet } from "react-native";
import { Text } from "./Text";
import { useTheme } from "../theme";
import type { DividerProps } from "../types";

export function Divider({ label, style }: DividerProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: theme.spacing.xl,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    label: {
      marginHorizontal: theme.spacing.md,
    },
  });

  if (!label) {
    return <View style={[styles.line, { marginVertical: theme.spacing.xl }, style]} />;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.line} />
      <Text variant="caption" color={theme.colors.textMuted} style={styles.label}>
        {label}
      </Text>
      <View style={styles.line} />
    </View>
  );
}
