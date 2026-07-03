
## Ziel

Route `/` (Startseite) beim Build statisch prerendern, damit der Hero-Block schon im ersten HTML-Dokument steht — der Browser malt LCP, bevor React/JS gebootet ist. Hydration muss danach ohne Warnings/Layout-Sprünge weiterlaufen.

## Tool-Wahl: `react-snap`

- Nutzt Headless-Chrome nach dem Build, besucht die konfigurierten Routen auf `dist/` und speichert das gerenderte DOM als statische `.html`-Datei zurück in `dist/`.
- Kein Umbau von Routing/Router nötig — funktioniert mit dem bestehenden `BrowserRouter`.
- Passt zum Lovable-Static-Hosting-Setup (SPA-Fallback + statische HTMLs).
- `vite-react-ssg` würde ein Umschreiben aller Routen auf ein SSG-Route-Objekt erfordern — deutlich invasiver bei ~65 Routen. Deshalb `react-snap`.

## Änderungen

### 1. Dependencies + npm-Scripts

- Dev-Dependency `react-snap` (nutzt intern Puppeteer).
- `package.json`:
  - `"postbuild": "react-snap"` — läuft automatisch nach `vite build`.
  - `"reactSnap"`-Konfigurationsblock:
    - `source: "dist"`
    - `include: ["/"]` — bewusst nur die Startseite, keine anderen Routen.
    - `puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"]` (CI-freundlich).
    - `inlineCss: false` (Vite kümmert sich schon ums Splitting).
    - `skipThirdPartyRequests: true` — blockiert Supabase/Stripe/Meta beim Snapshot, damit Netzwerk-Antworten nicht ins HTML einfrieren.
    - `crawl: false` — folgt keinen Links, prerendert wirklich nur `/`.

### 2. `src/main.tsx` — Hydrate statt neu mounten

Wenn `#root` schon Kinder hat (Snapshot vorhanden), `hydrateRoot` verwenden; sonst wie bisher `createRoot`.

```ts
const container = document.getElementById("root")!;
if (container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
```

### 3. Snapshot-Erkennung + Hydration-Safety

Zentrale kleine Utility `src/lib/isPrerender.ts` mit zwei Checks:
- Beim Snapshot (Node im Puppeteer): `navigator.userAgent.includes("ReactSnap")` → `true`.
- Zur Hydration: `document.documentElement.dataset.snap === "1"` (wird während des Snapshots per `<script>`-Tag gesetzt bzw. via `react-snap`s `preloadImages: false`-Hooks).

Damit beheben wir gezielt die drei bekannten Mismatch-Quellen im Hero-Baum:

#### 3a. `AnimatedSection`
Initial-State `inView` heute `false` → Hero wäre in der Snapshot-Datei mit `opacity: 0` eingefroren, LCP-Gewinn wäre weg.
Fix: `useState(() => isPrerender() || (typeof document !== "undefined" && document.documentElement.dataset.snap === "1"))`. Snapshot → sofort sichtbar; Hydration liest denselben Wert aus dem DOM-Flag → identisch → kein Mismatch. Für spätere Sektionen bleibt die IntersectionObserver-Animation aktiv.

#### 3b. `VorschauVerfuegbarkeit`
Rendert erst nach dem Supabase-Fetch etwas. Mit `skipThirdPartyRequests: true` bleibt das Element im Snapshot `null` und hydratisiert konsistent zu `null`. Der Fetch läuft danach live weiter → Pille erscheint nach Hydration. Kein Mismatch, minimaler CLS im Hero-Bereich (kleines Pill-Element, unterhalb der Buttons).

#### 3c. `DesignModeProvider`
`appleDesign` startet `false` und schaltet erst nach Supabase-Fetch die `apple-mode`-Klasse. Da wir Third-Party beim Snapshot blocken, bleibt der Snapshot im Default-Zustand — matcht Hydration. Live-Umschaltung passiert nach Hydration wie bisher.

### 4. `react-helmet-async`

- `HelmetProvider` ist bereits gesetzt → Titel/Meta/LCP-Preload landen im gesnapshotteten `<head>` und stehen sofort im Dokument.
- Der bereits vorhandene `<link rel="preload" as="image" fetchpriority="high">` fürs Hero-AVIF wird durch das Prerendering **zusätzlich** wirksam, weil er jetzt schon vor dem ersten JS-Parsing im HTML steht.

### 5. Lazy-Sections & DeferredMount

- Below-the-fold-Sektionen (`PainPoints`, `IndexServices`, …) sind `React.lazy` in einer gemeinsamen `<Suspense>` — im Snapshot wird der `SectionPlaceholder` gerendert. Das ist gewollt und matcht Hydration (weil beim Client-Boot dieselben Chunks erst nachladen).
- `<DeferredMount>` (CookieBanner, Chat-FAB, Pixel) rendert im Snapshot `null` (State `ready=false`) und hydratisiert genauso → kein Mismatch, und die Chrome-Elemente sind nicht im HTML-Snapshot enthalten (gut für LCP & Datei­größe).

### 6. Router-Randfälle

- `BrowserRouter`-Match auf `/` liefert `<Index />` synchron (eager import), das ist der einzige eager Route — passt.
- `ScrollToTop`, `PageMeta`, `StructuredData`, `PageTracker` sind alle effect-basiert → SSR/Prerender-sicher.

### 7. Verifikation nach dem Build

- Prüfen, dass `dist/index.html` jetzt echtes Hero-Markup enthält (`<h1>Webseiten, die planbar Kundenanfragen bringen…`).
- `dist/index.html` weiterhin auch die Fallback-Skript-Referenz behält (`<script type="module" src="/assets/…">`), damit Hydration nach dem Snapshot startet.
- Kurzer Playwright-Check: keine `Hydration failed`/`did not match`-Warnungen in der Console auf `/`.
- Lighthouse-LCP-Element bleibt das Hero-`<img>` — jetzt sichtbar vor JS-Execution.

## Explizit NICHT geändert

- Kein Umstieg auf SSG/SSR-Framework, kein neuer Router.
- Keine anderen Routen werden prerendered (Angebot, Kundenportal, Landingpages) — dynamische Inhalte, Auth, personalisierte Angebote.
- Kein Eingriff in Framer-Motion oder Below-the-fold-Animationen.
- `MetaPixel`, `CookieBanner`, `ChatAssistant`, `GlobalCtaPopup` bleiben deferred — sie erscheinen nicht im Prerender-Snapshot (gewollt, dann kein DSGVO-/Consent-Risiko im statischen HTML).

## Risiken / offene Punkte

- `react-snap` ist seit ~2019 nicht mehr aktiv gepflegt, funktioniert aber weiterhin mit React 18 (via `hydrateRoot`). Falls es beim Build zu Puppeteer-Version-Problemen kommt, ist der Fallback ein Wechsel zu `@prerenderer/rollup-plugin` — gleicher Ansatz, gleiches Ergebnis.
- Falls Lovables Build-Umgebung Chromium nicht bereitstellt, muss `react-snap` bzw. Puppeteer beim Install einen mitliefern (kann Install-Zeit +30 s bedeuten).
