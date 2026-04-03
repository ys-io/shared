import type { ThemeTokens } from "../types";

export const defaultTheme: ThemeTokens = {
  colors: {
    background: "#ffffff",
    surface: "#fafafa",
    primary: "#000000",
    primaryForeground: "#ffffff",
    danger: "#ee0000",
    textPrimary: "#000000",
    textSecondary: "#666666",
    textTertiary: "#888888",
    textMuted: "#999999",
    border: "#dddddd",
    borderLight: "#eeeeee",
    placeholder: "#cccccc",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radii: {
    sm: 4,
    md: 8,
    lg: 12,
  },
  fontSizes: {
    sm: 14,
    md: 16,
    lg: 18,
    xl: 28,
    xxl: 32,
  },
  fontWeights: {
    normal: "normal",
    semibold: "600",
    bold: "bold",
  },
};
