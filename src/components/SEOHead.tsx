import { useEffect, useMemo } from "react";

const SITE_ORIGIN = "https://meine-traum-webseite.de";
const BRAND = "Meine Traum Webseite";
const PUBLISHER_LOGO = `${SITE_ORIGIN}/logo.png`;
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/logo.png`;

/** Default publisher used as Article.publisher and as the ProfessionalService base. */
const DEFAULT_PUBLISHER = {
  "@type": "Organization" as const,
  name: BRAND,
  logo: { "@type": "ImageObject" as const, url: PUBLISHER_LOGO },
};

/** Default ProfessionalService block — matches the static JSON-LD in index.html. */
const DEFAULT_PROFESSIONAL_SERVICE_DEFAULTS = {
  alternateName: "QK Marketing",
  url: SITE_ORIGIN,
  logo: PUBLISHER_LOGO,
  telephone: "+49 6131 3076498",
  email: "info@meine-traum-webseite.de",
  priceRange: "€€",
  address: {
    "@type": "PostalAddress" as const,
    streetAddress: "Rheinallee 88, Gebäude 23",
    addressLocality: "Mainz",
    postalCode: "55120",
    addressCountry: "DE",
  },
  areaServed: ["DE", "AT", "CH"],
  founder: { "@type": "Person" as const, name: "Muad Amar" },
};

/** Schema.org Person */
export interface ArticleAuthor {
  name: string;
  /** Optional profile/about URL */
  url?: string;
  /** Optional image URL */
  image?: string;
}

export interface BreadcrumbItem {
  name: string;
  /** Path or absolute URL. Path gets prefixed with SITE_ORIGIN. */
  url: string;
}

/* ----------------------------- Structured data ----------------------------- */

export interface ArticleSchema {
  type: "Article";
  /** ISO 8601 publish date */
  publishedTime: string;
  /** ISO 8601 last modified date (defaults to publishedTime) */
  modifiedTime?: string;
  /** Authors — one or many. Strings or rich Person objects. */
  authors: Array<string | ArticleAuthor>;
  /** Article category, e.g. "Webdesign" */
  section?: string;
  /** Tags / keywords */
  tags?: string[];
  /** Plain article body text — used to estimate reading time */
  content?: string;
  /** Pre-computed reading time in minutes (overrides content-based estimate) */
  readingTimeMinutes?: number;
}

export interface ProductSchema {
  type: "Product";
  brand?: string;
  sku?: string;
  offers?: {
    price: number | string;
    priceCurrency?: string;
    availability?: string; // e.g. "https://schema.org/InStock"
    url?: string;
  };
  aggregateRating?: { ratingValue: number | string; reviewCount: number };
}

export interface ServiceSchema {
  type: "Service";
  /** e.g. "Webdesign", "Conversion-Optimierung" */
  serviceType?: string;
  /** e.g. "Conversion-optimierte Websites" */
  category?: string;
  /** ISO country codes or place names served */
  areaServed?: string[];
  /** Offer / starting price */
  offers?: {
    price: number | string;
    priceCurrency?: string;
    url?: string;
    /** Marks price as "starting from" */
    priceSpecificationMinPrice?: boolean;
  };
  /** Provider override — defaults to the site's ProfessionalService */
  provider?: Record<string, unknown>;
}

export interface ProfessionalServiceSchema {
  type: "ProfessionalService";
  /** Override default address (defaults to Mainz HQ) */
  address?: Record<string, unknown>;
  /** Override default areaServed (defaults to ["DE","AT","CH"]) */
  areaServed?: string[];
  /** Override default contact info */
  telephone?: string;
  email?: string;
  priceRange?: string;
  alternateName?: string;
  founder?: Record<string, unknown>;
}

export type StructuredDataInput =
  | ArticleSchema
  | ProductSchema
  | ServiceSchema
  | ProfessionalServiceSchema;

/* --------------------------------- Props --------------------------------- */

export interface SEOHeadProps {
  /** Page title — used for <title>, og:title */
  title: string;
  /** Meta description / og:description / JSON-LD description */
  description: string;
  /** Canonical path (e.g. "/leistungen") or absolute URL */
  path?: string;
  /** Main page/cover image (absolute URL recommended) */
  image?: string;
  /** Structured data block. Determines og:type and emitted JSON-LD. */
  structuredData?: StructuredDataInput;
  /** Breadcrumb trail (root → current page) */
  breadcrumbs?: BreadcrumbItem[];
  /** noindex this page */
  noindex?: boolean;
}

/** Words per minute used for reading-time estimate (German prose avg). */
const WPM = 220;

const estimateReadingTime = (text?: string): number | undefined => {
  if (!text) return undefined;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (!words) return undefined;
  return Math.max(1, Math.round(words / WPM));
};

const toAuthorObj = (a: string | ArticleAuthor): ArticleAuthor =>
  typeof a === "string" ? { name: a } : a;

const absoluteUrl = (urlOrPath: string): string => {
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
  return `${SITE_ORIGIN}${urlOrPath.startsWith("/") ? "" : "/"}${urlOrPath}`;
};

/** SEO_HEAD_ATTR marks every tag this component owns so we can clean up on unmount. */
const OWN_ATTR = "data-seo-head";

type TagSpec =
  | { type: "meta"; key: "name" | "property"; keyValue: string; content: string }
  | { type: "link"; rel: string; href: string }
  | { type: "ld"; id: string; json: unknown };

const applyTags = (specs: TagSpec[]) => {
  // Remove previously injected tags from this component
  document.querySelectorAll(`[${OWN_ATTR}]`).forEach((el) => el.remove());

  for (const spec of specs) {
    if (spec.type === "meta") {
      // Replace any existing static tag with the same key/value so og:* etc. don't duplicate
      document
        .querySelectorAll(`meta[${spec.key}="${spec.keyValue}"]`)
        .forEach((el) => el.remove());
      const el = document.createElement("meta");
      el.setAttribute(spec.key, spec.keyValue);
      el.setAttribute("content", spec.content);
      el.setAttribute(OWN_ATTR, "");
      document.head.appendChild(el);
    } else if (spec.type === "link") {
      document
        .querySelectorAll(`link[rel="${spec.rel}"]`)
        .forEach((el) => el.remove());
      const el = document.createElement("link");
      el.setAttribute("rel", spec.rel);
      el.setAttribute("href", spec.href);
      el.setAttribute(OWN_ATTR, "");
      document.head.appendChild(el);
    } else {
      const el = document.createElement("script");
      el.setAttribute("type", "application/ld+json");
      el.setAttribute(OWN_ATTR, spec.id);
      el.textContent = JSON.stringify(spec.json);
      document.head.appendChild(el);
    }
  }
};

const setRobots = (noindex: boolean) => {
  let tag = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", "robots");
    document.head.appendChild(tag);
  }
  tag.setAttribute(
    "content",
    noindex
      ? "noindex, nofollow"
      : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
  );
};

/** Build the default ProfessionalService block (for homepage / as Service.provider fallback). */
const buildProfessionalService = (
  override?: Partial<ProfessionalServiceSchema>,
  title?: string,
  description?: string,
) => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: BRAND,
  alternateName:
    override?.alternateName ?? DEFAULT_PROFESSIONAL_SERVICE_DEFAULTS.alternateName,
  url: DEFAULT_PROFESSIONAL_SERVICE_DEFAULTS.url,
  logo: DEFAULT_PROFESSIONAL_SERVICE_DEFAULTS.logo,
  description: description,
  image: DEFAULT_PROFESSIONAL_SERVICE_DEFAULTS.logo,
  telephone:
    override?.telephone ?? DEFAULT_PROFESSIONAL_SERVICE_DEFAULTS.telephone,
  email: override?.email ?? DEFAULT_PROFESSIONAL_SERVICE_DEFAULTS.email,
  priceRange:
    override?.priceRange ?? DEFAULT_PROFESSIONAL_SERVICE_DEFAULTS.priceRange,
  address: override?.address ?? DEFAULT_PROFESSIONAL_SERVICE_DEFAULTS.address,
  areaServed:
    override?.areaServed ?? DEFAULT_PROFESSIONAL_SERVICE_DEFAULTS.areaServed,
  founder: override?.founder ?? DEFAULT_PROFESSIONAL_SERVICE_DEFAULTS.founder,
  ...(title ? { slogan: title } : {}),
});

/** Map a structured-data type to its og:type value. */
const ogTypeFor = (t: StructuredDataInput["type"] | undefined): string => {
  switch (t) {
    case "Article":
      return "article";
    case "Product":
      return "product";
    case "Service":
    case "ProfessionalService":
      return "website";
    default:
      return "website";
  }
};

const SEOHead = ({
  title,
  description,
  path,
  image,
  structuredData,
  breadcrumbs,
  noindex = false,
}: SEOHeadProps) => {
  const computed = useMemo(() => {
    const url = path ? absoluteUrl(path) : SITE_ORIGIN + "/";
    const ogImage = image ? absoluteUrl(image) : DEFAULT_OG_IMAGE;
    return { url, ogImage };
  }, [path, image]);

  useEffect(() => {
    const { url, ogImage } = computed;

    document.title = title;
    setRobots(noindex);

    const specs: TagSpec[] = [
      { type: "meta", key: "name", keyValue: "description", content: description },
      { type: "link", rel: "canonical", href: url },

      // Open Graph
      { type: "meta", key: "property", keyValue: "og:type", content: ogTypeFor(structuredData?.type) },
      { type: "meta", key: "property", keyValue: "og:title", content: title },
      { type: "meta", key: "property", keyValue: "og:description", content: description },
      { type: "meta", key: "property", keyValue: "og:url", content: url },
      { type: "meta", key: "property", keyValue: "og:image", content: ogImage },
      { type: "meta", key: "property", keyValue: "og:site_name", content: BRAND },

      // Twitter
      { type: "meta", key: "name", keyValue: "twitter:card", content: "summary_large_image" },
      { type: "meta", key: "name", keyValue: "twitter:title", content: title },
      { type: "meta", key: "name", keyValue: "twitter:description", content: description },
      { type: "meta", key: "name", keyValue: "twitter:image", content: ogImage },
    ];

    /* ----- Article ----- */
    if (structuredData?.type === "Article") {
      const a = structuredData;
      const modified = a.modifiedTime ?? a.publishedTime;
      const authorObjs = a.authors.map(toAuthorObj);
      const readMin = a.readingTimeMinutes ?? estimateReadingTime(a.content);

      specs.push(
        { type: "meta", key: "property", keyValue: "article:published_time", content: a.publishedTime },
        { type: "meta", key: "property", keyValue: "article:modified_time", content: modified },
      );
      if (a.section) {
        specs.push({ type: "meta", key: "property", keyValue: "article:section", content: a.section });
      }
      for (const author of authorObjs) {
        specs.push({
          type: "meta",
          key: "property",
          keyValue: "article:author",
          content: author.url ?? author.name,
        });
      }
      if (a.tags?.length) {
        for (const t of a.tags) {
          specs.push({ type: "meta", key: "property", keyValue: "article:tag", content: t });
        }
        specs.push({ type: "meta", key: "name", keyValue: "keywords", content: a.tags.join(", ") });
      }
      if (typeof readMin === "number") {
        specs.push({ type: "meta", key: "name", keyValue: "twitter:label1", content: "Lesezeit" });
        specs.push({ type: "meta", key: "name", keyValue: "twitter:data1", content: `${readMin} Min.` });
      }

      const articleLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        image: [ogImage],
        datePublished: a.publishedTime,
        dateModified: modified,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        publisher: DEFAULT_PUBLISHER,
        author: authorObjs.map((au) => ({
          "@type": "Person",
          name: au.name,
          ...(au.url ? { url: au.url } : {}),
          ...(au.image ? { image: au.image } : {}),
        })),
      };
      if (a.section) articleLd.articleSection = a.section;
      if (a.tags?.length) articleLd.keywords = a.tags.join(", ");
      if (typeof readMin === "number") {
        articleLd.timeRequired = `PT${readMin}M`;
        articleLd.wordCount = a.content
          ? a.content.trim().split(/\s+/).filter(Boolean).length
          : readMin * WPM;
      }
      specs.push({ type: "ld", id: "article", json: articleLd });
    }

    /* ----- Product ----- */
    if (structuredData?.type === "Product") {
      const p = structuredData;
      const productLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: title,
        description,
        image: [ogImage],
        ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
        ...(p.sku ? { sku: p.sku } : {}),
      };
      if (p.offers) {
        productLd.offers = {
          "@type": "Offer",
          price: p.offers.price,
          priceCurrency: p.offers.priceCurrency ?? "EUR",
          ...(p.offers.availability ? { availability: p.offers.availability } : {}),
          url: p.offers.url ?? url,
        };
      }
      if (p.aggregateRating) {
        productLd.aggregateRating = {
          "@type": "AggregateRating",
          ratingValue: p.aggregateRating.ratingValue,
          reviewCount: p.aggregateRating.reviewCount,
        };
      }
      specs.push({ type: "ld", id: "product", json: productLd });
    }

    /* ----- Service ----- */
    if (structuredData?.type === "Service") {
      const s = structuredData;
      const provider =
        s.provider ?? buildProfessionalService(undefined, BRAND, description);
      const serviceLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: title,
        description,
        image: [ogImage],
        url,
        provider,
        ...(s.serviceType ? { serviceType: s.serviceType } : {}),
        ...(s.category ? { category: s.category } : {}),
        ...(s.areaServed
          ? { areaServed: s.areaServed }
          : { areaServed: DEFAULT_PROFESSIONAL_SERVICE_DEFAULTS.areaServed }),
      };
      if (s.offers) {
        serviceLd.offers = {
          "@type": "Offer",
          price: s.offers.price,
          priceCurrency: s.offers.priceCurrency ?? "EUR",
          url: s.offers.url ?? url,
          ...(s.offers.priceSpecificationMinPrice
            ? {
                priceSpecification: {
                  "@type": "PriceSpecification",
                  price: s.offers.price,
                  priceCurrency: s.offers.priceCurrency ?? "EUR",
                  valueAddedTaxIncluded: false,
                  description: "Ab-Preis",
                },
              }
            : {}),
        };
      }
      specs.push({ type: "ld", id: "service", json: serviceLd });
    }

    /* ----- ProfessionalService (homepage) ----- */
    if (structuredData?.type === "ProfessionalService") {
      const ps = buildProfessionalService(structuredData, title, description);
      specs.push({ type: "ld", id: "professional-service", json: ps });
    }

    /* ----- BreadcrumbList ----- */
    if (breadcrumbs?.length) {
      specs.push({
        type: "ld",
        id: "breadcrumbs",
        json: {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.map((b, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: b.name,
            item: absoluteUrl(b.url),
          })),
        },
      });
    }

    applyTags(specs);

    return () => {
      document.querySelectorAll(`[${OWN_ATTR}]`).forEach((el) => el.remove());
    };
  }, [title, description, structuredData, breadcrumbs, noindex, computed]);

  return null;
};

export default SEOHead;
export { estimateReadingTime };