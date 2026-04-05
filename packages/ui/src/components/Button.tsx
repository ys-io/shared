import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, View, StyleSheet, Platform } from "react-native";
import { Text } from "./Text";
import { useTheme } from "../theme";
import type { ButtonProps } from "../types";

export function Button({
  title,
  onPress,
  variant = "primary",
  icon,
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const pressableRef = useRef<View>(null);

  useEffect(() => {
    if (Platform.OS !== "web" || !pressableRef.current) return;
    const el = pressableRef.current as unknown as HTMLElement;
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " && !disabled && !loading) {
        e.preventDefault();
        onPress();
      }
    };
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [onPress, disabled, loading]);

  const base = {
    borderRadius: theme.radii.lg,
    alignItems: "center" as const,
    borderWidth: 2,
    borderColor: "transparent",
  };

  const variants = StyleSheet.create({
    primary: {
      ...base,
      backgroundColor: theme.colors.primary,
      paddingVertical: 16,
    },
    secondary: {
      ...base,
      backgroundColor: theme.colors.secondary,
      paddingVertical: 16,
    },
    outline: {
      ...base,
      backgroundColor: "transparent",
      borderColor: theme.colors.border,
      paddingVertical: 16,
    },
    ghost: {
      ...base,
      backgroundColor: "transparent",
      paddingVertical: 12,
    },
    danger: {
      ...base,
      backgroundColor: "transparent",
      paddingVertical: 12,
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
      ref={pressableRef}
      onPress={onPress}
      disabled={isDisabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={({ pressed }) => [
        variants[variant],
        focused && !isDisabled && { borderColor: theme.colors.focus },
        isDisabled && { opacity: 0.5 },
        pressed && !isDisabled && { opacity: 0.7 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {icon}
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
        </View>
      )}
    </Pressable>
  );
}
