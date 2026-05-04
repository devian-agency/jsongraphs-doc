"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme, useSearch } from "@/components/providers";
import { Sun, Moon, Search,  } from "lucide-react";

const NAV_LINKS = [
  { label: "Getting Started", href: "#installation" },
  { label: "API Reference",   href: "#jsongraph-class" },
  { label: "Types",           href: "#type-jsonsource" },
  { label: "Themes",         href: "#themes" },
  { label: "Advanced",       href: "#advanced-caption" },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { setOpen } = useSearch();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-6">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2 font-bold text-lg shrink-0 group"
          id="nav-logo"
        >
          <Image
            src="/logo/logo.webp"
            alt="JsonGraphs logo"
            width={32}
            height={32}
            className="rounded-lg"
            priority
          />
          <span className="gradient-text">JsonGraphs</span>
        </a>

        {/* Links — desktop */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Search trigger */}
          <button
            id="navbar-search-btn"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground border border-border rounded-lg bg-background/50 hover:bg-muted/60 transition-colors cursor-pointer"
          >
            <Search className="size-3.5" />
            <span className="hidden sm:inline">Search docs…</span>
            <kbd className="hidden sm:flex items-center gap-0.5 text-xs font-mono border border-border px-1.5 py-0.5 rounded">
              ⌃K
            </kbd>
          </button>

          {/* GitHub */}
          {/* <a
            id="nav-github"
            href="https://github.com/devian-agency/jsongraphs"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-colors"
            aria-label="GitHub repository"
          >
            <Github className="size-4" />
          </a> */}

          {/* Theme toggle */}
          <button
            id="nav-theme-toggle"
            onClick={toggle}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          {/* Mobile hamburger */}
          <button
            id="nav-mobile-menu"
            className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-colors cursor-pointer"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open menu"
          >
            <div className="w-4 flex flex-col gap-1">
              <span className={cn("block h-0.5 bg-current transition-all", menuOpen && "rotate-45 translate-y-1.5")} />
              <span className={cn("block h-0.5 bg-current transition-all", menuOpen && "opacity-0")} />
              <span className={cn("block h-0.5 bg-current transition-all", menuOpen && "-rotate-45 -translate-y-1.5")} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
