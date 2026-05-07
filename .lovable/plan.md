## Was passiert aktuell

Auf 11 Unterseiten (Index, Services, Conversion, WebsiteRelaunch, WebsiteErstellenLassen, alle 6 Branchenseiten, IndexOriginal) werden zwei optisch fast identische CTA-Module direkt nacheinander gerendert:

```text
[ FreePreviewCTA  ] – lila Gradient-Box, Headline "Ihre kostenlose Website-Strategie",
                      Button → /kontakt
[ CTABanner       ] – lila Gradient-Box, Headline "Jetzt kostenlose Strategie-Vorschau
                      sichern", Button → /kontakt + Rückruf-Button
```

Beide nutzen `gradient-hero-bg`, dasselbe Versprechen, denselben Ziel-Link. Aus Sicht der vier Rollen:

- **UX-Designer:** Doppelung wirkt wie ein Bug. Nutzer scrollen zweimal an „derselben" Box vorbei → CTA-Blindheit, Vertrauensverlust.
- **Conversion-Texter:** Zwei identische Versprechen direkt hintereinander schwächen den Call-to-Action statt ihn zu verstärken. Eine starke Schlussbotschaft konvertiert besser als zwei mittelmäßige.
- **Brand/Visual:** Zwei lila Gradient-Blöcke nebeneinander erschlagen den Rhythmus der Seite – es fehlt visueller Wechsel.
- **Frontend-Engineer:** Zwei Komponenten mit nahezu identischer Markup-Struktur = doppelter Maintenance-Aufwand, doppelte Bundle-Bytes.

Einstimmiges Urteil: **eines reicht. Es muss konsolidiert werden.**

## Lösung

Die beiden Module zu **einem finalen CTA** zusammenführen, das die Stärken beider kombiniert:

- **Headline + Hauptbenefit** aus `FreePreviewCTA` (klares Versprechen „Ihre kostenlose Website-Strategie")
- **3-Schritte-Trust-Liste** aus `FreePreviewCTA` beibehalten
- **Zweiter Rückruf-Button** aus `CTABanner` übernehmen (Wahlmöglichkeit erhöht Conversion bei Telefon-affinen Zielgruppen wie Handwerk/SHK/Ärzte)
- **Trust-Zeile** „Unverbindlich. Schnell. Klar." nur einmal

Ergebnis: ein einziger, stärkerer Schluss-CTA pro Seite.

## Umsetzung

1. **`src/components/FreePreviewCTA.tsx`** erweitern:
   - Bestehende Struktur (Badge, Headline, Beschreibung, 3-Schritte-Liste) bleibt
   - Button-Bereich bekommt zusätzlich den Outline-„Rückruf vereinbaren"-Button aus `CTABanner`
   - Beide Buttons in `flex-col sm:flex-row gap-3` Layout
   - Trust-Zeile „Unverbindlich. Schnell. Klar." bleibt einmal darunter

2. **`<CTABanner />` aus den Doppel-Seiten entfernen** (und Imports):
   - Index.tsx, IndexOriginal.tsx, Services.tsx, ConversionOptimierung.tsx, WebsiteRelaunch.tsx, WebsiteErstellenLassen.tsx
   - WebdesignAerzte, WebdesignAgentur, WebdesignCoaches, WebdesignHandwerker, WebdesignImmobilienmakler, WebdesignSHK

3. **`CTABanner` behalten** für Seiten, die *nur* `CTABanner` nutzen (About, Portfolio, KostenloserWebsiteCheck, LandingpageErstellen) – dort gibt es keine Doppelung, also kein Eingriff.

4. **Refs prüfen:** `CTABanner` ist `forwardRef` – kurz checken, ob eine der entfernten Seiten den Ref nutzt; falls ja, Ref auf `FreePreviewCTA` umbiegen oder Trigger anders lösen.

Keine Änderungen an Routing, Backend, Forms oder Texten der übrigen Seitenmodule.

## Ergebnis nach Umsetzung

- Jede Unterseite endet mit **einem** klaren, vollwertigen CTA-Block
- Visuell ruhigerer Seitenrhythmus, kein „Déjà-vu"-Effekt
- Eine einzige Quelle der Wahrheit für den finalen CTA → einfacher A/B-zu-testen
