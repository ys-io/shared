import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
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

  const variants = StyleSheet.create({
    primary: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.lg,
      paddingVertical: 18,
      alignItems: "center" as const,
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.lg,
      paddingVertical: 18,
      alignItems: "center" as const,
    },
    ghost: {
      backgroundColor: "transparent",
      paddingVertical: 14,
      alignItems: "center" as const,
    },
    danger: {
      backgroundColor: "transparent",
      paddingVertical: 14,
      alignItems: "center" as const,
    },
  });

  const textColors: Record<string, string> = {
    primary: theme.colors.textPrimary,
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
