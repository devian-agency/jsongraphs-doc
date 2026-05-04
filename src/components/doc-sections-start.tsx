import * as React from "react";
import { SectionHeading, CodeBlock, PropTable, Callout } from "@/components/doc-components";
import { GraphDemo, FeatureGrid, NodeTypeLegend } from "@/components/graph-demo";

// ─── Installation ─────────────────────────────────────────────────────────────

export function InstallSection() {
  return (
    <section id="installation" className="scroll-mt-24">
      <SectionHeading id="installation" badge="Getting Started" badgeColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        Installation
      </SectionHeading>
      <div className="space-y-4">
        <CodeBlock language="bash" filename="terminal" code={`npm install jsongraphs
# or
yarn add jsongraphs
# or
bun add jsongraphs`} />
        <Callout type="note">
          JsonGraphs is ESM-only. Make sure your bundler supports ESM modules (Vite, Next.js, Rollup, esbuild all work out of the box).
        </Callout>
      </div>
    </section>
  );
}

// ─── Quick Start ──────────────────────────────────────────────────────────────

export function QuickStartSection() {
  return (
    <section id="quick-start" className="scroll-mt-24">
      <SectionHeading id="quick-start" badge="Getting Started" badgeColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        Quick Start
      </SectionHeading>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        The simplest possible integration — create a <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">JsonGraph</code> instance,
        point it at a container element, and call <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">load()</code>.
      </p>
      <CodeBlock language="typescript" filename="main.ts" code={`import { JsonGraph, darkTheme } from 'jsongraphs';

const container = document.getElementById('graph-container')!;

const graph = new JsonGraph({
  container,
  theme: darkTheme,   // or defaultTheme for light
  layout: 'tree',     // or 'radial'
  minimap: true,
  toolbar: true,
  search: true,
});

// Load from a plain JS object
await graph.load({
  project: "My App",
  version: "2.0",
  dependencies: {
    react: "^19",
    typescript: "^5",
  },
});`} />
    </section>
  );
}

// ─── React / Next.js ─────────────────────────────────────────────────────────

export function ReactUsageSection() {
  return (
    <section id="react-usage" className="scroll-mt-24">
      <SectionHeading id="react-usage" badge="Getting Started" badgeColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        React / Next.js Integration
      </SectionHeading>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        Use a <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">useRef</code> for the container and
        initialize inside <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">useEffect</code>.
        Always call <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">destroy()</code> in the cleanup function.
      </p>
      <CodeBlock language="typescript" filename="GraphViewer.tsx" code={`"use client";
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
      onError: (err) => {
        console.error("Parse error:", err);
      },
    });

    graph.load(data);

    // Cleanup on unmount
    return () => graph.destroy();
  }, [data, dark]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "600px" }}
    />
  );
}`} />
      <Callout type="tip">
        Add <code className="font-mono text-xs">dynamic import</code> with <code className="font-mono text-xs">ssr: false</code> in Next.js to avoid window-not-defined errors during SSR,
        or prefix the component with <code className="font-mono text-xs">&quot;use client&quot;</code> in the App Router.
      </Callout>

      <h3 className="text-base font-semibold mt-8 mb-4 text-foreground">Live Demo</h3>
      <GraphDemo height="400px" />
    </section>
  );
}

// ─── Features section ─────────────────────────────────────────────────────────

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24">
      <SectionHeading id="features">Key Features</SectionHeading>
      <FeatureGrid />

      <h3 className="text-base font-semibold mt-10 mb-4 text-foreground">Node Type Colours</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Each JSON primitive type is rendered with a distinct color palette that works in both light and dark themes:
      </p>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-medium">Light theme</p>
          <NodeTypeLegend dark={false} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-medium">Dark theme</p>
          <NodeTypeLegend dark={true} />
        </div>
      </div>
    </section>
  );
}
