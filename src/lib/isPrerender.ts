/**
 * True while the page is being crawled by react-snap's headless Chrome for
 * the build-time snapshot, OR when the current live document was hydrated
 * from such a snapshot. Used to make effect-driven UI (animations,
 * consent-gated widgets) render its "final" state directly, so the
 * server-shape and hydration-shape match.
 */
export const isPrerender = (): boolean => {
  if (typeof navigator !== "undefined" && /ReactSnap/i.test(navigator.userAgent)) {
    return true;
  }
  if (typeof document !== "undefined" && document.documentElement.dataset.snap === "1") {
    return true;
  }
  return false;
};