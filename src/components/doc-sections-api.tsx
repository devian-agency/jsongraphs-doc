import { SectionHeading, CodeBlock, PropTable, Callout } from "@/components/doc-components";

// ─── JsonGraph Constructor ────────────────────────────────────────────────────

const CONSTRUCTOR_PROPS = [
  { name: "container",  type: "HTMLElement",              required: true,  default: "—",            description: "The host element for the graph canvas and overlay UI." },
  { name: "theme",      type: "Theme",                    required: false, default: "defaultTheme", description: "Initial visual theme. Import defaultTheme or darkTheme, or provide a custom Theme object." },
  { name: "layout",     type: "'tree' | 'radial'",        required: false, default: "'tree'",       description: "Initial layout algorithm. Can be changed at runtime via setLayout()." },
  { name: "minimap",    type: "boolean",                  required: false, default: "true",         description: "Show the interactive mini-map overlay in the bottom-right corner." },
  { name: "toolbar",    type: "boolean",                  required: false, default: "true",         description: "Show the toolbar overlay with zoom, fit, layout toggle, expand/collapse, and theme toggle buttons." },
  { name: "search",     type: "boolean",                  required: false, default: "true",         description: "Show the node search bar overlay at the top-center of the graph." },
  { name: "maxDepth",   type: "number",                   required: false, default: "200",          description: "Maximum JSON nesting depth before a ParseLimitError is thrown." },
  { name: "maxNodes",   type: "number",                   required: false, default: "500_000",      description: "Maximum total graph nodes before a ParseLimitError is thrown." },
  { name: "onLoad",     type: "(nodes: number, edges: number) => void", required: false, default: "—", description: "Callback invoked after parsing completes. Receives total node and edge counts." },
  { name: "onError",    type: "(err: Error) => void",     required: false, default: "—",            description: "Callback invoked if parsing fails (e.g. invalid JSON or limit exceeded)." },
];

export function JsonGraphClassSection() {
  return (
    <section id="jsongraph-class" className="scroll-mt-24">
      <SectionHeading id="jsongraph-class" badge="API Reference" badgeColor="bg-violet-500/10 text-violet-600 dark:text-violet-400">
        JsonGraph
      </SectionHeading>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        The main class. Initializes the canvas renderer, overlay UI components (toolbar, search bar, minimap),
        and event model inside the provided container element.
      </p>
      <CodeBlock language="typescript" code={`import { JsonGraph } from 'jsongraphs';

const graph = new JsonGraph(opts: JsonGraphOptions);`} />

      <h3 className="text-base font-semibold mt-8 mb-4 text-foreground">Constructor Options</h3>
      <PropTable rows={CONSTRUCTOR_PROPS} />

      <Callout type="note" className="mt-6">
        The container element gets <code className="font-mono text-xs">position: relative</code> and <code className="font-mono text-xs">overflow: hidden</code> applied automatically.
        Set an explicit <strong>width and height</strong> on it before constructing JsonGraph.
      </Callout>
    </section>
  );
}

// ─── load() ──────────────────────────────────────────────────────────────────

export function LoadMethodSection() {
  return (
    <section id="api-load" className="scroll-mt-24">
      <SectionHeading id="api-load" level={3}>
        load(source: JsonSource)
      </SectionHeading>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Asynchronously parses and renders a JSON source. Accepts five input formats:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          { type: "object",          label: "Plain JS object", desc: "Any serialisable JS value. Parsed synchronously." },
          { type: "string",          label: "JSON string",     desc: "A raw JSON string. Parsed synchronously." },
          { type: "File",            label: "File object",     desc: "From an <input type='file'> element. Streamed." },
          { type: "URL",             label: "URL object",      desc: "Fetched via fetch() and streamed." },
          { type: "ReadableStream",  label: "ReadableStream",  desc: "Streamed byte-by-byte. Ideal for huge files." },
        ].map((s) => (
          <div key={s.type} className="p-4 rounded-xl border border-border bg-card">
            <code className="text-xs font-mono text-amber-600 dark:text-amber-400">{s.type}</code>
            <p className="text-sm font-medium mt-1 mb-1 text-foreground">{s.label}</p>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
      <CodeBlock language="typescript" code={`// From a plain object
await graph.load({ name: "Alice", age: 30 });

// From a JSON string
await graph.load('{"hello": "world"}');

// From a file input
const file = fileInput.files[0];
await graph.load(file);

// From a URL (auto-fetches and streams)
await graph.load(new URL('https://api.example.com/data.json'));

// From a fetch() stream (most memory-efficient for large files)
const res = await fetch('/huge-data.json');
await graph.load(res.body!);`} />
    </section>
  );
}

// ─── setLayout() ─────────────────────────────────────────────────────────────

export function SetLayoutSection() {
  return (
    <section id="api-setlayout" className="scroll-mt-24">
      <SectionHeading id="api-setlayout" level={3}>
        setLayout(layout: LayoutType)
      </SectionHeading>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Switches the layout algorithm at runtime and re-runs the layout engine immediately.
        The toolbar also calls this method when the user clicks the layout toggle buttons.
      </p>
      <CodeBlock language="typescript" code={`// Switch to radial layout
graph.setLayout('radial');

// Switch back to tree layout
graph.setLayout('tree');`} />
      <Callout type="tip">
        The <strong>tree layout</strong> is best for deep, hierarchical JSON with clear parent-child relationships.
        The <strong>radial layout</strong> works great for shallow, wide structures and looks beautiful for network-like data.
      </Callout>
    </section>
  );
}

// ─── setTheme / toggleTheme ───────────────────────────────────────────────────

export function ThemeMethodsSection() {
  return (
    <>
      <section id="api-settheme" className="scroll-mt-24">
        <SectionHeading id="api-settheme" level={3}>
          setTheme(theme: Theme)
        </SectionHeading>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Applies a new <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">Theme</code> object to
          the canvas renderer, toolbar, search bar, and minimap simultaneously.
        </p>
        <CodeBlock language="typescript" code={`import { darkTheme, defaultTheme } from 'jsongraphs';

// Apply dark theme
graph.setTheme(darkTheme);

// Apply light theme
graph.setTheme(defaultTheme);

// Apply a custom theme
graph.setTheme(myCustomTheme);`} />
      </section>

      <section id="api-toggletheme" className="scroll-mt-24">
        <SectionHeading id="api-toggletheme" level={3}>
          toggleTheme()
        </SectionHeading>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Convenience method that toggles between <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">defaultTheme</code> (light)
          and <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">darkTheme</code>.
          Equivalent to checking the current theme name and calling <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">setTheme()</code>.
        </p>
        <CodeBlock language="typescript" code={`// One-liner to toggle light ↔ dark
graph.toggleTheme();`} />
      </section>
    </>
  );
}

// ─── fitView / zoom ───────────────────────────────────────────────────────────

export function ViewportMethodsSection() {
  return (
    <>
      <section id="api-fitview" className="scroll-mt-24">
        <SectionHeading id="api-fitview" level={3}>
          fitView()
        </SectionHeading>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Resets pan and zoom so all visible nodes fit within the container with an 80 px padding. Also marks the minimap dirty.
        </p>
        <CodeBlock language="typescript" code={`graph.fitView();`} />
      </section>

      <section id="api-zoom" className="scroll-mt-24">
        <SectionHeading id="api-zoom" level={3}>
          zoomIn() / zoomOut()
        </SectionHeading>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Smooth programmatic zoom centered on the container midpoint.
          <code className="font-mono text-xs px-1.5 py-0.5 mx-1 rounded bg-accent/60 text-accent-foreground">zoomIn()</code>
          scales by ×1.15 and
          <code className="font-mono text-xs px-1.5 py-0.5 mx-1 rounded bg-accent/60 text-accent-foreground">zoomOut()</code>
          scales by ×0.87.
        </p>
        <CodeBlock language="typescript" code={`graph.zoomIn();   // scale × 1.15
graph.zoomOut();  // scale × 0.87`} />
      </section>
    </>
  );
}

// ─── expandAll / collapseAll ──────────────────────────────────────────────────

export function ExpandCollapseSection() {
  return (
    <section id="api-expand" className="scroll-mt-24">
      <SectionHeading id="api-expand" level={3}>
        expandAll() / collapseAll()
      </SectionHeading>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">expandAll()</code> expands every
        <code className="font-mono text-xs px-1.5 py-0.5 mx-1 rounded bg-accent/60 text-accent-foreground">object</code> and
        <code className="font-mono text-xs px-1.5 py-0.5 mx-1 rounded bg-accent/60 text-accent-foreground">array</code> node.
        <code className="font-mono text-xs px-1.5 py-0.5 mx-1 rounded bg-accent/60 text-accent-foreground">collapseAll()</code> collapses all except the root node.
        Both re-run the layout engine after toggling visibility.
      </p>
      <CodeBlock language="typescript" code={`graph.expandAll();    // Show all nodes
graph.collapseAll();  // Collapse all (keep root visible)`} />
    </section>
  );
}

// ─── invalidateCache() ───────────────────────────────────────────────────────

export function InvalidateCacheSection() {
  return (
    <section id="api-invalidatecache" className="scroll-mt-24">
      <SectionHeading id="api-invalidatecache" level={3}>
        invalidateCache()
      </SectionHeading>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Manually trigger a re-calculation of the visible node tree. This is useful if you manipulate the internal <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">GraphModel</code> directly and need to force the O(V) visibility engine to rebuild the render cache.
      </p>
      <CodeBlock language="typescript" code={`graph.invalidateCache();`} />
    </section>
  );
}

// ─── destroy() ───────────────────────────────────────────────────────────────

export function DestroySection() {
  return (
    <section id="api-destroy" className="scroll-mt-24">
      <SectionHeading id="api-destroy" level={3}>
        destroy()
      </SectionHeading>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Cancels any pending animation frame, destroys the canvas renderer, and unmounts the search bar, minimap, and toolbar overlays.
        Always call this when removing the graph from the DOM to avoid memory leaks.
      </p>
      <CodeBlock language="typescript" code={`// In a React useEffect cleanup
return () => graph.destroy();

// Or manually when done
graph.destroy();`} />
      <Callout type="warning">
        Failing to call <code className="font-mono text-xs">destroy()</code> will leave dangling event listeners and canvas elements in memory.
      </Callout>
    </section>
  );
}
