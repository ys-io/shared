import type {
  StyleProp,
  TextStyle,
  ViewStyle,
  TextInputProps as RNTextInputProps,
  TextProps as RNTextProps,
} from "react-native";
import type { ReactNode } from "react";

// ─── Theme ──────────────────────────────────────────────

export interface ThemeTokens {
  colors: {
    background: string;
    surface: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    danger: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    textMuted: string;
    border: string;
    borderLight: string;
    placeholder: string;
    focus: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radii: {
    sm: number;
    md: number;
    lg: number;
  };
  fontSizes: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  fontWeights: {
    normal: TextStyle["fontWeight"];
    semibold: TextStyle["fontWeight"];
    bold: TextStyle["fontWeight"];
  };
}

// ─── Components ─────────────────────────────────────────

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export interface TextProps extends RNTextProps {
  variant?: "title" | "subtitle" | "body" | "caption";
  color?: string;
  align?: "left" | "center" | "right";
  children: ReactNode;
}

export interface ScreenProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface HeaderProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface BodyProps {
  children: ReactNode;
  centered?: boolean;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
}

export interface FooterProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface LoadingScreenProps {
  color?: string;
  size?: "small" | "large";
}

export interface DividerProps {
  label?: string;
  style?: StyleProp<ViewStyle>;
}
