## Ziel
Das KI-Chat-Widget (Floating-Button + Panel) sitzt auf Mobilgeräten zu hoch am unteren Bildschirmrand. Der Abstand nach unten soll verringert werden, sodass das Maskottchen visuell tiefer platziert ist.

## Analyse
- In `src/components/ChatAssistant.tsx` sind die Positionen per Inline-`<style>` mit `!important` hart gesetzt.
- Aktueller Mobile-Wert (unter 768 px): `bottom: 6rem` (~96 px).
- Desktop-Wert (ab 768 px): `bottom: 1.25rem` (~20 px).
- `6rem` rückt das Widget sehr weit vom unteren Rand ab, was auf kleinen Viewports als „zu weit oben“ wirkt.

## Änderung
1. `.mtw-fab` – Mobile-Regel: `bottom: 6rem` → `bottom: 4rem` (~64 px).
2. `.mtw-panel` – Mobile-Regel: `bottom: 6rem` → `bottom: 4rem` (~64 px).
3. Desktop-Media-Queries bleiben unverändert (`bottom: 1.25rem`).
4. Keine weiteren Dateien oder Logik anfassen.

## Datei
- `src/components/ChatAssistant.tsx` (Zeile 422 + 424 im `<style>`-Block)