import { ActivityIndicator, Pressable, StyleSheet, Platform } from "react-native";
import { Text } from "./Text";
import { useTheme } from "../theme";
import type { ButtonProps } from "../types";

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const theme = useTheme();

  const base = {
    borderRadius: theme.radii.lg,
    alignItems: "center" as const,
    ...(Platform.OS === "web" ? { outlineStyle: "none" } : {}),
  } as any;

  const variants = StyleSheet.create({
    primary: {
      ...base,
      backgroundColor: theme.colors.primary,
      paddingVertical: 18,
    },
    secondary: {
      ...base,
      backgroundColor: theme.colors.secondary,
      paddingVertical: 18,
    },
    outline: {
      ...base,
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingVertical: 18,
    },
    ghost: {
      ...base,
      backgroundColor: "transparent",
      paddingVertical: 14,
    },
    danger: {
      ...base,
      backgroundColor: "transparent",
      paddingVertical: 14,
    },
  });

  const textColors: Record<string, string> = {
    primary: theme.colors.primaryForeground,
    secondary: theme.colors.secondaryForeground,
    outline: theme.colors.textPrimary,
    ghost: theme.colors.textSecondary,
    danger: theme.colors.danger,
  };

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        variants[variant],
        isDisabled && { opacity: 0.5 },
        pressed && !isDisabled && { opacity: 0.7 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <Text
          variant="body"
          style={[
            {
              color: textColors[variant],
              fontWeight: theme.fontWeights.semibold,
              fontSize: theme.fontSizes.md,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
