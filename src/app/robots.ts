import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all well-behaved crawlers to index the full docs site
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/_next/",
          "/api/",
        ],
      },
      {
        // Google gets full access to content + assets
        userAgent: "Googlebot",
        allow: ["/", "/assets/", "/logo/"],
        disallow: ["/_next/", "/api/"],
      },
      {
        // Let Google Images index the OG image and logo
        userAgent: "Googlebot-Image",
        allow: ["/assets/", "/logo/"],
        disallow: ["/_next/"],
      },
      {
        // Block AI training crawlers
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "anthropic-ai",
          "Claude-Web",
          "cohere-ai",
          "Omgilibot",
          "FacebookBot",
          "Bytespider",
        ],
        disallow: ["/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host:    SITE.url,
  };
}
