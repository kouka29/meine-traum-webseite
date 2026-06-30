## Ursache

Im Home-Portfolio-Carousel werden nur die ersten 3 Bilder geladen (`loading="eager"` für `i < 3`), alle weiteren mit `loading="lazy"`. Embla rendert zwar alle Slides, schiebt sie aber per `translate3d(-9999px,…)` weit aus dem Viewport. Browser laden `loading="lazy"` Bilder erst, wenn der Container im Viewport intersected — bei transformierten Off-Screen-Slides passiert das nicht. Resultat: `naturalWidth = 0`, leere/kaputte Tiles ab Slide 4. Auf `/portfolio` greift dieser Bug nicht, weil die Bilder in einem normalen Grid liegen.

Verifiziert per Playwright: Home `complete:true` nur für Slides 1–3, ab Slide 4 alle `complete:false / nw:0`. Auf `/portfolio` dieselben URLs → alle `complete:true`.

## Fix

In `src/components/IndexPortfolio.tsx`:

1. `loading="eager"` für **alle** Carousel-Bilder setzen (max ~30 Projekte, vertretbar — Portfolio-Sektion liegt mid-page und der User scrollt typischerweise dorthin).
2. `decoding="async"` beibehalten, damit das Decoding nicht blockiert.
3. `fetchpriority="high"` weiterhin nur für die ersten 3 (LCP-Kandidaten der Sektion).

Damit verhalten sich Carousel und Grid identisch und alle Screenshots werden zuverlässig dargestellt.

## Betroffene Dateien

- `src/components/IndexPortfolio.tsx` — `loading` Attribut anpassen.

Keine weiteren Änderungen nötig (Edge Function, DB, Portfolio-Seite bleiben unberührt).
