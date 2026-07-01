## Plan: Platzhalter-Tags aus Trade-Texten entfernen

### Ziel
Alle rohen Platzhalter (`[Stadt]`, `[Region]`, `[Ort]`, `[Beruf]`, `[PLZ]`) aus sichtbaren Texten in `src/pages/trade/**` und `src/components/trade/**` entfernen. Texte natürlich + generisch umformulieren, Bedeutung erhalten.

### Befund (8 Vorkommen in 4 Dateien)

**1. `src/pages/trade/SanitaerHub.tsx`** — 2 Vorkommen
- Z.20: `"Eine eigene Notfall-Seite die bei 'Rohrbruch [Stadt]' rankt..."` → "Eine eigene Notfall-Seite die bei Suchen wie 'Rohrbruch' in Deiner Stadt rankt..."
- Z.23: `"Optimiert für 'Sanitär [Stadt]', 'Heizung [Stadt]', 'Rohrbruch [Stadt]'"` → "Optimiert für lokale Suchen wie 'Sanitär', 'Heizung', 'Rohrbruch' in Deiner Stadt"

**2. `src/pages/trade/HandwerkerLeistungen.tsx`** — 1 Vorkommen
- Z.8: `"wenn sie '[Beruf] [Stadt]' googeln"` → "wenn sie nach Deinem Gewerk in Deiner Stadt googeln"

**3. `src/pages/trade/DachdeckerHub.tsx`** — 3 Vorkommen
- Z.12: `"Kunden 'Dachdecker [Stadt]'"` → "Kunden nach 'Dachdecker' in Deiner Stadt"
- Z.20: `"bei 'Sturmschaden Dach [Stadt]' rankt"` → "bei Suchen wie 'Sturmschaden Dach' in Deiner Stadt rankt"
- Z.23: `"für 'Dachdecker [Stadt]' und 'Dachsanierung [Region]'"` → "für lokale Suchen wie 'Dachdecker' und 'Dachsanierung' in Deiner Region"

**4. `src/pages/trade/ElektrikerHub.tsx`** — 2 Vorkommen
- Z.8: `"Kunden suchen 'Elektriker [Stadt]'"` → "Kunden suchen nach 'Elektriker' in Deiner Stadt"
- Z.20: `"nachts 'Elektriker Notfall [Stadt]'"` → "nachts nach 'Elektriker Notfall' in Deiner Stadt"

### Abgrenzung (Tabu)
- Keine Änderungen an Supabase, Stripe, Pixel, Kundenportal.
- Keine anderen Texte, Zahlen, Layouts oder Logik anfassen.

### Validierung
- `rg` erneut laufen lassen — 0 Treffer.
- `tsc --noEmit` muss grün bleiben.
