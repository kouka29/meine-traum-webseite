## Lesbarkeit auf `/vorschau-start` fixen

### Ursache
Ich hatte im letzten Design-Pass `gradient-hero-bg` als Seiten-Background gesetzt. Dieses Token ist aber ein saturierter Vollton-Verlauf (`#8441E3 → #3488DF`) und nur für den Hero-Bereich mit weißem Text gedacht. Dadurch:
- Dunkler Text wird unlesbar (grau auf lila).
- Der Gradient-Text der H1 („Dein Termin steht") verschwindet komplett, weil der Farbverlauf des Textes fast identisch zum Hintergrund ist.
- Cards wirken bläulich getönt statt sauber weiß.

### Fix

**`src/pages/VorschauStart.tsx`**
- `gradient-hero-bg` → `gradient-subtle-bg` (pastelliger Hell-Hintergrund, exakt wie der Rest der Seite).

Damit erben alle Steps sofort den korrekten hellen Untergrund; Cards, Texte, Gradient-Headlines und Buttons sind wieder lesbar. Keine weiteren Änderungen an Steps nötig.

### Betroffene Datei
- `src/pages/VorschauStart.tsx` (eine Class-Änderung)