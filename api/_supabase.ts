import { createClient } from "@supabase/supabase-js";

export function adminClient() {
  const url = process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE!; // server-only
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
