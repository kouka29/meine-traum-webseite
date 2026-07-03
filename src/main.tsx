import { createRoot, hydrateRoot } from "react-dom/client";

// Self-hosted fonts (replace blocking Google Fonts CDN chain)
// font-display: swap is already set inside the @fontsource packages.
// Above-the-fold latin weights are preloaded from /public/fonts via index.html;
// these imports cover additional weights and non-latin subsets.
import "@fontsource-variable/inter/wght.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";

import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root")!;

// If react-snap prerendered this route, #root already contains DOM. Hydrate
// so we reuse it (LCP paints before JS runs). Otherwise cold-start as SPA.
if (container.hasChildNodes()) {
  // Mark the document so components can render their "settled" state on
  // first hydration pass and avoid mismatches with the snapshot.
  document.documentElement.dataset.snap = "1";
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
