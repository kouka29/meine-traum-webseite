Task: Remove raw placeholder tokens from visible user-facing strings across 18 files. Only rewrite quoted/marketing text that contains bracketed placeholders like [Stadt], [Region], [Ort], [Beruf], [Thema], [Fachgebiet], [PLZ]. Never touch code brackets (React hooks, arrays, destructuring).

## Affected files and occurrences

1. **src/components/PageMeta.tsx** (1)
   - `/elektriker` description: `'Elektriker [Stadt]'` → `'Elektriker' in Deiner Stadt`

2. **src/pages/WebdesignAerzte.tsx** (1)
   - Feature card desc: `"Arzt [Stadt]"` → `"Arzt in Deiner Stadt"`

3. **src/pages/WebdesignCoaches.tsx** (2)
   - Feature card desc: `"Coach [Thema] [Stadt]"` and `"Berater für [Thema]"` → generic natural phrasing (e.g. `"Coach für Dein Thema in Deiner Stadt"`, `"Berater für Dein Thema"`)

4. **src/pages/WebdesignImmobilienmakler.tsx** (1)
   - Feature card desc: `"Immobilienmakler [Stadt]"` → `"Immobilienmakler in Deiner Stadt"`

5. **src/pages/WebdesignSHK.tsx** (1)
   - Feature card desc: `"Heizungsbauer [Stadt]"` → `"Heizungsbauer in Deiner Stadt"`

6. **src/pages/branchen/AutohaeuserHub.tsx** (1)
   - `heroSub`: `'Werkstatt [Stadt]'` → `'Werkstatt in Deiner Stadt'`

7. **src/pages/branchen/EinzelhandelHub.tsx** (1)
   - `heroSub`: `'Geschäft [Stadt]'` → `'Geschäft in Deiner Stadt'`

8. **src/pages/branchen/FitnessHub.tsx** (1)
   - `heroSub`: `'Fitnessstudio [Stadt]'` and `'Yoga in der Nähe'` → `'Fitnessstudio in Deiner Stadt'` and `'Yoga in Deiner Nähe'`

9. **src/pages/branchen/FloristenHub.tsx** (2)
   - `heroSub`: `'Florist [Stadt]'` → `'Florist in Deiner Stadt'`
   - `painPoints[2].description`: `'Blumen Lieferung [Stadt]'` → `'Blumen Lieferung in Deiner Stadt'`

10. **src/pages/branchen/FriseureHub.tsx** (1)
    - `painPoints[3].description`: `'Friseur [Stadt]'` → `'Friseur in Deiner Stadt'`

11. **src/pages/branchen/GartenbauHub.tsx** (1)
    - `heroSub`: `'Gartenbauer [Stadt]'` → `'Gartenbauer in Deiner Stadt'`

12. **src/pages/branchen/GastronomieHub.tsx** (2)
    - `heroSub`: `'Restaurant [Stadt]'` → `'Restaurant in Deiner Stadt'`
    - `features[4].description`: `'Italiener in [Stadt]'` → `'Italiener in Deiner Stadt'`

13. **src/pages/branchen/KanzleienHub.tsx** (1)
    - `heroSub`: `'Anwalt [Stadt] [Fachgebiet]'` → `'Anwalt in Deiner Stadt für Dein Fachgebiet'`

14. **src/pages/branchen/PhysioHub.tsx** (1)
    - `heroSub`: `'Physiotherapie [Stadt]'` → `'Physiotherapie in Deiner Stadt'`

15. **src/pages/branchen/ReinigungHub.tsx** (1)
    - `heroSub`: `'Gebäudereinigung [Stadt]'` → `'Gebäudereinigung in Deiner Stadt'`

16. **src/pages/branchen/SchreinerHub.tsx** (1)
    - `heroSub`: `'Schreiner [Stadt]'` → `'Schreiner in Deiner Stadt'`

17. **src/pages/branchen/TieraerzteHub.tsx** (1)
    - `heroSub`: `'Tierarzt [Stadt]'` → `'Tierarzt in Deiner Stadt'`

18. **src/pages/branchen/ZahnaerzteHub.tsx** (1)
    - `heroSub`: `'Zahnarzt [Stadt]'` → `'Zahnarzt in Deiner Stadt'`

## Rule for every rewrite
- Remove square brackets and the placeholder word inside.
- Reformulate naturally and generically ("in Deiner Stadt", "in Deiner Region", "in Deiner Nähe", "für Dein Thema", etc.).
- Preserve exact surrounding punctuation, casing, and sentence meaning.
- Do not change any other text, numbers, or code.

## Verification step
- Run `rg '\[Stadt\]|\[Region\]|\[Ort\]|\[Beruf\]|\[Thema\]|\[Fachgebiet\]|\[PLZ\]' src/components/PageMeta.tsx src/pages/WebdesignAerzte.tsx src/pages/WebdesignCoaches.tsx src/pages/WebdesignImmobilienmakler.tsx src/pages/WebdesignSHK.tsx src/pages/branchen/` to confirm zero matches.
- Run `tsc --noEmit` to confirm build stays green.