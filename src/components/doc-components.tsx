"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

// Very lightweight syntax highlighter — no runtime deps
function highlight(code: string, lang: string): string {
  if (lang === "bash" || lang === "sh") {
    return code
      .replace(/(#.*$)/gm, '<span class="token-comment">$1</span>')
      .replace(/\b(npm|yarn|bun|npx)\b/g, '<span class="token-keyword">$1</span>');
  }

  // JS/TS/JSON
  let out = code
    // Strings
    .replace(/(["'`])((?:\\\1|(?!\1)[\s\S])*?)\1/g, '<span class="token-string">$1$2$1</span>')
    // Comments (single-line)
    .replace(/(\/\/[^\n<]*)/g, '<span class="token-comment">$1</span>')
    // Numbers
    .replace(/\b(\d+(?:\.\d+)?(?:_\d+)*)\b/g, '<span class="token-number">$1</span>')
    // Keywords
    .replace(
      /\b(import|export|from|const|let|var|function|class|new|return|await|async|if|else|type|interface|extends|implements|typeof|keyof|in|of|true|false|null|undefined|void|boolean|string|number|object)\b/g,
      '<span class="token-keyword">$1</span>'
    )
    // Object properties / keys in JSON
    .replace(/"([^"]+)"(?=\s*:)/g, '<span class="token-property">"$1"</span>');

  return out;
}

export function CodeBlock({ code, language = "typescript", filename, className }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const highlighted = highlight(code.trim(), language);

  return (
    <div className={cn("rounded-xl overflow-hidden border border-border bg-card", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-destructive/60" />
            <span className="size-3 rounded-full bg-amber-400/60" />
            <span className="size-3 rounded-full bg-emerald-400/60" />
          </div>
          {filename && (
            <span className="text-xs font-mono text-muted-foreground ml-2">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {language && (
            <span className="text-xs text-muted-foreground font-mono">{language}</span>
          )}
          <button
            onClick={copy}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted cursor-pointer"
            aria-label="Copy code"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed font-mono">
        <code
          className="text-foreground"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}

// ─── Inline prop table ─────────────────────────────────────────────────────────

interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

interface PropTableProps {
  rows: PropRow[];
  className?: string;
}

export function PropTable({ rows, className }: PropTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-border", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="text-left px-4 py-3 font-semibold text-foreground">Option</th>
            <th className="text-left px-4 py-3 font-semibold text-foreground">Type</th>
            <th className="text-left px-4 py-3 font-semibold text-foreground">Default</th>
            <th className="text-left px-4 py-3 font-semibold text-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.name}
              className={cn(
                "border-b border-border last:border-0 transition-colors hover:bg-muted/20",
                i % 2 === 0 ? "" : "bg-muted/10"
              )}
            >
              <td className="px-4 py-3 font-mono text-primary text-xs">
                {row.name}
                {row.required && (
                  <span className="ml-1 text-destructive text-[10px]">*</span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-amber-600 dark:text-amber-400 whitespace-nowrap">
                {row.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {row.default ?? "—"}
              </td>
              <td className="px-4 py-3 text-muted-foreground text-xs leading-relaxed">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Section anchor heading ────────────────────────────────────────────────────

interface SectionHeadingProps {
  id: string;
  children: React.ReactNode;
  level?: 2 | 3;
  badge?: string;
  badgeColor?: string;
  className?: string;
}

export function SectionHeading({
  id,
  children,
  level = 2,
  badge,
  badgeColor = "bg-primary/10 text-primary",
  className,
}: SectionHeadingProps) {
  const Tag = `h${level}` as "h2" | "h3";
  return (
    <Tag
      id={id}
      className={cn(
        "group flex items-center gap-3 scroll-mt-24",
        level === 2
          ? "text-2xl font-bold text-foreground mt-16 mb-6"
          : "text-lg font-semibold text-foreground mt-10 mb-4",
        className
      )}
    >
      <a href={`#${id}`} className="no-underline">
        {children}
      </a>
      {badge && (
        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", badgeColor)}>
          {badge}
        </span>
      )}
      <a
        href={`#${id}`}
        className="opacity-0 group-hover:opacity-60 transition-opacity text-muted-foreground text-base font-normal"
        aria-hidden
      >
        #
      </a>
    </Tag>
  );
}

// ─── Feature badge ─────────────────────────────────────────────────────────────

export function Badge({
  children,
  color = "bg-primary/10 text-primary",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span className={cn("inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full", color)}>
      {children}
    </span>
  );
}

// ─── Callout ───────────────────────────────────────────────────────────────────

interface CalloutProps {
  type?: "tip" | "note" | "warning" | "danger";
  children: React.ReactNode;
  className?: string;
}

const CALLOUT_STYLES = {
  tip:     "border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300",
  note:    "border-sky-500/40 bg-sky-500/5 text-sky-700 dark:text-sky-300",
  warning: "border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-300",
  danger:  "border-destructive/40 bg-destructive/5 text-destructive",
};

const CALLOUT_LABELS = { tip: "💡 Tip", note: "📝 Note", warning: "⚠️ Warning", danger: "🚨 Danger" };

export function Callout({ type = "note", children, className }: CalloutProps) {
  return (
    <div
      className={cn(
        "border-l-4 rounded-r-xl px-4 py-3 my-4 text-sm leading-relaxed",
        CALLOUT_STYLES[type],
        className
      )}
    >
      <div className="font-semibold mb-1 text-xs uppercase tracking-wide opacity-70">
        {CALLOUT_LABELS[type]}
      </div>
      {children}
    </div>
  );
}
