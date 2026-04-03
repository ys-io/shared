import { View, TextInput as RNTextInput, StyleSheet } from "react-native";
import { Text } from "./Text";
import { useTheme } from "../theme";
import type { TextInputProps } from "../types";

export function TextInput({
  label,
  error,
  containerStyle,
  style,
  ...rest
}: TextInputProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {},
    input: {
      borderWidth: 1,
      borderColor: error ? theme.colors.danger : theme.colors.border,
      borderRadius: theme.radii.md,
      padding: theme.spacing.md,
      fontSize: theme.fontSizes.md,
      color: theme.colors.textPrimary,
    },
    label: {
      marginBottom: theme.spacing.xs,
    },
    error: {
      marginTop: theme.spacing.xs,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="body" style={styles.label}>
          {label}
        </Text>
      )}
      <RNTextInput
        placeholderTextColor={theme.colors.placeholder}
        style={[styles.input, style]}
        {...rest}
      />
      {error && (
        <Text variant="caption" color={theme.colors.danger} style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}
