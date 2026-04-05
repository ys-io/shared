import { useEffect } from "react";
import { SafeAreaView, View, ScrollView, StyleSheet, Platform } from "react-native";
import { useTheme } from "../theme";
import type { ScreenProps } from "../types";

const MAX_WIDTH = 480;
let globalStyleInjected = false;

function injectGlobalWebStyles(focusColor: string) {
  if (Platform.OS !== "web" || globalStyleInjected) return;
  globalStyleInjected = true;

  const css = `
    *:focus, *:focus-visible { outline: none; }
    ::selection { background: ${focusColor}40; }
  `;

  const styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);
}

export function Screen({ children, scroll = false, style }: ScreenProps) {
  const theme = useTheme();

  useEffect(() => {
    injectGlobalWebStyles(theme.colors.focus);
  }, [theme.colors.focus]);

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

  if (scroll) {
    return (
      <SafeAreaView style={[styles.outer, style]}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
        >
          <View style={[styles.inner, { flex: undefined }]}>{children}</View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.outer, style]}>
      <View style={styles.inner}>{children}</View>
    </SafeAreaView>
  );
}
