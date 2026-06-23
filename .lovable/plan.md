## Ziel
Hochgeladene Portfolio-Vorschaubilder werden in den Karten **komplett sichtbar** und **unverzerrt** angezeigt — egal ob quadratisch, breit oder hochformatig (Full-Page-Screenshot).

## Änderung – nur `src/pages/Portfolio.tsx`

Beide Bild-Container (Variante mit und ohne `external_url`) bekommen wieder ein festes Seitenverhältnis und das `<img>` wird mit `object-contain` eingepasst, statt das gesamte Layout in die Höhe zu ziehen.

**Container-Div:**
- Vorher: `relative overflow-hidden rounded-2xl bg-muted/30`
- Nachher: `aspect-[4/3] relative overflow-hidden rounded-2xl bg-muted/30`

**`<img>`-Klassen:**
- Vorher: `w-full h-auto rounded-lg`
- Nachher: `absolute inset-0 w-full h-full object-contain`

Dadurch:
- Hochformatige Screenshots werden komplett gezeigt, links/rechts entsteht eine kleine Randfläche in `bg-muted/30`.
- Querformate werden komplett gezeigt, oben/unten Randfläche.
- Nichts wird gestreckt, nichts gecroppt.

Alles andere bleibt unverändert (Supabase-Transform width=400/quality=72/webp, `srcSet`, `sizes`, `width=800 height=600` Attribute, das Result-Badge unten links, Hover-Overlay).

## Nicht angefasst
- `src/components/IndexPortfolio.tsx` und andere Komponenten
- Admin-Upload-Flow, Bucket, Bildquelle (`image_url`)
