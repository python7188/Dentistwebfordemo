// pages/admin-dashboard.jsx
// Doctor-only protected dashboard.
// Shows today's + upcoming appointments and an availability editor.
// All writes go through /api/* routes that use lib/supabase-server.js (SERVICE_ROLE_KEY).

import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { supabase, getCurrentUser, signOut } from "../../lib/supabaseClient";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/* ──────────────────────────────────────────────────────────────────────────── */
/* AvailabilityEditor                                                           */
/* ──────────────────────────────────────────────────────────────────────────── */
function AvailabilityEditor({ doctorId }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null); // id of saving row
  const [announcement, setAnnouncement] = useState("");

  const fetchRows = async () => {
    const { data } = await supabase
      .from("availability")
      .select("*")
      .eq("doctor_id", doctorId)
      .order("day_of_week");
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
  }, [doctorId]);

  const updateRow = (id, field, value) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const saveRow = async (row) => {
    setSaving(row.id);
    try {
      let res, err;
      if (row.id.startsWith("new-")) {
        // Insert new row
        ({ data: res, error: err } = await supabase
          .from("availability")
          .insert({ doctor_id: doctorId, day_of_week: row.day_of_week, start_time: row.start_time, end_time: row.end_time, is_available: row.is_available })
          .select()
          .single());
        if (!err) setRows((prev) => prev.map((r) => (r.id === row.id ? res : r)));
      } else {
        ({ error: err } = await supabase
          .from("availability")
          .update({ day_of_week: row.day_of_week, start_time: row.start_time, end_time: row.end_time, is_available: row.is_available })
          .eq("id", row.id));
      }
      if (err) throw err;
      setAnnouncement("Availability saved.");
    } catch (e) {
      setAnnouncement("Save failed: " + e.message);
    } finally {
      setSaving(null);
    }
  };

  const deleteRow = async (id) => {
    if (id.startsWith("new-")) {
      setRows((prev) => prev.filter((r) => r.id !== id));
      return;
    }
    const { error } = await supabase.from("availability").delete().eq("id", id);
    if (!error) {
      setRows((prev) => prev.filter((r) => r.id !== id));
      setAnnouncement("Row deleted.");
    }
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: `new-${Date.now()}`, doctor_id: doctorId, day_of_week: "Monday", start_time: "09:00", end_time: "17:00", is_available: true },
    ]);
  };

  if (loading) return <p>Loading availability…</p>;

  return (
    <section aria-label="Availability editor" style={admStyles.section}>
      <div role="status" aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>
        {announcement}
      </div>
      <div style={admStyles.sectionHeader}>
        <h2 style={admStyles.sectionTitle}>Availability</h2>
        <button onClick={addRow} style={admStyles.addBtn} aria-label="Add availability slot">+ Add Slot</button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={admStyles.table} aria-label="Doctor availability schedule">
          <thead>
            <tr>
              {["Day", "Start Time", "End Time", "Available", "Actions"].map((h) => (
                <th key={h} style={admStyles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} style={admStyles.tr}>
                <td style={admStyles.td}>
                  <select value={row.day_of_week} onChange={(e) => updateRow(row.id, "day_of_week", e.target.value)} style={admStyles.select} aria-label="Day of week">
                    {DAYS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </td>
                <td style={admStyles.td}>
                  <input type="time" value={row.start_time} onChange={(e) => updateRow(row.id, "start_time", e.target.value)} style={admStyles.timeInput} aria-label="Start time" />
                </td>
                <td style={admStyles.td}>
                  <input type="time" value={row.end_time} onChange={(e) => updateRow(row.id, "end_time", e.target.value)} style={admStyles.timeInput} aria-label="End time" />
                </td>
                <td style={admStyles.td}>
                  <input
                    type="checkbox"
                    checked={row.is_available}
                    onChange={(e) => updateRow(row.id, "is_available", e.target.checked)}
                    aria-label="Toggle availability"
                    style={{ width: "18px", height: "18px" }}
                  />
                </td>
                <td style={admStyles.td}>
                  <button onClick={() => saveRow(row)} disabled={saving === row.id} style={admStyles.saveBtn} aria-label="Save row">
                    {saving === row.id ? "…" : "Save"}
                  </button>
                  <button onClick={() => deleteRow(row.id)} style={admStyles.deleteBtn} aria-label="Delete row">
                    Del
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} style={{ padding: "1rem", color: "#888", textAlign: "center" }}>No availability set. Click "+ Add Slot" to start.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* Admin Dashboard — main page                                                  */
/* ──────────────────────────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todayAppts, setTodayAppts] = useState([]);
  const [upcomingAppts, setUpcomingAppts] = useState([]);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      if (!u) {
        window.location.href = "/doctor-login";
        return;
      }

      // Verify doctor role
      const res = await fetch("/api/doctor-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: u.id }),
      });
      const json = await res.json();
      if (!json.isDoctor) {
        await signOut();
        window.location.href = "/doctor-login";
        return;
      }

      setUser(u);

      // Fetch doctor profile
      const { data: doctorData } = await supabase
        .from("doctors")
        .select("id, name, specialization, email")
        .eq("auth_uid", u.id)
        .single();
      setDoctor(doctorData);

      if (doctorData) {
        await fetchAppointments(doctorData.id);
      }

      setLoading(false);
    })();
  }, []);

  const fetchAppointments = async (doctorId) => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
    const futureEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30).toISOString();

    const [todayRes, upcomingRes] = await Promise.all([
      supabase
        .from("appointments")
        .select("id, appointment_ts, status, patients(name, email), services(name)")
        .eq("doctor_id", doctorId)
        .gte("appointment_ts", todayStart)
        .lt("appointment_ts", todayEnd)
        .order("appointment_ts"),
      supabase
        .from("appointments")
        .select("id, appointment_ts, status, patients(name, email), services(name)")
        .eq("doctor_id", doctorId)
        .gte("appointment_ts", todayEnd)
        .lte("appointment_ts", futureEnd)
        .order("appointment_ts"),
    ]);

    setTodayAppts(todayRes.data ?? []);
    setUpcomingAppts(upcomingRes.data ?? []);
  };

  if (loading) {
    return (
      <div style={admStyles.loadingPage}>
        <div role="status" aria-label="Loading">Loading dashboard…</div>
      </div>
    );
  }

  const initials = (name = "") => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const AppointmentRow = ({ appt }) => (
    <li style={admStyles.apptCard}>
      <div style={admStyles.avatar} aria-hidden="true">
        {initials(appt.patients?.name ?? "P")}
      </div>
      <div style={{ flex: 1 }}>
        <p style={admStyles.apptName}>{appt.patients?.name ?? "—"}</p>
        <p style={admStyles.apptService}>{appt.services?.name}</p>
        <p style={admStyles.apptTime}>{new Date(appt.appointment_ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
      </div>
      <span style={{ ...admStyles.badge, background: appt.status === "confirmed" ? "#d4edda" : "#fff3cd", color: appt.status === "confirmed" ? "#155724" : "#856404" }}>
        {appt.status}
      </span>
    </li>
  );

  return (
    <>
      <Head><title>Doctor Dashboard | TOOTHCARE</title></Head>
      <div style={admStyles.layout}>
        {/* Sidebar */}
        <aside style={admStyles.sidebar} aria-label="Doctor navigation">
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={admStyles.logoBrand}>TOOTH<span style={{ color: "#FF8A5B" }}>CARE</span></span>
          </Link>
          <div style={admStyles.doctorInfo}>
            <div style={admStyles.avatarLg}>{initials(doctor?.name)}</div>
            <p style={admStyles.doctorName}>{doctor?.name ?? "Doctor"}</p>
            <p style={admStyles.doctorSpec}>{doctor?.specialization}</p>
          </div>
          <nav style={admStyles.nav}>
            {[{ label: "Today's Schedule", icon: "📅" }, { label: "Upcoming", icon: "🗓️" }, { label: "Availability", icon: "⏰" }].map((item) => (
              <a key={item.label} href={`#${item.label.toLowerCase().replace(/[^a-z]/g, "-")}`} style={admStyles.navItem}>
                {item.icon} {item.label}
              </a>
            ))}
          </nav>
          <button
            onClick={async () => { await signOut(); window.location.href = "/doctor-login"; }}
            style={admStyles.signOutBtn}
            aria-label="Sign out"
          >
            Sign Out
          </button>
        </aside>

        {/* Main */}
        <main style={admStyles.main} id="main-content">
          <h1 style={admStyles.pageTitle}>Welcome, {doctor?.name ?? "Doctor"}</h1>

          {/* Today */}
          <section id="today-s-schedule" aria-label="Today's appointments" style={admStyles.section}>
            <h2 style={admStyles.sectionTitle}>
              Today&apos;s Schedule —{" "}
              <span style={{ fontWeight: 400, fontSize: "0.95rem", color: "#555" }}>
                {new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
              </span>
            </h2>
            {todayAppts.length === 0 ? (
              <p style={admStyles.empty}>No appointments today.</p>
            ) : (
              <ul style={admStyles.apptList} aria-label="Today's appointments">
                {todayAppts.map((a) => <AppointmentRow key={a.id} appt={a} />)}
              </ul>
            )}
          </section>

          {/* Upcoming */}
          <section id="upcoming" aria-label="Upcoming appointments" style={admStyles.section}>
            <h2 style={admStyles.sectionTitle}>Upcoming (Next 30 Days)</h2>
            {upcomingAppts.length === 0 ? (
              <p style={admStyles.empty}>No upcoming appointments.</p>
            ) : (
              <ul style={admStyles.apptList} aria-label="Upcoming appointments list">
                {upcomingAppts.map((a) => (
                  <li key={a.id} style={admStyles.apptCard}>
                    <div style={admStyles.avatar} aria-hidden="true">{initials(a.patients?.name ?? "P")}</div>
                    <div style={{ flex: 1 }}>
                      <p style={admStyles.apptName}>{a.patients?.name ?? "—"}</p>
                      <p style={admStyles.apptService}>{a.services?.name}</p>
                      <p style={admStyles.apptTime}>{new Date(a.appointment_ts).toLocaleString()}</p>
                    </div>
                    <span style={{ ...admStyles.badge, background: "#e8f4f8", color: "#1F4E79" }}>{a.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Availability Editor */}
          {doctor && <AvailabilityEditor doctorId={doctor.id} />}
        </main>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* Styles                                                                       */
/* ──────────────────────────────────────────────────────────────────────────── */
const admStyles = {
  loadingPage: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#555" },
  layout: { display: "flex", minHeight: "100vh", fontFamily: "var(--font-body, Inter, sans-serif)" },
  sidebar: { width: "260px", background: "linear-gradient(180deg, #1F4E79 0%, #163b73 100%)", color: "#fff", padding: "1.75rem 1.25rem", display: "flex", flexDirection: "column", gap: "1.5rem", flexShrink: 0 },
  logoBrand: { fontSize: "1.2rem", fontWeight: 800, color: "#fff", display: "block", marginBottom: "1rem" },
  doctorInfo: { textAlign: "center" },
  avatarLg: { width: "64px", height: "64px", borderRadius: "50%", background: "#FF8A5B", color: "#fff", fontSize: "1.3rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.5rem" },
  doctorName: { fontWeight: 700, fontSize: "1rem", marginBottom: "0.2rem" },
  doctorSpec: { fontSize: "0.8rem", opacity: 0.75 },
  nav: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  navItem: { display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(255,255,255,0.08)", color: "#fff", textDecoration: "none", padding: "0.75rem 1rem", borderRadius: "0.65rem", fontSize: "0.875rem", minHeight: "44px" },
  signOutBtn: { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "0.65rem 1rem", borderRadius: "2rem", cursor: "pointer", fontSize: "0.875rem", marginTop: "auto", minHeight: "44px" },
  main: { flex: 1, padding: "2rem", background: "#f8fafc", overflowY: "auto" },
  pageTitle: { fontSize: "1.5rem", fontWeight: 700, color: "#111", marginBottom: "1.5rem" },
  section: { background: "#fff", borderRadius: "1.25rem", padding: "1.5rem", marginBottom: "1.5rem", border: "1.5px solid #e8eaec" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
  sectionTitle: { fontSize: "1.1rem", fontWeight: 700, color: "#1F4E79", marginBottom: "1rem" },
  addBtn: { background: "#FF8A5B", color: "#fff", border: "none", borderRadius: "2rem", padding: "0.5rem 1rem", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", minHeight: "44px" },
  apptList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" },
  apptCard: { display: "flex", alignItems: "center", gap: "1rem", background: "#f8fafc", borderRadius: "1rem", padding: "1rem 1.25rem", border: "1.5px solid #e8eaec" },
  avatar: { width: "40px", height: "40px", borderRadius: "50%", background: "#1F4E79", color: "#fff", fontWeight: 700, fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  apptName: { fontWeight: 700, color: "#111", fontSize: "0.9rem" },
  apptService: { color: "#1F4E79", fontSize: "0.8rem", fontWeight: 600 },
  apptTime: { color: "#888", fontSize: "0.8rem" },
  badge: { display: "inline-block", padding: "0.3rem 0.75rem", borderRadius: "2rem", fontSize: "0.75rem", fontWeight: 600, textTransform: "capitalize" },
  empty: { color: "#888", fontSize: "0.9rem" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" },
  th: { textAlign: "left", padding: "0.65rem 0.75rem", fontWeight: 600, color: "#444", borderBottom: "2px solid #e8eaec", whiteSpace: "nowrap" },
  td: { padding: "0.65rem 0.75rem", borderBottom: "1px solid #f0f0f0" },
  tr: {},
  select: { padding: "0.4rem 0.5rem", border: "1.5px solid #d0d5dd", borderRadius: "0.5rem", fontSize: "0.85rem", minHeight: "36px" },
  timeInput: { padding: "0.4rem 0.5rem", border: "1.5px solid #d0d5dd", borderRadius: "0.5rem", fontSize: "0.85rem", minHeight: "36px" },
  saveBtn: { background: "#1F4E79", color: "#fff", border: "none", borderRadius: "0.5rem", padding: "0.4rem 0.75rem", fontWeight: 600, cursor: "pointer", fontSize: "0.8rem", marginRight: "0.4rem", minHeight: "36px" },
  deleteBtn: { background: "#c0392b", color: "#fff", border: "none", borderRadius: "0.5rem", padding: "0.4rem 0.75rem", fontWeight: 600, cursor: "pointer", fontSize: "0.8rem", minHeight: "36px" },
};
