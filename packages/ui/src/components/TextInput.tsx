import { forwardRef } from "react";
import {
  View,
  Text as RNText,
  TextInput as RNTextInput,
  StyleSheet,
} from "react-native";
import { Text } from "./Text";
import { useTheme } from "../theme";
import type { TextInputProps } from "../types";

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  function TextInput({ label, error, containerStyle, style, ...rest }, ref) {
    const theme = useTheme();
    const hasError = !!error;

    const styles = StyleSheet.create({
      container: {},
      input: {
        borderWidth: 1,
        borderColor: hasError ? theme.colors.danger : theme.colors.border,
        borderRadius: theme.radii.md,
        padding: theme.spacing.md,
        fontSize: theme.fontSizes.md,
        color: theme.colors.textPrimary,
      },
      label: {
        marginBottom: theme.spacing.xs,
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
          <Text variant="body" style={styles.label}>
            {label}
          </Text>
        ) : null}
        <RNTextInput
          ref={ref}
          placeholderTextColor={theme.colors.placeholder}
          style={[styles.input, style]}
          {...rest}
        />
        {hasError ? <RNText style={styles.errorText}>{error}</RNText> : null}
      </View>
    );
  },
);
