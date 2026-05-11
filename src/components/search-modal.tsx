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
  "Getting Started": "text-emerald-400",
  "API Reference":   "text-[#7ab3ff]",
  "Types":           "text-cyan-400",
  "Themes":          "text-amber-400",
  "Advanced":        "text-rose-400",
  "Features":        "text-indigo-400",
};

const SECTION_BG: Record<string, string> = {
  "Getting Started": "bg-emerald-500/8 border-emerald-500/20",
  "API Reference":   "bg-[#4d8fff]/8 border-[#4d8fff]/20",
  "Types":           "bg-cyan-500/8 border-cyan-500/20",
  "Themes":          "bg-amber-500/8 border-amber-500/20",
  "Advanced":        "bg-rose-500/8 border-rose-500/20",
  "Features":        "bg-indigo-500/8 border-indigo-500/20",
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

  React.useEffect(() => { setSelected(0); }, [results]);

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
      <div className="absolute inset-0 bg-[#020509]/75 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl overflow-hidden"
        style={{
          background: "rgba(8,14,26,0.97)",
          border: "1px solid rgba(77,143,255,0.18)",
          borderRadius: "1rem",
          boxShadow: "0 8px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(77,143,255,0.06), 0 0 80px rgba(77,143,255,0.07)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top glow line */}
        <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#4d8fff]/40 to-transparent" />

        {/* Search input row */}
        <div
          className="flex items-center gap-3 px-4 py-3.5 border-b border-[#4d8fff]/10"
        >
          <Search className="size-4 text-[#4d8fff]/60 shrink-0" />
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-[#2d4060] outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd
            className="hidden sm:flex items-center px-1.5 py-0.5 text-[10px] font-mono
                       text-[#2d4060] border border-[#4d8fff]/15 rounded bg-[#070b14]/60"
          >
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="py-10 text-center">
              <Search className="size-8 text-[#1e3050] mx-auto mb-3" />
              <p className="text-sm text-[#2d4060]">Type to search documentation…</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-[#2d4060]">No results for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            <ul>
              {results.map((entry, i) => (
                <li key={entry.id}>
                  <button
                    id={`search-result-${i}`}
                    onClick={() => navigateTo(entry.href)}
                    className={cn(
                      "w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150",
                      i === selected
                        ? "bg-[#4d8fff]/12 border border-[#4d8fff]/20"
                        : "hover:bg-[#4d8fff]/6 border border-transparent"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 shrink-0",
                        i === selected
                          ? "text-[#4d8fff]"
                          : (SECTION_COLORS[entry.section] ?? "text-[#3d5a80]")
                      )}
                    >
                      {SECTION_ICONS[entry.section] ?? <Code2 className="size-3.5" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "text-sm font-medium truncate",
                        i === selected ? "text-foreground" : "text-[#8bacc8]"
                      )}>
                        {entry.title}
                      </div>
                      <div className="text-xs text-[#3d5a80] truncate mt-0.5">
                        {entry.description}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-medium px-1.5 py-0.5 rounded-md border shrink-0 mt-0.5",
                        SECTION_COLORS[entry.section] ?? "text-[#3d5a80]",
                        SECTION_BG[entry.section] ?? "bg-[#4d8fff]/5 border-[#4d8fff]/15"
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
        <div
          className="flex items-center justify-between px-4 py-2 border-t border-[#4d8fff]/10"
          style={{ background: "rgba(5,10,18,0.60)" }}
        >
          <div className="flex items-center gap-4 text-xs text-[#2d4060]">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1 py-0.5 font-mono border border-[#4d8fff]/15 rounded text-[10px] bg-[#070b14]/60">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1.5">
              <CornerDownLeft className="size-3" />
              select
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#2d4060]">
            <kbd className="px-1 py-0.5 font-mono border border-[#4d8fff]/15 rounded text-[10px] bg-[#070b14]/60">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-1 py-0.5 font-mono border border-[#4d8fff]/15 rounded text-[10px] bg-[#070b14]/60">K</kbd>
            <span className="ml-1">to toggle</span>
          </div>
        </div>

        {/* Bottom glow */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#4d8fff]/20 to-transparent" />
      </div>
    </div>
  );
}
