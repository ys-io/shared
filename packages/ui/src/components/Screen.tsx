import { useEffect } from "react";
import { SafeAreaView, View, StyleSheet, Platform } from "react-native";
import { useTheme } from "../theme";
import type { ScreenProps } from "../types";

const MAX_WIDTH = 480;
let globalStyleInjected = false;

function injectGlobalWebStyles(focusColor: string) {
  if (Platform.OS !== "web" || globalStyleInjected) return;
  globalStyleInjected = true;

  const css = `
    *:focus { outline: none; }
    *:focus-visible {
      outline: 2px solid ${focusColor};
      outline-offset: 2px;
      border-radius: 8px;
    }
    input:focus-visible, textarea:focus-visible {
      outline: none;
    }
    ::selection {
      background: ${focusColor}40;
    }
  `;

  const styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);
}

export function Screen({ children, style }: ScreenProps) {
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

  return (
    <SafeAreaView style={[styles.outer, style]}>
      <View style={styles.inner}>{children}</View>
    </SafeAreaView>
  );
}
