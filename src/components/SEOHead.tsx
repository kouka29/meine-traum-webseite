import { useEffect, useMemo } from "react";

const SITE_ORIGIN = "https://meine-traum-webseite.de";
const BRAND = "Meine Traum Webseite";
const PUBLISHER_LOGO = `${SITE_ORIGIN}/logo.png`;
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/logo.png`;

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

export interface SEOHeadProps {
  /** Article title — used for <title>, og:title, JSON-LD headline */
  title: string;
  /** Meta description / og:description / JSON-LD description */
  description: string;
  /** Canonical path (e.g. "/blog/mein-artikel") or absolute URL */
  path?: string;
  /** Main article/cover image (absolute URL recommended) */
  image?: string;
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
  /** Breadcrumb trail (root → current page) */
  breadcrumbs?: BreadcrumbItem[];
  /** noindex this article */
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

const SEOHead = ({
  title,
  description,
  path,
  image,
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
  content,
  readingTimeMinutes,
  breadcrumbs,
  noindex = false,
}: SEOHeadProps) => {
  const computed = useMemo(() => {
    const url = path ? absoluteUrl(path) : SITE_ORIGIN + "/";
    const ogImage = image ? absoluteUrl(image) : DEFAULT_OG_IMAGE;
    const modified = modifiedTime ?? publishedTime;
    const authorObjs = authors.map(toAuthorObj);
    const readMin = readingTimeMinutes ?? estimateReadingTime(content);
    return { url, ogImage, modified, authorObjs, readMin };
  }, [path, image, modifiedTime, publishedTime, authors, readingTimeMinutes, content]);

  useEffect(() => {
    const { url, ogImage, modified, authorObjs, readMin } = computed;

    document.title = title;
    setRobots(noindex);

    const specs: TagSpec[] = [
      { type: "meta", key: "name", keyValue: "description", content: description },
      { type: "link", rel: "canonical", href: url },

      // Open Graph
      { type: "meta", key: "property", keyValue: "og:type", content: "article" },
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

      // Article-specific
      {
        type: "meta",
        key: "property",
        keyValue: "article:published_time",
        content: publishedTime,
      },
      {
        type: "meta",
        key: "property",
        keyValue: "article:modified_time",
        content: modified,
      },
    ];

    if (section) {
      specs.push({
        type: "meta",
        key: "property",
        keyValue: "article:section",
        content: section,
      });
    }

    for (const author of authorObjs) {
      specs.push({
        type: "meta",
        key: "property",
        keyValue: "article:author",
        content: author.url ?? author.name,
      });
    }

    if (tags?.length) {
      for (const tag of tags) {
        specs.push({
          type: "meta",
          key: "property",
          keyValue: "article:tag",
          content: tag,
        });
      }
      specs.push({
        type: "meta",
        key: "name",
        keyValue: "keywords",
        content: tags.join(", "),
      });
    }

    if (typeof readMin === "number") {
      // Non-standard but widely consumed (Medium, etc.)
      specs.push({
        type: "meta",
        key: "name",
        keyValue: "twitter:label1",
        content: "Lesezeit",
      });
      specs.push({
        type: "meta",
        key: "name",
        keyValue: "twitter:data1",
        content: `${readMin} Min.`,
      });
    }

    // ----- JSON-LD: Article -----
    const articleLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      image: [ogImage],
      datePublished: publishedTime,
      dateModified: modified,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      publisher: {
        "@type": "Organization",
        name: BRAND,
        logo: { "@type": "ImageObject", url: PUBLISHER_LOGO },
      },
      author: authorObjs.map((a) => ({
        "@type": "Person",
        name: a.name,
        ...(a.url ? { url: a.url } : {}),
        ...(a.image ? { image: a.image } : {}),
      })),
    };
    if (section) articleLd.articleSection = section;
    if (tags?.length) articleLd.keywords = tags.join(", ");
    if (typeof readMin === "number") {
      // ISO 8601 duration
      articleLd.timeRequired = `PT${readMin}M`;
      articleLd.wordCount = content
        ? content.trim().split(/\s+/).filter(Boolean).length
        : readMin * WPM;
    }
    specs.push({ type: "ld", id: "article", json: articleLd });

    // ----- JSON-LD: BreadcrumbList -----
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
  }, [
    title,
    description,
    publishedTime,
    section,
    tags,
    breadcrumbs,
    noindex,
    computed,
  ]);

  return null;
};

export default SEOHead;
export { estimateReadingTime };