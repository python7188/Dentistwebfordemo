// pages/login.jsx
// Public login landing page.
// Shows a side-by-side (or stacked on mobile) Patient | Doctor panel.
// Does NOT auto-redirect unauthenticated users who land on normal pages.

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { supabase, signInWithGoogle, getCurrentUser } from "../../lib/supabaseClient";

const PENDING_KEY = "toothcare_pending_booking";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  // If already authenticated, send patient to dashboard
  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (user) {
        router.replace("/patient-dashboard");
      }
    })();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      // After Google auth, Supabase redirects to /auth/callback (see lib/supabaseClient.js)
      // The auth/callback page checks for pending booking and routes accordingly.
      await signInWithGoogle();
    } catch (err) {
      setError(err.message ?? "Failed to start Google sign-in. Please try again.");
      setAnnouncement(err.message ?? "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | TOOTHCARE Dental</title>
        <meta name="description" content="Sign in to access your TOOTHCARE patient portal or doctor dashboard." />
      </Head>

      {/* Visually hidden for screen reader announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <div style={styles.page}>
        <div style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <Link href="/" style={styles.logoLink} aria-label="TOOTHCARE home">
              <span style={styles.logoBrand}>TOOTH<span style={{ color: "#FF8A5B" }}>CARE</span></span>
            </Link>
            <h1 style={styles.heading}>Welcome Back</h1>
            <p style={styles.subtext}>Access your portal to book &amp; manage appointments.</p>
          </div>

          {/* Panel grid */}
          <div style={styles.panels}>
            {/* ─── Patient Panel ─── */}
            <div style={styles.panel}>
              <span style={styles.panelIcon} aria-hidden="true">🧑‍⚕️</span>
              <h2 style={styles.panelHeading}>Patients</h2>
              <p style={styles.panelText}>Sign in with Google to book appointments and view your health records.</p>
              {error && (
                <p role="alert" style={styles.errorMsg}>{error}</p>
              )}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                style={{ ...styles.btn, ...styles.btnGoogle }}
                aria-label="Sign in with Google"
              >
                {loading ? "Redirecting…" : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={{ marginRight: "0.5rem" }}>
                      <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div style={styles.divider} aria-hidden="true">
              <span style={styles.dividerLabel}>or</span>
            </div>

            {/* ─── Doctor Panel ─── */}
            <div style={styles.panel}>
              <span style={styles.panelIcon} aria-hidden="true">🩺</span>
              <h2 style={styles.panelHeading}>Healthcare Staff</h2>
              <p style={styles.panelText}>Doctors, use your clinic email and password to access your dashboard.</p>
              <Link
                href="/doctor-login"
                style={{ ...styles.btn, ...styles.btnDoctor }}
                aria-label="Go to Doctor Login"
              >
                Doctor Login →
              </Link>
            </div>
          </div>

          <p style={styles.footer}>
            <Link href="/" style={styles.backLink}>← Back to main site</Link>
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f7ff 0%, #e8f4f8 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    fontFamily: "var(--font-body, Inter, sans-serif)",
  },
  card: {
    background: "#fff",
    borderRadius: "1.25rem",
    boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
    width: "100%",
    maxWidth: "740px",
    overflow: "hidden",
    padding: "2.5rem 2rem",
  },
  header: { textAlign: "center", marginBottom: "2rem" },
  logoLink: { textDecoration: "none", display: "inline-block", marginBottom: "1rem" },
  logoBrand: {
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "#1F4E79",
    fontFamily: "var(--font-display, Georgia, serif)",
  },
  heading: { fontSize: "1.6rem", fontWeight: 700, color: "#111", margin: "0 0 0.35rem" },
  subtext: { color: "#555", fontSize: "0.95rem" },
  panels: {
    display: "flex",
    gap: "1.5rem",
    flexWrap: "wrap",
  },
  panel: {
    flex: "1 1 260px",
    border: "1.5px solid #e8eaec",
    borderRadius: "1rem",
    padding: "1.75rem 1.5rem",
  },
  panelIcon: { fontSize: "2.25rem", lineHeight: 1, display: "block", marginBottom: "0.75rem" },
  panelHeading: { fontSize: "1.15rem", fontWeight: 700, color: "#1F4E79", marginBottom: "0.5rem" },
  panelText: { color: "#555", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.25rem" },
  divider: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 0.25rem",
  },
  dividerLabel: {
    background: "#e8eaec",
    color: "#888",
    borderRadius: "50%",
    width: "2rem",
    height: "2rem",
    lineHeight: "2rem",
    textAlign: "center",
    fontSize: "0.8rem",
    fontWeight: 600,
  },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.75rem 1.5rem",
    borderRadius: "2rem",
    fontWeight: 600,
    fontSize: "0.9rem",
    cursor: "pointer",
    border: "none",
    textDecoration: "none",
    minHeight: "44px",
    width: "100%",
    boxSizing: "border-box",
    transition: "filter 0.2s",
  },
  btnGoogle: { background: "#1F4E79", color: "#fff" },
  btnDoctor: { background: "#FF8A5B", color: "#fff" },
  errorMsg: { color: "#c0392b", fontSize: "0.85rem", marginBottom: "0.75rem", padding: "0.5rem", background: "#fff5f5", borderRadius: "0.5rem" },
  footer: { textAlign: "center", marginTop: "2rem" },
  backLink: { color: "#1F4E79", fontSize: "0.875rem", textDecoration: "none" },
};
