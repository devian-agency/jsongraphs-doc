"use client";

import * as React from "react";
import { ArrowRight, Terminal, Zap, GitBranch, Cpu } from "lucide-react";
import { useSearch } from "@/components/providers";
import { GraphDemo, DemoWindow } from "@/components/graph-demo";

const STATS = [
  { icon: Cpu,       value: "60 FPS",    label: "Canvas rendering" },
  { icon: Zap,       value: "500k+",     label: "Nodes supported" },
  { icon: GitBranch, value: "0",         label: "Dependencies" },
];

export function HeroSection() {
  const { setOpen } = useSearch();

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* ── Background layers ── */}
      <div className="absolute inset-0 dot-grid opacity-60" />

      {/* Orbs */}
      <div className="orb absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#8b83f0]/20 pointer-events-none" />
      <div className="orb orb-2 absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[#c792ea]/12 pointer-events-none" />
      <div className="orb orb-3 absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-[#89ddf0]/10 pointer-events-none" />

      {/* Vignette edge fade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,transparent_60%,var(--background)_100%)] pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-28 pb-16 px-4 sm:px-6">

        {/* Badge */}
        {/* <div className="fade-up fade-up-1 mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full
                          border border-[#8b83f0]/30 bg-[#8b83f0]/8
                          text-sm font-medium text-[#a09bef]">
            <Image src="/logo/logo.webp" alt="JsonGraphs" width={18} height={18} className="rounded-sm" />
            <span>jsongraphs</span>
            <span className="text-[#8b83f0]/50">·</span>
            <span className="text-xs font-mono text-[#8b83f0]/70">v1.0.2</span>
            <span className="flex items-center gap-1 ml-1 text-xs text-emerald-400/80">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              stable
            </span>
          </div>
        </div> */}

        {/* Heading */}
        <h1 className="fade-up fade-up-2 text-center max-w-4xl">
          <span className="block text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-2">
            <span className="grad">Visualize JSON</span>
          </span>
          <span className="block text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-foreground">
            as Interactive
          </span>
          <span className="block text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-muted-foreground mt-2">
            Graph Structures
          </span>
        </h1>

        {/* Description */}
        <p className="fade-up fade-up-3 mt-8 text-base sm:text-lg text-muted-foreground max-w-xl text-center leading-relaxed">
          A <span className="text-foreground font-medium">dependency-free</span> canvas library
          with a streaming parser, tree &amp; radial layouts, and built-in search, minimap, and toolbar.
        </p>

        {/* CTA */}
        <div className="fade-up fade-up-4 flex flex-col sm:flex-row items-center gap-3 mt-10">
          <a
            href="#installation"
            className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                       bg-primary text-primary-foreground
                       hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]
                       transition-all duration-200 shadow-lg shadow-primary/25"
          >
            Get Started
            <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
          </a>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium
                       border border-border bg-card/50 backdrop-blur-sm text-muted-foreground
                       hover:text-foreground hover:border-primary/30 hover:bg-card
                       transition-all duration-200 cursor-pointer"
          >
            <Terminal className="size-3.5" />
            <span>Search docs</span>
            <kbd className="ml-1 text-xs font-mono border border-border px-1.5 py-0.5 rounded-md bg-muted/50">⌃K</kbd>
          </button>
        </div>

        {/* Stats bar */}
        <div className="fade-up fade-up-5 flex items-center gap-6 sm:gap-10 mt-12 pb-4">
          {STATS.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div className="h-8 w-px bg-border" />}
              <div className="flex flex-col items-center gap-0.5">
                <s.icon className="size-3.5 text-primary/60 mb-1" />
                <span className="text-lg font-bold text-foreground">{s.value}</span>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">{s.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Install pill */}
        <div className="fade-up fade-up-5 mt-6">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl
                          bg-card border border-border font-mono text-sm
                          text-muted-foreground shimmer relative overflow-hidden">
            <span className="text-primary font-bold">$</span>
            npm install <strong className="text-foreground font-semibold">jsongraphs</strong>
          </div>
        </div>

        {/* Live demo */}
        <div className="fade-up fade-up-5 w-full max-w-5xl mt-16 px-2">
          <DemoWindow title="Live Preview" badge="interactive">
            <GraphDemo
              layout="tree"
              dataset="general"
              height="420px"
              showToolbar
              showMinimap
              showSearch
            />
          </DemoWindow>
          <p className="text-center text-xs text-muted-foreground mt-3">
            ↑ Fully interactive — zoom, pan, search, collapse nodes, and toggle layouts
          </p>
        </div>
      </div>
    </section>
  );
}
