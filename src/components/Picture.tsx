import type { ImgHTMLAttributes } from "react";

/**
 * Output shape of vite-imagetools when using `?picture` directive.
 * Each format key holds a `srcset` string for that format.
 */
export type PictureSource = {
  sources: Record<string, string>;
  img: { src: string; w: number; h: number };
};

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  source: PictureSource;
  alt: string;
  /** Defaults to "lazy" — set to "eager" for above-the-fold images. */
  loading?: "lazy" | "eager";
  /** Set to "high" for the LCP image. */
  fetchPriority?: "high" | "low" | "auto";
  /** Responsive sizes attribute, e.g. "(min-width: 768px) 800px, 100vw". */
  sizes?: string;
};

/**
 * Picture component that emits AVIF + WebP + original fallback in one go.
 * Width/height are baked in from the source descriptor to prevent CLS.
 */
const Picture = ({
  source,
  alt,
  loading = "lazy",
  fetchPriority,
  sizes,
  className,
  style,
  ...rest
}: Props) => {
  const { sources, img } = source;
  // React <19 doesn't recognize camelCase `fetchPriority` — emit lowercase
  // attribute so the browser hint is applied without dev-time warnings.
  const fetchPriorityAttr = fetchPriority
    ? ({ fetchpriority: fetchPriority } as Record<string, string>)
    : {};
  return (
    <picture>
      {Object.entries(sources).map(([type, srcSet]) => (
 <source key={type} type={`image/${type}`} srcSet={srcSet} sizes={sizes} />
      ))}
      <img
        src={img.src}
        width={img.w}
        height={img.h}
        alt={alt}
        loading={loading}
        decoding={loading === "eager" ? "sync" : "async"}
        sizes={sizes}
        className={className}
        style={style}
        {...fetchPriorityAttr}
        {...rest}
      />
    </picture>
  );
};

export default Picture;