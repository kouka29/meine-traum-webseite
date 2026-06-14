/// <reference types="vite/client" />
/// <reference types="vite-imagetools/client" />

// Catch-all for picture/format query imports that imagetools rewrites.
declare module "*?picture" {
  const value: {
    sources: Record<string, string>;
    img: { src: string; w: number; h: number };
  };
  export default value;
}
