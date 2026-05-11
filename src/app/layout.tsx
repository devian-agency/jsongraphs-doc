import type { Metadata } from "next";
import "./globals.css";
import { meta } from "@/metadata/metadata";
import { SITE } from "@/lib/seo";

export const metadata = meta;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={SITE.language}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
