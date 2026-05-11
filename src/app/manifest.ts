import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: "/",
    id: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
    orientation: "any",
    background_color: SITE.backgroundColor,
    theme_color: SITE.themeColor,
    categories: ["developer tools", "productivity", "utilities"],
    lang: SITE.language,
    dir: "ltr",
    scope: "/",
    prefer_related_applications: false,
    icons: [
      { src: SITE.logo, sizes: "48x48",   type: "image/webp", purpose: "any" },
      { src: SITE.logo, sizes: "192x192", type: "image/webp", purpose: "any" },
      { src: SITE.logo, sizes: "512x512", type: "image/webp", purpose: "any" },
      { src: SITE.logo, sizes: "512x512", type: "image/webp", purpose: "maskable" },
    ],
    screenshots: [
      {
        src: SITE.ogImage,
        sizes: "1200x630",
        type: "image/webp",
        label: `${SITE.name} — ${SITE.tagline}`,
      },
    ],
    shortcuts: [
      {
        name: "Documentation",
        short_name: "Docs",
        url: "/#installation",
        description: "Read the JsonGraphs documentation",
        icons: [{ src: SITE.logo, sizes: "96x96" }],
      },
      {
        name: "API Reference",
        short_name: "API",
        url: "/#jsongraph-class",
        description: "Browse the full JsonGraphs API reference",
        icons: [{ src: SITE.logo, sizes: "96x96" }],
      },
    ],
  };
}
