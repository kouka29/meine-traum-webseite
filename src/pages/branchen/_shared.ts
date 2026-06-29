import type { TradeHubConfig } from "@/components/trade/TradeHub";

/** Cross-links shown on every non-handwerker landingpage. */
export const NON_TRADE_CROSS_LINKS = [
  { icon: "👨‍⚕️", label: "Für Ärzte & Praxen", to: "/webdesign-aerzte" },
  { icon: "🎓", label: "Für Coaches & Trainer", to: "/webdesign-coaches" },
  { icon: "🏢", label: "Für Immobilienmakler", to: "/webdesign-immobilienmakler" },
];

/** Shared overrides applied to every non-handwerker hub. */
export const NON_TRADE_DEFAULTS: Partial<TradeHubConfig> = {
  crossLinksH2: "Auch für andere Branchen",
  crossLinksFooterLabel: "Alle Branchen ansehen →",
  crossLinksFooterTo: "/#branchen",
  pricingContactPath: "/kontakt",
};

/** Helper: merge a branche-specific config with the non-trade defaults. */
export const branche = (cfg: Omit<TradeHubConfig, "crossLinks"> & { crossLinks?: TradeHubConfig["crossLinks"] }): TradeHubConfig => ({
  ...NON_TRADE_DEFAULTS,
  crossLinks: NON_TRADE_CROSS_LINKS,
  ...cfg,
});