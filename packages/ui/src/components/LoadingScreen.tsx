import { ActivityIndicator } from "react-native";
import { ScreenContainer } from "./ScreenContainer";
import { useTheme } from "../theme";
import type { LoadingScreenProps } from "../types";

export function LoadingScreen({ color, size = "large" }: LoadingScreenProps) {
  const theme = useTheme();

  return (
    <ScreenContainer centered>
      <ActivityIndicator
        size={size}
        color={color ?? theme.colors.primary}
        style={{ alignSelf: "center" }}
      />
    </ScreenContainer>
  );
}
