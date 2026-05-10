"use client";
import { JsonGraph, defaultTheme, darkTheme } from "jsongraphs";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "./providers";

// ─── Per-feature demo datasets ───────────────────────────────────────────────

export const DEMO_DATASETS = {
  // Hero / general demo
  general: {
    library: "JsonGraphs",
    version: "1.1.1",
    features: {
      renderer: "Canvas 2D",
      parser: "Streaming SAX",
      layouts: ["tree", "radial"],
      ui: { toolbar: true, minimap: true, search: true },
    },
    nodeTypes: ["object", "array", "string", "number", "boolean", "null"],
    performance: { maxNodes: 500000, maxDepth: 200, fps: 60 },
    license: "MIT",
    author: "Devian Agency",
  },

  // Tree layout demo — deeply nested hierarchy
  treeLayout: {
    organization: {
      name: "Acme Corp",
      departments: {
        engineering: {
          head: "Alice Chen",
          teams: {
            frontend: { size: 8, stack: ["React", "TypeScript", "Vite"] },
            backend: { size: 12, stack: ["Node.js", "PostgreSQL", "Redis"] },
            devops: { size: 4, stack: ["Kubernetes", "Terraform", "AWS"] },
          },
        },
        product: {
          head: "Bob Kim",
          teams: {
            design: { size: 5, tools: ["Figma", "Storybook"] },
            research: { size: 3, methods: ["interviews", "A/B tests"] },
          },
        },
      },
    },
  },

  // Radial layout demo — star/hub-spoke topology
  radialLayout: {
    api: {
      gateway: "https://api.example.com",
      services: {
        auth: { port: 3001, endpoints: ["/login", "/logout", "/refresh"] },
        users: { port: 3002, endpoints: ["/list", "/get", "/update"] },
        orders: { port: 3003, endpoints: ["/create", "/status", "/cancel"] },
        payments: { port: 3004, endpoints: ["/charge", "/refund"] },
        notifications: { port: 3005, endpoints: ["/send", "/history"] },
      },
      rateLimit: "1000 req/min",
      auth: "JWT Bearer",
    },
  },

  // Streaming / large data demo — wide flat arrays
  streaming: {
    dataset: "e-commerce transactions",
    count: 24,
    transactions: Array.from({ length: 24 }, (_, i) => ({
      id: `txn_${String(i + 1).padStart(4, "0")}`,
      amount: +(Math.random() * 500 + 10).toFixed(2),
      currency: ["USD", "EUR", "GBP"][i % 3],
      status: ["completed", "pending", "failed"][i % 3],
      timestamp: new Date(Date.now() - i * 3600000).toISOString().slice(0, 16),
    })),
  },

  // Search demo — rich text content for searching
  search: {
    products: {
      laptop: {
        brand: "ThinkPad",
        ram: "16GB",
        storage: "512GB SSD",
        price: 1299,
      },
      phone: { brand: "Pixel 8", ram: "8GB", storage: "256GB", price: 699 },
      tablet: { brand: "iPad Pro", ram: "8GB", storage: "128GB", price: 799 },
      monitor: {
        brand: "Dell UltraSharp",
        size: "27 inch",
        resolution: "4K",
        price: 649,
      },
      keyboard: {
        brand: "Keychron K3",
        switches: "Brown",
        layout: "TKL",
        price: 89,
      },
    },
    filters: { minPrice: 0, maxPrice: 2000, inStock: true },
    sortBy: "price",
  },

  // Collapse/Expand demo — deeply nested JSON
  collapse: {
    config: {
      server: {
        host: "0.0.0.0",
        port: 8080,
        tls: {
          enabled: true,
          cert: "/etc/ssl/cert.pem",
          key: "/etc/ssl/key.pem",
          protocols: ["TLSv1.2", "TLSv1.3"],
        },
        cors: {
          origins: ["https://app.example.com"],
          methods: ["GET", "POST", "PUT"],
        },
      },
      database: {
        primary: { host: "db-1.internal", port: 5432, name: "app_prod" },
        replica: { host: "db-2.internal", port: 5432, name: "app_prod" },
        pool: { min: 2, max: 20, idleTimeout: 30000 },
      },
      cache: { provider: "redis", ttl: 3600, maxMemory: "256mb" },
      logging: { level: "info", format: "json", destination: "stdout" },
    },
  },

  // Theme demo — colorful mixed types
  themes: {
    palette: {
      primary: "#6366f1",
      secondary: "#8b83f0",
      accent: "#c792ea",
    },
    typography: {
      fontFamily: "Inter",
      fontSize: 16,
      lineHeight: 1.6,
      monospace: "JetBrains Mono",
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, "2xl": 48 },
    shadows: { sm: true, md: true, lg: false },
    borderRadius: { sm: 4, md: 8, lg: 12, full: 9999 },
    darkMode: true,
    animations: { duration: 200, easing: "ease-in-out", reduceMotion: false },
  },
} as const;

// ─── GraphDemo component ──────────────────────────────────────────────────────

interface GraphDemoProps {
  theme?: "light" | "dark";
  layout?: "tree" | "radial";
  className?: string;
  height?: string;
  data?: object;
  dataset?: keyof typeof DEMO_DATASETS;
  showToolbar?: boolean;
  showMinimap?: boolean;
  showSearch?: boolean;
  showNodeCount?: boolean;
  /** Optional URL to fetch a large JSON file */
  fetchUrl?: string;
}

export function GraphDemo({
  theme = "dark",
  layout = "tree",
  className,
  height = "480px",
  data,
  dataset,
  showToolbar = true,
  showMinimap = true,
  showSearch = true,
  showNodeCount = true,
  fetchUrl,
}: GraphDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<unknown>(null);
  const { theme: currentTheme } = useTheme();

  // Resolve data source
  const resolvedData =
    data ?? (dataset ? DEMO_DATASETS[dataset] : DEMO_DATASETS.general);

  useEffect(() => {
    if (!containerRef.current) return;
    (async () => {
      const graph = new JsonGraph({
        container: containerRef.current!,
        theme: currentTheme === "dark" ? darkTheme : defaultTheme,
        layout,
        minimap: showMinimap,
        toolbar: showToolbar,
        search: showSearch,
        showNodeCount,
      });

      if (fetchUrl) {
        const res = await fetch(fetchUrl);
        await graph.load(res);
      } else {
        graph.load(resolvedData as object);
      }

      graphRef.current = graph;
    })();

    return () => {
      (graphRef.current as JsonGraph)?.destroy();
      graphRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTheme]);

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden border border-border glow",
        className,
      )}
      style={{ height }}
    >
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

// ─── DemoWindow — wraps GraphDemo in a macOS-style chrome ────────────────────

interface DemoWindowProps extends GraphDemoProps {
  title?: string;
  badge?: string;
  children?: React.ReactNode;
}

export function DemoWindow({
  title = "Live Preview",
  badge,
  children,
  ...props
}: DemoWindowProps) {
  return (
    <div className="rounded-2xl overflow-hidden border border-primary/20 glow-violet">
      {/* Chrome bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-card/80 backdrop-blur border-b border-border/50">
        <span className="size-3 rounded-full bg-[#ff5f56]" />
        <span className="size-3 rounded-full bg-[#ffbd2e]" />
        <span className="size-3 rounded-full bg-[#27c93f]" />
        <span className="ml-3 text-xs font-mono text-muted-foreground">
          {title} — JsonGraphs
        </span>
        {badge && (
          <span className="ml-auto text-[10px] text-emerald-400/70 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-emerald-400/70 animate-pulse" />
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── FeatureDemo — side-by-side description + live graph ─────────────────────

interface FeatureDemoProps {
  icon: string;
  title: string;
  description: string;
  color: string;
  borderColor: string;
  dataset?: keyof typeof DEMO_DATASETS;
  layout?: "tree" | "radial";
  height?: string;
  reverse?: boolean;
  children?: React.ReactNode;
}

export function FeatureDemo({
  icon,
  title,
  description,
  color,
  borderColor,
  dataset = "general",
  layout = "tree",
  height = "280px",
  reverse = false,
  children,
}: FeatureDemoProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-6 items-center",
        reverse && "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1",
      )}
    >
      {/* Text side */}
      <div className="space-y-4">
        <div
          className={cn(
            "inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-sm font-medium",
            color,
            borderColor,
          )}
        >
          <span className="text-base">{icon}</span>
          <span>{title}</span>
        </div>
        <p className="text-muted-foreground leading-relaxed text-sm">
          {description}
        </p>
        {children}
      </div>
      {/* Graph side */}
      <GraphDemo
        dataset={dataset}
        layout={layout}
        height={height}
        showToolbar={false}
        showMinimap={false}
        showSearch={false}
        showNodeCount={false}
        className="border-primary/15"
      />
    </div>
  );
}

// ─── NodeTypeLegend ───────────────────────────────────────────────────────────

const NODE_TYPES = [
  {
    type: "object",
    fill: "#EEEAFD",
    stroke: "#7F77DD",
    label: "object",
    darkFill: "#201c50",
    darkStroke: "#8b83f0",
  },
  {
    type: "array",
    fill: "#DFF5EC",
    stroke: "#1D9E75",
    label: "array",
    darkFill: "#042e26",
    darkStroke: "#22b882",
  },
  {
    type: "string",
    fill: "#E3F0FC",
    stroke: "#378ADD",
    label: "string",
    darkFill: "#02284d",
    darkStroke: "#4a95f0",
  },
  {
    type: "number",
    fill: "#E8F3DC",
    stroke: "#5E9412",
    label: "number",
    darkFill: "#182e02",
    darkStroke: "#72b020",
  },
  {
    type: "boolean",
    fill: "#FBF0DA",
    stroke: "#BA7517",
    label: "boolean",
    darkFill: "#3a1e02",
    darkStroke: "#d08520",
  },
  {
    type: "null",
    fill: "#EEEEEB",
    stroke: "#888780",
    label: "null",
    darkFill: "#252524",
    darkStroke: "#9a9890",
  },
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

// ─── LayoutToggleDemo — interactive layout switcher ──────────────────────────

export function LayoutToggleDemo() {
  const [layout, setLayout] = useState<"tree" | "radial">("tree");
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<JsonGraph | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const graph = new JsonGraph({
      container: containerRef.current,
      theme: darkTheme,
      layout: "tree",
      minimap: true,
      toolbar: false,
      search: false,
      showNodeCount: true,
    });
    graph.load(DEMO_DATASETS.treeLayout as object);
    graphRef.current = graph;
    return () => {
      graph.destroy();
      graphRef.current = null;
    };
  }, []);

  const switchLayout = (l: "tree" | "radial") => {
    setLayout(l);
    graphRef.current?.setLayout(l);
  };

  return (
    <div className="space-y-3">
      {/* Toggle buttons */}
      <div className="flex gap-2">
        {(["tree", "radial"] as const).map((l) => (
          <button
            key={l}
            onClick={() => switchLayout(l)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer",
              layout === l
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {l === "tree" ? "🌳 Tree" : "🌀 Radial"}
          </button>
        ))}
      </div>
      <div
        ref={containerRef}
        className="w-full h-72 rounded-2xl border border-border"
      />
    </div>
  );
}
