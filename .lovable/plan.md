## Ziel
Karussell-Pfeile auf den Vorschau-Demo-Seiten entfernen (analog zur Startseite).

## Änderungen

**`src/pages/KostenloseVorschau2.tsx`**
- Block Zeilen 1637–1642 entfernen (`CarouselPrevious` / `CarouselNext` Demos-Slider)
- Block Zeilen 1692–1697 entfernen (`CarouselPrevious` / `CarouselNext` Testimonials-Slider)
- Unbenutzte Imports `CarouselPrevious`, `CarouselNext` aufräumen

**`src/pages/KostenloseVorschauV2.tsx`**
- Block Zeilen 1813–1816 entfernen (Demos-Slider)
- Block Zeilen 1870–1873 entfernen (Testimonials-Slider)
- Unbenutzte Imports `CarouselPrevious`, `CarouselNext` aufräumen

Autoplay/Dots bleiben unverändert — Slider laufen automatisch weiter.