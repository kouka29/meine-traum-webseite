import { forwardRef, type ImgHTMLAttributes } from "react";

/**
 * Central image primitive for Portfolio / Referenzen / Galerie / Logo-Slider.
 * Enforces width/height (CLS), decoding=async and lazy-by-default.
 * Pass `priority` (or loading="eager") for the single above-the-fold hero image.
 */
export type ProjectImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  width: number;
  height: number;
  priority?: boolean;
};

const ProjectImage = forwardRef<HTMLImageElement, ProjectImageProps>(
  ({ priority, loading, decoding = "async", ...rest }, ref) => {
    const effectiveLoading = loading ?? (priority ? "eager" : "lazy");
    const extra: Record<string, string> = {};
    if (priority) extra.fetchpriority = "high";
    return (
      <img
        ref={ref}
        loading={effectiveLoading}
        decoding={decoding}
        {...extra}
        {...rest}
      />
    );
  }
);
ProjectImage.displayName = "ProjectImage";

export default ProjectImage;