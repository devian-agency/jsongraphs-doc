import Link from "next/link";
import type { Metadata } from "next";
import { SITE, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: `The page you're looking for doesn't exist on ${SITE.name}. Return to the documentation to explore our JSON graph visualization library.`,
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: `404 — Page Not Found | ${SITE.name}`,
    description: `The page you're looking for doesn't exist on ${SITE.name}.`,
    url: SITE.url,
    siteName: SITE.name,
    images: [
      {
        url: absoluteUrl(SITE.ogImage),
        width: 1200,
        height: 630,
        alt: `${SITE.name} — Page Not Found`,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `404 — Page Not Found | ${SITE.name}`,
    description: `The page you're looking for doesn't exist on ${SITE.name}.`,
    site: SITE.twitter,
  },
};

export default function NotFound() {
  return (
    <main
      id="not-found-page"
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: "#070b14" }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: "rgba(77,143,255,0.07)", filter: "blur(150px)" }}
        />
        <div
          className="absolute top-[25%] left-[15%] w-[350px] h-[350px] rounded-full"
          style={{ background: "rgba(0,212,255,0.04)", filter: "blur(110px)" }}
        />
        <div
          className="absolute bottom-[20%] right-[15%] w-[280px] h-[280px] rounded-full"
          style={{ background: "rgba(77,143,255,0.05)", filter: "blur(90px)" }}
        />
      </div>

      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(77,143,255,0.13) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
        aria-hidden
      />

      <div className="relative z-10 space-y-7 max-w-lg">
        {/* Error label */}
        <p
          style={{
            color: "#4d8fff", fontSize: "11px", fontWeight: 700,
            letterSpacing: "0.28em", textTransform: "uppercase",
            filter: "drop-shadow(0 0 8px rgba(77,143,255,0.5))",
          }}
        >
          Error 404
        </p>

        {/* Giant 404 */}
        <h1
          style={{
            fontSize: "clamp(5rem,18vw,10rem)",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: "rgba(232,240,255,0.90)",
          }}
        >
          4
          <span
            style={{
              background: "linear-gradient(135deg, #4d8fff 0%, #00d4ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 30px rgba(77,143,255,0.4))",
            }}
          >
            0
          </span>
          4
        </h1>

        {/* Description */}
        <p style={{ color: "#3d5a80", fontSize: "17px", lineHeight: 1.65, maxWidth: "380px", margin: "0 auto" }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Head back to the documentation.
        </p>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", paddingTop: "12px" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <Link
              href="/"
              id="not-found-home-link"
              style={{
                height: "48px", padding: "0 32px", borderRadius: "12px",
                background: "#4d8fff", color: "#070b14", fontWeight: 700,
                fontSize: "14px", display: "flex", alignItems: "center",
                gap: "8px", textDecoration: "none",
                boxShadow: "0 0 28px rgba(77,143,255,0.30)",
                transition: "all 0.2s",
              }}
            >
              <svg
                style={{ width: "16px", height: "16px" }}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Docs
            </Link>

            <a
              href={SITE.pages.npm}
              id="not-found-npm-link"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                height: "48px", padding: "0 28px", borderRadius: "12px",
                border: "1px solid rgba(77,143,255,0.18)",
                color: "#5a7094", fontWeight: 600, fontSize: "14px",
                display: "flex", alignItems: "center",
                textDecoration: "none", background: "rgba(77,143,255,0.05)",
                transition: "all 0.2s",
              }}
            >
              View on npm ↗
            </a>
          </div>

          {/* Install hint */}
          <div
            style={{
              marginTop: "12px", display: "inline-flex", alignItems: "center",
              gap: "10px", padding: "10px 20px", borderRadius: "14px",
              background: "rgba(5,10,20,0.80)",
              border: "1px solid rgba(77,143,255,0.18)",
              fontFamily: "monospace", fontSize: "13px",
            }}
          >
            <span style={{ color: "#4ade80", fontWeight: 700 }}>$</span>
            <span style={{ color: "#8bacc8" }}>npm install </span>
            <strong style={{ color: "#ffffff" }}>jsongraphs</strong>
          </div>
        </div>
      </div>
    </main>
  );
}