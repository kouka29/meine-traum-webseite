# Font-Loading Analyse & Optimierung

## Ist-Zustand (Analyse)

**Einbindung:** Alle Webfonts sind **@fontsource-Pakete** aus `node_modules`, importiert über ESM in `src/main.tsx`:
- `@fontsource-variable/inter/wght.css` (Variable Font, weight 100–900)
- `@fontsource/poppins/600.css`, `/700.css`, `/800.css`

**Echte Pfade:** Vite bündelt + hasht die `.woff2` als Assets (z.B. `/assets/inter-latin-wght-normal-<hash>.woff2`). Kein CDN, kein `public/` — reine Build-Assets.

**@font-face-Regeln** (aus den Fontsource-Paketen, bereits ausgeliefert):
```css
/* Inter Variable — inter-latin-wght-normal */
@font-face {
  font-family: 'Inter Variable';
  font-style: normal;
  font-display: swap;      /* ✅ bereits gesetzt */
  font-weight: 100 900;
  src: url(./files/inter-latin-wght-normal.woff2) format('woff2-variations');
  unicode-range: U+0000-00FF, …;
}

/* Poppins 400/600/700/800 — je Subset (latin, latin-ext, devanagari) */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-display: swap;      /* ✅ bereits gesetzt */
  font-weight: 600;
  src: url(./files/poppins-latin-600-normal.woff2) format('woff2'), … .woff;
  unicode-range: U+0000-00FF, …;
}
```

**Font-Stacks** (bereits mit echtem Fallback):
- `--font-body: 'Inter Variable', 'Inter', system-ui, sans-serif` (index.css:217, tailwind.config.ts:18)
- `--font-heading: 'Poppins', system-ui, sans-serif` (index.css:216, tailwind.config.ts:17)

**Aktueller Preload-Mechanismus** (`src/main.tsx`): Nach JS-Parse werden `<link rel=preload>` für Inter latin wght-normal und Poppins 700 latin per JS eingefügt — funktioniert nicht als echter Critical-Path-Preload (zu spät im Wasserfall), aber keine 404s.

## Befund → Empfehlung

`font-display: swap` ist überall **bereits gesetzt** (durch Fontsource-Defaults). Fallback-Stack ist ebenfalls bereits vorhanden. Die einzige echte Verbesserung: **stabile Pfade + hardcoded Preload in `index.html`** für die 1–2 above-the-fold-Weights.

Ansatz laut Vorgabe: Inter 400 + 600 nach `public/fonts/` mit festen Namen kopieren, dedizierte `@font-face` darauf zeigen, in `index.html` preloaden. Übrige Weights/Subsets (Cyrillic, Greek, Vietnamese, Italics, Variable-Achsen) bleiben aus Fontsource → dynamisch nachgeladen, kein Regressionsrisiko.

Da wir eine **Variable Font (Inter Variable)** nutzen, ist ein separates statisches „Inter 400" und „Inter 600" nicht nötig — die Variable-Datei deckt beide ab. Für Preload nehmen wir **einmal die Inter-Latin-Variable-Datei** (~30 KB, deckt 100–900) + **Poppins 700 latin** (Haupt-Headline-Weight des Hero-H1).

## Änderungen (Build-Modus)

### 1) `public/fonts/` mit stabilen Namen anlegen
Kopiere aus `node_modules`:
- `@fontsource-variable/inter/files/inter-latin-wght-normal.woff2` → `public/fonts/inter-variable-latin.woff2`
- `@fontsource/poppins/files/poppins-latin-700-normal.woff2` → `public/fonts/poppins-700-latin.woff2`

### 2) Eigene `@font-face` in `src/index.css` (ganz oben, VOR den bestehenden Regeln)
```css
@font-face {
  font-family: 'Inter Variable';
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url('/fonts/inter-variable-latin.woff2') format('woff2-variations');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
                 U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193,
                 U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-display: swap;
  font-weight: 700;
  src: url('/fonts/poppins-700-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
                 U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193,
                 U+2212, U+2215, U+FEFF, U+FFFD;
}
```
Der Latin-Subset-`unicode-range` sorgt dafür, dass für nicht-lateinische Zeichen weiterhin die Fontsource-Regeln (Cyrillic/Greek/Devanagari) greifen — kein Bruch.

### 3) `index.html` — hardcoded Preloads
```html
<link rel="preload" href="/fonts/inter-variable-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/poppins-700-latin.woff2" as="font" type="font/woff2" crossorigin>
```
(In den bestehenden Fonts-Kommentar-Block einsetzen.)

### 4) `src/main.tsx` aufräumen
Den JS-basierten Preload-Injector (der gehashte Assets nachreicht) **entfernen** — wird durch statisches Preload ersetzt. `@fontsource`-CSS-Imports bleiben (liefern weitere Weights/Subsets für Fallback-Zeichen und 600/800).

### 5) Nichts anderes anfassen
Keine Layout-, Design-, Copy-Änderungen. Tailwind-Config bleibt. Fallback-Stacks sind bereits korrekt.

## Validierung
- `bun run build` grün.
- Network-Tab: `inter-variable-latin.woff2` und `poppins-700-latin.woff2` erscheinen als früheste Font-Requests (aus `<head>` preload), keine 404.
- Kein FOIT auf Slow-3G-Simulation (swap greift).
