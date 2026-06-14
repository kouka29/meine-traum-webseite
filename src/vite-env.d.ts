/// <reference types="vite/client" />
/// <reference types="vite-imagetools/client" />

// Catch-all for any image import that ends with `as=picture` (vite-imagetools).
// Wildcard ambient modules accept a single `*`, so this matches any leading path/query.
declare module "*as=picture" {
  const value: {
    sources: Record<string, string>;
    img: { src: string; w: number; h: number };
  };
  export default value;
}
