import * as React from "react";
import { SectionHeading, CodeBlock, PropTable, Callout } from "@/components/doc-components";

// ─── JsonSource type ──────────────────────────────────────────────────────────

export function JsonSourceTypeSection() {
  return (
    <section id="type-jsonsource" className="scroll-mt-24">
      <SectionHeading id="type-jsonsource" badge="Types" badgeColor="bg-sky-500/10 text-sky-600 dark:text-sky-400">
        Types
      </SectionHeading>
      <SectionHeading id="type-jsonsource-h3" level={3}>
        JsonSource
      </SectionHeading>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        A union type representing every valid data source for <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">graph.load()</code>.
      </p>
      <CodeBlock language="typescript" code={`type JsonSource =
  | File                       // Browser File API (e.g. from <input type="file">)
  | ReadableStream<Uint8Array>  // WHATWG Streams (e.g. fetch().body)
  | string                     // Raw JSON string
  | URL                        // URL — fetched and streamed automatically
  | object;                    // Any plain JS object / array`} />
    </section>
  );
}

// ─── LayoutType ───────────────────────────────────────────────────────────────

export function LayoutTypeSection() {
  return (
    <section id="type-layouttype" className="scroll-mt-24">
      <SectionHeading id="type-layouttype" level={3}>LayoutType</SectionHeading>
      <CodeBlock language="typescript" code={`type LayoutType = 'tree' | 'radial';`} />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card">
          <code className="text-xs font-mono text-primary">'tree'</code>
          <p className="text-sm font-medium mt-1 mb-1 text-foreground">Tree Layout</p>
          <p className="text-xs text-muted-foreground">Hierarchical top-down layout. Best for deeply nested, structured JSON.</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <code className="text-xs font-mono text-primary">'radial'</code>
          <p className="text-sm font-medium mt-1 mb-1 text-foreground">Radial Layout</p>
          <p className="text-xs text-muted-foreground">Organic radial layout emanating from the root. Great for wide, shallow structures.</p>
        </div>
      </div>
    </section>
  );
}

// ─── NodeType ─────────────────────────────────────────────────────────────────

export function NodeTypeSection() {
  return (
    <section id="type-nodetype" className="scroll-mt-24">
      <SectionHeading id="type-nodetype" level={3}>NodeType</SectionHeading>
      <p className="text-muted-foreground mb-4">Represents each JSON primitive and container type.</p>
      <CodeBlock language="typescript" code={`type NodeType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';`} />
    </section>
  );
}

// ─── GraphNode ────────────────────────────────────────────────────────────────

const GRAPH_NODE_FIELDS = [
  { name: "id",          type: "string",       description: "Unique node identifier." },
  { name: "type",        type: "NodeType",     description: "JSON value type: object | array | string | number | boolean | null." },
  { name: "key",         type: "string?",      description: "The JSON key that produced this node. Undefined for the root node." },
  { name: "value",       type: "string?",      description: "Serialised display value for primitives (string, number, boolean, null)." },
  { name: "childCount",  type: "number",       description: "Number of direct children (object keys or array items)." },
  { name: "depth",       type: "number",       description: "Zero-indexed depth from the root." },
  { name: "parentId",    type: "string?",      description: "ID of the parent node. Undefined for the root." },
  { name: "expanded",    type: "boolean",      description: "Whether this node is currently expanded in the UI." },
  { name: "pos",         type: "NodePosition", description: "Layout position { x, y, vx, vy }. Mutated by the layout engine." },
  { name: "width",       type: "number",       description: "Bounding box width set after layout measurement." },
  { name: "height",      type: "number",       description: "Bounding box height set after layout measurement." },
  { name: "highlighted", type: "boolean",      description: "True when this node matches a search query." },
  { name: "hovered",     type: "boolean",      description: "True when the pointer is over this node." },
  { name: "alpha",       type: "number",       description: "Animation progress 0→1 used for fade-in." },
  { name: "transparent", type: "boolean?",     description: "Anonymous array-item wrapper — hidden from view, edges skipped through." },
];

export function GraphNodeTypeSection() {
  return (
    <section id="type-graphnode" className="scroll-mt-24">
      <SectionHeading id="type-graphnode" level={3}>GraphNode</SectionHeading>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Represents a single node in the graph. Each JSON value (object, array, or primitive) produces one GraphNode.
      </p>
      <CodeBlock language="typescript" code={`interface NodePosition {
  x: number;
  y: number;
  vx: number;  // velocity used by force layout
  vy: number;
}

interface GraphNode {
  id: string;
  type: NodeType;
  key?: string;
  value?: string;
  childCount: number;
  depth: number;
  parentId?: string;
  expanded: boolean;
  pos: NodePosition;
  width: number;
  height: number;
  highlighted: boolean;
  hovered: boolean;
  alpha: number;
  transparent?: boolean;
}`} />
      <h3 className="text-base font-semibold mt-6 mb-3 text-foreground">Fields</h3>
      <PropTable rows={GRAPH_NODE_FIELDS.map(f => ({
        name: f.name, type: f.type, description: f.description, required: false,
      }))} />
    </section>
  );
}

// ─── GraphEdge ────────────────────────────────────────────────────────────────

const GRAPH_EDGE_FIELDS = [
  { name: "id",       type: "string",  description: "Unique edge identifier." },
  { name: "sourceId", type: "string",  description: "ID of the source (parent) node." },
  { name: "targetId", type: "string",  description: "ID of the target (child) node." },
  { name: "label",    type: "string?", description: "The JSON key label on this edge (same as target.key)." },
  { name: "caption",  type: "string?", description: "Optional text displayed in a pill box at the edge midpoint. Set automatically when the target key is __CAPTION__." },
  { name: "alpha",    type: "number",  description: "Animation progress 0→1 for fade-in." },
];

export function GraphEdgeTypeSection() {
  return (
    <section id="type-graphedge" className="scroll-mt-24">
      <SectionHeading id="type-graphedge" level={3}>GraphEdge</SectionHeading>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Represents a directed edge between two nodes. Edges carry the JSON key label and an optional caption pill.
      </p>
      <CodeBlock language="typescript" code={`interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;    // JSON key that connects these nodes
  caption?: string;  // Optional pill label at edge midpoint
  alpha: number;     // Fade-in animation progress
}`} />
      <PropTable rows={GRAPH_EDGE_FIELDS.map(f => ({ name: f.name, type: f.type, description: f.description, required: false }))} className="mt-4" />
    </section>
  );
}

// ─── ParseOptions ─────────────────────────────────────────────────────────────

export function ParseOptionsSection() {
  return (
    <section id="type-parseoptions" className="scroll-mt-24">
      <SectionHeading id="type-parseoptions" level={3}>ParseOptions</SectionHeading>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Low-level parser configuration passed via <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">maxDepth</code> and{" "}
        <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">maxNodes</code> on <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">JsonGraphOptions</code>.
      </p>
      <CodeBlock language="typescript" code={`interface ParseOptions {
  maxDepth?: number;  // Max nesting depth. Default: 200
  maxNodes?: number;  // Max total nodes. Default: 500_000
  chunkSize?: number; // Text decoder chunk in bytes. Default: 65_536 (64 KB)
}`} />
    </section>
  );
}

// ─── ParseLimitError ──────────────────────────────────────────────────────────

export function ParseLimitErrorSection() {
  return (
    <section id="type-parselimiterror" className="scroll-mt-24">
      <SectionHeading id="type-parselimiterror" level={3}>ParseLimitError</SectionHeading>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Error class thrown (and forwarded to <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">onError</code>) when the parser
        exceeds <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">maxDepth</code> or <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">maxNodes</code>.
      </p>
      <CodeBlock language="typescript" code={`import { ParseLimitError } from 'jsongraphs';

class ParseLimitError extends Error {
  readonly kind: 'depth' | 'nodes';
}

// Usage
const graph = new JsonGraph({
  container,
  maxNodes: 10_000,
  onError: (err) => {
    if (err instanceof ParseLimitError) {
      if (err.kind === 'nodes') {
        console.warn('Too many nodes! Increase maxNodes.');
      } else if (err.kind === 'depth') {
        console.warn('JSON too deeply nested! Increase maxDepth.');
      }
    }
  },
});`} />
    </section>
  );
}

// ─── Theme interface ──────────────────────────────────────────────────────────

export function ThemeTypeSection() {
  return (
    <section id="type-theme" className="scroll-mt-24">
      <SectionHeading id="type-theme" level={3}>Theme</SectionHeading>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        The full theme interface. Every visual property of the graph is configurable through this object.
      </p>
      <CodeBlock language="typescript" code={`interface NodeColors {
  fill:   string;  // Node background
  stroke: string;  // Node border
  text:   string;  // Node label text
  badge:  string;  // Type badge colour
}

interface Theme {
  name:       string;
  background: string;  // Canvas background colour
  gridLine:   string;  // Subtle grid line colour

  nodeColors: Record<NodeType, NodeColors>;  // Per-type colours

  edge: {
    stroke:        string;  // Default edge colour
    highlight:     string;  // Highlighted edge colour
    width:         number;  // Edge line width in px
    captionBg:     string;  // Caption pill background
    captionText:   string;  // Caption pill text
    captionBorder: string;  // Caption pill border
  };

  font: {
    family:    string;  // CSS font-family
    keySize:   number;  // Key label font size
    valueSize: number;  // Value label font size
    typeSize:  number;  // Type badge font size
  };

  node: {
    radius:       number;  // Corner radius
    paddingX:     number;  // Horizontal padding
    paddingY:     number;  // Vertical padding
    minWidth:     number;  // Minimum node width
    shadowBlur:   number;  // Drop shadow blur radius
    shadowColor:  string;  // Drop shadow colour
    shadowOffset: number;  // Drop shadow offset
  };

  ui: {
    panelBg:          string;  // Toolbar / search / minimap background
    panelBorder:      string;  // Panel border colour
    panelShadow:      string;  // Panel box-shadow CSS value
    btnHover:         string;  // Button hover background
    btnActive:        string;  // Button active / selected background
    text:             string;  // Primary UI text colour
    textMuted:        string;  // Secondary UI text colour
    inputBg:          string;  // Search input background
    inputText:        string;  // Search input text colour
    inputPlaceholder: string;  // Search placeholder colour
    focusRing:        string;  // Focus ring colour
    separator:        string;  // Separator line colour
    minimapViewport:  string;  // Minimap viewport rect stroke
  };
}`} />
    </section>
  );
}
