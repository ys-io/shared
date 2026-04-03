import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseClientOptions {
  url: string;
  anonKey: string;
  storage?: any;
}

let instance: SupabaseClient | null = null;

export function createSupabaseClient({
  url,
  anonKey,
  storage,
}: SupabaseClientOptions): SupabaseClient {
  if (instance) return instance;

  instance = createClient(url, anonKey, {
    auth: {
      ...(storage ? { storage } : {}),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  return instance;
}
