# /kostenlose-vorschau-business — Business-LP mit geteiltem Funnel

## Ziel
Zweite Landingpage für breite Zielgruppe (Berater, Praxen, Shops, Agenturen…) mit eigener Hero/Copy, aber identischem Funnel + Success-Screen wie die bestehende Handwerker-Seite. Platz-Zähler wird geteilt.

## 1. Refactor: `<VorschauFunnel />` Komponente
Bisher lebt alles in `src/pages/KostenloseVorschauV2.tsx` (~2450 Zeilen). Ich extrahiere den Funnel-Teil (Multi-Step-Form + Warteliste-Mini-Form + Success-Screen inkl. FAQ/Ehrlichkeits-Sektion + Slot-Zähler) in eine neue Komponente:

- **Neu:** `src/components/vorschau/VorschauFunnel.tsx`
- **Props:**
  ```ts
  type VorschauFunnelProps = {
    quelle: "handwerker" | "business";       // → source_cta Suffix
    branchePlaceholder: string;              // Placeholder Gewerk/Branche
    ansprache?: "du" | "sie";                // Default "du"
    telegramLabel: string;                   // z.B. "/kostenlose-vorschau" oder "Business-LP"
    budgetChips?: { kaufen?: string[]; mieten?: string[] };
  };
  ```
- Alle Submit-Handler (Lead, Warteliste, Booking, Kontaktweg) erhalten `quelle`/`telegramLabel` in `source_cta` und Telegram-Header.
- Slot-Zähler bleibt via `count_freigegebene_leads_this_month` (LP-übergreifend, exakt wie gewünscht).
- Handwerker-Seite `KostenloseVorschauV2.tsx` ersetzt ihren Inline-Funnel durch `<VorschauFunnel quelle="handwerker" telegramLabel="/kostenlose-vorschau" branchePlaceholder="z. B. Elektriker, Sanitär, Maler" />` — Copy oberhalb (Hero, Sektionen) bleibt 1:1.

## 2. Neue Seite `src/pages/KostenloseVorschauBusiness.tsx`
Aufbau (nutzt bestehende Design-Tokens, keine neuen Farben):

1. **Hero** — H1, Subline, 2 Status-Chips (Plätze frei / Monat), Primary-CTA scrollt zu Funnel, Vertrauens-Zeile.
2. **Für wen wir bauen** — Grid mit 10 Branchen-Cards, Lucide-Icons (Stethoscope, Briefcase, UtensilsCrossed, ShoppingBag, Palette, Scale, Dumbbell, Car, GraduationCap, Wrench), Fallback-Text drunter.
3. **So läuft's ab** — 3-Schritte-Section identisch strukturiert wie Handwerker-Seite.
4. **Was du bekommst** — 4 Nutzen-Cards (Startseite live / Farben & Logo / Struktur klickbar / Mobile).
5. **`<VorschauFunnel quelle="business" ... />`** + dezenter Hinweis-Text.
6. **Social Proof** — vorerst weggelassen (keine passenden branchen-diversen Testimonials im Projekt, siehe offene Punkte).
7. Bestehender globaler WhatsApp-Button greift automatisch — keine Extra-Arbeit.

## 3. Routing & SEO
- `src/App.tsx`: neue Route `/kostenlose-vorschau-business` → `KostenloseVorschauBusiness`.
- `<PageMeta>` (bestehendes Muster) mit:
  - Title: „Kostenlose Website-Vorschau für Selbstständige & Unternehmen | MTW"
  - Description wie im Brief
  - Canonical `/kostenlose-vorschau-business`

## 4. Backend
Keine DB-Migration nötig. `source_cta` wird pro Insert gesetzt:
- Lead-Submit: `kostenlose-vorschau-business:lead`
- Warteliste: `kostenlose-vorschau-business:warteliste`
- Booking / Kontaktweg-Updates: analog mit `business:` Prefix
- Telegram-Header: „🆕 NEUE ANFRAGE — Business-LP" bzw. „⏳ WARTELISTE — Business-LP"

## 5. Textregeln
- Du-Form, kein „Bewerbung", kein Agentur-Sprech.
- Success-Screen (Ehrlichkeit + FAQ + WhatsApp-Link) bleibt inhaltlich identisch, da in der Komponente.

## Offene Punkte
1. **Testimonials-Sektion (6):** Erstmal weglassen bis passende Testimonials aus verschiedenen Branchen vorliegen. OK?
2. **Refactor-Risiko:** Der bestehende Funnel ist groß und stark verzahnt mit `KostenloseVorschauV2`. Ich extrahiere sauber in eine Komponente und teste, dass die Handwerker-Seite optisch/funktional 1:1 gleich bleibt. Falls du das Refactor lieber vermeiden willst, wäre die Alternative: Datei duplizieren und die zwei Copy-Stellen anpassen (schneller, aber doppelter Wartungsaufwand). Sag Bescheid welche Variante.
