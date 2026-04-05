import { useCallback, useEffect, useRef, useState } from "react";
import type { User, SupabaseClient } from "@supabase/supabase-js";
import type { AuthUser, AuthProviderType } from "../types/auth";

function mapUser(user: User): AuthUser {
  const provider = (user.app_metadata?.provider ?? "email") as AuthProviderType;
  return {
    id: user.id,
    email: user.email ?? null,
    provider,
    displayName:
      user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    avatarUrl: user.user_metadata?.avatar_url ?? null,
  };
}

export function useAuthProvider(supabase: SupabaseClient) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const paused = useRef(false);

  const pauseAuthListener = useCallback(() => { paused.current = true; }, []);
  const resumeAuthListener = useCallback(() => { paused.current = false; }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? mapUser(session.user) : null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (paused.current) return;
      if (event === "PASSWORD_RECOVERY") return;
      setUser(session?.user ? mapUser(session.user) : null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    [supabase],
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string, name: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) throw error;
    },
    [supabase],
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, [supabase]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    pauseAuthListener,
    resumeAuthListener,
  };
}
