import { createContext, useContext, type ReactNode } from "react";
import type { ThemeTokens } from "../types";
import { defaultTheme } from "./tokens";

const ThemeContext = createContext<ThemeTokens>(defaultTheme);

interface ThemeProviderProps {
  theme?: Partial<ThemeTokens>;
  children: ReactNode;
}

function mergeTheme(
  base: ThemeTokens,
  overrides: Partial<ThemeTokens>,
): ThemeTokens {
  return {
    colors: { ...base.colors, ...overrides.colors },
    spacing: { ...base.spacing, ...overrides.spacing },
    radii: { ...base.radii, ...overrides.radii },
    fontSizes: { ...base.fontSizes, ...overrides.fontSizes },
    fontWeights: { ...base.fontWeights, ...overrides.fontWeights },
  };
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const value = theme ? mergeTheme(defaultTheme, theme) : defaultTheme;
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeTokens {
  return useContext(ThemeContext);
}
