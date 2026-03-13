// pages/patient-dashboard.jsx
// Protected page — only accessible to authenticated patients.
// If unauthenticated, shows a friendly gate (not a forced redirect — see UX rule in spec).
// Contains inline booking UI with anonymous -> login flow and pending-booking persistence.

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { supabase, getCurrentUser, signOut, signInWithGoogle } from "../lib/supabaseClient";

const PENDING_KEY = "toothcare_pending_booking";

/* ──────────────────────────────────────────────────────────────────────────── */
/* BookingModal — shown when anonymous user clicks "Book" anywhere on the site */
/* ──────────────────────────────────────────────────────────────────────────── */
function AuthPromptModal({ onClose, pendingData }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (pendingData) sessionStorage.setItem(PENDING_KEY, JSON.stringify(pendingData));
    closeRef.current?.focus();

    // Trap focus inside modal
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, pendingData]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-prompt-title"
      style={modalStyles.overlay}
    >
      <div style={modalStyles.box}>
        <button
          ref={closeRef}
          onClick={onClose}
          style={modalStyles.closeBtn}
          aria-label="Close dialog"
        >
          ✕
        </button>
        <h2 id="auth-prompt-title" style={modalStyles.heading}>Sign In to Book</h2>
        <p style={modalStyles.body}>
          To complete your appointment booking, please sign in. Your selection will be saved and
          ready when you return.
        </p>
        <button
          onClick={() => signInWithGoogle()}
          style={modalStyles.googleBtn}
          aria-label="Sign in with Google to continue booking"
        >
          Sign in with Google
        </button>
        <button onClick={onClose} style={modalStyles.cancelBtn} aria-label="Cancel">
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* InlineBookingFlow — 4-step stepper (service → doctor → date → time)         */
/* ──────────────────────────────────────────────────────────────────────────── */
function InlineBookingFlow({ user, onSuccess, onCancel, initialData }) {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  const [selectedService, setSelectedService] = useState(initialData?.service_id || "");
  const [selectedDoctor, setSelectedDoctor] = useState(initialData?.doctor_id || "");
  const [selectedDate, setSelectedDate] = useState(initialData?.date || "");
  const [selectedTime, setSelectedTime] = useState(initialData?.time || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState("");

  // Fetch services on mount
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("services").select("id, name, description").order("name");
      setServices(data ?? []);
    })();
  }, []);

  // Fetch doctors when service changes
  useEffect(() => {
    if (!selectedService) return;
    (async () => {
      // Simplified: get all doctors; extend with join on service_offerings if needed
      const { data } = await supabase.from("doctors").select("id, name, specialization").order("name");
      setDoctors(data ?? []);
    })();
  }, [selectedService]);

  // Fetch available times when doctor + date change
  useEffect(() => {
    if (!selectedDoctor || !selectedDate) return;
    (async () => {
      const dayOfWeek = new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" });
      const { data } = await supabase
        .from("availability")
        .select("start_time, end_time")
        .eq("doctor_id", selectedDoctor)
        .eq("day_of_week", dayOfWeek)
        .eq("is_available", true);
      // Build hourly slots from ranges
      const slots = [];
      (data ?? []).forEach(({ start_time, end_time }) => {
        const [sh, sm] = start_time.split(":").map(Number);
        const [eh, em] = end_time.split(":").map(Number);
        let cur = sh * 60 + sm;
        const end = eh * 60 + em;
        while (cur + 30 <= end) {
          const h = String(Math.floor(cur / 60)).padStart(2, "0");
          const m = String(cur % 60).padStart(2, "0");
          slots.push(`${h}:${m}`);
          cur += 30;
        }
      });
      setAvailableTimes(slots);
    })();
  }, [selectedDoctor, selectedDate]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    const appointment_ts = `${selectedDate}T${selectedTime}:00`;
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: user.id,
          doctor_id: selectedDoctor,
          service_id: selectedService,
          appointment_ts,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Booking failed");
      setAnnouncement("Appointment booked successfully!");
      // Clear any pending booking key
      sessionStorage.removeItem(PENDING_KEY);
      onSuccess(json.appointment);
    } catch (err) {
      const msg = err.message;
      setError(msg);
      setAnnouncement(msg);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div style={bookingStyles.container} role="region" aria-label="Appointment booking form">
      {/* Accessible announcements */}
      <div role="status" aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>
        {announcement}
      </div>

      {/* Step indicator */}
      <div style={bookingStyles.stepRow} aria-label={`Step ${step} of 4`}>
        {["Service", "Doctor", "Date", "Time"].map((label, i) => (
          <div
            key={label}
            style={{
              ...bookingStyles.step,
              background: step > i + 1 ? "#1F4E79" : step === i + 1 ? "#FF8A5B" : "#e8eaec",
              color: step >= i + 1 ? "#fff" : "#888",
            }}
            aria-current={step === i + 1 ? "step" : undefined}
          >
            <span>{i + 1}</span>
            <span style={{ fontSize: "0.7rem", marginTop: "0.2rem" }}>{label}</span>
          </div>
        ))}
      </div>

      {error && <div role="alert" style={bookingStyles.error}>⚠️ {error}</div>}

      {/* Step 1: Service */}
      {step === 1 && (
        <div>
          <h3 style={bookingStyles.stepHeading}>Select a Service</h3>
          <div style={bookingStyles.grid}>
            {services.map((svc) => (
              <button
                key={svc.id}
                onClick={() => { setSelectedService(svc.id); setStep(2); }}
                style={{ ...bookingStyles.card, border: selectedService === svc.id ? "2px solid #1F4E79" : "1.5px solid #e0e0e0" }}
                aria-pressed={selectedService === svc.id}
              >
                <strong>{svc.name}</strong>
                <span style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.25rem", display: "block" }}>{svc.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Doctor */}
      {step === 2 && (
        <div>
          <h3 style={bookingStyles.stepHeading}>Choose Your Doctor</h3>
          <div style={bookingStyles.grid}>
            {doctors.map((doc) => (
              <button
                key={doc.id}
                onClick={() => { setSelectedDoctor(doc.id); setStep(3); }}
                style={{ ...bookingStyles.card, border: selectedDoctor === doc.id ? "2px solid #1F4E79" : "1.5px solid #e0e0e0" }}
                aria-pressed={selectedDoctor === doc.id}
              >
                <strong>{doc.name}</strong>
                <span style={{ fontSize: "0.8rem", color: "#666", display: "block" }}>{doc.specialization}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} style={bookingStyles.back}>← Back</button>
        </div>
      )}

      {/* Step 3: Date */}
      {step === 3 && (
        <div>
          <h3 style={bookingStyles.stepHeading}>Pick a Date</h3>
          <label htmlFor="appt-date" style={bookingStyles.label}>Preferred date</label>
          <input
            id="appt-date"
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={bookingStyles.dateInput}
            aria-required="true"
          />
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
            <button onClick={() => setStep(2)} style={bookingStyles.back}>← Back</button>
            <button
              onClick={() => setStep(4)}
              disabled={!selectedDate}
              style={{ ...bookingStyles.primaryBtn, opacity: selectedDate ? 1 : 0.4 }}
            >
              Next: Pick Time →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Time + Confirm */}
      {step === 4 && (
        <div>
          <h3 style={bookingStyles.stepHeading}>Select a Time Slot</h3>
          {availableTimes.length === 0 ? (
            <p style={{ color: "#888" }}>No availability found for this doctor on {selectedDate}. Please pick another date.</p>
          ) : (
            <div style={bookingStyles.timeGrid}>
              {availableTimes.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  style={{
                    ...bookingStyles.timeSlot,
                    background: selectedTime === t ? "#1F4E79" : "#f5f5f5",
                    color: selectedTime === t ? "#fff" : "#333",
                  }}
                  aria-pressed={selectedTime === t}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
          <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button onClick={() => setStep(3)} style={bookingStyles.back}>← Back</button>
            <button
              onClick={handleSubmit}
              disabled={!selectedTime || loading}
              style={{ ...bookingStyles.primaryBtn, opacity: selectedTime ? 1 : 0.4 }}
            >
              {loading ? "Booking…" : "Confirm Appointment"}
            </button>
            <button onClick={onCancel} style={bookingStyles.back}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* Patient Dashboard — main page                                                */
/* ──────────────────────────────────────────────────────────────────────────── */
export default function PatientDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [pendingData, setPendingData] = useState(null);

  // Load session and hydrate pending booking
  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      setUser(u);
      setLoading(false);

      if (u) {
        fetchAppointments(u.id);
        // Check for pending booking from pre-auth flow
        const rawPending = sessionStorage.getItem(PENDING_KEY);
        if (rawPending) {
          try {
            setPendingData(JSON.parse(rawPending));
            setShowBooking(true);
          } catch {}
        }
      }
    })();
  }, []);

  const fetchAppointments = async (patientId) => {
    const { data } = await supabase
      .from("appointments")
      .select("id, appointment_ts, status, doctors(name), services(name)")
      .eq("patient_id", patientId)
      .gte("appointment_ts", new Date().toISOString())
      .order("appointment_ts");
    setAppointments(data ?? []);
  };

  const handleBookClick = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setShowBooking(true);
    }
  };

  const handleBookingSuccess = (appt) => {
    setBookingSuccess(appt);
    setShowBooking(false);
    if (user) fetchAppointments(user.id);
  };

  // ─── Unauthenticated gate ────────────────────────────────────────────────
  if (!loading && !user) {
    return (
      <>
        <Head><title>Patient Dashboard | TOOTHCARE</title></Head>
        <div style={styles.page}>
          <div style={styles.gateCard}>
            <span style={{ fontSize: "3rem" }}>🔒</span>
            <h1 style={styles.heading}>Patient Portal</h1>
            <p style={{ color: "#555", marginBottom: "1.5rem" }}>
              Sign in to view your appointments and book new ones.
            </p>
            <Link href="/login" style={styles.primaryBtn}>Sign In / Create Account</Link>
            <Link href="/" style={styles.backLink}>← Back to main site</Link>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div role="status" aria-label="Loading">
          <div style={styles.spinner} aria-hidden="true" />
          <p style={{ color: "#666" }}>Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head><title>Patient Dashboard | TOOTHCARE Dental</title></Head>

      {showAuthModal && (
        <AuthPromptModal
          onClose={() => setShowAuthModal(false)}
          pendingData={pendingData}
        />
      )}

      <div style={styles.pageLayout}>
        {/* Sidebar */}
        <aside style={styles.sidebar} aria-label="Patient navigation">
          <Link href="/" style={styles.logoLink}>
            <span style={styles.logoBrand}>TOOTH<span style={{ color: "#FF8A5B" }}>CARE</span></span>
          </Link>
          <nav>
            {[
              { label: "My Appointments", icon: "📅" },
              { label: "Book Appointment", icon: "➕", action: handleBookClick },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.action ?? undefined}
                style={styles.navItem}
                aria-label={item.label}
              >
                <span aria-hidden="true">{item.icon}</span> {item.label}
              </button>
            ))}
          </nav>
          <div style={styles.sidebarFooter}>
            <p style={styles.userEmail} title={user.email}>{user.email}</p>
            <button
              onClick={async () => { await signOut(); window.location.href = "/"; }}
              style={styles.signOutBtn}
              aria-label="Sign out"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main style={styles.main} id="main-content">
          <div style={styles.mainHeader}>
            <h1 style={styles.pageTitle}>My Dashboard</h1>
            <button
              onClick={handleBookClick}
              style={styles.primaryBtnSmall}
              aria-label="Book a new appointment"
            >
              + Book Appointment
            </button>
          </div>

          {/* Success banner */}
          {bookingSuccess && (
            <div role="status" aria-live="polite" style={styles.successBanner}>
              ✅ Appointment booked for {new Date(bookingSuccess.appointment_ts).toLocaleString()}
            </div>
          )}

          {/* Inline booking flow */}
          {showBooking && (
            <InlineBookingFlow
              user={user}
              onSuccess={handleBookingSuccess}
              onCancel={() => setShowBooking(false)}
              initialData={pendingData}
            />
          )}

          {/* Upcoming appointments */}
          <section aria-label="Upcoming Appointments" style={{ marginTop: "2rem" }}>
            <h2 style={styles.sectionHeading}>Upcoming Appointments</h2>
            {appointments.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={{ fontSize: "2.5rem" }}>📭</span>
                <p>No upcoming appointments. <button onClick={handleBookClick} style={styles.inlineLink}>Book one now →</button></p>
              </div>
            ) : (
              <ul style={styles.apptList} aria-label="List of upcoming appointments">
                {appointments.map((a) => (
                  <li key={a.id} style={styles.apptCard}>
                    <div>
                      <p style={styles.apptDate}>{new Date(a.appointment_ts).toLocaleString()}</p>
                      <p style={styles.apptDetail}>{a.services?.name}</p>
                      <p style={styles.apptDoctor}>Dr. {a.doctors?.name}</p>
                    </div>
                    <span style={{ ...styles.badge, background: a.status === "confirmed" ? "#d4edda" : "#fff3cd", color: a.status === "confirmed" ? "#155724" : "#856404" }}>
                      {a.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* Styles                                                                       */
/* ──────────────────────────────────────────────────────────────────────────── */
const styles = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "var(--font-body, Inter, sans-serif)", padding: "2rem 1rem" },
  gateCard: { background: "#fff", borderRadius: "1.25rem", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", padding: "3rem 2rem", textAlign: "center", maxWidth: "400px", width: "100%" },
  heading: { fontSize: "1.5rem", fontWeight: 700, color: "#111", margin: "0.75rem 0" },
  spinner: { width: "40px", height: "40px", border: "4px solid #ddd", borderTop: "4px solid #1F4E79", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" },
  pageLayout: { display: "flex", minHeight: "100vh", fontFamily: "var(--font-body, Inter, sans-serif)" },
  sidebar: { width: "240px", background: "linear-gradient(180deg, #1F4E79 0%, #163b73 100%)", color: "#fff", padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: "1rem", flexShrink: 0 },
  logoLink: { textDecoration: "none", display: "block", marginBottom: "1.5rem" },
  logoBrand: { fontSize: "1.2rem", fontWeight: 800, color: "#fff" },
  navItem: { display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", padding: "0.75rem 1rem", borderRadius: "0.65rem", cursor: "pointer", fontSize: "0.9rem", width: "100%", textAlign: "left", marginBottom: "0.4rem", minHeight: "44px" },
  sidebarFooter: { marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "1rem" },
  userEmail: { fontSize: "0.75rem", opacity: 0.7, marginBottom: "0.5rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  signOutBtn: { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "0.5rem 1rem", borderRadius: "2rem", cursor: "pointer", fontSize: "0.85rem", width: "100%", minHeight: "44px" },
  main: { flex: 1, padding: "2rem", background: "#f8fafc", overflowY: "auto" },
  mainHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" },
  pageTitle: { fontSize: "1.5rem", fontWeight: 700, color: "#111" },
  primaryBtn: { background: "#1F4E79", color: "#fff", padding: "0.85rem 2rem", borderRadius: "2rem", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem", display: "inline-block", minHeight: "44px" },
  primaryBtnSmall: { background: "#FF8A5B", color: "#fff", border: "none", padding: "0.65rem 1.25rem", borderRadius: "2rem", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", minHeight: "44px" },
  backLink: { display: "block", marginTop: "1rem", color: "#1F4E79", textDecoration: "none", fontSize: "0.875rem" },
  sectionHeading: { fontSize: "1.1rem", fontWeight: 700, color: "#1F4E79", marginBottom: "1rem" },
  apptList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" },
  apptCard: { background: "#fff", borderRadius: "1rem", padding: "1.25rem 1.5rem", border: "1.5px solid #e8eaec", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" },
  apptDate: { fontWeight: 700, color: "#111", marginBottom: "0.2rem" },
  apptDetail: { color: "#1F4E79", fontSize: "0.875rem", fontWeight: 600 },
  apptDoctor: { color: "#555", fontSize: "0.8rem" },
  badge: { display: "inline-block", padding: "0.3rem 0.75rem", borderRadius: "2rem", fontSize: "0.75rem", fontWeight: 600, textTransform: "capitalize" },
  emptyState: { textAlign: "center", padding: "3rem", color: "#888" },
  inlineLink: { background: "none", border: "none", color: "#1F4E79", cursor: "pointer", fontSize: "inherit", textDecoration: "underline", padding: 0 },
  successBanner: { background: "#d4edda", color: "#155724", border: "1px solid #b7f5c8", borderRadius: "0.75rem", padding: "1rem 1.25rem", marginBottom: "1rem", fontSize: "0.9rem" },
};

const modalStyles = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" },
  box: { background: "#fff", borderRadius: "1.25rem", padding: "2.5rem 2rem", maxWidth: "420px", width: "100%", position: "relative", textAlign: "center" },
  closeBtn: { position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer", color: "#888", minWidth: "44px", minHeight: "44px" },
  heading: { fontSize: "1.3rem", fontWeight: 700, color: "#111", marginBottom: "0.75rem" },
  body: { color: "#555", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: 1.6 },
  googleBtn: { width: "100%", background: "#1F4E79", color: "#fff", border: "none", borderRadius: "2rem", padding: "0.85rem", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", marginBottom: "0.75rem", minHeight: "44px" },
  cancelBtn: { width: "100%", background: "none", border: "1.5px solid #d0d5dd", borderRadius: "2rem", padding: "0.65rem", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", color: "#555", minHeight: "44px" },
};

const bookingStyles = {
  container: { background: "#fff", border: "1.5px solid #dce1e7", borderRadius: "1.25rem", padding: "1.75rem", marginBottom: "1.5rem" },
  stepRow: { display: "flex", gap: "0.5rem", marginBottom: "1.5rem" },
  step: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: "0.75rem", padding: "0.5rem 0.75rem", fontSize: "0.85rem", fontWeight: 700, flex: 1 },
  stepHeading: { fontSize: "1.05rem", fontWeight: 700, color: "#1F4E79", marginBottom: "1rem" },
  grid: { display: "flex", flexWrap: "wrap", gap: "0.75rem" },
  card: { background: "#fff", borderRadius: "1rem", padding: "1rem", cursor: "pointer", textAlign: "left", flex: "1 1 180px", minHeight: "44px" },
  label: { display: "block", fontWeight: 600, fontSize: "0.875rem", color: "#222", marginBottom: "0.5rem" },
  dateInput: { width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #d0d5dd", borderRadius: "0.65rem", fontSize: "0.95rem", minHeight: "44px", boxSizing: "border-box" },
  timeGrid: { display: "flex", flexWrap: "wrap", gap: "0.5rem" },
  timeSlot: { padding: "0.5rem 0.85rem", borderRadius: "0.5rem", border: "none", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", minHeight: "44px" },
  back: { background: "none", border: "1.5px solid #d0d5dd", padding: "0.6rem 1.2rem", borderRadius: "2rem", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", color: "#555", minHeight: "44px" },
  primaryBtn: { background: "#1F4E79", color: "#fff", border: "none", padding: "0.7rem 1.5rem", borderRadius: "2rem", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer", minHeight: "44px" },
  error: { background: "#fff5f5", color: "#c0392b", border: "1px solid #fbc7c7", borderRadius: "0.65rem", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.875rem" },
};
