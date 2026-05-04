"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ArrowRight, Terminal } from "lucide-react";
import { useSearch } from "@/components/providers";

export function HeroSection() {
  const { setOpen } = useSearch();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden hero-grid pt-16">
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] opacity-60" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-8">
          <Image src="/logo/logo.webp" alt="JsonGraphs" width={18} height={18} className="rounded" />
          <span>v1.0.2 — Zero Dependencies</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          <span className="gradient-text">JsonGraphs</span>
          <br />
          <span className="text-foreground">Interactive JSON</span>
          <br />
          <span className="text-muted-foreground font-light">Graph Visualizer</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          A high-performance, <strong className="text-foreground">dependency-free</strong> library for
          visualizing complex JSON as beautiful, interactive canvas-based graphs.
          Streaming parser, tree &amp; radial layouts, built-in minimap, search, and toolbar.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href="#installation"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
          >
            Get Started <ArrowRight className="size-4" />
          </a>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card hover:bg-muted/60 text-foreground font-medium transition-all cursor-pointer"
          >
            <Terminal className="size-4 text-muted-foreground" />
            Search Docs
            <kbd className="text-xs font-mono text-muted-foreground border border-border px-1.5 py-0.5 rounded">⌃K</kbd>
          </button>
        </div>

        {/* Install snippet */}
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-card border border-border font-mono text-sm text-muted-foreground">
          <span className="text-primary">$</span>
          <span>npm install <strong className="text-foreground">jsongraphs</strong></span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-muted-foreground/50" />
      </div>
    </section>
  );
}
