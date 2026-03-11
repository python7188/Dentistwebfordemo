"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, signInWithGoogle, getCurrentUser } from "../../lib/supabaseClient";

interface GlobalBookingCTAProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e?: any) => void;
}

export default function GlobalBookingCTA({ children, className, onClick }: GlobalBookingCTAProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onClick) onClick(e);
    const user = await getCurrentUser();
    if (user) {
      // Authenticated -> go straight to dashboard
      router.push("/patient-dashboard");
    } else {
      // Unauthenticated -> prompt inline
      setShowModal(true);
    }
  };

  return (
    <>
      <button onClick={handleClick} className={className}>
        {children}
      </button>

      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "1rem",
            color: "#111"
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "1.25rem",
              padding: "2.5rem 2rem",
              maxWidth: "420px",
              width: "100%",
              position: "relative",
              textAlign: "center"
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                fontSize: "1.25rem",
                cursor: "pointer",
                color: "#888",
                minWidth: "44px",
                minHeight: "44px"
              }}
              aria-label="Close dialog"
            >
              ✕
            </button>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.75rem", fontFamily: "var(--font-body)" }}>
              Sign In to Book
            </h2>
            <p style={{ color: "#555", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>
              To complete your appointment booking, please sign in. Your process will be seamless and secure.
            </p>
            <button
              onClick={() => {
                sessionStorage.setItem("toothcare_pending_booking", JSON.stringify({ pending: true }));
                signInWithGoogle();
              }}
              style={{
                width: "100%",
                background: "#1F4E79",
                color: "#fff",
                border: "none",
                borderRadius: "2rem",
                padding: "0.85rem",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                marginBottom: "0.75rem",
                minHeight: "44px"
              }}
            >
              Sign in with Google
            </button>
            <button
              onClick={() => { setShowModal(false); router.push("/contact"); }}
              style={{
                width: "100%",
                background: "none",
                border: "1.5px solid #d0d5dd",
                borderRadius: "2rem",
                padding: "0.65rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
                color: "#555",
                minHeight: "44px"
              }}
            >
              Continue as Guest (Contact Form)
            </button>
          </div>
        </div>
      )}
    </>
  );
}
