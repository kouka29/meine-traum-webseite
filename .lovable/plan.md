## Problem
Die Carousel-Pfeile (`CarouselPrevious` / `CarouselNext`) in `src/components/ui/carousel.tsx` sind mit `-left-12` / `-right-12` absolut zum Carousel-Container positioniert. In `src/components/IndexPortfolio.tsx` ist der Carousel-Container auf `max-w-6xl mx-auto` begrenzt, sodass die Pfeile bei manchen Viewports abgeschnitten werden oder im Padding statt klar neben den sichtbaren Karten stehen.

## Lösung
1. In `src/components/IndexPortfolio.tsx` den Carousel-Container so anpassen, dass die Karten mit ausreichend Platz für die Pfeile dargestellt werden (z. B. `max-w-[72rem]` oder Container-Padding verringern).
2. Die absoluten Positionierungsklassen der Pfeile in `carousel.tsx` prüfen und ggf. von `-left-12 / -right-12` auf `left-2 / right-2` (innerhalb des sichtbaren Bereichs) oder einen Wert justieren, der garantiert links/rechts der Karten sichtbar ist.
3. Sicherstellen, dass die Pfeile auf Desktop sichtbar bleiben und nicht vom Viewport abgeschnitten werden.

## Dateien
- `src/components/ui/carousel.tsx`
- `src/components/IndexPortfolio.tsx`