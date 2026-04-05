import { forwardRef, useState } from "react";
import {
  View,
  Text as RNText,
  TextInput as RNTextInput,
  StyleSheet,
  Platform,
} from "react-native";
import { Text } from "./Text";
import { useTheme } from "../theme";
import type { TextInputProps } from "../types";

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  function TextInput(
    { label, error, containerStyle, style, secureTextEntry, ...rest },
    ref,
  ) {
    const theme = useTheme();
    const hasError = !!error;
    const [focused, setFocused] = useState(false);

    const styles = StyleSheet.create({
      container: {},
      inputWrapper: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: hasError
          ? theme.colors.danger
          : focused
            ? theme.colors.focus
            : "transparent",
        borderRadius: theme.radii.lg,
        paddingHorizontal: theme.spacing.lg,
      },
      input: {
        paddingVertical: theme.spacing.lg,
        fontSize: theme.fontSizes.md,
        color: theme.colors.textPrimary,
        ...(Platform.OS === "web" ? { outlineStyle: "none" } : {}),
      } as any,
      label: {
        marginBottom: theme.spacing.sm,
        color: theme.colors.textMuted,
      },
      errorText: {
        marginTop: theme.spacing.xs,
        color: theme.colors.danger,
        fontSize: theme.fontSizes.sm,
      },
    });

    return (
      <View style={[styles.container, containerStyle]}>
        {label ? (
          <Text variant="caption" style={styles.label}>
            {label}
          </Text>
        ) : null}
        <View style={styles.inputWrapper}>
          <RNTextInput
            ref={ref}
            placeholderTextColor={theme.colors.placeholder}
            secureTextEntry={secureTextEntry}
            onFocus={(e) => {
              setFocused(true);
              rest.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              rest.onBlur?.(e);
            }}
            style={[styles.input, style]}
            {...rest}
          />
        </View>
        {hasError ? <RNText style={styles.errorText}>{error}</RNText> : null}
      </View>
    );
  },
);
