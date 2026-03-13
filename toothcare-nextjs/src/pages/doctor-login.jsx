// pages/doctor-login.jsx
// Email + password authentication for doctors only.
// After login, calls /api/doctor-check to verify auth.uid ↔ doctors table mapping.

import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export default function DoctorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    // Basic client-side validation
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // 1. Authenticate with Supabase email/password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) throw authError;

      const uid = authData.user?.id;

      // 2. Verify this uid exists in the doctors table via server API
      const res = await fetch("/api/doctor-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });
      const json = await res.json();

      if (!json.isDoctor) {
        // Not a registered doctor — sign out and show error
        await supabase.auth.signOut();
        throw new Error(
          "Your account is not registered as a doctor. Contact your clinic administrator."
        );
      }

      // 3. Success — navigate to admin dashboard
      setAnnouncement("Login successful. Redirecting to dashboard.");
      router.push("/admin-dashboard");
    } catch (err) {
      const msg = err.message ?? "Login failed. Please check your credentials.";
      setError(msg);
      setAnnouncement(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Please enter your email address first, then click Forgot Password.");
      return;
    }
    setError("");
    try {
      // Send password reset email via Supabase auth
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/doctor-reset-password`,
      });
      if (error) throw error;
      setInfo("Password reset email sent. Please check your inbox.");
      setAnnouncement("Password reset email sent.");
    } catch (err) {
      setError(err.message ?? "Failed to send reset email.");
    }
  };

  return (
    <>
      <Head>
        <title>Doctor Login | TOOTHCARE Dental</title>
        <meta name="description" content="Doctor and staff login for TOOTHCARE's admin dashboard." />
      </Head>

      {/* Accessible live announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <div style={styles.page}>
        <div style={styles.card}>
          {/* Logo */}
          <div style={styles.header}>
            <Link href="/" style={styles.logoLink} aria-label="TOOTHCARE home">
              <span style={styles.logoBrand}>TOOTH<span style={{ color: "#FF8A5B" }}>CARE</span></span>
            </Link>
            <span style={styles.badge}>🩺 Doctor Portal</span>
            <h1 style={styles.heading}>Doctor Login</h1>
            <p style={styles.subtext}>Sign in with your clinic-issued email address.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate aria-label="Doctor login form">
            {error && (
              <div role="alert" style={styles.errorBox}>
                ⚠️ {error}
              </div>
            )}
            {info && (
              <div role="status" style={styles.infoBox}>
                ✅ {info}
              </div>
            )}

            <div style={styles.field}>
              <label htmlFor="email" style={styles.label}>Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                placeholder="doctor@toothcare.com"
                disabled={loading}
                style={styles.input}
                aria-required="true"
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                disabled={loading}
                style={styles.input}
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={styles.submitBtn}
              aria-label="Sign in as doctor"
            >
              {loading ? "Verifying…" : "Sign In"}
            </button>

            <button
              type="button"
              onClick={handleForgotPassword}
              style={styles.forgotBtn}
              aria-label="Request password reset"
            >
              Forgot password?
            </button>
          </form>

          <p style={styles.footer}>
            <Link href="/login" style={styles.backLink}>← Patient login</Link>
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
    maxWidth: "440px",
    padding: "2.5rem 2rem",
  },
  header: { textAlign: "center", marginBottom: "2rem" },
  logoLink: { textDecoration: "none", display: "block", marginBottom: "0.75rem" },
  logoBrand: { fontSize: "1.4rem", fontWeight: 800, color: "#1F4E79" },
  badge: { display: "inline-block", background: "#e8f4f8", color: "#1F4E79", borderRadius: "2rem", padding: "0.3rem 0.9rem", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.75rem" },
  heading: { fontSize: "1.5rem", fontWeight: 700, color: "#111", margin: "0 0 0.35rem" },
  subtext: { color: "#555", fontSize: "0.9rem" },
  field: { marginBottom: "1.1rem" },
  label: { display: "block", fontWeight: 600, fontSize: "0.875rem", color: "#222", marginBottom: "0.4rem" },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1.5px solid #d0d5dd",
    borderRadius: "0.65rem",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
    minHeight: "44px",
    transition: "border-color 0.2s",
  },
  submitBtn: {
    width: "100%",
    background: "#1F4E79",
    color: "#fff",
    border: "none",
    borderRadius: "2rem",
    padding: "0.85rem",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    minHeight: "44px",
    marginBottom: "0.75rem",
    marginTop: "0.5rem",
  },
  forgotBtn: {
    width: "100%",
    background: "none",
    border: "none",
    color: "#1F4E79",
    cursor: "pointer",
    fontSize: "0.875rem",
    textDecoration: "underline",
    minHeight: "44px",
  },
  errorBox: { background: "#fff5f5", color: "#c0392b", border: "1px solid #fbc7c7", borderRadius: "0.65rem", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.875rem" },
  infoBox: { background: "#f0fff4", color: "#276749", border: "1px solid #b7f5c8", borderRadius: "0.65rem", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.875rem" },
  footer: { textAlign: "center", marginTop: "1.5rem" },
  backLink: { color: "#1F4E79", fontSize: "0.875rem", textDecoration: "none" },
};
