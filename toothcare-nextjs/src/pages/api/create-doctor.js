// pages/api/create-doctor.js
// Dev/admin convenience route — inserts a new doctor record.
// Protected by a x-admin-key header check.
//
// Usage (curl):
//   curl -X POST /api/create-doctor \
//     -H "x-admin-key: YOUR_ADMIN_KEY" \
//     -H "Content-Type: application/json" \
//     -d '{"auth_uid":"...","name":"Dr. Jane","email":"jane@tc.com","specialization":"Orthodontics"}'
//
// Security notes:
//  - POST only + x-admin-key check prevents casual abuse.
//  - Add ADMIN_CREATE_KEY to Vercel environment variables (never commit to code).
//  - Validate all fields server-side.
//  - Uses SERVICE_ROLE_KEY via supabase-server.js.

import { createServerClient } from "../../../lib/supabase-server";

export default async function handler(req, res) {
  // ── Method guard ────────────────────────────────────────────────────────
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── Admin key check ─────────────────────────────────────────────────────
  const adminKey = process.env.ADMIN_CREATE_KEY;
  if (!adminKey) {
    return res.status(503).json({ error: "Admin key not configured on server." });
  }
  if (req.headers["x-admin-key"] !== adminKey) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const { auth_uid, name, email, specialization } = req.body ?? {};

  // ── Input validation ────────────────────────────────────────────────────
  if (!auth_uid || typeof auth_uid !== "string") return res.status(400).json({ error: "auth_uid is required" });
  if (!name || typeof name !== "string") return res.status(400).json({ error: "name is required" });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Valid email is required" });
  if (!specialization || typeof specialization !== "string") return res.status(400).json({ error: "specialization is required" });

  try {
    const supabase = createServerClient();

    // Check for duplicate auth_uid
    const { data: existing } = await supabase
      .from("doctors")
      .select("id")
      .eq("auth_uid", auth_uid)
      .single();

    if (existing) {
      return res.status(409).json({ error: "A doctor with this auth_uid already exists" });
    }

    const { data, error } = await supabase
      .from("doctors")
      .insert({ auth_uid, name, email, specialization })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ success: true, doctor: data });
  } catch (err) {
    console.error("[create-doctor] Error:", err.message);
    return res.status(500).json({ error: err.message ?? "Failed to create doctor" });
  }
}
