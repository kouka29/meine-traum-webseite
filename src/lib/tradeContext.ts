export type TradeContext = {
  key: "handwerker" | "elektriker" | "maler" | "sanitaer" | "dachdecker";
  emoji: string;
  label: string; // e.g. "Für Handwerker"
  hubLabel: string; // e.g. "Für Handwerker" (breadcrumb)
  hubPath: string; // e.g. "/handwerker"
  bannerText: string;
};

export const tradeContexts: Record<string, TradeContext> = {
  handwerker: {
    key: "handwerker",
    emoji: "🔨",
    label: "Für Handwerker",
    hubLabel: "Für Handwerker",
    hubPath: "/handwerker",
    bannerText: "🔨 Speziell für Handwerksbetriebe — Kostenlose Website-Vorschau in 48 Stunden sichern →",
  },
  elektriker: {
    key: "elektriker",
    emoji: "⚡",
    label: "Für Elektriker",
    hubLabel: "Für Elektriker",
    hubPath: "/elektriker",
    bannerText: "⚡ Speziell für Elektriker — Kostenlose Website-Vorschau in 48 Stunden sichern →",
  },
  maler: {
    key: "maler",
    emoji: "🎨",
    label: "Für Maler",
    hubLabel: "Für Maler",
    hubPath: "/maler",
    bannerText: "🎨 Speziell für Maler & Lackierer — Kostenlose Website-Vorschau in 48 Stunden sichern →",
  },
  sanitaer: {
    key: "sanitaer",
    emoji: "🔧",
    label: "Für Sanitärbetriebe",
    hubLabel: "Für Sanitärbetriebe",
    hubPath: "/sanitaer",
    bannerText: "🔧 Speziell für Sanitär & Heizungsbetriebe — Kostenlose Website-Vorschau in 48 Stunden sichern →",
  },
  dachdecker: {
    key: "dachdecker",
    emoji: "🏠",
    label: "Für Dachdecker",
    hubLabel: "Für Dachdecker",
    hubPath: "/dachdecker",
    bannerText: "🏠 Speziell für Dachdecker — Kostenlose Website-Vorschau in 48 Stunden sichern →",
  },
};

export function getTradeContext(pathname: string): TradeContext | null {
  const seg = pathname.split("/")[1];
  return tradeContexts[seg] ?? null;
}

export const SUBPAGE_LABELS: Record<string, string> = {
  preise: "Preise",
  leistungen: "Leistungen",
  portfolio: "Portfolio",
  "ueber-uns": "Über uns",
  kontakt: "Kontakt",
};
