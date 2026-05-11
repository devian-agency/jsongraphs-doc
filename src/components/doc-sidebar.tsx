"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface NavItem { label: string; href: string }
interface NavGroup { label: string; color: string; dot: string; dotGlow: string; items: NavItem[] }

const NAV: NavGroup[] = [
  {
    label: "Getting Started",
    color: "text-emerald-400",
    dot: "bg-emerald-400",
    dotGlow: "shadow-[0_0_6px_rgba(52,211,153,0.8)]",
    items: [
      { label: "Installation",      href: "#installation" },
      { label: "Quick Start",       href: "#quick-start" },
      { label: "React / Next.js",   href: "#react-usage" },
      { label: "Key Features",      href: "#features" },
    ],
  },
  {
    label: "API Reference",
    color: "text-[#7ab3ff]",
    dot: "bg-[#4d8fff]",
    dotGlow: "shadow-[0_0_6px_rgba(77,143,255,0.8)]",
    items: [
      { label: "JsonGraph",                   href: "#jsongraph-class" },
      { label: "load()",                      href: "#api-load" },
      { label: "setLayout()",                 href: "#api-setlayout" },
      { label: "setTheme()",                  href: "#api-settheme" },
      { label: "toggleTheme()",               href: "#api-toggletheme" },
      { label: "fitView()",                   href: "#api-fitview" },
      { label: "zoomIn() / zoomOut()",        href: "#api-zoom" },
      { label: "expandAll() / collapseAll()", href: "#api-expand" },
      { label: "invalidateCache()",           href: "#api-invalidatecache" },
      { label: "destroy()",                   href: "#api-destroy" },
    ],
  },
  {
    label: "Types",
    color: "text-cyan-400",
    dot: "bg-cyan-400",
    dotGlow: "shadow-[0_0_6px_rgba(34,211,238,0.8)]",
    items: [
      { label: "JsonSource",      href: "#type-jsonsource" },
      { label: "LayoutType",      href: "#type-layouttype" },
      { label: "NodeType",        href: "#type-nodetype" },
      { label: "GraphNode",       href: "#type-graphnode" },
      { label: "GraphEdge",       href: "#type-graphedge" },
      { label: "ParseOptions",    href: "#type-parseoptions" },
      { label: "ParseLimitError", href: "#type-parselimiterror" },
      { label: "Theme",           href: "#type-theme" },
    ],
  },
  {
    label: "Themes",
    color: "text-amber-400",
    dot: "bg-amber-400",
    dotGlow: "shadow-[0_0_6px_rgba(251,191,36,0.8)]",
    items: [
      { label: "Built-in Themes", href: "#themes" },
      { label: "Custom Theme",    href: "#themes-custom" },
    ],
  },
  {
    label: "Advanced",
    color: "text-rose-400",
    dot: "bg-rose-400",
    dotGlow: "shadow-[0_0_6px_rgba(251,113,133,0.8)]",
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
    const observers: IntersectionObserver[] = [];

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
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
        <nav aria-label="Documentation navigation" className="space-y-5">
          {NAV.map((group) => (
            <div key={group.label}>
              {/* Group header */}
              <div className={cn(
                "flex items-center gap-2 px-2 mb-1.5 text-[10px] font-bold uppercase tracking-widest opacity-75",
                group.color
              )}>
                <span className={cn("size-1.5 rounded-full shrink-0", group.dot, group.dotGlow)} />
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
                            ? "text-foreground font-medium bg-[#4d8fff]/10 border border-[#4d8fff]/20"
                            : "text-[#3d5a80] hover:text-foreground hover:bg-[#4d8fff]/5"
                        )}
                      >
                        {active && (
                          <span
                            className="size-1 rounded-full bg-[#4d8fff] shrink-0"
                            style={{ boxShadow: "0 0 6px rgba(77,143,255,0.8)" }}
                          />
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
          <div className="pt-4 border-t border-[#4d8fff]/10 space-y-1">
            {[
              { label: "GitHub",        href: "https://github.com/devian-agency/jsongraphs" },
              { label: "npm",           href: "https://www.npmjs.com/package/jsongraphs" },
              { label: "Devian Agency", href: "https://devian.in" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#2d4060]
                           hover:text-[#5a7094] rounded-lg hover:bg-[#4d8fff]/5 transition-colors"
              >
                <span className="size-1 rounded-full bg-[#2d4060]" />
                {l.label} ↗
              </a>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
}
