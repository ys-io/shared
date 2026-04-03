import { SafeAreaView, StyleSheet } from "react-native";
import { useTheme } from "../theme";
import type { ScreenContainerProps } from "../types";

export function ScreenContainer({
  children,
  centered = false,
  style,
}: ScreenContainerProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.xl,
    },
    centered: {
      justifyContent: "center",
    },
  });

  return (
    <SafeAreaView style={[styles.container, centered && styles.centered, style]}>
      {children}
    </SafeAreaView>
  );
}
