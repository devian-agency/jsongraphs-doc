import type { Metadata } from "next";
import { SITE, absoluteUrl } from "@/lib/seo";

export const meta: Metadata = {
  metadataBase: new URL(SITE.url),

  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.org.name, url: SITE.org.url }],
  generator: "Next.js",
  keywords: [...SITE.keywords],
  referrer: "origin-when-cross-origin",
  creator: SITE.org.name,
  publisher: SITE.org.name,
  category: SITE.category,

  alternates: {
    canonical: SITE.url,
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: {
      default: `${SITE.name} — ${SITE.tagline}`,
      template: `%s | ${SITE.name}`,
    },
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    images: [
      {
        url: absoluteUrl(SITE.ogImage),
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.tagline}`,
        type: "image/webp",
      },
    ],
    locale: SITE.locale,
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: {
      default: `${SITE.name} — ${SITE.tagline}`,
      template: `%s | ${SITE.name}`,
    },
    description: SITE.description,
    site: SITE.twitter,
    creator: SITE.twitter,
    images: [
      {
        url: absoluteUrl(SITE.ogImage),
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.tagline}`,
      },
    ],
  },

  icons: {
    icon: [
      { url: SITE.logo, sizes: "any", type: "image/webp" },
    ],
    shortcut: SITE.logo,
    apple: [
      { url: SITE.logo, sizes: "180x180", type: "image/webp" },
    ],
  },

  manifest: "/site.webmanifest",

  other: {
    "msapplication-TileColor": SITE.themeColor,
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": SITE.shortName,
    "format-detection": "telephone=no",
    "theme-color": SITE.themeColor,
  },
};
