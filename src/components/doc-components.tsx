"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Copy, ChevronRight } from "lucide-react";

// ─── Syntax highlighter (single-pass character tokenizer) ──────────────────────
// We HTML-escape the raw source FIRST, then walk character-by-character
// producing colored spans. Because we never re-process emitted markup,
// regex patterns can NEVER corrupt span attribute strings.

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function span(cls: string, content: string) { return `<span class="${cls}">${content}</span>`; }

const KW = new Set([
  "import","export","from","const","let","var","function","class","new","return",
  "await","async","if","else","typeof","keyof","in","of","true","false","null",
  "undefined","void","type","interface","extends","implements","declare","readonly",
  "private","public","protected","default","throw","try","catch","for","while",
  "break","continue","switch","case","enum","this","super","delete","instanceof",
  "yield","static","abstract","override",
]);

function tokenizeTS(s: string): string {
  let out = ""; let i = 0; const n = s.length;
  while (i < n) {
    if (s[i] === "/" && s[i+1] === "/") {
      let j = i; while (j < n && s[j] !== "\n") j++;
      out += span("sh-comment", s.slice(i, j)); i = j; continue;
    }
    if (s[i] === "/" && s[i+1] === "*") {
      let j = i + 2; while (j < n && !(s[j] === "*" && s[j+1] === "/")) j++;
      j = Math.min(j + 2, n);
      out += span("sh-comment", s.slice(i, j)); i = j; continue;
    }
    if (s.startsWith("&quot;", i)) {
      let j = i + 6;
      while (j < n) {
        if (s[j] === "\\" ) { j += 2; continue; }
        if (s.startsWith("&quot;", j)) { j += 6; break; }
        if (s[j] === "\n") break;
        j++;
      }
      out += span("sh-string", s.slice(i, j)); i = j; continue;
    }
    if (s[i] === "'") {
      let j = i + 1;
      while (j < n && s[j] !== "'" && s[j] !== "\n") { if (s[j] === "\\") j++; j++; }
      if (j < n && s[j] === "'") j++;
      out += span("sh-string", s.slice(i, j)); i = j; continue;
    }
    if (s[i] === "`") {
      let j = i + 1;
      while (j < n && s[j] !== "`") { if (s[j] === "\\") j++; j++; }
      if (j < n) j++;
      out += span("sh-string", s.slice(i, j)); i = j; continue;
    }
    if (s[i] === "&") {
      let j = i + 1; while (j < n && s[j] !== ";" && j - i < 8) j++;
      if (j < n && s[j] === ";") j++;
      out += s.slice(i, j); i = j; continue;
    }
    if (s[i] >= "0" && s[i] <= "9") {
      let j = i;
      while (j < n && ((s[j] >= "0" && s[j] <= "9") || s[j] === "_" || s[j] === ".")) j++;
      out += span("sh-number", s.slice(i, j)); i = j; continue;
    }
    if (/[a-zA-Z_$]/.test(s[i])) {
      let j = i; while (j < n && /[a-zA-Z0-9_$]/.test(s[j])) j++;
      const word = s.slice(i, j);
      let k = j; while (k < n && (s[k] === " " || s[k] === "\t")) k++;
      const isProp = k < n && s[k] === ":" && s[k+1] !== ":";
      if (KW.has(word))             out += span("sh-keyword",  word);
      else if (/^[A-Z]/.test(word)) out += span("sh-type",     word);
      else if (isProp)              out += span("sh-property",  word);
      else                          out += word;
      i = j; continue;
    }
    out += s[i++];
  }
  return out;
}

function tokenizeJSON(s: string): string {
  let out = ""; let i = 0; const n = s.length;
  while (i < n) {
    if (s.startsWith("&quot;", i)) {
      let j = i + 6;
      while (j < n) {
        if (s[j] === "\\") { j += 2; continue; }
        if (s.startsWith("&quot;", j)) { j += 6; break; }
        j++;
      }
      let k = j; while (k < n && (s[k] === " " || s[k] === "\t")) k++;
      const isKey = k < n && s[k] === ":";
      out += span(isKey ? "sh-property" : "sh-string", s.slice(i, j)); i = j; continue;
    }
    if (s[i] === "&") {
      let j = i + 1; while (j < n && s[j] !== ";" && j - i < 8) j++;
      if (j < n && s[j] === ";") j++;
      out += s.slice(i, j); i = j; continue;
    }
    if (s[i] >= "0" && s[i] <= "9" || (s[i] === "-" && s[i+1] >= "0" && s[i+1] <= "9")) {
      let j = i;
      while (j < n && /[0-9.\-eE+]/.test(s[j])) j++;
      out += span("sh-number", s.slice(i, j)); i = j; continue;
    }
    for (const kw of ["true","false","null"]) {
      if (s.startsWith(kw, i) && !/[a-zA-Z]/.test(s[i + kw.length] ?? "")) {
        out += span("sh-keyword", kw); i += kw.length; break;
      }
    }
    if (i < n) { out += s[i++]; }
  }
  return out;
}

function tokenizeBash(s: string): string {
  let out = ""; let i = 0; const n = s.length;
  while (i < n) {
    if (s[i] === "#") {
      let j = i; while (j < n && s[j] !== "\n") j++;
      out += span("sh-comment", s.slice(i, j)); i = j; continue;
    }
    if (s[i] === "$" && (i === 0 || s[i-1] === "\n" || s[i-1] === " ")) {
      out += span("sh-operator", "$"); i++; continue;
    }
    if (s.startsWith("&quot;", i)) {
      let j = i + 6;
      while (j < n) {
        if (s[j] === "\\") { j += 2; continue; }
        if (s.startsWith("&quot;", j)) { j += 6; break; }
        j++;
      }
      out += span("sh-string", s.slice(i, j)); i = j; continue;
    }
    if (s[i] === "&") {
      let j = i + 1; while (j < n && s[j] !== ";" && j - i < 8) j++;
      if (j < n && s[j] === ";") j++;
      out += s.slice(i, j); i = j; continue;
    }
    if (/[a-zA-Z_]/.test(s[i])) {
      let j = i; while (j < n && /[a-zA-Z0-9_\-]/.test(s[j])) j++;
      const word = s.slice(i, j);
      const builtins = new Set(["npm","yarn","bun","npx","install","add","run","init","create"]);
      out += builtins.has(word) ? span("sh-builtin", word) : word;
      i = j; continue;
    }
    out += s[i++];
  }
  return out;
}

function highlight(rawCode: string, lang: string): string {
  const escaped = esc(rawCode.trim());
  if (lang === "bash" || lang === "sh") return tokenizeBash(escaped);
  if (lang === "json")                  return tokenizeJSON(escaped);
  return tokenizeTS(escaped);
}


// ─── CodeBlock ────────────────────────────────────────────────────────────────

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, language = "typescript", filename, className }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const html = highlight(code, language);
  const lines = html.split("\n");

  return (
    <div className={cn(
      "group relative rounded-2xl overflow-hidden",
      "border border-[#4d8fff]/12",
      "shadow-xl shadow-black/40",
      "hover:border-[#4d8fff]/25 hover:shadow-[0_0_30px_rgba(77,143,255,0.06)] transition-all duration-300",
      className
    )}>
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b border-[#4d8fff]/10"
        style={{ background: "rgba(10,16,30,0.90)" }}
      >
        <div className="flex items-center gap-3">
          {/* macOS traffic lights */}
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="size-2.5 rounded-full bg-[#28ca41]" />
          </div>
          {filename && (
            <span className="text-xs font-mono text-[#3d5a80] pl-2 border-l border-[#4d8fff]/12">
              {filename}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {language && (
            <span className="text-[11px] font-mono text-[#2d4060] uppercase tracking-wide">
              {language}
            </span>
          )}
          <button
            onClick={copy}
            className="flex items-center gap-1.5 text-xs text-[#3d5a80] hover:text-[#4d8fff]
                       px-2 py-1 rounded-md hover:bg-[#4d8fff]/10 transition-all cursor-pointer"
            aria-label="Copy code"
          >
            {copied ? (
              <><Check className="size-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
            ) : (
              <><Copy className="size-3" /><span>Copy</span></>
            )}
          </button>
        </div>
      </div>

      {/* Code area with line numbers */}
      <div className="overflow-x-auto" style={{ background: "#050a12" }}>
        <pre className="p-4 text-sm leading-relaxed font-mono">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex group/line hover:bg-[#4d8fff]/4 -mx-4 px-4 rounded">
                <span className="select-none w-8 shrink-0 text-right text-[#1e3050] text-xs leading-relaxed mr-4 pt-px">
                  {i + 1}
                </span>
                <span
                  className="flex-1 text-[#b8c8e0]"
                  dangerouslySetInnerHTML={{ __html: line || " " }}
                />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

// ─── PropTable ────────────────────────────────────────────────────────────────

interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

export function PropTable({ rows, className }: { rows: PropRow[]; className?: string }) {
  return (
    <div className={cn(
      "overflow-x-auto rounded-2xl border border-[#4d8fff]/12 shadow-xl shadow-black/20",
      className
    )}>
      <table className="w-full text-sm">
        <thead>
          <tr
            className="border-b border-[#4d8fff]/10"
            style={{ background: "rgba(10,16,30,0.80)" }}
          >
            <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-widest text-[#2d4060] w-40">Option</th>
            <th className="text-left px-4 py-3.5 font-semibold text-xs uppercase tracking-widest text-[#2d4060] w-48">Type</th>
            <th className="text-left px-4 py-3.5 font-semibold text-xs uppercase tracking-widest text-[#2d4060] w-28">Default</th>
            <th className="text-left px-4 py-3.5 font-semibold text-xs uppercase tracking-widest text-[#2d4060]">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.name}
              className="border-b border-[#4d8fff]/6 last:border-0 hover:bg-[#4d8fff]/3 transition-colors group"
            >
              <td className="px-5 py-3.5">
                <code className="font-mono text-xs text-[#4d8fff] font-semibold">
                  {row.name}
                  {row.required && <span className="text-red-400 ml-0.5">*</span>}
                </code>
              </td>
              <td className="px-4 py-3.5">
                <code className="font-mono text-xs text-[#e0af68] whitespace-nowrap">{row.type}</code>
              </td>
              <td className="px-4 py-3.5">
                <code className="font-mono text-xs text-[#2d4060]">{row.default ?? "—"}</code>
              </td>
              <td className="px-4 py-3.5 text-xs text-[#5a7094] leading-relaxed">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── SectionHeading ───────────────────────────────────────────────────────────

interface SectionHeadingProps {
  id: string;
  children: React.ReactNode;
  level?: 2 | 3;
  badge?: string;
  badgeColor?: string;
  className?: string;
}

const BADGE_COLORS: Record<string, string> = {
  "Getting Started": "bg-emerald-500/12 text-emerald-400 border border-emerald-500/20",
  "API Reference":   "bg-[#4d8fff]/12 text-[#7ab3ff] border border-[#4d8fff]/22",
  "Types":           "bg-cyan-500/12 text-cyan-400 border border-cyan-500/20",
  "Themes":          "bg-amber-500/12 text-amber-400 border border-amber-500/20",
  "Advanced":        "bg-rose-500/12 text-rose-400 border border-rose-500/20",
  "Features":        "bg-indigo-500/12 text-indigo-400 border border-indigo-500/20",
};

export function SectionHeading({
  id, children, level = 2, badge, badgeColor, className,
}: SectionHeadingProps) {
  const Tag = `h${level}` as "h2" | "h3";
  const color = badgeColor ?? (badge ? BADGE_COLORS[badge] ?? "bg-[#4d8fff]/10 text-[#4d8fff]" : "");

  return (
    <Tag
      id={id}
      className={cn(
        "group flex items-center gap-3 scroll-mt-24",
        level === 2
          ? "text-2xl font-bold text-foreground mt-20 mb-6"
          : "text-base font-semibold text-foreground mt-12 mb-4",
        className
      )}
    >
      {level === 2 && (
        <span
          className="inline-block w-1 h-6 rounded-full shrink-0"
          style={{
            background: "linear-gradient(to bottom, #4d8fff, #00d4ff)",
            boxShadow: "0 0 12px rgba(77,143,255,0.5)",
          }}
        />
      )}
      <a href={`#${id}`} className="hover:text-[#4d8fff] transition-colors">{children}</a>
      {badge && (
        <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full font-mono", color)}>
          {badge}
        </span>
      )}
      <a href={`#${id}`} className="opacity-0 group-hover:opacity-30 transition-opacity text-[#3d5a80] text-sm font-normal" aria-hidden>#</a>
    </Tag>
  );
}

// ─── Callout ──────────────────────────────────────────────────────────────────

const CALLOUT = {
  tip:     { border: "border-emerald-500/25", bg: "bg-emerald-500/[0.04]", icon: "💡", label: "Tip",     text: "text-emerald-400" },
  note:    { border: "border-[#4d8fff]/25",   bg: "bg-[#4d8fff]/[0.04]",   icon: "📝", label: "Note",    text: "text-[#7ab3ff]"   },
  warning: { border: "border-amber-500/25",   bg: "bg-amber-500/[0.04]",   icon: "⚠️", label: "Warning", text: "text-amber-400"   },
  danger:  { border: "border-red-500/25",     bg: "bg-red-500/[0.04]",     icon: "🚨", label: "Danger",  text: "text-red-400"     },
};

export function Callout({
  type = "note", children, className,
}: {
  type?: "tip" | "note" | "warning" | "danger";
  children: React.ReactNode;
  className?: string;
}) {
  const s = CALLOUT[type];
  return (
    <div className={cn("rounded-xl border p-4 my-5", s.border, s.bg, className)}>
      <div className={cn("flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2", s.text)}>
        <span>{s.icon}</span>
        <span>{s.label}</span>
      </div>
      <div className="text-sm text-[#5a7094] leading-relaxed">{children}</div>
    </div>
  );
}

// ─── Inline code ─────────────────────────────────────────────────────────────

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-[#4d8fff]/10 text-[#7ab3ff] border border-[#4d8fff]/15">
      {children}
    </code>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

export function Badge({ children, color = "bg-[#4d8fff]/10 text-[#4d8fff] border border-[#4d8fff]/15" }: {
  children: React.ReactNode; color?: string;
}) {
  return (
    <span className={cn("inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full", color)}>
      {children}
    </span>
  );
}
