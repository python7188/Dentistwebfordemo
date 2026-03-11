// pages/api/doctor-check.js
// POST { uid } → { isDoctor: bool, doctorId?: string }
//
// Security notes:
//  - Only accepts POST to prevent CSRF via GET links.
//  - Uses SERVICE_ROLE_KEY via supabase-server.js — never leaks to frontend.
//  - Check Origin header in production (see comment below).
//  - Validate input before querying.

import { createServerClient } from "../../../lib/supabase-server";

export default async function handler(req, res) {
  // ── CSRF mitigation: accept POST only ───────────────────────────────────
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── Optional: origin check in production ────────────────────────────────
  // const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL;
  // if (req.headers.origin && req.headers.origin !== allowedOrigin) {
  //   return res.status(403).json({ error: "Forbidden" });
  // }

  const { uid } = req.body ?? {};

  // ── Input validation ────────────────────────────────────────────────────
  if (!uid || typeof uid !== "string" || uid.length < 10) {
    return res.status(400).json({ error: "Invalid uid" });
  }

  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("doctors")
      .select("id")
      .eq("auth_uid", uid)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found — not a system error
      throw error;
    }

    if (!data) {
      return res.status(200).json({ isDoctor: false });
    }

    return res.status(200).json({ isDoctor: true, doctorId: data.id });
  } catch (err) {
    console.error("[doctor-check] Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
