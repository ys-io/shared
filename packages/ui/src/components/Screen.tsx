import { SafeAreaView, StyleSheet } from "react-native";
import { useTheme } from "../theme";
import type { ScreenProps } from "../types";

export function Screen({ children, style }: ScreenProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });

  return (
    <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>
  );
}
