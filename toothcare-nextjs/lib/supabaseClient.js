// lib/supabaseClient.js
// Client-side Supabase helper — uses only NEXT_PUBLIC_ keys.
// Safe to import in browser/React components. Never import supabase-server.js here.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist session across page reloads using localStorage
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// ─── Convenience helpers ──────────────────────────────────────────────────────

/**
 * Get the current authenticated user, or null.
 */
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  await supabase.auth.signOut();
}

/**
 * Initiate Google OAuth sign-in.
 * Redirects to /auth/callback after success.
 * @param {string} redirectTo – override the post-auth redirect (optional)
 */
export async function signInWithGoogle(redirectTo) {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        redirectTo ||
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });
  if (error) throw error;
}
