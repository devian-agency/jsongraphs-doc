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
        Build a full custom theme by satisfying the <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">Theme</code> interface.
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
        __CAPTION__ Key — Floating Node & Edge Labels
      </SectionHeading>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Add a special <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">__CAPTION__</code> key inside any JSON object
        to inject contextual meaning into your graph.
      </p>
      <ul className="list-disc list-inside text-muted-foreground mb-4 leading-relaxed space-y-1">
        <li><strong>Top-Level Nodes (Depth 1):</strong> Renders as a beautiful floating pill directly above the node itself.</li>
        <li><strong>Deep Nodes (Depth &gt; 1):</strong> Renders elegantly centered on the incoming connecting edge.</li>
      </ul>
      <CodeBlock language="json" filename="example.json" code={`{
  "user": {
    "__CAPTION__": "is assigned to",
    "name": "Alice",
    "role": "admin"
  },
  "project": {
    "__CAPTION__": "Project Details",
    "title": "JsonGraphs Docs",
    "status": "active"
  }
}`} />
      <Callout type="note">
        The <code className="font-mono text-xs">__CAPTION__</code> node is automatically detected during parsing and extracted. The node itself is then marked <code className="font-mono text-xs">transparent</code> to keep the graph clean.
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
        JsonGraphs uses an asynchronous chunked streaming parser internally with automatic <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">yieldToMain()</code> integration. 
        You can feed it a <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">ReadableStream&lt;Uint8Array&gt;</code> directly.
        This guarantees the UI will <strong>never freeze</strong>, even when processing files with hundreds of thousands of nodes.
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
    <footer className="relative mt-24 border-t border-primary/10">
      {/* Subtle gradient top */}
      <div className="absolute -top-px inset-x-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">JsonGraphs</span>
              {" "}— MIT License © {new Date().getFullYear()}{" "}
              <a href="https://devian.agency" className="text-primary/80 hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                Devian Agency
              </a>
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[
              { label: "GitHub", href: "https://github.com/devian-agency/jsongraphs" },
              { label: "npm",    href: "https://www.npmjs.com/package/jsongraphs" },
              { label: "devian.agency", href: "https://devian.agency" },
            ].map((l, i, arr) => (
              <React.Fragment key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer"
                   className="px-3 py-1.5 text-sm text-muted-foreground/60 hover:text-muted-foreground rounded-lg hover:bg-primary/8 transition-all">
                  {l.label}
                </a>
                {i < arr.length - 1 && <span className="text-border">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
