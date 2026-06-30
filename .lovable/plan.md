## Problem
Die Screenshots von **ME-KA, CBI, Elektrotechnik Fretter** erscheinen im Carousel auf `/` leer/kaputt, auf `/portfolio` korrekt — obwohl die Storage-Dateien gültig sind (per curl geprüft, alle drei JPGs liefern echte Seiten-Inhalte).

## Diagnose (vermutete Ursache)
- Beide Seiten teilen sich `portfolioCache` (`sessionStorage` Key `portfolio_projects_v3`, 5 min TTL) und denselben Resolver `rawSrc = p.image_url || p.screenshot_url`.
- Für diese 3 Items ist `image_url` in der DB ein **leerer String** und `screenshot_url` ist gesetzt → der Fallback auf `screenshot_url` muss greifen.
- Verdacht: In `IndexPortfolio.tsx` Zeile 148 wird `p.image_url` getestet als `(typeof p.image_url === "string" ? p.image_url : "")` — bei `""` ist `"" || screenshot_url` ok, aber wenn ein älterer Cache-Eintrag (`portfolio_projects_v3`) noch ein **anderes** image_url-Format speicherte (z. B. `null` oder einen toten relativen Pfad), wird `normalizeImageSrc` daraus eine kaputte URL bauen (`{SUPABASE_URL}/storage/v1/object/public/portfolio-images/null`). Portfolio.tsx hat eine etwas andere Branching-Reihenfolge und trifft dadurch evtl. nicht denselben Pfad.

## Schritt 1 — Verifikation per Playwright
Headless Chromium auf `http://localhost:8080/` öffnen, zur Portfolio-Section scrollen, für ME-KA / CBI / Elektrotechnik Fretter die tatsächlichen `<img src>`-Werte und `naturalWidth/naturalHeight` auslesen + Screenshots. Dasselbe auf `/portfolio` zum Vergleich. Damit ist die Render-Differenz eindeutig.

## Schritt 2 — Fix in `src/components/IndexPortfolio.tsx`
Resolver vereinheitlichen und robust gegen leere/null/relative image_url machen:
```ts
const rawSrc =
  (typeof p.screenshot_url === "string" && p.screenshot_url) ||
  (typeof p.image_url === "string" && p.image_url) ||
  "";
```
Begründung: `screenshot_url` ist (sofern gesetzt) immer die frischeste, vom Admin-Edge-Function gepflegte Quelle. Damit identische Quelle wie auf `/portfolio` — Differenz verschwindet.

## Schritt 3 — Cache-Invalidierung
Da der bisherige `sessionStorage`-Eintrag noch alte Daten enthalten kann, Cache-Key von `portfolio_projects_v3` → `portfolio_projects_v4` in `src/lib/portfolioCache.ts` anheben. Alte Einträge werden ignoriert, frischer Fetch erzwungen.

## Schritt 4 — Validierung
Playwright erneut auf `/` ausführen, prüfen dass alle 3 Cards jetzt Bildinhalt zeigen (naturalWidth > 0, sichtbare Pixel-Diff zum vorherigen Screenshot).

## Nicht-Ziele
- Keine Änderungen an `Portfolio.tsx` (funktioniert bereits).
- Kein Neugenerieren der Screenshots — die Dateien sind nachweislich intakt.
- Keine Styling-Änderungen am Card-Layout.