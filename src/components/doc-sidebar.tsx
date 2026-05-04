"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface NavItem { label: string; href: string }
interface NavGroup { label: string; color: string; dot: string; items: NavItem[] }

const NAV: NavGroup[] = [
  {
    label: "Getting Started",
    color: "text-emerald-400",
    dot: "bg-emerald-400",
    items: [
      { label: "Installation",      href: "#installation" },
      { label: "Quick Start",       href: "#quick-start" },
      { label: "React / Next.js",   href: "#react-usage" },
      { label: "Key Features",      href: "#features" },
    ],
  },
  {
    label: "API Reference",
    color: "text-violet-400",
    dot: "bg-violet-400",
    items: [
      { label: "JsonGraph",               href: "#jsongraph-class" },
      { label: "load()",                  href: "#api-load" },
      { label: "setLayout()",             href: "#api-setlayout" },
      { label: "setTheme()",              href: "#api-settheme" },
      { label: "toggleTheme()",           href: "#api-toggletheme" },
      { label: "fitView()",               href: "#api-fitview" },
      { label: "zoomIn() / zoomOut()",    href: "#api-zoom" },
      { label: "expandAll() / collapseAll()", href: "#api-expand" },
      { label: "invalidateCache()",       href: "#api-invalidatecache" },
      { label: "destroy()",               href: "#api-destroy" },
    ],
  },
  {
    label: "Types",
    color: "text-sky-400",
    dot: "bg-sky-400",
    items: [
      { label: "JsonSource",        href: "#type-jsonsource" },
      { label: "LayoutType",        href: "#type-layouttype" },
      { label: "NodeType",          href: "#type-nodetype" },
      { label: "GraphNode",         href: "#type-graphnode" },
      { label: "GraphEdge",         href: "#type-graphedge" },
      { label: "ParseOptions",      href: "#type-parseoptions" },
      { label: "ParseLimitError",   href: "#type-parselimiterror" },
      { label: "Theme",             href: "#type-theme" },
    ],
  },
  {
    label: "Themes",
    color: "text-amber-400",
    dot: "bg-amber-400",
    items: [
      { label: "Built-in Themes",   href: "#themes" },
      { label: "Custom Theme",      href: "#themes-custom" },
    ],
  },
  {
    label: "Advanced",
    color: "text-rose-400",
    dot: "bg-rose-400",
    items: [
      { label: "__CAPTION__ Key",     href: "#advanced-caption" },
      { label: "Streaming Large Files", href: "#advanced-streaming" },
    ],
  },
];

export function DocSidebar() {
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    const allIds = NAV.flatMap((g) => g.items.map((i) => i.href.slice(1)));
    const map = new Map<Element, string>();
    const observers: IntersectionObserver[] = [];

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      map.set(el, id);
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: "-80px 0px -55% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <aside className="hidden lg:block w-56 xl:w-60 shrink-0">
      <div className="sticky top-[72px] max-h-[calc(100vh-5rem)] overflow-y-auto pr-1 pb-8">
        <nav aria-label="Documentation navigation" className="space-y-6">
          {NAV.map((group) => (
            <div key={group.label}>
              {/* Group header */}
              <div className={cn(
                "flex items-center gap-2 px-2 mb-1.5 text-[10px] font-bold uppercase tracking-widest",
                group.color, "opacity-80"
              )}>
                <span className={cn("size-1.5 rounded-full", group.dot)} />
                {group.label}
              </div>

              {/* Items */}
              <ul className="space-y-px">
                {group.items.map((item) => {
                  const id = item.href.slice(1);
                  const active = activeId === id;
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2 px-2 py-[6px] text-[13px] rounded-lg transition-all duration-150",
                          active
                            ? "text-foreground font-medium bg-primary/10 border border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/3"
                        )}
                      >
                        {active && (
                          <span className="size-1 rounded-full bg-primary shrink-0" />
                        )}
                        <span className={active ? "" : "pl-3"}>{item.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Footer links */}
          <div className="pt-4 border-t border-border/40 space-y-1">
            {[
              { label: "GitHub", href: "https://github.com/devian-agency/jsongraphs" },
              { label: "npm",    href: "https://www.npmjs.com/package/jsongraphs" },
              { label: "Devian Agency", href: "https://devian.agency" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground/60
                           hover:text-muted-foreground rounded-lg hover:bg-white/3 transition-colors"
              >
                <span className="size-1 rounded-full bg-muted-foreground/30" />
                {l.label} ↗
              </a>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
}
