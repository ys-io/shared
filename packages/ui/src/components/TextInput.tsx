import { forwardRef, useState } from "react";
import {
  View,
  Text as RNText,
  TextInput as RNTextInput,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { Text } from "./Text";
import { useTheme } from "../theme";
import type { TextInputProps } from "../types";

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  function TextInput(
    { label, error, showPasswordToggle, containerStyle, style, secureTextEntry, ...rest },
    ref,
  ) {
    const theme = useTheme();
    const hasError = !!error;
    const [hidden, setHidden] = useState(true);
    const [focused, setFocused] = useState(false);

    const isSecure = secureTextEntry && hidden;

    const styles = StyleSheet.create({
      container: {},
      inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.surface,
        borderWidth: hasError ? 1 : focused ? 1 : 0,
        borderColor: hasError
          ? theme.colors.danger
          : focused
            ? theme.colors.focus
            : "transparent",
        borderRadius: theme.radii.lg,
        paddingHorizontal: theme.spacing.lg,
      },
      input: {
        flex: 1,
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
      eyeButton: {
        padding: theme.spacing.sm,
      },
      eyeText: {
        fontSize: 20,
        color: theme.colors.textMuted,
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
            secureTextEntry={isSecure}
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
          {showPasswordToggle && secureTextEntry ? (
            <Pressable
              onPress={() => setHidden(!hidden)}
              style={styles.eyeButton}
            >
              <RNText style={styles.eyeText}>{hidden ? "👁" : "👁‍🗨"}</RNText>
            </Pressable>
          ) : null}
        </View>
        {hasError ? <RNText style={styles.errorText}>{error}</RNText> : null}
      </View>
    );
  },
);
