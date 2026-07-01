## Ziel
Behebe zwei UI-Bugs in `src/components/ChatAssistant.tsx` – keine anderen Dateien oder Logik ändern.

## Änderungen

### Bug 1 – Portal-Rendering (fixed-Position korrigieren)
- **Import**: `import { createPortal } from "react-dom";` hinzufügen.
- **Wrapper**: Den gesamten bisherigen `return (...)`-Inhalt in `createPortal(<>{...}</>, document.body)` umschließen.
- **Panel-Container**: Am `<div role="dialog">` (Panel-Container) das Attribut `data-apple-skip` ergänzen, damit Apple-Mode-Hover-Transforms nicht greifen.

### Bug 2 – Button + Maskottchen größer
- **Floating-Button**: Klassen `w-[52px] h-[52px] md:w-[56px] md:h-[56px]` → `w-16 h-16 md:w-[68px] md:h-[68px]`.
- **Maskottchen-Image im Button**: Klassen `w-[72%] h-[72%]` → `w-[88%] h-[88%]`.

## Nicht in Scope
- Keine Änderungen an Edge Functions, Stripe, Pixel, Kundenportal oder anderer Business-Logik.
- Keine Änderungen an anderen Komponenten oder Seiten.

## Erfolgskriterium
- Build bleibt grün (Lint ≤ Baseline).
- Widget-Button und Panel rendern korrekt per Portal in `document.body`.
- Button und Maskottchen sind sichtbar größer.