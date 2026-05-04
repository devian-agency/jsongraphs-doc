"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

const NAV: NavItem[] = [
  {
    label: "Getting Started",
    href: "#installation",
    children: [
      { label: "Installation",          href: "#installation" },
      { label: "Quick Start",           href: "#quick-start" },
      { label: "React / Next.js",       href: "#react-usage" },
      { label: "Key Features",          href: "#features" },
    ],
  },
  {
    label: "API Reference",
    href: "#jsongraph-class",
    children: [
      { label: "JsonGraph",             href: "#jsongraph-class" },
      { label: "load()",                href: "#api-load" },
      { label: "setLayout()",           href: "#api-setlayout" },
      { label: "setTheme()",            href: "#api-settheme" },
      { label: "toggleTheme()",         href: "#api-toggletheme" },
      { label: "fitView()",             href: "#api-fitview" },
      { label: "zoomIn() / zoomOut()",  href: "#api-zoom" },
      { label: "expandAll() / collapseAll()", href: "#api-expand" },
      { label: "destroy()",             href: "#api-destroy" },
    ],
  },
  {
    label: "Types",
    href: "#type-jsonsource",
    children: [
      { label: "JsonSource",            href: "#type-jsonsource" },
      { label: "LayoutType",            href: "#type-layouttype" },
      { label: "NodeType",              href: "#type-nodetype" },
      { label: "GraphNode",             href: "#type-graphnode" },
      { label: "GraphEdge",             href: "#type-graphedge" },
      { label: "ParseOptions",          href: "#type-parseoptions" },
      { label: "ParseLimitError",       href: "#type-parselimiterror" },
      { label: "Theme",                 href: "#type-theme" },
    ],
  },
  {
    label: "Themes",
    href: "#themes",
    children: [
      { label: "Built-in Themes",       href: "#themes" },
      { label: "Custom Theme",          href: "#themes-custom" },
    ],
  },
  {
    label: "Advanced",
    href: "#advanced-caption",
    children: [
      { label: "__CAPTION__ Key",       href: "#advanced-caption" },
      { label: "Streaming Large Files", href: "#advanced-streaming" },
    ],
  },
];

export function DocSidebar() {
  const [activeId, setActiveId] = React.useState<string>("");

  // Track active section via IntersectionObserver
  React.useEffect(() => {
    const allIds = NAV.flatMap((g) => (g.children ?? []).map((c) => c.href.slice(1)));
    const observers: IntersectionObserver[] = [];

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <aside className="hidden lg:block w-60 xl:w-64 shrink-0">
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 -mr-2">
        <nav aria-label="Documentation navigation">
          {NAV.map((group) => (
            <div key={group.label} className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-2">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {(group.children ?? []).map((item) => {
                  const id = item.href.slice(1);
                  const isActive = activeId === id;
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg transition-colors",
                          isActive
                            ? "text-primary bg-primary/8 font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        {isActive && <ChevronRight className="size-3 shrink-0 text-primary" />}
                        <span className={cn(!isActive && "pl-5")}>{item.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
