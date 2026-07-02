## Ziel

Reine Textkorrektur über das gesamte Projekt „Meine Traum Webseite“ — 35 Seiten + 15 Branchen-Hubs + 11 Trade-Seiten + ca. 88 Komponenten. Keine Code-, Layout-, Routing-, Formular-, SEO- oder Design-Änderungen. Nur sichtbare Strings, Meta-Texte, Buttons, FAQs, Testimonials, Datenobjekte in Komponenten.

## Scope (was geprüft wird)

1. **Root-Seiten** (`src/pages/*.tsx`) — 35 Dateien inkl. Index, Portfolio, Preise, Kontakt, About, Rechts-Seiten (Impressum/AGB/Datenschutz *nur Tippfehler*, keine juristischen Umformulierungen).
2. **Branchen-Hubs** (`src/pages/branchen/*.tsx`) — 15 Dateien + `_shared.ts`.
3. **Trade-Seiten** (`src/pages/trade/*.tsx`) — 11 Dateien.
4. **Landingpages** (`src/pages/lp/*`) und **Kundenportal** (`src/pages/kundenportal/*`).
5. **Komponenten** mit sichtbarem Text (`src/components/**`): Navbar, Footer, PainPoints, IndexServices, IndexBenefits, IndexBranchen, IndexFAQ, IndexTestimonials, FreePreviewCTA, HeroSections, PricingLeadPopup, ChatAssistant Greetings/Quick-Replies, TradeHub, FeatureCard etc.

Bereits in dieser Session korrigierte Stellen (PainPoints, IndexServices, IndexBenefits, FreePreviewCTA, Index-Hero-Badge) werden nicht erneut angefasst.

## Korrektur-Regeln

**Konsistente Ansprache**
- „Du / Dich / Dein / Dir / Deine / Deinem“ **immer groß**.
- Keine Mischung mit „Sie / Ihr / Ihnen“ in Marketing-Texten. Ausnahme: rechtliche Seiten (Impressum, AGB, Datenschutz) bleiben in ihrer Ansprache erhalten.

**Grammatik / Konjugation**
- „kostet du" → „kostet Dich"
- „Du verlassen die Seite" → „Sie verlassen die Seite" (Subjekt ist „Besucher")
- „wen du erreichen wollen" → „wen Du erreichen möchtest"
- „was du anbieten" → „was Du anbietest"
- Satzanfänge und Eigennamen konsequent groß.

**Rechtschreibung / Zeichensetzung**
- Doppelte Leerzeichen entfernen.
- Deutsche Anführungszeichen „…" statt "…" in Fließtext (nur wo bereits Textinhalt, keine JSX-Attribute).
- Halbgeviertstrich „–" statt „-" bei Gedankenstrichen.
- Einheitliche Schreibweise: **Website** (nicht „Webseite" wechselnd — Marke „Meine Traum Webseite" bleibt aber unverändert).

**Nicht angefasst wird**
- Zahlen, Preise, Referenzen, Fakten, Versprechen.
- Slugs, URLs, `to=""`, `href=""`, `path=""`, Klassennamen, `aria-*`, `data-*`.
- SEO-Slugs und `path`-Props in `SEOHead`/`PageMeta` (Titel/Description werden nur bei Tippfehlern korrigiert).
- Juristische Formulierungen in AGB/Impressum/Datenschutz.
- Fremdsprachige Strings (z. B. englische Meta-Fallbacks in Edge Functions).
- Formular-Feldnamen, Event-Namen, Analytics-Tags.

## Vorgehen (Batches)

Ich arbeite in klar getrennten Batches, um pro Turn eine sinnvolle Einheit abzuschließen und nichts zu übersehen:

```text
Batch 1: Hauptseiten (Index-Sektionen + Root-Pages ohne trade/branchen)
Batch 2: Trade-Seiten (Handwerker, Elektriker, Dachdecker, Sanitär, Maler)
Batch 3: Branchen-Hubs (15 Dateien + _shared.ts)
Batch 4: Landingpages (/lp/*) + Kundenportal
Batch 5: Globale Komponenten (Navbar, Footer, Chat, Popups, Pricing, Trade-Komponenten)
Batch 6: Rechts-Seiten (nur Tippfehler) + Formular-Success-Seiten
```

Pro Batch: `rg` nach typischen Fehlern (kleine Satzanfänge, „du" ohne Großschreibung, „kostet du", doppelte Leerzeichen, gemischte Ansprache), gezielte `apply_patch`-Edits, Build-Grün-Prüfung am Ende jedes Batches.

## Deliverable am Ende

Kurzer Report:
- Zahl geprüfter Dateien pro Batch.
- Kategorien der Fixes (Groß-/Kleinschreibung, Konjugation, Zeichensetzung, Ansprache, Tippfehler).
- Liste **unsicherer Stellen**, die ich bewusst **nicht** angefasst habe (z. B. widersprüchliche Angebotstexte, inhaltlich mehrdeutige Claims, gemischte Du/Sie-Passagen in Rechts-Texten).
- Empfehlungen für manuelle Prüfung.

## Sicherheitsnetz

- Keine Datei-Löschungen, keine neuen Komponenten, keine Import-Änderungen.
- Nur String-Literale in `.tsx`/`.ts`, JSX-Textknoten, Array-Objekt-Werte (`title`, `desc`, `text`, `question`, `answer` etc.).
- Nach jedem Batch: `bun run build` implizit via Sandbox, Fehler sofort zurückrollen.

Freigabe bedeutet: ich starte mit Batch 1 und liefere in den folgenden Turns Batch für Batch, mit Zwischenstatus.