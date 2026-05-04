import * as React from "react";
import { SectionHeading, CodeBlock, Callout } from "@/components/doc-components";
import { GraphDemo } from "@/components/graph-demo";

// ─── Themes section ───────────────────────────────────────────────────────────

export function ThemesSection() {
  return (
    <section id="themes" className="scroll-mt-24">
      <SectionHeading id="themes" badge="Themes" badgeColor="bg-amber-500/10 text-amber-600 dark:text-amber-400">
        Themes
      </SectionHeading>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        JsonGraphs ships with two polished built-in themes. Import and use them directly, or compose a custom theme.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-sm font-semibold mb-3 text-foreground">Light Theme (defaultTheme)</h3>
          <GraphDemo theme="light" height="260px" showToolbar={false} showMinimap={false} showSearch={false} />
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-3 text-foreground">Dark Theme (darkTheme)</h3>
          <GraphDemo theme="dark" height="260px" showToolbar={false} showMinimap={false} showSearch={false} />
        </div>
      </div>

      <CodeBlock language="typescript" code={`import { defaultTheme, darkTheme } from 'jsongraphs';

// Apply light theme
graph.setTheme(defaultTheme);

// Apply dark theme
graph.setTheme(darkTheme);

// Toggle between them
graph.toggleTheme();`} />
    </section>
  );
}

// ─── Custom theme ─────────────────────────────────────────────────────────────

export function CustomThemeSection() {
  return (
    <section id="themes-custom" className="scroll-mt-24">
      <SectionHeading id="themes-custom" level={3}>
        Custom Theme
      </SectionHeading>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Build a full custom theme by satisfying the <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-accent/60 text-accent-foreground">Theme</code> interface.
        The easiest approach is to spread a built-in theme and override only the properties you want to change.
      </p>
      <CodeBlock language="typescript" code={`import { defaultTheme, type Theme } from 'jsongraphs';

const sunsetTheme: Theme = {
  ...defaultTheme,
  name: 'sunset',
  background: '#1a0a00',
  gridLine: 'rgba(255,120,50,0.05)',

  nodeColors: {
    object:  { fill: '#2a1000', stroke: '#ff6820', text: '#ffd0a0', badge: '#ff6820' },
    array:   { fill: '#001a10', stroke: '#20d080', text: '#a0ffc8', badge: '#20d080' },
    string:  { fill: '#00101a', stroke: '#20a0ff', text: '#a0d8ff', badge: '#20a0ff' },
    number:  { fill: '#1a1000', stroke: '#c0b020', text: '#ffe890', badge: '#c0b020' },
    boolean: { fill: '#1a0020', stroke: '#c040c0', text: '#f0a0f0', badge: '#c040c0' },
    null:    { fill: '#151510', stroke: '#808070', text: '#c8c8b0', badge: '#808070' },
  },

  edge: {
    ...defaultTheme.edge,
    stroke: 'rgba(255,120,50,0.4)',
    highlight: '#ff6820',
  },

  ui: {
    ...defaultTheme.ui,
    panelBg: 'rgba(26,10,0,0.92)',
    text: '#ffd0a0',
    focusRing: '#ff6820',
  },
};

graph.setTheme(sunsetTheme);`} />
      <Callout type="tip">
        Use the spread operator (<code className="font-mono text-xs">...defaultTheme</code>) to inherit all defaults, then override only what you need.
        This is much safer than building a theme from scratch.
      </Callout>
    </section>
  );
}

// ─── Advanced: __CAPTION__ ────────────────────────────────────────────────────

export function AdvancedCaptionSection() {
  return (
    <section id="advanced-caption" className="scroll-mt-24">
      <SectionHeading id="advanced-caption" badge="Advanced" badgeColor="bg-rose-500/10 text-rose-600 dark:text-rose-400">
        Advanced Usage
      </SectionHeading>
      <SectionHeading id="advanced-caption-h3" level={3}>
        __CAPTION__ Key — Custom Edge Labels
      </SectionHeading>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Add a special <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-accent/60 text-accent-foreground">__CAPTION__</code> key inside any JSON object
        to place a descriptive label in a pill box at the midpoint of the incoming edge.
        The node itself is hidden — only the caption is shown on the edge.
      </p>
      <CodeBlock language="json" filename="example.json" code={`{
  "user": {
    "__CAPTION__": "is assigned to",
    "name": "Alice",
    "role": "admin"
  },
  "project": {
    "__CAPTION__": "belongs to",
    "title": "JsonGraphs Docs",
    "status": "active"
  }
}`} />
      <Callout type="note">
        The <code className="font-mono text-xs">__CAPTION__</code> node is automatically detected during parsing.
        Its value becomes the <code className="font-mono text-xs">caption</code> field on the parent edge, and the node itself is marked <code className="font-mono text-xs">transparent</code>.
      </Callout>
    </section>
  );
}

// ─── Advanced: streaming ──────────────────────────────────────────────────────

export function AdvancedStreamingSection() {
  return (
    <section id="advanced-streaming" className="scroll-mt-24">
      <SectionHeading id="advanced-streaming" level={3}>
        Streaming Large Files
      </SectionHeading>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        JsonGraphs uses a chunked streaming parser internally. You can feed it a{" "}
        <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-accent/60 text-accent-foreground">ReadableStream&lt;Uint8Array&gt;</code> directly,
        which means it starts rendering as it downloads — perfect for very large JSON files.
      </p>
      <CodeBlock language="typescript" code={`// Stream directly from fetch — renders as data arrives
const response = await fetch('/api/huge-dataset.json');
await graph.load(response.body!);

// From a File input (also streamed)
document.querySelector('input[type="file"]')
  .addEventListener('change', async (e) => {
    const file = e.target.files[0];
    await graph.load(file);  // Streams the file, no full read into memory
  });

// With limit guards
const graph = new JsonGraph({
  container,
  maxNodes: 50_000,   // Stop at 50k nodes
  maxDepth: 100,      // Stop at depth 100
  onError: (err) => {
    console.error('Limit reached:', err.message);
  },
});`} />
      <Callout type="tip">
        For very large JSON files (10MB+), always use the streaming approach via <code className="font-mono text-xs">fetch().body</code> or a <code className="font-mono text-xs">File</code> object.
        Passing a pre-parsed string works too, but keeps the entire string in memory.
      </Callout>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer className="border-t border-border mt-24 py-12 text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">JsonGraphs</strong> — MIT License © {new Date().getFullYear()}{" "}
            <a href="https://devian.agency" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              Devian Agency
            </a>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="https://github.com/devian-agency/jsongraphs" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.npmjs.com/package/jsongraphs" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">npm</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
