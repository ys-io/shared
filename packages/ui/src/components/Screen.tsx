import { SafeAreaView, View, StyleSheet } from "react-native";
import { useTheme } from "../theme";
import type { ScreenProps } from "../types";

const MAX_WIDTH = 480;

export function Screen({ children, style }: ScreenProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    outer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    inner: {
      flex: 1,
      width: "100%",
      maxWidth: MAX_WIDTH,
      alignSelf: "center",
    },
  });

  return (
    <SafeAreaView style={[styles.outer, style]}>
      <View style={styles.inner}>{children}</View>
    </SafeAreaView>
  );
}
