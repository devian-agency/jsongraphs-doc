"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Lazy-load jsongraphs only on the client
const DEMO_JSON = {
  library: "JsonGraphs",
  version: "1.0.2",
  features: {
    renderer: "Canvas 2D",
    parser: "Streaming",
    layouts: ["tree", "radial"],
    ui: {
      toolbar: true,
      minimap: true,
      search: true,
    },
  },
  nodeTypes: ["object", "array", "string", "number", "boolean", "null"],
  performance: {
    maxNodes: 500000,
    maxDepth: 200,
    fps: 60,
  },
  license: "MIT",
  author: "Devian Agency",
};

interface GraphDemoProps {
  theme?: "light" | "dark";
  layout?: "tree" | "radial";
  className?: string;
  height?: string;
  data?: object;
  showToolbar?: boolean;
  showMinimap?: boolean;
  showSearch?: boolean;
}

export function GraphDemo({
  theme = "dark",
  layout = "tree",
  className,
  height = "480px",
  data = DEMO_JSON,
  showToolbar = true,
  showMinimap = true,
  showSearch = true,
}: GraphDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;
    let graph: { destroy: () => void; load: (d: object) => void } | null = null;

    import("jsongraphs").then(({ JsonGraph, defaultTheme, darkTheme }) => {
      if (destroyed || !containerRef.current) return;

      graph = new JsonGraph({
        container: containerRef.current!,
        theme: theme === "dark" ? darkTheme : defaultTheme,
        layout,
        minimap: showMinimap,
        toolbar: showToolbar,
        search: showSearch,
      });

      graph.load(data);
      graphRef.current = graph;
    });

    return () => {
      destroyed = true;
      graph?.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn("rounded-2xl overflow-hidden border border-border glow", className)}
      style={{ height }}
    >
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

// ─── Feature cards grid ────────────────────────────────────────────────────────

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const FEATURES: FeatureCard[] = [
  {
    icon: "🚀",
    title: "Canvas-Based Rendering",
    description: "60 FPS rendering with optimized spatial indexing. Handles hundreds of thousands of nodes without breaking a sweat.",
    color: "from-violet-500/10 to-violet-500/5",
  },
  {
    icon: "📡",
    title: "Streaming Parser",
    description: "Load multi-megabyte JSON files without blocking the UI thread. Feed fetch() streams directly as they download.",
    color: "from-sky-500/10 to-sky-500/5",
  },
  {
    icon: "📐",
    title: "Multiple Layouts",
    description: "Switch between hierarchical Tree and organic Radial layouts dynamically at runtime with a single method call.",
    color: "from-emerald-500/10 to-emerald-500/5",
  },
  {
    icon: "🎨",
    title: "Themeable",
    description: "Built-in light and dark themes. Customize every color, size, and geometry via the structured Theme interface.",
    color: "from-amber-500/10 to-amber-500/5",
  },
  {
    icon: "🧩",
    title: "Zero Dependencies",
    description: "Pure TypeScript, no external runtime deps. Ultra-lightweight bundle size, easy to integrate anywhere.",
    color: "from-rose-500/10 to-rose-500/5",
  },
  {
    icon: "🛠️",
    title: "Built-in UI",
    description: "Integrated MiniMap, Toolbar (zoom, fit, layout toggle), and Search overlay — all without any extra configuration.",
    color: "from-indigo-500/10 to-indigo-500/5",
  },
];

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {FEATURES.map((f) => (
        <div
          key={f.title}
          className={cn(
            "group p-5 rounded-2xl border border-border bg-gradient-to-br",
            f.color,
            "hover:border-primary/30 hover:shadow-md transition-all duration-300"
          )}
        >
          <div className="text-3xl mb-3">{f.icon}</div>
          <h3 className="font-semibold text-foreground mb-2 text-sm">{f.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Node type legend ──────────────────────────────────────────────────────────

const NODE_TYPES = [
  { type: "object",  fill: "#EEEAFD", stroke: "#7F77DD", label: "object",  darkFill: "#201c50", darkStroke: "#8b83f0" },
  { type: "array",   fill: "#DFF5EC", stroke: "#1D9E75", label: "array",   darkFill: "#042e26", darkStroke: "#22b882" },
  { type: "string",  fill: "#E3F0FC", stroke: "#378ADD", label: "string",  darkFill: "#02284d", darkStroke: "#4a95f0" },
  { type: "number",  fill: "#E8F3DC", stroke: "#5E9412", label: "number",  darkFill: "#182e02", darkStroke: "#72b020" },
  { type: "boolean", fill: "#FBF0DA", stroke: "#BA7517", label: "boolean", darkFill: "#3a1e02", darkStroke: "#d08520" },
  { type: "null",    fill: "#EEEEEB", stroke: "#888780", label: "null",    darkFill: "#252524", darkStroke: "#9a9890" },
];

export function NodeTypeLegend({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {NODE_TYPES.map((n) => (
        <div
          key={n.type}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono"
          style={{
            background: dark ? n.darkFill : n.fill,
            borderColor: dark ? n.darkStroke : n.stroke,
            color: dark ? n.darkStroke : n.stroke,
          }}
        >
          <span
            className="size-2 rounded-full"
            style={{ background: dark ? n.darkStroke : n.stroke }}
          />
          {n.label}
        </div>
      ))}
    </div>
  );
}
