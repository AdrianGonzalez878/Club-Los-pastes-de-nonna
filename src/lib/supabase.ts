import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getEnv } from "@/lib/env";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const env = getEnv();
  if (!env) return null;
  if (!client) {
    client = createClient(env.supabaseUrl, env.serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return client;
}
