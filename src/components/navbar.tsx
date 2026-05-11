"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme, useSearch } from "@/components/providers";
import { Sun, Moon, Search, ExternalLink } from "lucide-react";

const NAV_LINKS = [
  { label: "Getting Started", href: "#installation" },
  { label: "API Reference",   href: "#jsongraph-class" },
  { label: "Types",           href: "#type-jsonsource" },
  { label: "Themes",          href: "#themes" },
  { label: "Advanced",        href: "#advanced-caption" },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { setOpen } = useSearch();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-40 transition-all duration-500",
          scrolled
            ? "bg-[#070b14]/85 backdrop-blur-2xl border-b border-[#4d8fff]/10 shadow-[0_4px_32px_rgba(0,0,0,0.4)]"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[60px] flex items-center gap-4">

          {/* Logo */}
          <a href="#" id="nav-logo" className="flex items-center gap-2.5 shrink-0 group mr-2">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-[#4d8fff]/25 blur-md group-hover:bg-[#4d8fff]/45 transition-colors" />
              <Image
                src="/logo/logo.webp"
                alt="JsonGraphs"
                width={28}
                height={28}
                className="relative rounded-lg"
                priority
              />
            </div>
            <span
              className="font-bold text-base grad"
              style={{ letterSpacing: "-0.01em" }}
            >
              JsonGraphs
            </span>
          </a>

          {/* Separator */}
          <div className="hidden md:block h-4 w-px bg-[#4d8fff]/15" />

          {/* Links — desktop */}
          <div className="hidden md:flex items-center gap-0.5 flex-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm text-[#5a7094] hover:text-foreground
                           rounded-lg hover:bg-[#4d8fff]/8 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 ml-auto">

            {/* Search */}
            <button
              id="navbar-search-btn"
              onClick={() => setOpen(true)}
              className="hidden sm:flex items-center gap-2.5 h-8 px-3 text-xs
                         text-[#5a7094] border border-[#4d8fff]/15 rounded-lg
                         bg-[#4d8fff]/4 hover:bg-[#4d8fff]/10 hover:border-[#4d8fff]/28 hover:text-foreground
                         transition-all duration-200 cursor-pointer group"
            >
              <Search className="size-3 text-[#4d8fff]/60 group-hover:text-[#4d8fff] transition-colors" />
              <span className="hidden lg:inline min-w-[72px]">Search docs…</span>
              <kbd className="hidden lg:flex items-center gap-0.5 text-[10px] font-mono
                              border border-[#4d8fff]/15 px-1.5 py-0.5 rounded bg-[#070b14]/60">
                ⌘ + K
              </kbd>
            </button>

            {/* npm */}
            <a
              id="nav-npm"
              href="https://www.npmjs.com/package/jsongraphs"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 h-8 px-2.5 text-[11px] font-medium
                         border border-[#4d8fff]/15 rounded-lg text-[#5a7094]
                         hover:text-foreground hover:border-[#4d8fff]/28 hover:bg-[#4d8fff]/8
                         transition-all duration-200"
              aria-label="View on npm"
            >
              npm <ExternalLink className="size-2.5" />
            </a>

            {/* Theme toggle */}
            <button
              id="nav-theme-toggle"
              onClick={toggle}
              className="flex items-center justify-center size-8 text-[#5a7094]
                         hover:text-foreground rounded-lg hover:bg-[#4d8fff]/8
                         transition-all duration-200 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark"
                ? <Sun className="size-4" />
                : <Moon className="size-4" />}
            </button>

            {/* Mobile menu btn */}
            <button
              id="nav-mobile-menu"
              className="md:hidden flex items-center justify-center size-8 text-[#5a7094]
                         hover:text-foreground rounded-lg hover:bg-[#4d8fff]/8
                         transition-all duration-200 cursor-pointer"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-[5px] w-4">
                <span className={cn("block h-0.5 bg-current rounded-full transition-all duration-300", menuOpen && "rotate-45 translate-y-[7px]")} />
                <span className={cn("block h-0.5 bg-current rounded-full transition-all duration-300", menuOpen && "opacity-0 scale-x-0")} />
                <span className={cn("block h-0.5 bg-current rounded-full transition-all duration-300", menuOpen && "-rotate-45 translate-y-[-7px]")} />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-30 md:hidden pt-[60px]" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="absolute top-[60px] inset-x-0 bg-[#070b14]/96 backdrop-blur-xl border-b border-[#4d8fff]/10 px-4 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center px-3 py-2.5 text-sm text-[#5a7094]
                           hover:text-foreground hover:bg-[#4d8fff]/8 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 pt-3 border-t border-[#4d8fff]/10 flex items-center gap-2">
              <button onClick={() => { setOpen(true); setMenuOpen(false); }}
                className="flex-1 flex items-center justify-center gap-2 h-9 text-xs
                           border border-[#4d8fff]/15 rounded-lg text-[#5a7094] hover:text-foreground
                           hover:bg-[#4d8fff]/8 transition-colors cursor-pointer">
                <Search className="size-3" /> Search docs
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
