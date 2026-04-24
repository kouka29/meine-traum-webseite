# Warteliste-Modus, wenn alle Plätze vergeben sind

Ja, genau – wenn `taken_slots >= total_slots`, soll der Funnel **nicht geschlossen** werden. Stattdessen läuft derselbe Flow weiter, aber visuell + textlich als **Warteliste für den nächsten Monat** umgelabelt. Der Lead wird mit einem Marker `is_waitlist = true` gespeichert, blockiert keinen Platz und du siehst ihn im Admin separat.

## Was sich für den Besucher ändert (nur wenn ausgebucht)

| Element | Normal (Plätze frei) | Ausgebucht (Warteliste-Modus) |
|---|---|---|
| Hero-Badge | "Nur noch 1 von 5 Plätzen im April verfügbar" | "Alle Plätze im April vergeben – sichere dir jetzt einen Platz für Mai" |
| Hero-CTA | "Jetzt kostenlose Vorschau sichern" | "Jetzt für Mai vormerken lassen" |
| Slot-Anzeige im Funnel | "1 frei" | "Warteliste – Mai" Badge |
| Termin-Schritt | Buchung für aktuellen Monat | Hinweis: "Termin im Mai – wir melden uns sobald die Plätze freigeschaltet sind" |
| Final-CTA | "Jetzt letzten Platz sichern" | "Jetzt auf die Mai-Warteliste" |
| Bestätigungs-Screen | "Danke {name}, wir melden uns telefonisch…" | "Danke {name}, du stehst auf der Warteliste für Mai. Sobald die Plätze freigeschaltet sind, melden wir uns zuerst bei dir." |

Funktional bleibt alles gleich – Felder, Reihenfolge, Termin-Auswahl. Nur Texte + ein Banner oben am Funnel-Container, plus ein Flag im Lead.

## Was sich im Admin ändert

- Neue Spalte/Filter: **Warteliste** (zusätzlich zu Neu / Qualifiziert / Abgelehnt / Kunde)
- Lead-Karte zeigt deutlich Badge "📋 Warteliste – nächster Monat"
- Im Filter "Warteliste" siehst du alle Vormerkungen, die du am Monatsanfang abarbeiten kannst
- Beim manuellen Qualifizieren eines Warteliste-Leads wird – wie bisher – `taken_slots` erhöht und `is_waitlist` auf `false` gesetzt (Platz wird "echt" vergeben)

## Datenbank

```sql
ALTER TABLE leads
  ADD COLUMN is_waitlist boolean NOT NULL DEFAULT false;
```

Der nächste Monat wird **clientseitig berechnet** (kein extra Schema nötig): aktueller Monat + 1 in Deutsch (z. B. "Mai"). Falls du später einen festen "Nächster-Monat-Label" pflegen willst, können wir das in `vorschau_settings` als `next_month_label` ergänzen – ich würde aber erstmal mit der automatischen Berechnung starten.

## Code-Änderungen

**`src/pages/KostenloseVorschau2.tsx`**
- `const isWaitlistMode = remainingSlots <= 0;` ableiten
- Hero-Badge / CTA-Label / Final-CTA / Funnel-Header / Erfolgsbildschirm konditional rendern
- Beim Lead-Insert: wenn `isWaitlistMode` → `is_waitlist: true` mitschicken
- Banner oben im Funnel: "🗓️ April ist ausgebucht – du sicherst dir jetzt einen Platz für **{nächster Monat}**"

**`src/pages/AdminLeads.tsx`**
- Filter-Tab "Warteliste" hinzufügen
- Badge auf Lead-Karte
- "Platz reservieren"-Button setzt `is_waitlist = false` zusätzlich zu Status `qualified` und Slot-Increment

**`supabase/functions/admin-leads/index.ts`**
- `update-status`-Action erweitern, sodass `is_waitlist` mitgesetzt werden kann

**RLS**
- Bestehende Insert-Policy auf `leads` erlaubt zusätzliche Spalten ohne Änderung. Kein Update nötig.

## Was du danach hast

1. Funnel funktioniert auch bei "ausgebucht" weiter und sammelt qualifizierte Vormerkungen statt Besucher zu verlieren
2. Klare ehrliche Kommunikation: niemand glaubt, er bekomme noch im April einen Platz
3. Du behältst volle Kontrolle: Warteliste-Leads blockieren nichts, du qualifizierst am Monatsanfang manuell
4. Optionaler nächster Schritt (auf Wunsch): Auto-Mail "Du bist auf der Warteliste für Mai" beim Eintrag
