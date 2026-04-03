import { ActivityIndicator } from "react-native";
import { Screen } from "./Screen";
import { Body } from "./Body";
import { useTheme } from "../theme";
import type { LoadingScreenProps } from "../types";

export function LoadingScreen({ color, size = "large" }: LoadingScreenProps) {
  const theme = useTheme();

  return (
    <Screen>
      <Body centered>
        <ActivityIndicator
          size={size}
          color={color ?? theme.colors.primary}
          style={{ alignSelf: "center" }}
        />
      </Body>
    </Screen>
  );
}
