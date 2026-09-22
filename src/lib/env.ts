import "server-only";

export type AppEnv = {
  supabaseUrl: string;
  serviceRoleKey: string;
  staffPin: string;
  loyaltySecret: string;
};

export function getEnv(): AppEnv | null {
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const staffPin = process.env.STAFF_PIN?.trim();
  const loyaltySecret = process.env.LOYALTY_SECRET?.trim();

  if (!supabaseUrl || !serviceRoleKey || !staffPin || !loyaltySecret) {
    return null;
  }

  return { supabaseUrl, serviceRoleKey, staffPin, loyaltySecret };
}

export function isConfigured(): boolean {
  return getEnv() !== null;
}
