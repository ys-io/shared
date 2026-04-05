import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { AuthKitConfig, AuthKitMessages } from "../types/config";
import { DEFAULT_MESSAGES } from "../constans/defaults";

interface AuthKitContextValue {
  config: AuthKitConfig;
  msg: Required<AuthKitMessages>;
}

const AuthKitContext = createContext<AuthKitContextValue | null>(null);

interface Props {
  config: AuthKitConfig;
  messages?: AuthKitMessages;
  children: ReactNode;
}

export function AuthKitProvider({ config, messages, children }: Props) {
  const msg = useMemo(
    () => ({ ...DEFAULT_MESSAGES, ...messages }),
    [messages],
  );

  return (
    <AuthKitContext.Provider value={{ config, msg }}>
      {children}
    </AuthKitContext.Provider>
  );
}

export function useAuthKit() {
  const ctx = useContext(AuthKitContext);
  if (!ctx) throw new Error("useAuthKit must be used within AuthKitProvider");
  return ctx;
}
