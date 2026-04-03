export interface AuthUser {
  id: string;
  email: string | null;
  provider: "email" | "google" | "kakao" | "naver";
  displayName: string | null;
  avatarUrl: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
