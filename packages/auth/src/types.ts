export type AuthProvider = "email" | "google" | "kakao" | "naver";

export interface AuthUser {
  id: string;
  email: string | null;
  provider: AuthProvider;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
