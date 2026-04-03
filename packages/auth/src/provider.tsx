import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AuthState, AuthUser } from "./types";

const AuthContext = createContext<AuthState>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // TODO: Supabase auth listener 연동
  useEffect(() => {
    setState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
