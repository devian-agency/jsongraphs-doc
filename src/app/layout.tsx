import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://jsongraphs.devian.agency";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "JsonGraphs — Interactive JSON Graph Visualizer",
    template: "%s | JsonGraphs",
  },

  description:
    "High-performance, dependency-free library for visualizing complex JSON structures as beautiful, interactive canvas-based graphs. Streaming parser, tree & radial layouts, built-in minimap, search, and toolbar.",

  keywords: [
    "json graph",
    "json visualizer",
    "json tree",
    "interactive graph",
    "canvas renderer",
    "streaming json parser",
    "tree layout",
    "radial layout",
    "typescript library",
    "zero dependencies",
    "jsongraphs",
  ],

  authors: [{ name: "Devian Agency", url: "https://devian.agency" }],
  creator: "Devian Agency",
  publisher: "Devian Agency",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: SITE_URL,
  },

  // ── Open Graph ─────────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "JsonGraphs",
    title: "JsonGraphs — Interactive JSON Graph Visualizer",
    description:
      "High-performance canvas-based JSON graph visualization library. Streaming parser, tree & radial layouts, built-in minimap, search, and toolbar. Zero dependencies.",
    images: [
      {
        url: "/assets/images/og-image.webp",
        width: 1200,
        height: 630,
        alt: "JsonGraphs — Interactive JSON Graph Visualizer",
        type: "image/webp",
      },
    ],
  },

  // ── Twitter / X Card ───────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "JsonGraphs — Interactive JSON Graph Visualizer",
    description:
      "High-performance canvas-based JSON graph visualization library. Streaming parser, tree & radial layouts, built-in minimap and toolbar. Zero dependencies.",
    images: ["/assets/images/og-image.webp"],
    creator: "@devianagency",
    site: "@devianagency",
  },

  // ── Icons (favicon + apple touch) ─────────────────────────────────────────
  icons: {
    icon: [
      { url: "/logo/logo.webp", type: "image/webp" },
    ],
    apple: [
      { url: "/logo/logo.webp", type: "image/webp" },
    ],
    shortcut: "/logo/logo.webp",
  },

  // ── App metadata ───────────────────────────────────────────────────────────
  applicationName: "JsonGraphs",
  category: "Developer Tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", inter.variable, geistMono.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
