/**
 * Rewrite a Supabase Storage public object URL to use the on-the-fly image
 * transformer (`/storage/v1/render/image/public/...`) so we can deliver smaller
 * WebP variants instead of multi-megabyte source PNGs.
 *
 * If the URL is not a Supabase Storage object URL (e.g. local bundled asset,
 * external host, blob:), it is returned unchanged.
 */
export function supabaseImage(
  url: string | null | undefined,
  opts: { width?: number; quality?: number; format?: "webp" | "avif" | "origin" } = {}
): string {
  if (!url || typeof url !== "string") return url || "";
  // Only transform our Supabase Storage public object URLs
  const marker = "/storage/v1/object/public/";
  if (!url.includes(marker)) return url;

  const transformed = url.replace(marker, "/storage/v1/render/image/public/");
  const params = new URLSearchParams();
  if (opts.width) params.set("width", String(opts.width));
  params.set("quality", String(opts.quality ?? 75));
  params.set("format", opts.format ?? "webp");
  const sep = transformed.includes("?") ? "&" : "?";
  return `${transformed}${sep}${params.toString()}`;
}

/**
 * Build a `srcset` for a Supabase Storage URL across multiple widths.
 */
export function supabaseImageSrcSet(
  url: string | null | undefined,
  widths: number[],
  opts: { quality?: number; format?: "webp" | "avif" | "origin" } = {}
): string {
  if (!url || !url.includes("/storage/v1/object/public/")) return "";
  return widths
    .map((w) => `${supabaseImage(url, { width: w, ...opts })} ${w}w`)
    .join(", ");
}