## Ziel
Das Testimonials-Karussell (`src/components/IndexTestimonials.tsx`) soll nicht mehr sichtbar zum Anfang zurückspringen, sondern in einer echten Endlosschleife laufen – als würde sich der Stream der Karten unendlich weiterdrehen.

## Aktueller Zustand
- Eigene Implementierung mit `translateX` und `setCurrent(0)` beim Erreichen des Endes
- Beim Reset von letztem Index zurück auf 0 entsteht ein sichtbarer Rück-Sprung (mit Animation rückwärts durch alle Karten)
- Auto-Advance alle 4 Sekunden

## Lösungsansatz: Geklonte Karten + nahtloser Reset

Klassisches Infinite-Loop-Pattern ohne neue Library:

1. **Karten-Array verdoppeln** beim Rendern: `[...testimonials, ...testimonials]` – die zweite Hälfte dient als "Vorschau" der ersten beim Weiterscrollen über das Ende hinaus.
2. **Weiterzählen über `testimonials.length` hinaus erlauben.** `next()` erhöht `current` einfach um 1 (kein Reset mehr).
3. **Nahtloser Reset:** Sobald `current === testimonials.length` erreicht ist und die Transition abgeschlossen ist (`onTransitionEnd`), wird die CSS-Transition kurz deaktiviert und `current` auf `0` zurückgesetzt. Da Position 0 und Position `testimonials.length` visuell identisch sind (gleiche Karten), ist der Sprung unsichtbar. Danach Transition wieder aktivieren.
4. **`prev()` analog:** Bei `current < 0` ohne Transition auf `testimonials.length - 1` springen.
5. **Pagination-Dots:** unverändert auf `current % testimonials.length` mappen.

### Technische Details
- Neuer State `enableTransition: boolean`, wird vor dem Reset auf `false` gesetzt, im nächsten `requestAnimationFrame` wieder auf `true`.
- `onTransitionEnd`-Handler am Flex-Container für den Reset-Trigger.
- `visibleCount`-Logik bleibt unverändert, aber `maxIndex` entfällt – ersetzt durch fortlaufenden Index.
- Auto-Advance-Interval und Hover-Pause (falls vorhanden) bleiben gleich.

## Scope
- Nur `src/components/IndexTestimonials.tsx` wird angepasst.
- Keine Änderung am visuellen Design (Aurora-Hintergrund, Card-Hover bleiben).
- Keine neuen Dependencies.
