# Design-Vereinheitlichung — Premium Polish

Ziel: Eine durchgängige Design-Sprache über alle öffentlichen Seiten und Conversion-Flows. Keine Feature-Änderungen, keine Logik-Eingriffe — nur Visual & Komponenten-Konsolidierung.

## Scope

**In:** Home, Branchen-Hubs (alle 23), Portfolio, Preise (alle Varianten), Kontakt, Erstgespräch, Vorschau-Flows (KostenloseVorschau / V2 / 2), Angebot/Checkout, Kauf-Erfolg, Footer, Navbar, Cookie-Banner, Lead-Modals.
**Out:** Admin (`AdminLeads`, `admin/*`), Kundenportal (`kundenportal/*`), Rechtliches (AGB/Impressum/Datenschutz — nur Typo-Pass).

## Design-Master (Source of Truth)

Eine einzige Token- & Komponenten-Schicht. Bestehende Brand-Farben (Purple `hsl(250 56% 48%)`, Amber Akzent, Success Green) bleiben — nur konsequenter eingesetzt.

**Tokens (in `src/index.css` konsolidieren):**
- Radius-Skala: `--radius-sm: 8px`, `--radius-md: 12px`, `--radius-lg: 16px`, `--radius-2xl: 24px`. Cards = 2xl, Buttons = lg, Inputs = md.
- Shadow-Skala: `--shadow-sm` (subtle hover), `--shadow-card` (default card), `--shadow-elevated` (modal/popover), `--shadow-glow` (CTA-hero).
- Spacing-Rhythmus: Sektionen einheitlich `py-20 md:py-28`, Container `max-w-6xl` für Content, `max-w-7xl` nur für Galerie/Grid.
- Section-Backgrounds: nur drei Varianten — `dark` (Hero/CTA), `light` (muted bg), `white` (Content).

**Komponenten-Bibliothek anlegen unter `src/components/ui-marketing/`:**
- `<Section bg="dark|light|white" id?>` — vereinheitlicht den heute überall duplizierten Wrapper aus TradeHub.
- `<SectionHeading eyebrow? title subtitle? align?>` — ersetzt die ~30 leicht abweichenden H2-Blöcke.
- `<MarketingCard variant="default|feature|pain|testimonial">` — eine Card-Familie statt 6 unterschiedlicher Inline-Versionen (FeatureCard, PainPointCard, IndexBenefits-Karte, IndexServices-Karte etc.).
- `<CtaButton variant="primary|secondary|ghost" size>` — ersetzt die hardcodierten `bg: var(--brand-purple)` Buttons überall.
- `<TrustBadgeRow>` und `<PhoneCta>` — wiederkehrende Hero-Bausteine.

## Icon-Strategie

- **Lucide React** für alle funktionalen/UI-Icons: Nav, Buttons, Form-Felder, Check-Listen, Pfeile, Telefon, Mail, Close, Chevrons.
- **Emojis bleiben** in: Branchen-Cards (`IndexBranchen`), Hero-Badges der Hubs, PainPoint/Feature-Cards der TradeHubs, Step-Indikatoren ("So einfach geht's"). Dort tragen sie Wärme & Wiedererkennung.
- **Aufzuräumen:** Misch-Stellen wo Emoji ↔ Lucide inkonsistent ist (z.B. `IndexBenefits` vs `IndexServices`), Sterne-Strings `⭐⭐⭐⭐⭐` → `<Stars count={5} />` Komponente mit Lucide `Star` (filled).

## Konkrete Aufräum-Punkte (gefunden bei Audit)

1. **Buttons:** Inline-Style `style={{ background: "var(--brand-purple)" }}` an ~40+ Stellen → `<CtaButton>`.
2. **Cards:** `rounded-2xl`, `rounded-xl`, `rounded-3xl` willkürlich gemischt → einheitlich `rounded-2xl` für Content-Cards.
3. **Sektionen:** `py-16`, `py-20`, `py-24`, `py-32` → `py-20 md:py-28`.
4. **Headings:** H2 mal `text-3xl md:text-4xl`, mal `text-4xl md:text-5xl`, mal `text-2xl md:text-3xl` → Skala festziehen (H1 hero, H2 section, H3 card).
5. **Hardcoded Farben:** `text-white`, `bg-white`, `text-[#0A0A1F]`, `#5B5FEF` etc. → semantische Tokens.
6. **Branchen-Hubs:** Alle 15 neuen Hubs nutzen bereits `TradeHub` — gut. Aber `WebdesignAerzte`, `WebdesignSHK`, `WebdesignCoaches`, `WebdesignImmobilienmakler`, `WebdesignHandwerker`, `WebdesignAgentur` sind eigene Layouts → optional auf `TradeHub`-Pattern migrieren, oder zumindest auf gleiche Tokens/Komponenten ziehen.
7. **Vorschau-Seiten:** `KostenloseVorschau.tsx`, `KostenloseVorschau2.tsx`, `KostenloseVorschauV2.tsx` haben drei verschiedene Looks → an Master angleichen (Hero, Form-Card, Trust-Strip).
8. **Footer/Navbar:** Padding, Link-Hover-States, Spacing harmonisieren.
9. **Lead-Modals & Popups:** `LeadCaptureModal`, `PricingLeadPopup`, `GlobalCtaPopup`, `StripeCheckoutDialog` — gleiche Dialog-Shell (Header, Close-Button, Radius, Shadow).
10. **Stars-Component:** Emoji-Sterne durch Lucide-Filled-Stars ersetzen (skaliert sauberer, einheitliche Farbe).

## Vorgehen (Reihenfolge)

```text
1. Token-Layer in index.css konsolidieren (radii, shadows, section paddings)
2. ui-marketing/ Komponenten anlegen (Section, SectionHeading, MarketingCard, CtaButton, Stars, TrustBadgeRow)
3. TradeHub.tsx auf neue Komponenten umstellen (refactor in place — 15 Branchen ziehen automatisch nach)
4. Home-Sektionen (IndexPortfolio, IndexBranchen, IndexBenefits, IndexServices, IndexTestimonials, IndexFAQ, IndexStats, CTABanner, PainPoints, SocialProofBar) migrieren
5. Standalone-Seiten (Portfolio, Services, Contact, Erstgespraech, WebdesignPreise[2], WebdesignAerzte/SHK/Coaches/Immobilien/Handwerker/Agentur) angleichen
6. Vorschau-Flow vereinheitlichen (3 Vorschau-Seiten + LeadCaptureModal)
7. Angebot/Checkout-Flow (Angebot, KaufErfolgreich, ZahlungErfolgreich, CheckoutFunnel, StripeEmbeddedCheckout, StripeCheckoutDialog) auf gleiche Dialog/Card-Shells
8. Footer + Navbar + CookieBanner Feinschliff
9. Visual-QA: Playwright-Screenshots Home / Branche / Portfolio / Preise / Vorschau / Angebot — vorher/nachher
```

## Was sich für den Nutzer ändert

- Konsistentere Optik: gleiche Card-Form, gleiche Button-Höhe, gleiche Abstände auf jeder Seite.
- Professionelleres Icon-Set: keine Mischmasch Emoji/SVG mehr in UI-Elementen.
- Bessere Lesbarkeit & Hierarchie durch einheitliche Typo-Skala.
- Keine inhaltlichen Änderungen, keine Funktionalität verändert.

## Technische Notizen

- Keine neuen Dependencies (Lucide ist schon installiert).
- Refactor erfolgt nicht-destruktiv: bestehende Komponenten werden auf die neuen Bausteine umgeschrieben, keine breiten Datei-Löschungen.
- Build wird nach jeder Phase verifiziert; Playwright-Screenshots zur visuellen Regression der drei wichtigsten Routen (`/`, `/elektriker`, `/kostenlose-vorschau`).
- Geschätzter Umfang: ~25–35 Datei-Edits, 5–6 neue Komponenten-Dateien.
