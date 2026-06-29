## Problem

Der Hover-Scroll-Effekt auf den Portfolio-Karten (`/portfolio`) animiert `object-position` von `top` nach `bottom` über 9 s. Das ist nur sichtbar, wenn das Bild **höher** ist als der Karten-Container (`aspect-video`, 16:9). Sonst gibt es kein Overflow, das `object-cover` schneidet nichts ab — das Bild steht still.

Bei der letzten Optimierung der Edge Function `portfolio-screenshot` wurde aus Performance-Gründen `fullPage=false` zum Standard und der Viewport auf 1440×900 (also exakt 16:9) gesetzt. Dadurch erzeugen alle „neu generierten" Screenshots ein Bild im selben Seitenverhältnis wie der Karten-Frame → kein Scroll-Spielraum.

Manuell hochgeladene Bilder (`image_url`) sind weiterhin meist hoch genug, deswegen tritt der Bug nur bei „nachträglich neu generierten" Projekten auf.

## Fix

### 1. `supabase/functions/portfolio-screenshot/index.ts`
- Default `fullPage` auf **`true`** umstellen (vorher `false`). Damit liefert Microlink standardmäßig wieder einen langen Screenshot, der genug Höhe für den Hover-Scroll hat.
- Storage-Pfad auf `auto/v5/` bumpen, damit beim ersten Aufruf pro Projekt **automatisch** ein neuer Full-Page-Screenshot erzeugt wird (statt das alte 16:9-Bild aus `auto/v4/` aus dem Cache zu liefern).
- Im Retry-Pfad ebenfalls `fullPage: true` durchreichen (statt nur die übergebene Variable), damit auch der Fallback einen scrollbaren Screenshot produziert.
- Admin-Override „Vollständige Seite" bleibt erhalten — der Default wird nur umgedreht.

### 2. `src/pages/Portfolio.tsx` (defensiver Fallback)
- Nach dem `onLoad` der `<img>` prüfen, ob die natürliche Höhe (bezogen auf die gerenderte Breite) signifikant größer ist als die Container-Höhe. Wenn **nein** (z. B. weil ein altes `auto/v4`-Bild oder ein manuell hochgeladenes 16:9-Bild vorliegt), die Hover-Scroll-Klasse + Inline-Transition für diese eine Karte deaktivieren. So sieht der Hover bei „flachen" Bildern nicht mehr nach kaputter Animation aus, sondern wirkt einfach statisch.
- Keine Änderung am Mockup-Rahmen, an den restlichen Klassen oder am Reduced-Motion-Verhalten.

### 3. Kein DB-Change, keine Migration, keine UI-Texte verändert.

## Hinweis an den Nutzer
Damit der Fix bei bereits regenerierten Projekten greift, muss im Admin **einmal pro betroffenem Projekt** „Screenshot neu generieren" geklickt werden (oder der Backfill-Button). Der neue Pfad `auto/v5/` sorgt dafür, dass ohne `force` automatisch ein frisches Full-Page-Bild gerendert wird, sobald irgendwo ein leerer Cache-Eintrag liegt.
