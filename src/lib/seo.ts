/**
 * Centralized SEO constants for the JsonGraphs documentation site.
 * Used across metadata, JSON-LD, sitemaps, manifests, and robots.
 */

export const SITE = {
  name:        "JsonGraphs",
  shortName:   "JsonGraphs",
  tagline:     "Interactive JSON Graph Visualizer",
  url:         "https://jsongraphs.devian.in",
  description:
    "High-performance, dependency-free canvas library for visualizing complex JSON structures as beautiful, interactive graph visualizations. Streaming parser, tree & radial layouts, built-in minimap, search, and toolbar. Zero dependencies.",
  logo:        "/logo/logo.webp",
  logoSymbol:  "/logo/logo.webp",
  ogImage:     "/assets/images/og-image.webp",
  locale:      "en_US",
  language:    "en",
  themeColor:  "#4d8fff",
  backgroundColor: "#070b14",
  twitter:     "@devian_twt",
  email:       "info@devian.in",
  founder:     "Devian Agency",
  foundingDate: "2025-01-01",
  category:    "Developer Tools",
  version:     "1.1.1",
  license:     "MIT",

  keywords: [
    "json graph",
    "json visualizer",
    "json tree",
    "json viewer",
    "interactive graph",
    "canvas renderer",
    "streaming json parser",
    "tree layout",
    "radial layout",
    "typescript library",
    "zero dependencies",
    "jsongraphs",
    "json to graph",
    "data visualization",
    "graph visualization",
    "devian agency",
    "node graph",
    "json explorer",
    "json structure",
    "canvas library",
  ],

  org: {
    name:      "Devian Agency",
    url:       "https://devian.in",
    legalName: "Devian Agency",
  },

  pages: {
    home:      "/",
    docs:      "/#installation",
    api:       "/#jsongraph-class",
    types:     "/#type-jsonsource",
    themes:    "/#themes",
    advanced:  "/#advanced-caption",
    npm:       "https://www.npmjs.com/package/jsongraphs",
    github:    "https://github.com/devian-agency/jsongraphs",
  },
} as const;

/** Full absolute URL helper */
export function absoluteUrl(path: string): string {
  return `${SITE.url}${path}`;
}
