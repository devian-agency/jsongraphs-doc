import { SITE, absoluteUrl } from "./seo";

// ─── Types ─────────────────────────────────────────────────────────

export type JsonLdNode = Record<string, unknown>;

// ─── Graph Renderer ────────────────────────────────────────────────
// Renders all schema nodes as a single <script> with @graph.
// This avoids multiple <script type="application/ld+json"> tags,
// reduces DOM size, and gives crawlers a single parse context.

export function JsonLdGraph({ nodes }: { nodes: JsonLdNode[] }) {
  if (nodes.length === 0) return null;

  const graph = {
    "@context": "https://schema.org",
    "@graph": nodes,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

// ─── Organization ──────────────────────────────────────────────────

export function organizationSchema(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.org.name,
    legalName: SITE.org.legalName,
    url: SITE.org.url,
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE.url}/#logo`,
      url: absoluteUrl(SITE.logo),
      contentUrl: absoluteUrl(SITE.logo),
      caption: SITE.org.name,
    },
    image: { "@id": `${SITE.url}/#logo` },
    email: SITE.email,
    foundingDate: SITE.foundingDate,
    sameAs: [
      "https://github.com/devian-agency",
      "https://www.linkedin.com/in/devian-agency/",
      "https://x.com/devian_twt",
      "https://www.instagram.com/devian.agency/",
      "https://www.facebook.com/profile.php?id=61577980919543",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: SITE.email,
      contactType: "customer support",
      availableLanguage: ["English"],
    },
  };
}

// ─── WebSite (enables Google Sitelinks Search Box) ─────────────────

export function webSiteSchema(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: SITE.url,
    description: SITE.description,
    publisher: { "@id": `${SITE.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/crawler?url={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: SITE.language,
  };
}

// ─── WebApplication ────────────────────────────────────────────────

export function webApplicationSchema(): JsonLdNode {
  return {
    "@type": "WebApplication",
    "@id": `${SITE.url}/#webapp`,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: SITE.url,
    description: SITE.description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Requires a modern browser.",
    image: absoluteUrl(SITE.ogImage),
    screenshot: absoluteUrl(SITE.ogImage),
    isPartOf: { "@id": `${SITE.url}/#website` },
    creator: { "@id": `${SITE.url}/#organization` },
    // offers: {
    //   "@type": "AggregateOffer",
    //   lowPrice: "0",
    //   highPrice: "99",
    //   priceCurrency: "USD",
    //   offerCount: 3,
    //   offers: [
    //     {
    //       "@type": "Offer",
    //       name: "Free Plan",
    //       price: "0",
    //       priceCurrency: "USD",
    //       description:
    //         "Up to 100 pages, 1 depth level, basic metadata extraction, form intelligence, risk scoring, and SEO audit.",
    //       url: absoluteUrl(SITE.pages.pricing),
    //     },
    //     {
    //       "@type": "Offer",
    //       name: "Base Plan",
    //       price: "19",
    //       priceCurrency: "USD",
    //       description:
    //         "Up to 1,000 pages, 5 depth levels, JS bundle analysis, security audit, broken link check, and performance metrics.",
    //       url: absoluteUrl(SITE.pages.pricing),
    //     },
    //     {
    //       "@type": "Offer",
    //       name: "Pro Plan",
    //       price: "99",
    //       priceCurrency: "USD",
    //       description:
    //         "Up to 5,000 pages, 20 depth levels, full reconnaissance suite with contact recon, API sniffing, stealth mode, and custom headers.",
    //       url: absoluteUrl(SITE.pages.pricing),
    //     },
    //   ],
    // },
    featureList: [
      "Deep Discovery — extract hidden routes from JS bundles",
      "Autonomous Engine — priority-based crawl queue",
      "Contact Intelligence — email and phone scraping",
      "Elastic Workers — scalable concurrent crawling",
      "Broken Link Detector — find 404s and 500s",
      "Security Audit — HTTP header grading",
      "Tech Profiler — detect 80+ technologies",
      "Subdomain Recon — wildcard subdomain discovery",
      "Keys Detection — auto-detect secrets and tokens",
    ],
  };
}

// ─── SoftwareApplication (for Google rich results) ─────────────────

export function softwareApplicationSchema(): JsonLdNode {
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE.url}/#software`,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: SITE.url,
    description: SITE.description,
    applicationCategory: "WebApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: { "@id": `${SITE.url}/#organization` },
  };
}

// ─── FAQPage ───────────────────────────────────────────────────────

interface FAQ {
  question: string;
  answer: string;
}

export function faqPageSchema(faqs: FAQ[]): JsonLdNode {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ─── BreadcrumbList ────────────────────────────────────────────────

interface Breadcrumb {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: Breadcrumb[]): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ─── Product (for pricing page rich results) ───────────────────────

interface ProductOffer {
  name: string;
  price: string;
  currency: string;
  description: string;
  features: string[];
}

export function productSchema(offers: ProductOffer[]): JsonLdNode {
  return {
    "@type": "Product",
    name: SITE.name,
    description: SITE.description,
    brand: { "@id": `${SITE.url}/#organization` },
    image: absoluteUrl(SITE.ogImage),
    // url: absoluteUrl(SITE.pages.pricing),
    // offers: offers.map((offer) => ({
    //   "@type": "Offer",
    //   name: offer.name,
    //   price: offer.price,
    //   priceCurrency: offer.currency,
    //   description: offer.description,
    //   availability: "https://schema.org/InStock",
    //   url: absoluteUrl(SITE.pages.pricing),
    //   itemCondition: "https://schema.org/NewCondition",
    //   seller: { "@id": `${SITE.url}/#organization` },
    // })),
  };
}

// ─── WebPage (generic, for privacy/terms/etc.) ─────────────────────

export function webPageSchema({
  name,
  description,
  url,
  dateModified,
}: {
  name: string;
  description: string;
  url: string;
  dateModified?: string;
}): JsonLdNode {
  return {
    "@type": "WebPage",
    "@id": url,
    name,
    description,
    url,
    inLanguage: SITE.language,
    isPartOf: { "@id": `${SITE.url}/#website` },
    about: { "@id": `${SITE.url}/#organization` },
    ...(dateModified ? { dateModified } : {}),
  };
}

// ─── HowTo (for crawler usage) ─────────────────────────────────────

interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

export function howToSchema({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: HowToStep[];
}): JsonLdNode {
  return {
    "@type": "HowTo",
    name,
    description,
    image: absoluteUrl(SITE.ogImage),
    step: steps.map((step, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: step.name,
      text: step.text,
      ...(step.url ? { url: step.url } : {}),
    })),
  };
}
