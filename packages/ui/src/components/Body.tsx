import { View } from "react-native";
import { useTheme } from "../theme";
import type { BodyProps } from "../types";

export function Body({
  children,
  centered = false,
  style,
}: BodyProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          flex: 1,
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.lg,
        },
        centered && { justifyContent: "center" as const },
        style,
      ]}
    >
      {children}
    </View>
  );
}
