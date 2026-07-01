import { createRoot } from "react-dom/client";

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

createRoot(document.getElementById("root")!).render(<App />);
