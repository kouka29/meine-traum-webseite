## Plan: ChatAssistant Floating-Button Position Fix

### Context
Der Floating-Button in `src/components/ChatAssistant.tsx` verliert zur Laufzeit seine rechts-Positionierung (`right-5`), weil Tailwind-Klassen von anderem CSS überschrieben werden. Ziel ist, die Position per `!important`-CSS zu erzwingen.

### Änderungen (nur in `src/components/ChatAssistant.tsx`)

1. **CSS-Regeln im `<style>`-Block ergänzen** (Zeilen 416–422):
   - `.mtw-fab` und `.mtw-panel` mit `!important` für `position`, `right`, `left`, `bottom`, `z-index`, `width`, `max-width` definieren.
   - Mobile/Desktop-Unterscheidung via `@media(min-width:768px)`.

2. **Floating-Button**: Positionsklassen entfernen und durch `className="mtw-fab"` ersetzen. Visuelle Klassen (`rounded-full`, `shadow-lg`, `hover:shadow-xl`, `transition-shadow`, `flex items-center justify-center`, `w-16 h-16 md:w-[68px] md:h-[68px]`) und `style={{ background: BRAND_GRADIENT }}` bleiben erhalten.

3. **Panel-Container**: Positionsklassen entfernen und durch `className` mit `mtw-panel` ersetzen. Visuelle Klassen (`bg-background`, `border`, `border-border`, `shadow-2xl`, `flex`, `flex-col`, `overflow-hidden`, `max-h-[70vh]`, `rounded-2xl`) und `data-apple-skip` bleiben erhalten.

### Tabu
- Keine Änderungen an Supabase, Stripe, Pixel oder Kundenportal.

### Erfolgskriterium
- Build bleibt grün.
- Button und Panel behalten ihre Position auch bei CSS-Konflikten.