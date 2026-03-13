// pages/api/book.js
// POST { patient_id, doctor_id, service_id, appointment_ts }
// Creates an appointment after validating:
//  1. All required fields present
//  2. Doctor is available on that day/time (availability table)
//  3. No conflicting appointment exists for the doctor at that timestamp
//
// Security notes:
//  - Accepts POST only (CSRF mitigation)
//  - Uses SERVICE_ROLE_KEY server client for integrity-critical checks
//  - All inputs validated before any DB write

import { createServerClient } from "../../lib/supabase-server";

export default async function handler(req, res) {
  // ── Method guard ────────────────────────────────────────────────────────
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── Optional origin check in production ─────────────────────────────────
  // const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL;
  // if (req.headers.origin && req.headers.origin !== allowedOrigin) {
  //   return res.status(403).json({ error: "Forbidden" });
  // }

  const { patient_id, doctor_id, service_id, appointment_ts } = req.body ?? {};

  // ── Input validation ────────────────────────────────────────────────────
  if (!patient_id || !doctor_id || !service_id || !appointment_ts) {
    return res.status(400).json({ error: "Missing required fields: patient_id, doctor_id, service_id, appointment_ts" });
  }

  // Validate appointment_ts is a valid ISO date in the future
  const apptDate = new Date(appointment_ts);
  if (isNaN(apptDate.getTime())) {
    return res.status(400).json({ error: "Invalid appointment_ts — must be a valid ISO datetime string" });
  }
  if (apptDate <= new Date()) {
    return res.status(400).json({ error: "Appointment must be scheduled in the future" });
  }

  try {
    const supabase = createServerClient();

    // ── 1. Check doctor availability for that day/time ───────────────────
    const dayOfWeek = apptDate.toLocaleDateString("en-US", { weekday: "long" });
    const timeStr = apptDate.toTimeString().slice(0, 5); // HH:MM

    const { data: avail } = await supabase
      .from("availability")
      .select("start_time, end_time, is_available")
      .eq("doctor_id", doctor_id)
      .eq("day_of_week", dayOfWeek)
      .eq("is_available", true);

    const inRange = (avail ?? []).some(({ start_time, end_time }) => {
      const slotStart = timeToMinutes(start_time);
      const slotEnd = timeToMinutes(end_time);
      const apptMin = timeToMinutes(timeStr);
      return apptMin >= slotStart && apptMin + 30 <= slotEnd;
    });

    if (!inRange) {
      return res.status(409).json({ error: "Doctor is not available at the requested time slot" });
    }

    // ── 2. Check for conflicting appointment (same doctor, same timestamp) ─
    const windowStart = new Date(apptDate.getTime() - 29 * 60 * 1000).toISOString();
    const windowEnd = new Date(apptDate.getTime() + 29 * 60 * 1000).toISOString();

    const { data: conflict } = await supabase
      .from("appointments")
      .select("id")
      .eq("doctor_id", doctor_id)
      .neq("status", "cancelled")
      .gte("appointment_ts", windowStart)
      .lte("appointment_ts", windowEnd)
      .limit(1);

    if (conflict && conflict.length > 0) {
      return res.status(409).json({ error: "This time slot is already booked. Please choose another time." });
    }

    // ── 3. Insert appointment ────────────────────────────────────────────
    const { data: newAppt, error: insertError } = await supabase
      .from("appointments")
      .insert({
        patient_id,
        doctor_id,
        service_id,
        appointment_ts,
        status: "confirmed",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return res.status(201).json({ success: true, appointment: newAppt });
  } catch (err) {
    console.error("[book] Error:", err.message);
    return res.status(500).json({ error: err.message ?? "Failed to book appointment" });
  }
}

/** Convert "HH:MM" → integer minutes since midnight */
function timeToMinutes(str) {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
}
