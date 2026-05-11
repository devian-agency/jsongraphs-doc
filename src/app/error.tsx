"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[JsonGraphs] Runtime error:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: "#070b14" }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "rgba(77,143,255,0.06)", filter: "blur(140px)" }} />
        <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full"
          style={{ background: "rgba(0,212,255,0.04)", filter: "blur(100px)" }} />
      </div>

      <div className="relative z-10 space-y-6 max-w-md">
        {/* Error label */}
        <p style={{ color: "#4d8fff", fontSize: "11px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" }}>
          Runtime Error
        </p>

        {/* Title */}
        <h1 style={{ fontSize: "clamp(2rem,6vw,3.5rem)", fontWeight: 900, color: "rgba(232,240,255,0.9)", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
          Something{" "}
          <span style={{
            background: "linear-gradient(135deg, #4d8fff 0%, #00d4ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            went wrong
          </span>
        </h1>

        {/* Error message */}
        {error.message && (
          <p style={{
            fontFamily: "monospace", fontSize: "13px", padding: "12px 16px",
            background: "rgba(77,143,255,0.06)", border: "1px solid rgba(77,143,255,0.15)",
            borderRadius: "10px", color: "#5a7094", wordBreak: "break-all",
          }}>
            {error.message}
          </p>
        )}

        <p style={{ color: "#3d5a80", fontSize: "15px", lineHeight: 1.6 }}>
          An unexpected error occurred. Try refreshing the page or click below to retry.
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", paddingTop: "8px" }}>
          <button
            id="error-retry-btn"
            onClick={reset}
            style={{
              height: "44px", padding: "0 28px", borderRadius: "10px",
              background: "#4d8fff", color: "#070b14", fontWeight: 700,
              fontSize: "13px", border: "none", cursor: "pointer",
              boxShadow: "0 0 24px rgba(77,143,255,0.30)",
              transition: "all 0.2s",
            }}
          >
            Try again
          </button>
          <a
            href="/"
            id="error-home-link"
            style={{
              height: "44px", padding: "0 28px", borderRadius: "10px",
              border: "1px solid rgba(77,143,255,0.18)", color: "#5a7094",
              fontWeight: 600, fontSize: "13px", display: "flex",
              alignItems: "center", textDecoration: "none",
              background: "rgba(77,143,255,0.04)",
              transition: "all 0.2s",
            }}
          >
            Back to docs
          </a>
        </div>

        {error.digest && (
          <p style={{ fontSize: "11px", color: "#1e3050", fontFamily: "monospace" }}>
            digest: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}