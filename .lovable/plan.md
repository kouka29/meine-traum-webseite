Änderungen ausschließlich in `src/components/ChatAssistant.tsx` am Floating-Button (`.mtw-fab` CSS-Regel bleibt unverändert):

1. Inline-Style `style={{ background: BRAND_GRADIENT }}` am `<button>` entfernen.
2. Kreis-Optik-Klassen entfernen: `"rounded-full"`, `"shadow-lg"`, `"hover:shadow-xl"`, `"transition-shadow"`. Behalten: `"flex items-center justify-center"`. Hinzufügen: `"hover:scale-105 transition-transform"`.
3. Button-Größe um ~30 % erhöhen: `"w-16 h-16 md:w-[68px] md:h-[68px]"` → `"w-[84px] h-[84px] md:w-[92px] md:h-[92px]"`.
4. Maskottchen-Img füllt den Button: `"w-[88%] h-[88%]"` → `"w-full h-full"`. Zusätzlich `drop-shadow-[0_4px_12px_rgba(0,0,0,0.20)]` auf dem `<img>`.
5. MessageCircle-Badge (absolute `-top-1 -right-1 bg-white ...`) komplett entfernen.

Build grün halten. Tabu: Supabase/Stripe/Pixel/Kundenportal.