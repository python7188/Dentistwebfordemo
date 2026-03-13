// lib/supabase-server.js
// SERVER-SIDE ONLY — uses SERVICE_ROLE_KEY which bypasses Row Level Security.
// NEVER import this file in any client component or browser-executed code.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
  );
}

/**
 * Returns a Supabase admin client with SERVICE_ROLE_KEY.
 * Each API route should call this once per request — no singleton needed server-side.
 */
export function createServerClient() {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      // Disable session persistence — server client is stateless per request
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
