## Problem

Im Funnel auf `/kostenlose-vorschau` werden Auswahl-Kacheln (Branche, Webseite-Status, Ziel, Dringlichkeit) beim Anklicken komplett weiß — Text und Icon verschwinden.

**Ursache:** In `src/pages/KostenloseVorschauV2.tsx` Zeile 351 hat die `TileButton`-Klasse sowohl `bg-card` als auch `data-[selected=true]:bg-primary`. Wenn ausgewählt, wird der Text per `text-primary-foreground` auf weiß gesetzt — aber der lila Primary-Hintergrund schlägt in einigen Render-Pfaden nicht durch (Tailwind Source-Order / globales `apple-mode` CSS für `[class*="bg-primary"]`). Ergebnis: weißer Text auf weißer Card.

## Fix

Eine einzige Datei, eine Komponente (`TileButton` in `src/pages/KostenloseVorschauV2.tsx`):

1. **Klassenliste in zwei Zustände trennen** statt `bg-card` + Override mit data-attribute. Per Template-Literal je nach `selected` entweder `bg-card text-foreground` oder `bg-primary text-primary-foreground border-primary shadow-lg` anwenden — keine Kollision mehr.
2. Innen-Icon-Container und Icon ebenfalls auf `selected`-Prop umschalten (statt `group-data-[selected=true]:…`), damit Icon + Check garantiert sichtbar bleiben.
3. Span-Label bekommt explizit `text-inherit` — Verhalten bleibt, aber kein Vererbungsproblem mehr.

Kein anderer Funnel-Code, kein State, keine sonstigen Buttons werden angefasst. Die anderen vier CTA-Buttons im Funnel (`Weiter`, `Zurück`) nutzen shadcn `<Button>` und sind nicht betroffen.

## Verifikation

- Step 1 (Branche): jede Kachel beim Klick → lila Hintergrund, weißer Text + Check sichtbar.
- Step 2 (Webseite?): selektierte Option bleibt 200 ms sichtbar bevor `next()` triggert.
- Step 3 (Ziele, Mehrfachauswahl): mehrere lila Kacheln sichtbar.
- Step 4 (Dringlichkeit): wie Step 2.
- Nicht-selektierte Kacheln unverändert (weiße Card, Hover-Lift).
