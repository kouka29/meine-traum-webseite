## Ziel
Visuelle Vereinheitlichung in drei Achsen (Typo, Radius, Icons) ohne Layout-Bruch und ohne Änderung an Inhalten, Farben oder Tabu-Bereichen (Supabase/Stripe/Pixel/Kundenportal/Admin).

---

## 1) Type-Scale festlegen

**Globale Basis in `src/index.css`** (Elemente-Layer):
```text
h1   →  text-4xl md:text-5xl   (font-bold, leading-[1.1])
h2   →  text-3xl                (font-bold, leading-[1.15])
h3   →  text-xl                 (font-semibold, leading-snug)
p    →  text-base               (leading-relaxed)
small →  text-sm
```
Aktuell stehen `h1: md:text-6xl lg:text-7xl` und `h2: md:text-4xl lg:text-5xl` als Defaults — diese werden auf die Skala oben gekürzt. Damit greift die Skala automatisch überall, wo keine Override-Klassen gesetzt sind.

**Ausnahme „Hero-H1 der Startseite"**: genau **eine** H1 darf `text-6xl` bleiben → `src/pages/Index.tsx` Hero. Eine kuratierte Whitelist (Marketing-Hauptseiten Hero) bekommt das opt-in-Modifier `hero-xl` (Utility-Klasse in `index.css`, `@apply text-5xl md:text-6xl`).

**Überschriften-Overrides aufräumen (Search-Replace)** in folgenden Dateien — H1/H2 die aktuell `text-5xl/6xl/7xl/8xl` tragen, werden auf die Skala (H1 = `text-4xl md:text-5xl`, H2 = `text-3xl`) reduziert:

- `src/pages/Handwerker.tsx` (Zeilen 179, 360, 400, 450, 482, 524, 603, 643, 769, 811)
- `src/pages/EinEuroAngebot.tsx` (Z. 124, 157, 175, 227, 257, 272, 348)
- `src/pages/Premium.tsx` (Z. 543, 559) — Hero behält `text-5xl`
- `src/pages/Erstgespraech.tsx` Quote (Z. 354) → `text-2xl md:text-3xl`
- `src/pages/Starter.tsx` (Z. 422, 741)
- `src/pages/trade/HandwerkerUeberUns.tsx` (Z. 30, 41, 74)
- `src/pages/trade/HandwerkerLeistungen.tsx` (Z. 78)
- `src/pages/ConversionOptimierung.tsx` (Z. 71) — dekorative Stat, bleibt `text-4xl`
- `src/pages/About.tsx` (Z. 80) — Stat → `text-4xl`
- `src/pages/KaufErfolgreich.tsx`, `src/pages/WebsiteErstellenLassen.tsx`, `src/pages/KostenloseVorschauV2.tsx`, `src/pages/lp/Gesetz.tsx`, `src/pages/lp/EmailAngebot.tsx`

Dekorative Zahlen/Ziffern (Pricing-Preis, Schritt-Nummern, Stat-Counter, „❝"-Glyphen) **bleiben unangetastet** — das sind keine Headlines.

---

## 2) Radius vereinheitlichen

**Token in `src/index.css`:**
- `:root { --radius: 0.75rem }` → bleibt.
- `html.apple-mode { --radius: 1.25rem }` → **bleibt** (bewusst für Apple-Mode wie im Briefing erlaubt).
- `--radius-card: 1rem` und `--radius-card-lg: 1.25rem` → behalten als bewusste Card-Stufen, aber Nutzung wird konsolidiert.

**Tailwind-Mapping (`tailwind.config.ts`)** prüfen — `rounded-lg/md/sm` lesen bereits aus `--radius`. shadcn-`Button`, `Input`, `Card` benutzen `rounded-md`/`rounded-lg` → keine Änderung nötig.

**Aufräumen (Search-Replace) in Marketing-Components:**
- `rounded-3xl` (26×) → `rounded-2xl` außer in Hero-Cards der Startseite und `Premium.tsx` (dort bewusst).
- `rounded-[28px]`, `rounded-[2rem]`, `rounded-[20px]`, `rounded-[22px]`, `rounded-[2.5rem]`, `rounded-[1.5rem]` → auf `rounded-2xl` normalisieren.
- `rounded-[2px]` (Single use) → `rounded-sm`.
- `rounded-full` (172×, Buttons/Badges/Avatare) → bleibt.
- `rounded-2xl` (Cards) und `rounded-xl` (Mid-Elements) bleiben — sind die zwei zulässigen Card-Stufen.

Resultat: Stack {sm, md, lg, xl, 2xl, full} — keine willkürlichen Pixel-Werte.

---

## 3) Icon-Set kuratieren

**Konzept → kanonisches Icon** (site-weit erzwungen):

| Konzept | Icon |
|---|---|
| Telefon / Kontakt | `Phone` |
| Termin / Kalender | `Calendar` |
| E-Mail | `Mail` |
| Adresse / Standort | `MapPin` |
| Erfolg / Check | `Check` |
| Fehler / Warnung | `AlertTriangle` |
| Geschwindigkeit | `Zap` |
| Sicherheit | `ShieldCheck` |
| Zeit / Dauer | `Clock` |
| Pfeil weiter | `ArrowRight` |
| Externer Link | `ExternalLink` |
| Schließen | `X` |

**Suche & Ersetzen** (nicht im Admin/Kundenportal):
- `PhoneCall`, `PhoneIncoming`, `PhoneOutgoing` → `Phone`
- `CalendarDays`, `CalendarCheck`, `CalendarClock` → `Calendar`
- `MailCheck`, `Send` (im Sinn von „E-Mail") → `Mail` (Send bleibt für „Senden-Button")
- `CheckCircle`, `CheckCircle2` → `Check` (in Bullet-Listen) — Inline-Form bleibt wo bewusst dekorativ
- `AlertCircle` → `AlertTriangle` (außer Inline-Form-Validation in `Input`)

**Größen-Skala (px):**
- `size={16}` Inline-Text und Buttons-sm
- `size={20}` Standard (Cards, Listen-Bullets, Nav)
- `size={24}` Hero/Feature-Tiles
Stroke-width: Default (2) site-weit — keine `strokeWidth`-Overrides außer bewusst dünn in Hero-Premium (`Premium.tsx`, bleibt).

Beliebige `size={28/32/40/48}` werden auf 24 reduziert; `size={12/14/18}` auf 16/20.

---

## Verifikation

```text
1. bunx tsgo --noEmit        → 0 Fehler
2. npx eslint src --quiet    → 0 Fehler
3. rg "text-(7xl|8xl)" src   → leer (außer bewusste Ausnahme)
4. rg "rounded-\[" src       → leer
5. Spot-Screenshots: /, /handwerker, /angebot, /kostenlose-vorschau
```

---

## Tabu (unangetastet)

- `src/integrations/supabase/*`, alle Supabase-Edge-Functions
- Stripe-Flows, Meta-Pixel
- Kundenportal (`src/pages/portal/*`), Admin-Bereich (`src/pages/admin*`, `src/components/admin/*`)
- Farben, Texte, Übersetzungen, Routing
- Apple-Mode-Radius (1.25rem bleibt erhalten — bewusste Variante)
