import { createRoot } from "react-dom/client";

// Self-hosted fonts (replace blocking Google Fonts CDN chain)
// font-display: swap is already set inside the @fontsource packages.
import "@fontsource-variable/inter/wght.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";

// Preload critical above-the-fold font files (Vite emits hashed asset URLs)
import interLatinUrl from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
import spaceGrotesk700Url from "@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2?url";

for (const href of [interLatinUrl, spaceGrotesk700Url]) {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "font";
  link.type = "font/woff2";
  link.crossOrigin = "anonymous";
  link.href = href;
  document.head.appendChild(link);
}

import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
