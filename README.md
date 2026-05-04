# 🕸️ JsonGraphs

[![Version](https://img.shields.io/npm/v/jsongraphs?color=7c3aed&style=flat-square)](https://www.npmjs.com/package/jsongraphs)
[![License](https://img.shields.io/npm/l/jsongraphs?style=flat-square)](https://github.com/devian-agency/jsongraphs/blob/main/LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/jsongraphs?style=flat-square)](https://bundlephobia.com/package/jsongraphs)

**JsonGraphs** is a high-performance, dependency-free library for visualizing complex JSON structures as beautiful, interactive graphs. Built with a custom Canvas renderer and a streaming parser, it can handle massive datasets while maintaining smooth 60 FPS interactions.

[Live Demo](https://jsongraphs.devian.agency) | [Documentation](https://github.com/devian-agency/jsongraphs/tree/main/docs)

---

## ✨ Key Features

*   **🚀 Extreme Performance**: Canvas-based rendering with optimized spatial indexing.
*   **📡 Streaming Parser**: Load huge JSON files (MBs+) without blocking the UI thread.
*   **🛠️ Interactive UI**: Built-in MiniMap, Search Bar, and Toolbar for easy navigation.
*   **📐 Multiple Layouts**: Switch between hierarchical **Tree** and organic **Radial** layouts.
*   **🎨 Themeable**: Comes with sleek Light and Dark modes out of the box.
*   **🧩 Zero Dependencies**: Ultra-lightweight and easy to integrate into any project.

---

## 📦 Installation

```bash
npm install jsongraphs
# or
yarn add jsongraphs
# or
bun add jsongraphs
```

---

## 🚀 Quick Start

### Vanilla JavaScript

```javascript
import { JsonGraph, darkTheme } from 'jsongraphs';

const container = document.getElementById('graph-container');

const graph = new JsonGraph({
  container,
  theme: darkTheme,
  layout: 'tree',
  minimap: true,
  toolbar: true,
});

// Load from an object
graph.load({
  project: "Alpha",
  tasks: [
    { id: 1, title: "Design UI" },
    { id: 2, title: "Implement Backend" }
  ]
});
```

### React / Next.js Integration

```tsx
"use client";
import { useEffect, useRef } from "react";
import { JsonGraph, darkTheme } from "jsongraphs";

export default function GraphViewer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const graph = new JsonGraph({
      container: containerRef.current,
      theme: darkTheme,
    });

    graph.load({ /* your data */ });

    return () => graph.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '600px' }} />;
}
```

---

## 🛠️ Configuration

The `JsonGraph` constructor accepts an options object:

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `container` | `HTMLElement` | **Required** | The host element for the graph. |
| `theme` | `Theme` | `defaultTheme` | Initial theme (`defaultTheme` or `darkTheme`). |
| `layout` | `'tree' \| 'radial'` | `'tree'` | Initial layout algorithm. |
| `minimap` | `boolean` | `true` | Show/hide the interactive mini-map. |
| `toolbar` | `boolean` | `true` | Show/hide the viewport control toolbar. |
| `search` | `boolean` | `true` | Show/hide the node search bar. |
| `maxDepth` | `number` | `200` | Maximum recursion depth for parsing. |
| `onLoad` | `function` | `undefined` | Callback: `(nodes, edges) => void`. |

---

## 📖 API Reference

### Methods

*   **`load(source: JsonSource)`**: Load data from a `File`, `URL`, `string`, `ReadableStream`, or plain `object`.
*   **`setLayout(layout: 'tree' | 'radial')`**: Switch the layout algorithm dynamically.
*   **`setTheme(theme: Theme)`**: Apply a new theme.
*   **`toggleTheme()`**: Switch between Light and Dark modes.
*   **`fitView()`**: Reset zoom and center the graph.
*   **`expandAll() / collapseAll()`**: Control node visibility globally.
*   **`destroy()`**: Cleanup event listeners and DOM elements.

---

## 💡 Advanced Usage

### Custom Edge Captions
You can add descriptive labels to edges by using the special `__CAPTION__` key inside any object:

```json
{
  "user": {
    "__CAPTION__": "is assigned to",
    "name": "Alice"
  }
}
```

### Loading Large Files
Since JsonGraphs uses a streaming parser, you can feed it a fetch response stream directly to save memory:

```javascript
const response = await fetch('/huge-data.json');
graph.load(response.body); // Loads while downloading!
```

---

## 🎨 Themes

JsonGraphs is designed to look premium. You can import and use the built-in themes:

```javascript
import { defaultTheme, darkTheme } from 'jsongraphs';

graph.setTheme(darkTheme);
```

To create a custom theme, follow the `Theme` interface:

```typescript
const myTheme = {
  name: 'sunset',
  background: '#1a1a1a',
  node: {
    string: '#ffcc00',
    number: '#ff5500',
    // ...
  }
};
```

---

## 📄 License

MIT © [Devian Agency](https://devian.agency)
