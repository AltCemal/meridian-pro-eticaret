import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// SECURITY: SUPABASE_SERVICE_ROLE_KEY must never be prefixed with
// NEXT_PUBLIC_ and must never be imported into a Client Component.
// It bypasses Row Level Security entirely.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
