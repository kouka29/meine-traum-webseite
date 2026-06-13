## Ziel
Die beiden Sections „Globale Vorschau-Plätze" und „Plätze (Verknappung)" im Admin-Tab `Kostenlose Vorschau` zu **einer einzigen Section** zusammenführen — mit manueller Eingabe **und** einem Auto-Zähl-Button.

## Neue, kombinierte Section: „Plätze & Verknappung"

```text
┌─ Plätze & Verknappung ──────────────────────────────────────┐
│                                                              │
│  Plätze gesamt          Davon vergeben          Verfügbar    │
│  [ 10 ]                 [ 5 ] [↻ Auto]          [ 5 Plätze ] │
│                                                              │
│  ⓘ Auto: zählt echte Anfragen aus der Datenbank             │
│     (Status „slot_assigned", aktueller Monat) und            │
│     überschreibt den manuellen Wert.                         │
│                                                              │
│  ☑ Plätze-Anzeige auf der Seite einblenden                   │
│                                                              │
│  Gilt für: ● Diese Seite (/kostenlose-vorschau)              │
│            ○ Global (alle Landingpages)                      │
└──────────────────────────────────────────────────────────────┘
```

## Verhalten

1. **„Plätze gesamt"** und **„Davon vergeben"** sind manuell editierbare Zahlen.
2. **Button „↻ Auto-Zählen"** neben „Davon vergeben":
   - ruft die echte Anzahl bestätigter Anfragen für den aktuellen Monat ab
   - trägt den Wert in das Feld ein
   - der Nutzer kann ihn danach noch von Hand anpassen
3. **„Verfügbar"** wird live aus `gesamt − vergeben` berechnet.
4. **Scope-Schalter** „Diese Seite / Global" entscheidet, ob die Werte für die ausgewählte Landingpage oder global gespeichert werden — ersetzt die bisherige doppelte UI.
5. **Toggle „Anzeige einblenden"** bleibt erhalten (pro Seite).

## Was wegfällt

- Separate Section „Globale Vorschau-Plätze" mit ihrem eigenen Speichern-Button → ersetzt durch den Scope-Schalter.
- Das Feld „Wird aus Anfragen gezählt" als reines Read-Only-Element → ersetzt durch den Auto-Button.

## Gibt es Nachteile?

- **Klarheit:** der Unterschied „echte Verknappung vs. kosmetische Anzeige" verschwimmt. Lösung: kleiner Hinweistext + sichtbarer Auto-Button.
- **Versehentliches Überschreiben:** Wenn jemand manuell einen Wert einträgt, weicht die Anzeige von der echten DB-Zahl ab. Mildernd: Auto-Button + optional ein kleines Warn-Icon, wenn manueller Wert ≠ DB-Wert.
- **Keine Datenmigration nötig** — Felder `total_slots` / `taken_slots` existieren bereits in `vorschau_settings` pro `page_key` (inkl. `global`).

## Technische Details

- Datei: `src/components/admin/AdminVorschauTab.tsx` — beide Sections durch eine neue ersetzen.
- Auto-Button ruft die bestehende Edge-Function `check-vorschau-availability` auf und schreibt `taken_slots = total - available` in `vorschau_settings` (für den aktiven `page_key` bzw. `global`).
- Speichern weiterhin über den vorhandenen „Einstellungen speichern"-Button am Ende der Seite — keine zusätzliche Backend-Änderung nötig.