## Ziel
Im Admin → „Kostenlose Vorschau" gibt es einen **globalen Countdown-Block** (analog zu „Plätze & Verknappung Global"), der für alle Landingpages gilt. Die bisherige seiten-spezifische Countdown-Sektion wird entfernt. Zusätzlich wird der Bug behoben, dass auf `/kostenlose-vorschau` täglich „1 Tag …" steht.

## Ursache des Bugs
`src/pages/KostenloseVorschauV2.tsx` ignoriert die in der DB gepflegten Countdown-Felder. `getEndOfMonth()` liefert dort `Date.now() + 47 h 59 min` und der `<Countdown>` wird mit hartem `mode="end_of_month"` gerendert → bei jedem Seitenaufruf wieder „1 Tag 23 Std 59 Min", deshalb wirkt es statisch.

## Umsetzung

### 1. Globaler Countdown im Admin
`src/components/admin/AdminVorschauTab.tsx`

- Neuer Block **„Countdown (Global)"** direkt unter „Plätze & Verknappung Global". Felder:
  - **Modus**: `Monatsende` | `Fester Zeitpunkt`
  - **Ziel-Zeitpunkt** (nur bei `fixed_date`): datetime-local
  - **Label über dem Countdown** (Text)
  - **Anzeigen auf der Seite** (Switch)
  - Speichern-Button „Globalen Countdown speichern" → schreibt `countdown_mode`, `countdown_target`, `countdown_label`, `show_countdown` auf die Zeile `vorschau_settings.page_key = 'global'`.
- Bestehender Countdown-Block in der per-Seite-Sektion wird **entfernt**.

### 2. Globale Werte ausspielen
`src/hooks/useVorschauSettings.ts`

- Das `global`-Select erweitert um `countdown_mode, countdown_target, countdown_label, show_countdown`.
- Beim Merge überschreiben diese vier Felder die seiten-spezifischen Werte (gleiches Muster wie heute schon `total_slots`/`taken_slots`).

### 3. Countdown auf den Landingpages korrekt rendern
`src/pages/KostenloseVorschauV2.tsx`, `src/pages/KostenloseVorschau2.tsx`

- `getEndOfMonth()` liefert wieder den **echten Monatsletzten 23:59:59 lokal** (`new Date(y, m+1, 0, 23, 59, 59)`).
- `useCountdown` nutzt die aus `settings` durchgereichten `countdown_mode` + `countdown_target` (V2 ruft `<Countdown>` aktuell ohne `targetISO` auf – wird angepasst).
- Label kommt aus `settings.countdown_label`, Sichtbarkeit aus `settings.show_countdown`.

### 4. Keine Schemaänderung
Spalten `countdown_mode`, `countdown_target`, `countdown_label`, `show_countdown` existieren bereits in `vorschau_settings`. Es ist nur ein einmaliges `UPDATE` auf die `global`-Zeile nötig, damit sinnvolle Defaults gesetzt sind (Modus `end_of_month`, Label „Aktion endet in:", `show_countdown = true`).

## Nicht angefasst
- Slot-/Verfügbarkeits-Logik, Edge Functions, Portfolio.
- Andere Seiten als die beiden Vorschau-Landingpages.
