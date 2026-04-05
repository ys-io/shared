export type AuthProviderType = "email" | "google";

export interface AuthUser {
  id: string;
  email: string | null;
  provider: AuthProviderType;
  displayName: string | null;
  avatarUrl: string | null;
}

export type AuthKitView =
  | "login"
  | "signup"
  | "signupOtp"
  | "forgotPassword"
  | "terms"
  | "privacy";

export type ForgotPasswordStep = "email" | "otp" | "reset" | "done";
