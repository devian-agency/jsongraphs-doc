"use client";

import * as React from "react";
import { ThemeProvider, SearchProvider } from "@/components/providers";
import { SearchModal } from "@/components/search-modal";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { DocSidebar } from "@/components/doc-sidebar";

// Getting Started sections
import {
  InstallSection,
  QuickStartSection,
  ReactUsageSection,
  FeaturesSection,
} from "@/components/doc-sections-start";

// API Reference sections
import {
  JsonGraphClassSection,
  LoadMethodSection,
  SetLayoutSection,
  ThemeMethodsSection,
  ViewportMethodsSection,
  ExpandCollapseSection,
  InvalidateCacheSection,
  DestroySection,
} from "@/components/doc-sections-api";

// Types sections
import {
  JsonSourceTypeSection,
  LayoutTypeSection,
  NodeTypeSection,
  GraphNodeTypeSection,
  GraphEdgeTypeSection,
  ParseOptionsSection,
  ParseLimitErrorSection,
  ThemeTypeSection,
} from "@/components/doc-sections-types";

// Themes & Advanced sections
import {
  ThemesSection,
  CustomThemeSection,
  AdvancedCaptionSection,
  AdvancedStreamingSection,
  Footer,
} from "@/components/doc-sections-advanced";

export default function HomePage() {
  return (
    <ThemeProvider>
      <SearchProvider>
        {/* Search modal (Ctrl+K) */}
        <SearchModal />

        {/* Sticky navbar */}
        <Navbar />

        {/* Hero */}
        <HeroSection />

        {/* Doc body */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex gap-12">
            {/* Sidebar */}
            <DocSidebar />

        {/* Main content */}
        <main className="flex-1 min-w-0 py-16">
          {/* ── Getting Started ── */}
          <InstallSection />
          <QuickStartSection />
          <ReactUsageSection />
          <FeaturesSection />

          {/* ── API Reference ── */}
          <div className="section-rule" />
          <JsonGraphClassSection />
          <LoadMethodSection />
          <SetLayoutSection />
          <ThemeMethodsSection />
          <ViewportMethodsSection />
          <ExpandCollapseSection />
          <InvalidateCacheSection />
          <DestroySection />

          {/* ── Types ── */}
          <div className="section-rule" />
          <JsonSourceTypeSection />
          <LayoutTypeSection />
          <NodeTypeSection />
          <GraphNodeTypeSection />
          <GraphEdgeTypeSection />
          <ParseOptionsSection />
          <ParseLimitErrorSection />
          <ThemeTypeSection />

          {/* ── Themes ── */}
          <div className="section-rule" />
          <ThemesSection />
          <CustomThemeSection />

          {/* ── Advanced ── */}
          <div className="section-rule" />
          <AdvancedCaptionSection />
          <AdvancedStreamingSection />
        </main>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </SearchProvider>
    </ThemeProvider>
  );
}
