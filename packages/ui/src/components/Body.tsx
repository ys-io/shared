import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../theme";
import type { BodyProps } from "../types";

export function Body({
  children,
  centered = false,
  scroll = false,
  style,
}: BodyProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    body: {
      flex: 1,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
    },
    centered: {
      justifyContent: "center",
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
    },
  });

  if (scroll) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          centered && styles.centered,
          style,
        ]}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.body, centered && styles.centered, style]}>
      {children}
    </View>
  );
}
