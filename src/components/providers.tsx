"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Theme Context ─────────────────────────────────────────────────────────────

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: "dark",
  toggle: () => {},
});

export function useTheme() {
  return React.useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>("dark");

  React.useEffect(() => {
    const saved = localStorage.getItem("jsongraphs-doc-theme") as Theme | null;
    const initial = saved ?? "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = React.useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("jsongraphs-doc-theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Search Context ────────────────────────────────────────────────────────────

interface SearchEntry {
  id: string;
  title: string;
  description: string;
  section: string;
  href: string;
}

export const DOC_SEARCH_INDEX: SearchEntry[] = [
  { id: "installation",    title: "Installation",          description: "npm / yarn / bun install jsongraphs",                section: "Getting Started", href: "#installation" },
  { id: "quick-start",     title: "Quick Start",           description: "Minimal setup with JsonGraph constructor",            section: "Getting Started", href: "#quick-start" },
  { id: "react-usage",     title: "React / Next.js Usage", description: "useEffect + useRef pattern for React integration",    section: "Getting Started", href: "#react-usage" },
  { id: "jsongraph-class", title: "JsonGraph",             description: "Main class — constructor options and lifecycle",       section: "API Reference",   href: "#jsongraph-class" },
  { id: "load",            title: "load(source)",          description: "Load JSON from File, URL, string, stream, or object", section: "API Reference",   href: "#api-load" },
  { id: "setlayout",       title: "setLayout()",           description: "Switch between tree and radial layout algorithms",    section: "API Reference",   href: "#api-setlayout" },
  { id: "settheme",        title: "setTheme()",            description: "Apply a Theme object to all layers",                  section: "API Reference",   href: "#api-settheme" },
  { id: "toggletheme",     title: "toggleTheme()",         description: "Toggle between defaultTheme and darkTheme",           section: "API Reference",   href: "#api-toggletheme" },
  { id: "fitview",         title: "fitView()",             description: "Reset zoom and pan to fit all nodes",                 section: "API Reference",   href: "#api-fitview" },
  { id: "zoomin",          title: "zoomIn() / zoomOut()",  description: "Smooth programmatic zoom toward container center",    section: "API Reference",   href: "#api-zoom" },
  { id: "expandall",       title: "expandAll()",           description: "Expand all object and array nodes",                   section: "API Reference",   href: "#api-expand" },
  { id: "collapseall",     title: "collapseAll()",         description: "Collapse all nodes except the root",                  section: "API Reference",   href: "#api-expand" },
  { id: "destroy",         title: "destroy()",             description: "Clean up canvas, listeners, and overlay elements",    section: "API Reference",   href: "#api-destroy" },
  { id: "jsonsource",      title: "JsonSource",            description: "Union type: File | ReadableStream | string | URL | object", section: "Types",    href: "#type-jsonsource" },
  { id: "layouttype",      title: "LayoutType",            description: "'tree' | 'radial' union type",                       section: "Types",            href: "#type-layouttype" },
  { id: "graphnode",       title: "GraphNode",             description: "Interface for a single visualized JSON node",         section: "Types",            href: "#type-graphnode" },
  { id: "graphedge",       title: "GraphEdge",             description: "Interface for edges / connectors between nodes",      section: "Types",            href: "#type-graphedge" },
  { id: "theme-interface", title: "Theme",                 description: "Full theme interface with nodeColors, edge, font…",   section: "Types",            href: "#type-theme" },
  { id: "defaulttheme",    title: "defaultTheme",          description: "Built-in light theme export",                         section: "Themes",           href: "#themes" },
  { id: "darktheme",       title: "darkTheme",             description: "Built-in dark theme export",                          section: "Themes",           href: "#themes" },
  { id: "custom-theme",    title: "Custom Theme",          description: "Build a theme object from the Theme interface",       section: "Themes",           href: "#themes-custom" },
  { id: "parse-options",   title: "ParseOptions",          description: "maxDepth, maxNodes, chunkSize parser options",        section: "Types",            href: "#type-parseoptions" },
  { id: "parselimiterror", title: "ParseLimitError",       description: "Error thrown when depth or node limits are reached",  section: "Types",            href: "#type-parselimiterror" },
  { id: "caption",         title: "__CAPTION__ Key",       description: "Special JSON key to add descriptive edge labels",     section: "Advanced",         href: "#advanced-caption" },
  { id: "streaming",       title: "Streaming Large Files", description: "Feed fetch() response body stream directly",          section: "Advanced",         href: "#advanced-streaming" },
  { id: "minimap",         title: "MiniMap UI",            description: "Built-in interactive overview minimap",               section: "Features",         href: "#features" },
  { id: "search-ui",       title: "Search Bar UI",         description: "Built-in node search bar overlay",                   section: "Features",         href: "#features" },
  { id: "toolbar-ui",      title: "Toolbar UI",            description: "Built-in toolbar with zoom, layout, and theme toggle",section: "Features",         href: "#features" },
];

interface SearchContextValue {
  open: boolean;
  query: string;
  results: SearchEntry[];
  setOpen: (v: boolean) => void;
  setQuery: (v: string) => void;
}

const SearchContext = React.createContext<SearchContextValue>({
  open: false,
  query: "",
  results: [],
  setOpen: () => {},
  setQuery: () => {},
});

export function useSearch() {
  return React.useContext(SearchContext);
}

function fuzzySearch(index: SearchEntry[], query: string): SearchEntry[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return index
    .filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.section.toLowerCase().includes(q)
    )
    .slice(0, 10);
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchEntry[]>([]);

  // Debounce search
  React.useEffect(() => {
    const t = setTimeout(() => {
      setResults(fuzzySearch(DOC_SEARCH_INDEX, query));
    }, 150);
    return () => clearTimeout(t);
  }, [query]);

  // Ctrl+K shortcut
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSetOpen = React.useCallback((v: boolean) => {
    setOpen(v);
    if (!v) setQuery("");
  }, []);

  return (
    <SearchContext.Provider
      value={{ open, query, results, setOpen: handleSetOpen, setQuery }}
    >
      {children}
    </SearchContext.Provider>
  );
}
