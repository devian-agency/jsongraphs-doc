import * as React from "react";
import { SectionHeading, CodeBlock, PropTable, Callout, Code } from "@/components/doc-components";
import {
  GraphDemo,
  DemoWindow,
  FeatureDemo,
  LayoutToggleDemo,
  NodeTypeLegend,
} from "@/components/graph-demo";

// ─── Installation ─────────────────────────────────────────────────────────────

export function InstallSection() {
  return (
    <section id="installation" className="scroll-mt-24">
      <SectionHeading
        id="installation"
        badge="Getting Started"
        badgeColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      >
        Installation
      </SectionHeading>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        JsonGraphs ships as a single zero-dependency ESM/CJS package. Install it with any package manager:
      </p>
      <div className="space-y-4">
        <CodeBlock
          language="bash"
          filename="terminal"
          code={`npm install jsongraphs
# or
yarn add jsongraphs
# or
bun add jsongraphs`}
        />
        <Callout type="note">
          JsonGraphs is ESM-first. Vite, Next.js, Rollup, and esbuild all work out of the box.
          For CDN/script-tag usage, import from{" "}
          <Code>dist/jsongraphs.umd.js</Code>.
        </Callout>
      </div>
    </section>
  );
}

// ─── Quick Start ──────────────────────────────────────────────────────────────

export function QuickStartSection() {
  return (
    <section id="quick-start" className="scroll-mt-24 space-y-6">
      <SectionHeading
        id="quick-start"
        badge="Getting Started"
        badgeColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      >
        Quick Start
      </SectionHeading>
      <p className="text-muted-foreground leading-relaxed">
        Create a <Code>JsonGraph</Code> instance, point it at a container element, and call <Code>load()</Code>.
        The graph renders immediately — no configuration required beyond a container.
      </p>
      <CodeBlock
        language="typescript"
        filename="main.ts"
        code={`import { JsonGraph, darkTheme } from 'jsongraphs';

const container = document.getElementById('graph-container')!;

const graph = new JsonGraph({
  container,
  theme: darkTheme,   // or defaultTheme for light mode
  layout: 'tree',     // or 'radial'
  minimap: true,      // bottom-left minimap
  toolbar: true,      // zoom / layout / theme buttons
  search: true,       // Ctrl+F search overlay
});

// Load from a plain JS object — synchronous, instant
await graph.load({
  project: "My App",
  version: "2.0",
  dependencies: {
    react: "^19",
    typescript: "^5",
  },
});`}
      />

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground font-medium">Live result ↓</p>
        <DemoWindow title="Quick Start Demo" badge="interactive">
          <GraphDemo dataset="general" height="380px" />
        </DemoWindow>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Zoom · Pan · Double-click to expand/collapse · Search with Ctrl+K
        </p>
      </div>
    </section>
  );
}

// ─── React / Next.js ─────────────────────────────────────────────────────────

export function ReactUsageSection() {
  return (
    <section id="react-usage" className="scroll-mt-24 space-y-6">
      <SectionHeading
        id="react-usage"
        badge="Getting Started"
        badgeColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      >
        React / Next.js
      </SectionHeading>
      <p className="text-muted-foreground leading-relaxed">
        Use a <Code>useRef</Code> for the container and initialize inside{" "}
        <Code>useEffect</Code>. Always call <Code>destroy()</Code> in the cleanup
        to prevent memory leaks.
      </p>
      <CodeBlock
        language="typescript"
        filename="GraphViewer.tsx"
        code={`"use client";
import { useEffect, useRef } from "react";
import { JsonGraph, darkTheme, defaultTheme } from "jsongraphs";

interface Props {
  data: object;
  dark?: boolean;
}

export function GraphViewer({ data, dark = true }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const graph = new JsonGraph({
      container: containerRef.current,
      theme: dark ? darkTheme : defaultTheme,
      layout: "tree",
      minimap: true,
      toolbar: true,
      search: true,
      onLoad: (nodes, edges) => {
        console.log(\`Loaded \${nodes} nodes, \${edges} edges\`);
      },
      onError: (err) => console.error("Parse error:", err),
    });

    graph.load(data);

    // Always destroy on unmount — cleans up canvas, events, timers
    return () => graph.destroy();
  }, [data, dark]);

  return <div ref={containerRef} style={{ width: "100%", height: "600px" }} />;
}`}
      />
      <Callout type="tip">
        In Next.js App Router, add <Code>&quot;use client&quot;</Code> to the component file.
        For Pages Router, use <Code>dynamic(() =&gt; import(…), &#123; ssr: false &#125;)</Code>
        to skip server-side rendering of the canvas.
      </Callout>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24 space-y-20">
      <SectionHeading id="features">Key Features</SectionHeading>

      {/* ── 1. Tree Layout ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌳</span>
          <div>
            <h3 className="font-semibold text-foreground">Tree Layout</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Renders JSON as a clean left-to-right hierarchy. Parent nodes always appear
              to the left of their children with even vertical spacing.
              Every subtree occupies its own band — zero node overlaps, no matter how
              deeply nested the data is.
            </p>
          </div>
        </div>
        <DemoWindow title="Tree Layout" badge="interactive">
          <GraphDemo
            dataset="treeLayout"
            layout="tree"
            height="360px"
            showSearch={false}
          />
        </DemoWindow>
      </div>

      {/* Divider */}
      <hr className="border-border/40" />

      {/* ── 2. Radial Layout ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌀</span>
          <div>
            <h3 className="font-semibold text-foreground">Radial Layout</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Arranges nodes in an organic, outward-growing spiral pattern —
              inspired by how seeds pack in a sunflower or a nautilus shell.
              The result is a compact, visually balanced graph where no two nodes
              ever overlap, even with hundreds of nodes.
            </p>
          </div>
        </div>
        <DemoWindow title="Radial Layout" badge="interactive">
          <GraphDemo
            dataset="radialLayout"
            layout="radial"
            height="400px"
            showSearch={false}
          />
        </DemoWindow>
      </div>

      <hr className="border-border/40" />

      {/* ── 3. Layout switching ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <h3 className="font-semibold text-foreground">Instant Layout Switching</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Switch between Tree and Radial layouts at any time with a single call to{" "}
              <Code>graph.setLayout()</Code>. The toolbar includes a one-click toggle.
              Click the buttons below to watch the same graph transform between layouts:
            </p>
          </div>
        </div>
        <LayoutToggleDemo />
      </div>

      <hr className="border-border/40" />

      {/* ── 4. Streaming parser ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔄</span>
          <div>
            <h3 className="font-semibold text-foreground">Streaming Parser</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Large JSON files are loaded progressively — the UI never freezes,
              even with multi-megabyte datasets. Nodes appear as the data is read.
              Pass a <Code>File</Code>, <Code>ReadableStream</Code>, <Code>Response</Code>,
              plain string, or JS object — all handled identically.
            </p>
          </div>
        </div>
        <CodeBlock
          language="typescript"
          filename="streaming.ts"
          code={`// From a fetch Response — library streams it without extra fetch() calls
const res = await fetch('/api/data.json');
await graph.load(res);

// From a File input
const [file] = input.files;
await graph.load(file);

// From a ReadableStream
await graph.load(response.body);

// From a plain object or JSON string — both work too
await graph.load({ users: [...] });
await graph.load('{"users":[...]}');`}
        />
        <DemoWindow title="Large Dataset (24 transactions)" badge="streaming">
          <GraphDemo
            dataset="streaming"
            layout="radial"
            height="340px"
            showSearch={false}
            showMinimap={false}
          />
        </DemoWindow>
      </div>

      <hr className="border-border/40" />

      {/* ── 5. Expand / Collapse ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🪗</span>
          <div>
            <h3 className="font-semibold text-foreground">Expand / Collapse</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Double-click any object or array node to toggle its subtree.
              Collapsed nodes show a child count badge. Large datasets auto-collapse
              beyond depth 3 on load — keeping the initial view navigable. You can
              programmatically expand/collapse via <Code>graph.expandNode(id)</Code> /
              <Code>graph.collapseNode(id)</Code>.
            </p>
          </div>
        </div>
        <DemoWindow title="Expand / Collapse — double-click any node" badge="interactive">
          <GraphDemo
            dataset="collapse"
            layout="tree"
            height="360px"
            showSearch={false}
            showMinimap={false}
          />
        </DemoWindow>
      </div>

      <hr className="border-border/40" />

      {/* ── 6. Search ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔍</span>
          <div>
            <h3 className="font-semibold text-foreground">Full-Text Search</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Press <kbd className="text-xs font-mono border border-border px-1.5 py-0.5 rounded bg-muted/50">Ctrl+K</kbd> (or{" "}
              <kbd className="text-xs font-mono border border-border px-1.5 py-0.5 rounded bg-muted/50">⌘K</kbd>) to open
              the search overlay. Results highlight matching nodes and pan the viewport to them.
              The search index is built at parse-time, making repeated queries O(1).
            </p>
          </div>
        </div>
        <DemoWindow title="Search — press Ctrl+K" badge="interactive">
          <GraphDemo
            dataset="search"
            layout="tree"
            height="340px"
            showSearch={true}
            showMinimap={false}
          />
        </DemoWindow>
      </div>

      <hr className="border-border/40" />

      {/* ── 7. Node type colours ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎨</span>
          <div>
            <h3 className="font-semibold text-foreground">Semantic Node Colors</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Each JSON primitive type renders with a distinct color in both light and dark themes.
              Colors are fully customizable via the theme system.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Light theme</p>
            <div className="p-4 rounded-xl border border-border bg-white/5">
              <NodeTypeLegend dark={false} />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Dark theme</p>
            <div className="p-4 rounded-xl border border-border bg-black/20">
              <NodeTypeLegend dark={true} />
            </div>
          </div>
        </div>
        <DemoWindow title="All node types visible">
          <GraphDemo
            dataset="themes"
            layout="radial"
            height="340px"
            showToolbar={false}
            showSearch={false}
            showMinimap={false}
          />
        </DemoWindow>
      </div>
    </section>
  );
}
