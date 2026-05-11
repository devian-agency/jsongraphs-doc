import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url:             SITE.url,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        1.0,
    },
    {
      url:             `${SITE.url}/#installation`,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        0.9,
    },
    {
      url:             `${SITE.url}/#jsongraph-class`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.85,
    },
    {
      url:             `${SITE.url}/#type-jsonsource`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.75,
    },
    {
      url:             `${SITE.url}/#themes`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.70,
    },
    {
      url:             `${SITE.url}/#advanced-caption`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.65,
    },
    {
      url:             `${SITE.url}/#features`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.80,
    },
  ];
}
