<div align="center">

<img src="https://jsongraphs.devian.in/logo/logo.webp" alt="JsonGraphs" width="80" height="80" />

# JsonGraphs

**High-performance, dependency-free JSON graph visualizer**

[![npm version](https://img.shields.io/npm/v/jsongraphs?color=%238b83f0&style=flat-square)](https://www.npmjs.com/package/jsongraphs)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/jsongraphs?color=%2322b882&style=flat-square)](https://bundlephobia.com/package/jsongraphs)
[![License](https://img.shields.io/npm/l/jsongraphs?color=%23ffcb6b&style=flat-square)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue?style=flat-square)](https://www.typescriptlang.org/)

[Documentation](https://jsongraphs.devian.in) · [npm](https://www.npmjs.com/package/jsongraphs) · [GitHub](https://github.com/devian-agency/jsongraphs)

</div>
---

## Features

| Feature | Details |
|---|---|
| 🌳 **Tree Layout** | Clean left-to-right hierarchy with zero node overlaps |
| 🌀 **Radial Layout** | Organic outward-growing spiral — compact and overlap-free at any scale |
| 🔄 **Streaming Parser** | Progressive loading of large files — the UI never freezes |
| 🎨 **Theming** | Built-in light & dark themes, fully composable custom themes |
| 🔍 **Search** | Full-text Ctrl+K search with live node highlighting |
| 🗺️ **MiniMap** | Viewport-aware minimap with pan indicator |
| 🪗 **Expand/Collapse** | Double-click any node to toggle its subtree |
| 🏷️ **Captions** | `__CAPTION__` key injects floating pills and edge labels |
| 📦 **Zero deps** | Pure TypeScript + Canvas 2D — no runtime dependencies |

---

## Installation

```bash
npm install jsongraphs
# or
yarn add jsongraphs
# or
bun add jsongraphs
```

---

## Quick Start

```typescript
import { JsonGraph, darkTheme } from 'jsongraphs';

const graph = new JsonGraph({
  container: document.getElementById('graph-container')!,
  theme: darkTheme,
  layout: 'tree',   // or 'radial'
  minimap: true,
  toolbar: true,
  search: true,
});

await graph.load({
  project: "My App",
  version: "2.0",
  dependencies: {
    react: "^19",
    typescript: "^5",
  },
});
```

---

## React / Next.js

```tsx
"use client";
import { useEffect, useRef } from "react";
import { JsonGraph, darkTheme } from "jsongraphs";

export function GraphViewer({ data }: { data: object }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const graph = new JsonGraph({
      container: ref.current,
      theme: darkTheme,
      layout: "tree",
      minimap: true,
      toolbar: true,
      search: true,
    });
    graph.load(data);
    return () => graph.destroy();
  }, [data]);

  return <div ref={ref} style={{ width: "100%", height: "600px" }} />;
}
```

> **Next.js:** Add `"use client"` in App Router, or use `dynamic(() => import(…), { ssr: false })` in Pages Router.

---

## API Reference

### `new JsonGraph(options)`

| Option | Type | Default | Description |
|---|---|---|---|
| `container` | `HTMLElement` | **required** | Host element for the canvas |
| `theme` | `Theme` | `defaultTheme` | Visual theme |
| `layout` | `'tree' \| 'radial'` | `'tree'` | Initial layout |
| `minimap` | `boolean` | `true` | Show minimap overlay |
| `toolbar` | `boolean` | `true` | Show toolbar overlay |
| `search` | `boolean` | `true` | Enable Ctrl+K search |
| `showNodeCount` | `boolean` | `true` | Show total node count badge |
| `maxNodes` | `number` | `500_000` | Parser node limit |
| `maxDepth` | `number` | `200` | Parser depth limit |
| `onLoad` | `(nodes, edges) => void` | `—` | Called when loading completes |
| `onError` | `(err: Error) => void` | `—` | Called on parse errors |

### Methods

```typescript
// Data
await graph.load(source)           // File | ReadableStream | Response | string | object

// Layout
graph.setLayout('radial')          // Switch layout

// Viewport
graph.fitView()                    // Fit all visible nodes into view
graph.zoomIn()                     // Zoom in
graph.zoomOut()                    // Zoom out
graph.resetZoom()                  // Reset to 100%

// Theme
graph.setTheme(myTheme)            // Apply a new theme
graph.toggleTheme()                // Toggle light ↔ dark

// Nodes
graph.expandNode(id)               // Expand a collapsed node
graph.collapseNode(id)             // Collapse an expanded node
graph.expandAll()                  // Expand all nodes
graph.collapseAll()                // Collapse all nodes

// Lifecycle
graph.destroy()                    // Unmount and clean up all resources
```

---

## Data Sources

```typescript
// JS object
await graph.load({ users: [] });

// JSON string
await graph.load('{"users":[]}');

// Fetch response (streamed progressively)
const res = await fetch('/data.json');
await graph.load(res);

// File input
const file = input.files[0];
await graph.load(file);

// ReadableStream
await graph.load(response.body);
```

---

## Layouts

### Tree Layout

A clean, left-to-right hierarchical layout. Every subtree occupies its own vertical band — zero overlaps regardless of depth.

```
root
├── users [array]
│   ├── { name: "Alice", role: "admin" }
│   └── { name: "Bob",   role: "user"  }
└── config
    ├── debug: false
    └── version: "2.0"
```

### Radial Layout

An organic, outward-growing spiral layout inspired by natural packing patterns. Nodes radiate from the center with siblings clustered together. Overlap-free at any scale.

---

## `__CAPTION__` Keys

Add contextual labels to any node by including a `__CAPTION__` key:

```json
{
  "user": {
    "__CAPTION__": "is assigned to",
    "name": "Alice",
    "role": "admin"
  }
}
```

- **Top-level nodes** → floating pill rendered above the node
- **Deeper nodes** → label centered on the incoming edge

The `__CAPTION__` node is automatically hidden — only its value is used as the label.

---

## Theming

```typescript
import { defaultTheme, type Theme } from 'jsongraphs';

const myTheme: Theme = {
  ...defaultTheme,
  name: 'custom',
  background: '#0a0a10',
  nodeColors: {
    object:  { fill: '#1a1040', stroke: '#6366f1', text: '#c4b5fd', badge: '#6366f1' },
    array:   { fill: '#0a2010', stroke: '#22c55e', text: '#86efac', badge: '#22c55e' },
    string:  { fill: '#0a1828', stroke: '#3b82f6', text: '#93c5fd', badge: '#3b82f6' },
    number:  { fill: '#1a1400', stroke: '#eab308', text: '#fde047', badge: '#eab308' },
    boolean: { fill: '#1a0a14', stroke: '#ec4899', text: '#f9a8d4', badge: '#ec4899' },
    null:    { fill: '#141414', stroke: '#6b7280', text: '#9ca3af', badge: '#6b7280' },
  },
};

graph.setTheme(myTheme);
```

---

## Performance

| Metric | Value |
|---|---|
| Rendering | 60 FPS Canvas 2D |
| Max recommended nodes | 500,000 |
| Large file loading | Progressive — UI stays responsive |
| Bundle size | < 50 kB minzipped |
| Dependencies | 0 |

---

## Browser Support

All modern browsers with Canvas 2D and ResizeObserver support:

- Chrome 88+, Edge 88+, Firefox 90+, Safari 14+

---

## License

MIT © [Devian Agency](https://devian.in)

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.  
Security issues: see [SECURITY.md](./SECURITY.md).
