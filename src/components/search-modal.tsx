"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useSearch } from "@/components/providers";
import {
  Search,
  FileJson,
  Network,
  Layers,
  Sun,
  Code2,
  Zap,
  CornerDownLeft,
} from "lucide-react";

const SECTION_ICONS: Record<string, React.ReactNode> = {
  "Getting Started": <Zap className="size-3.5" />,
  "API Reference":   <Code2 className="size-3.5" />,
  "Types":           <FileJson className="size-3.5" />,
  "Themes":          <Sun className="size-3.5" />,
  "Advanced":        <Network className="size-3.5" />,
  "Features":        <Layers className="size-3.5" />,
};

const SECTION_COLORS: Record<string, string> = {
  "Getting Started": "text-emerald-500",
  "API Reference":   "text-violet-500",
  "Types":           "text-sky-500",
  "Themes":          "text-amber-500",
  "Advanced":        "text-rose-500",
  "Features":        "text-indigo-500",
};

export function SearchModal() {
  const { open, query, results, setOpen, setQuery } = useSearch();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [selected, setSelected] = React.useState(0);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelected(0);
    }
  }, [open]);

  React.useEffect(() => {
    setSelected(0);
  }, [results]);

  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter" && results[selected]) {
        navigateTo(results[selected].href);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, selected]);

  function navigateTo(href: string) {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 text-xs font-mono text-muted-foreground border border-border rounded">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Type to search documentation…
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <ul>
              {results.map((entry, i) => (
                <li key={entry.id}>
                  <button
                    id={`search-result-${i}`}
                    onClick={() => navigateTo(entry.href)}
                    className={cn(
                      "w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-colors",
                      i === selected
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/60"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 shrink-0",
                        i === selected
                          ? "text-primary"
                          : (SECTION_COLORS[entry.section] ?? "text-muted-foreground")
                      )}
                    >
                      {SECTION_ICONS[entry.section] ?? <Code2 className="size-3.5" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{entry.title}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {entry.description}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded-md border shrink-0 mt-0.5",
                        SECTION_COLORS[entry.section] ?? "text-muted-foreground",
                        "border-current/20 bg-current/5"
                      )}
                    >
                      {entry.section}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 font-mono border border-border rounded text-[10px]">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="size-3" />
              select
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <kbd className="px-1 py-0.5 font-mono border border-border rounded text-[10px]">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-1 py-0.5 font-mono border border-border rounded text-[10px]">K</kbd>
            <span className="ml-1">to toggle</span>
          </div>
        </div>
      </div>
    </div>
  );
}
