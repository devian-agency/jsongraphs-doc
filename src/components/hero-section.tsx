"use client";

import * as React from "react";
import { ArrowRight, Terminal, Zap, GitBranch, Cpu } from "lucide-react";
import { useSearch } from "@/components/providers";
import { GraphDemo, DemoWindow } from "@/components/graph-demo";

/* ── Constellation canvas ─────────────────────────────────────────────────── */

interface ConstellationNode {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
}

function ConstellationCanvas({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;
    let nodes: ConstellationNode[] = [];

    function resize() {
      if (!canvas) return;
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function spawn() {
      const count = Math.min(80, Math.floor((W * H) / 18000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.6 + 0.6,
      }));
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, W, H);

      const LINK = 160;

      // Update
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            const alpha = (1 - d / LINK) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(77,143,255,${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        // outer glow
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
        grd.addColorStop(0, "rgba(77,143,255,0.35)");
        grd.addColorStop(1, "rgba(77,143,255,0)");
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(120,185,255,0.90)";
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(() => { resize(); spawn(); });
    ro.observe(canvas);
    resize();
    spawn();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

/* ── Stats ────────────────────────────────────────────────────────────────── */

const STATS = [
  { icon: Cpu,       value: "60 FPS",  label: "Canvas rendering" },
  { icon: Zap,       value: "500k+",   label: "Nodes supported"  },
  { icon: GitBranch, value: "0",       label: "Dependencies"     },
];

/* ── HeroSection ──────────────────────────────────────────────────────────── */

export function HeroSection() {
  const { setOpen } = useSearch();

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── Deep navy gradient base ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_0%,#0d1a2e_0%,#070b14_60%)]" />

      {/* ── Constellation network ── */}
      <ConstellationCanvas className="constellation-canvas" />

      {/* ── Subtle dot grid ── */}
      <div className="absolute inset-0 dot-grid opacity-40" />

      {/* ── Soft blue orbs ── */}
      <div className="orb absolute -top-16 left-1/4 w-[600px] h-[600px] bg-[#1a3a6e]/30 pointer-events-none" />
      <div className="orb orb-2 absolute bottom-1/3 right-1/5 w-[420px] h-[420px] bg-[#003a7a]/20 pointer-events-none" />
      <div className="orb orb-3 absolute top-1/2 left-1/6 w-[280px] h-[280px] bg-[#00d4ff]/6 pointer-events-none" />

      {/* ── Bottom vignette fade ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_50%_at_50%_110%,var(--background)_30%,transparent_70%)] pointer-events-none" />

      {/* ── Faint code-text texture (top-right / bottom-left) ── */}
      <div
        className="absolute top-12 right-0 w-64 h-96 opacity-[0.04] pointer-events-none select-none overflow-hidden text-[10px] font-mono text-[#4d8fff] leading-5 tracking-wider"
        aria-hidden
      >
        {`const graph = new\nJsonGraph({ container,\n  theme: darkTheme,\n  layout: 'tree',\n  minimap: true,\n  toolbar: true,\n  search: true,\n});\nawait graph.load(data);\ngraph.setLayout('radial');\ngraph.fitView();\ngraph.expandAll();\n// nodes: 500k+\n// fps: 60\n// deps: 0`}
      </div>
      <div
        className="absolute bottom-32 left-0 w-52 h-72 opacity-[0.04] pointer-events-none select-none overflow-hidden text-[10px] font-mono text-[#00d4ff] leading-5 tracking-wider"
        aria-hidden
      >
        {`import { JsonGraph,\n  darkTheme,\n  defaultTheme,\n  type Theme,\n} from 'jsongraphs';\n// zero dependencies\n// ESM & CJS\n// TypeScript-first\n// canvas-rendered\ngraph.destroy();`}
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-28 pb-16 px-4 sm:px-6">

        {/* Version badge */}
        <div className="fade-up fade-up-1 mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full
                          border border-[#4d8fff]/25 bg-[#4d8fff]/6 backdrop-blur-sm
                          text-xs font-mono text-[#7ab3ff]">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#00d4ff] animate-pulse shadow-[0_0_6px_#00d4ff]" />
              jsongraphs
            </span>
            <span className="text-[#4d8fff]/40">·</span>
            <span>v1.1.1</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="fade-up fade-up-2 text-center max-w-4xl">
          <span className="block text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-2">
            <span className="grad">Visualize JSON</span>
          </span>
          <span className="block text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-foreground">
            as Interactive
          </span>
          <span className="block text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#4a6a99] mt-2">
            Graph Structures
          </span>
        </h1>

        {/* Description */}
        <p className="fade-up fade-up-3 mt-8 text-base sm:text-lg text-[#5a7094] max-w-xl text-center leading-relaxed">
          {"A "}<span className="text-foreground font-medium">dependency-free</span>{" canvas library with a streaming parser, tree & radial layouts, and built-in search, minimap, and toolbar."}
        </p>

        {/* CTA row */}
        <div className="fade-up fade-up-4 flex flex-col sm:flex-row items-center gap-3 mt-10">
          <a
            href="#installation"
            className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                       bg-[#4d8fff] text-[#070b14]
                       hover:bg-[#6aaeff] hover:scale-[1.02] active:scale-[0.98]
                       transition-all duration-200 shadow-lg shadow-[#4d8fff]/25
                       relative overflow-hidden"
          >
            {/* Shimmer on button */}
            <span className="absolute inset-0 shimmer" />
            <span className="relative">Get Started</span>
            <ArrowRight className="relative size-4 group-hover:translate-x-0.5 transition-transform" />
          </a>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium
                       border border-[#4d8fff]/15 bg-[#0c1220]/70 backdrop-blur-sm text-[#5a7094]
                       hover:text-foreground hover:border-[#4d8fff]/30 hover:bg-[#0f1e38]
                       transition-all duration-200 cursor-pointer"
          >
            <Terminal className="size-3.5" />
            <span>Search docs</span>
            <kbd className="ml-1 text-sm font-mono border border-[#4d8fff]/20 px-1.5 py-0.5 rounded-md bg-[#111928]/80">
              ⌘ + k</kbd>
          </button>
        </div>

        {/* ── Stats bar (matching reference image) ── */}
        <div className="fade-up fade-up-5 flex items-center gap-0 mt-14">
          {STATS.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && (
                <div className="h-12 w-px bg-linear-to-b from-transparent via-[#4d8fff]/25 to-transparent mx-8" />
              )}
              <div className="flex flex-col items-center gap-1 min-w-[90px]">
                <s.icon
                  className="size-5 mb-1"
                  style={{ color: "#4d8fff", filter: "drop-shadow(0 0 6px rgba(77,143,255,0.6))" }}
                />
                <span
                  className="text-xl sm:text-2xl font-black tracking-tight text-white"
                  style={{ textShadow: "0 0 20px rgba(77,143,255,0.3)" }}
                >
                  {s.value}
                </span>
                <span className="text-[11px] text-[#3d5a80] whitespace-nowrap font-medium">
                  {s.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* ── Install pill (matching reference image) ── */}
        <div className="fade-up fade-up-5 mt-8">
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-mono text-sm
                        relative overflow-hidden cursor-text select-all"
            style={{
              background: "rgba(5,10,20,0.80)",
              border: "1px solid rgba(77,143,255,0.22)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 0 30px rgba(77,143,255,0.08), inset 0 1px 0 rgba(77,143,255,0.08)",
            }}
          >
            <span className="shimmer absolute inset-0 pointer-events-none" />
            <span style={{ color: "#4ade80", fontWeight: 700 }}>$</span>
            <span className="text-[#8bacc8]">npm install </span>
            <strong className="text-white font-semibold">jsongraphs</strong>
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
          <p className="text-center text-xs text-[#3d5a80] mt-3">
            ↑ Fully interactive — zoom, pan, search, collapse nodes, and toggle layouts
          </p>
        </div>
      </div>
    </section>
  );
}
