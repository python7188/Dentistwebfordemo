// components/FeaturePopup.jsx
// Informational banner that appears on first site visit.
// Does NOT require authentication and must NOT trigger forced login.
// Dismissible — stores flag in localStorage.

"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

const STORAGE_KEY = "toothcare_popup_dismissed";

export default function FeaturePopup() {
  const [visible, setVisible] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    // Only show if user hasn't dismissed before
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  // Focus the close button when popup mounts for keyboard users
  useEffect(() => {
    if (visible && closeRef.current) {
      closeRef.current.focus();
    }
  }, [visible]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay — clicking outside dismisses (optional soft behaviour) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        aria-describedby="popup-desc"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          width: "min(600px, calc(100vw - 2rem))",
          background: "linear-gradient(135deg, #1F4E79 0%, #163b73 100%)",
          color: "#fff",
          borderRadius: "1rem",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
        }}
      >
        {/* Icon */}
        <span style={{ fontSize: "2rem", lineHeight: 1, flexShrink: 0 }} aria-hidden="true">
          🏥
        </span>

        {/* Copy */}
        <div style={{ flex: 1 }}>
          <p
            id="popup-title"
            style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.35rem" }}
          >
            New: Secure Patient Portal &amp; Doctor Dashboard
          </p>
          <p
            id="popup-desc"
            style={{ fontSize: "0.875rem", opacity: 0.85, marginBottom: "1rem", lineHeight: 1.5 }}
          >
            Book and manage your dental appointments online — fast, easy, and private.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link
              href="/login"
              style={{
                background: "#FF8A5B",
                color: "#fff",
                textDecoration: "none",
                padding: "0.55rem 1.25rem",
                borderRadius: "2rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                minHeight: "44px",
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
              aria-label="Login or access the patient portal"
            >
              Login / Access Portal
            </Link>
            <button
              onClick={dismiss}
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "0.55rem 1.25rem",
                borderRadius: "2rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
                minHeight: "44px",
                whiteSpace: "nowrap",
              }}
              aria-label="Dismiss this notification"
            >
              Not Now
            </button>
          </div>
        </div>

        {/* Close (X) button */}
        <button
          ref={closeRef}
          onClick={dismiss}
          aria-label="Close popup"
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.7)",
            fontSize: "1.25rem",
            cursor: "pointer",
            flexShrink: 0,
            padding: "0.25rem",
            lineHeight: 1,
            minWidth: "44px",
            minHeight: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "0.5rem",
          }}
        >
          ✕
        </button>
      </div>
    </>
  );
}
