## Problem

Die Demo-Karten zeigen aktuell nur einen **Ausschnitt** der Full-Page-Screenshots: `aspect-video` + `object-cover` zwingt die hochformatigen Screenshots (z.B. 1280×4000+ px) in ein 16:9-Fenster und schneidet alles ober-/unterhalb ab. Auch der Hover-Scroll (`object-top → object-bottom`) zeigt immer nur einen schmalen Streifen, nie die ganze Seite gleichzeitig.

## Fix

In `src/pages/KostenloseVorschauV2.tsx` (Demo-`<img>`, Z. 1789–1800) die Bildklassen so umstellen, dass der komplette Screenshot ohne Crop und ohne Hover-Scroll sichtbar ist:

1. **Aspect-Ratio anheben**, damit ein hoher Screenshot nicht in 16:9 gepresst wird. `aspect-[3/4]` (Hochformat) zeigt deutlich mehr von der Seite und passt zu Full-Page-Screenshots.
2. **`object-contain`** statt `object-cover` — skaliert das gesamte Bild in den Rahmen, ohne irgendetwas wegzuschneiden.
3. **Hover-Scroll und `object-top` entfernen** — nicht mehr nötig, da die ganze Seite bereits sichtbar ist. Auch `motion-reduce`-Klassen weg.
4. **Hintergrund hinter dem Bild**: Letterbox-Streifen mit `bg-white` füllen (passt zum Browser-Mockup), damit `object-contain` keinen grauen Card-Rand zeigt.

Neue img-Klassen:
```
aspect-[3/4] w-full object-contain bg-white
```

Den Fallback-Block (Z. 1802) ebenfalls auf `aspect-[3/4]` setzen, damit Karten ohne Bild dieselbe Höhe haben und das Grid einheitlich bleibt.

Browser-Rahmen (Verlauf-Padding, Card, Ampel-Dots, Hover-Overlay mit „Live ansehen") und alle anderen Karten-Inhalte bleiben unverändert.

## Optional / Hinweis

Bei sehr hohen Screenshots (>2000 px) wird die Darstellung im 3:4-Frame ziemlich klein. Falls dir die Vorschau danach zu klein erscheint, wäre die Alternative ein noch höheres Verhältnis (`aspect-[2/3]` oder `aspect-[1/1.4]`) oder das Bild bei der Erzeugung in `generate-demo-screenshot` direkt als Above-the-Fold-Shot (Viewport-Höhe, nicht Full-Page) zu speichern. Beides nur auf Zuruf — der Fix oben bleibt rein visuell.

## Verifikation

`/kostenlose-vorschau` öffnen, Demo-Carousel prüfen: jede Karte zeigt den **kompletten** Screenshot der gemockten Webseite (Header bis Footer), nichts wird mehr beim Hover gescrollt, alle Karten gleich hoch, Browser-Rahmen mit Ampel-Dots unverändert.