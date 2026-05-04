<div align="center">

<img src="https://jsongraphs.devian.in/logo/logo.webp" alt="JsonGraphs" width="80" height="80" />

# JsonGraphs

**High-performance, dependency-free JSON graph visualizer**

[![npm version](https://img.shields.io/npm/v/jsongraphs?color=%238b83f0&style=flat-square)](https://www.npmjs.com/package/jsongraphs)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/jsongraphs?color=%2322b882&style=flat-square)](https://bundlephobia.com/package/jsongraphs)
[![License](https://img.shields.io/npm/l/jsongraphs?color=%23ffcb6b&style=flat-square)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue?style=flat-square)](https://www.typescriptlang.org/)

[Documentation](https://jsongraphs.devian.agency) · [npm](https://www.npmjs.com/package/jsongraphs) · [GitHub](https://github.com/devian-agency/jsongraphs)

</div>

---

Visualize any JSON structure as a beautiful, interactive, canvas-rendered graph — directly in the browser. Built with a **streaming parser** and a **zero-dependency** architecture, JsonGraphs handles everything from tiny config objects to multi-megabyte datasets at a smooth 60 FPS.

## ✨ Features

| | Feature | Details |
|---|---|---|
| 🚀 | **Canvas Rendering** | 60 FPS, hardware-accelerated. Optimized spatial indexing for large graphs. |
| 📡 | **Streaming Parser** | Load JSON files of any size without blocking the UI thread. Feed `fetch()` streams directly. |
| 📐 | **Multiple Layouts** | Switch between **Tree** (hierarchical) and **Radial** (organic) layouts at runtime. |
| 🎨 | **Themeable** | Built-in light & dark themes. Full `Theme` interface for custom palettes. |
| 🛠️ | **Built-in UI** | Integrated **MiniMap**, **Search Bar**, and **Toolbar** — all opt-in. |
| 🧩 | **Zero Dependencies** | No runtime deps. ESM-only. Works with Vite, Next.js, Rollup, esbuild. |

---

## 📦 Installation

```bash
npm install jsongraphs
# or
yarn add jsongraphs
# or
bun add jsongraphs
```

> **Note:** JsonGraphs is **ESM-only**. Make sure your bundler supports ESM (Vite, Next.js, Rollup, and esbuild all do out of the box).

---

## 🚀 Quick Start

### Vanilla JavaScript / TypeScript

```typescript
import { JsonGraph, darkTheme } from 'jsongraphs';

const container = document.getElementById('graph-container')!;

const graph = new JsonGraph({
  container,
  theme: darkTheme,   // or defaultTheme for light
  layout: 'tree',     // or 'radial'
  minimap: true,
  toolbar: true,
  search: true,
  onLoad: (nodes, edges) => {
    console.log(`Loaded ${nodes} nodes, ${edges} edges`);
  },
});

// Load from a plain JS object
await graph.load({
  project: 'My App',
  version: '2.0',
  dependencies: {
    react: '^19',
    typescript: '^5',
  },
});
```

The container element gets `position: relative` and `overflow: hidden` applied automatically. Set an explicit **width and height** on it before constructing `JsonGraph`.

### React / Next.js

```tsx
'use client';
import { useEffect, useRef } from 'react';
import { JsonGraph, darkTheme, defaultTheme } from 'jsongraphs';

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
      layout: 'tree',
      minimap: true,
      toolbar: true,
      search: true,
      onLoad: (nodes, edges) => {
        console.log(`Loaded ${nodes} nodes, ${edges} edges`);
      },
      onError: (err) => {
        console.error('Parse error:', err);
      },
    });

    graph.load(data);

    // Always clean up to avoid memory leaks
    return () => graph.destroy();
  }, [data, dark]);

  return <div ref={containerRef} style={{ width: '100%', height: '600px' }} />;
}
```

---

## ⚙️ Constructor Options (`JsonGraphOptions`)

| Option | Type | Default | Description |
|:---|:---|:---|:---|
| `container` | `HTMLElement` | **required** | The host element for the graph canvas and overlay UI. |
| `theme` | `Theme` | `defaultTheme` | Initial visual theme. Use `defaultTheme`, `darkTheme`, or a custom `Theme` object. |
| `layout` | `'tree' \| 'radial'` | `'tree'` | Initial layout algorithm. Can be changed at runtime via `setLayout()`. |
| `minimap` | `boolean` | `true` | Show the interactive mini-map overlay (bottom-right). |
| `toolbar` | `boolean` | `true` | Show the toolbar overlay (zoom, fit, layout toggle, expand/collapse, theme). |
| `search` | `boolean` | `true` | Show the node search bar overlay (top-center). |
| `maxDepth` | `number` | `200` | Maximum JSON nesting depth before a `ParseLimitError` is thrown. |
| `maxNodes` | `number` | `500_000` | Maximum total graph nodes before a `ParseLimitError` is thrown. |
| `onLoad` | `(nodes: number, edges: number) => void` | — | Callback after parsing completes. |
| `onError` | `(err: Error) => void` | — | Callback if parsing fails. |

---

## 📖 API Reference

### `load(source: JsonSource): Promise<void>`

Parses and renders a JSON source. Accepts **five input formats**:

```typescript
// Plain JS object (parsed synchronously)
await graph.load({ name: 'Alice', age: 30 });

// Raw JSON string (parsed synchronously)
await graph.load('{"hello": "world"}');

// File from <input type="file"> (streamed)
const file = fileInput.files[0];
await graph.load(file);

// URL — auto-fetched and streamed
await graph.load(new URL('https://api.example.com/data.json'));

// ReadableStream — most memory-efficient for large files
const res = await fetch('/huge-data.json');
await graph.load(res.body!);
```

---

### `setLayout(layout: LayoutType): void`

Switches the layout algorithm at runtime and immediately re-renders.

```typescript
graph.setLayout('radial'); // Switch to radial layout
graph.setLayout('tree');   // Switch back to tree layout
```

> **Tree layout** is best for deep, hierarchical JSON.  
> **Radial layout** excels with wide, shallow, or network-like structures.

---

### `setTheme(theme: Theme): void`

Applies a `Theme` object to all layers — canvas, toolbar, search bar, and minimap simultaneously.

```typescript
import { darkTheme, defaultTheme } from 'jsongraphs';

graph.setTheme(darkTheme);    // Apply dark theme
graph.setTheme(defaultTheme); // Apply light theme
graph.setTheme(myCustomTheme); // Apply a custom theme
```

---

### `toggleTheme(): void`

Convenience method that toggles between `defaultTheme` (light) and `darkTheme`.

```typescript
graph.toggleTheme();
```

---

### `fitView(): void`

Resets pan and zoom so all visible nodes fit within the container with 80 px padding.

```typescript
graph.fitView();
```

---

### `zoomIn() / zoomOut(): void`

Smooth programmatic zoom toward the container midpoint. `zoomIn()` scales ×1.15, `zoomOut()` scales ×0.87.

```typescript
graph.zoomIn();   // ×1.15
graph.zoomOut();  // ×0.87
```

---

### `expandAll() / collapseAll(): void`

Expand or collapse all `object` and `array` nodes. `collapseAll()` keeps the root node visible.

```typescript
graph.expandAll();   // Show all nodes
graph.collapseAll(); // Collapse all (root stays visible)
```

---

### `destroy(): void`

Cancels pending animation frames, destroys the canvas renderer, and unmounts all overlay elements. **Always call this** when removing the graph to avoid memory leaks.

```typescript
// React useEffect cleanup
return () => graph.destroy();
```

---

## 🎨 Themes

### Built-in Themes

```typescript
import { defaultTheme, darkTheme } from 'jsongraphs';

graph.setTheme(defaultTheme); // Light
graph.setTheme(darkTheme);    // Dark
graph.toggleTheme();          // Toggle between them
```

### Node Type Colors

Each JSON type has its own distinct color in both themes:

| Type | Light | Dark |
|:---|:---|:---|
| `object` | Purple | Deep purple |
| `array` | Green | Deep green |
| `string` | Blue | Deep blue |
| `number` | Lime | Deep lime |
| `boolean` | Amber | Deep amber |
| `null` | Gray | Deep gray |

### Custom Theme

Spread a built-in theme and override only what you need:

```typescript
import { defaultTheme, type Theme } from 'jsongraphs';

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

graph.setTheme(sunsetTheme);
```

---

## 💡 Advanced Usage

### `__CAPTION__` Key — Custom Edge Labels

Add a `"__CAPTION__"` key inside any JSON object to place a descriptive label in a pill at the midpoint of that node's incoming edge. The node itself is hidden — only the caption is shown.

```json
{
  "user": {
    "__CAPTION__": "is assigned to",
    "name": "Alice",
    "role": "admin"
  },
  "project": {
    "__CAPTION__": "belongs to",
    "title": "My App",
    "status": "active"
  }
}
```

### Streaming Large Files

JsonGraphs uses a chunked streaming parser internally. Feed it a `ReadableStream<Uint8Array>` directly so it starts rendering while still downloading:

```typescript
// Start rendering while data is still downloading
const response = await fetch('/api/huge-dataset.json');
await graph.load(response.body!);

// From a file input (also streamed — no full read into memory)
fileInput.addEventListener('change', async (e) => {
  const file = (e.target as HTMLInputElement).files![0];
  await graph.load(file);
});
```

### Handling Parse Limits

```typescript
import { JsonGraph, ParseLimitError } from 'jsongraphs';

const graph = new JsonGraph({
  container,
  maxNodes: 50_000,
  maxDepth: 100,
  onError: (err) => {
    if (err instanceof ParseLimitError) {
      if (err.kind === 'nodes') {
        console.warn('Too many nodes — increase maxNodes option');
      } else if (err.kind === 'depth') {
        console.warn('JSON too deeply nested — increase maxDepth option');
      }
    }
  },
});
```

---

## 📐 Type Reference

### `JsonSource`

```typescript
type JsonSource =
  | File                        // Browser File API
  | ReadableStream<Uint8Array>  // WHATWG Streams
  | string                      // Raw JSON string
  | URL                         // Fetched and streamed automatically
  | object;                     // Any plain JS object
```

### `LayoutType`

```typescript
type LayoutType = 'tree' | 'radial';
```

### `NodeType`

```typescript
type NodeType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
```

### `GraphNode`

```typescript
interface GraphNode {
  id: string;
  type: NodeType;
  key?: string;          // JSON key that produced this node (undefined for root)
  value?: string;        // Serialized display value for primitives
  childCount: number;    // Number of direct children
  depth: number;         // Zero-indexed depth from root
  parentId?: string;     // Parent node id (undefined for root)
  expanded: boolean;     // Whether this node is expanded in the UI
  pos: NodePosition;     // Layout position { x, y, vx, vy }
  width: number;         // Bounding box width (set after layout)
  height: number;        // Bounding box height (set after layout)
  highlighted: boolean;  // True when matching a search query
  hovered: boolean;      // True when pointer is over this node
  alpha: number;         // Fade-in animation progress (0→1)
  transparent?: boolean; // Anonymous array-item wrapper (hidden from view)
}
```

### `GraphEdge`

```typescript
interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;    // JSON key connecting these nodes
  caption?: string;  // Pill label at edge midpoint (__CAPTION__ feature)
  alpha: number;     // Fade-in animation progress (0→1)
}
```

### `ParseOptions`

```typescript
interface ParseOptions {
  maxDepth?: number;  // Max nesting depth. Default: 200
  maxNodes?: number;  // Max total nodes.   Default: 500_000
  chunkSize?: number; // Text decoder chunk in bytes. Default: 65_536 (64 KB)
}
```

### `ParseLimitError`

```typescript
class ParseLimitError extends Error {
  readonly kind: 'depth' | 'nodes'; // Which limit was exceeded
}
```

### `Theme` (abridged)

```typescript
interface Theme {
  name: string;
  background: string;
  gridLine: string;
  nodeColors: Record<NodeType, NodeColors>; // Per-type fill/stroke/text/badge
  edge: {
    stroke: string; highlight: string; width: number;
    captionBg: string; captionText: string; captionBorder: string;
  };
  font: { family: string; keySize: number; valueSize: number; typeSize: number; };
  node: {
    radius: number; paddingX: number; paddingY: number; minWidth: number;
    shadowBlur: number; shadowColor: string; shadowOffset: number;
  };
  ui: {
    panelBg: string; panelBorder: string; panelShadow: string;
    btnHover: string; btnActive: string;
    text: string; textMuted: string;
    inputBg: string; inputText: string; inputPlaceholder: string;
    focusRing: string; separator: string; minimapViewport: string;
  };
}
```

---

## 📄 License

MIT © [Devian Agency](https://devian.agency)
