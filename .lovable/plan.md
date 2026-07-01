## Befund

Das ausgewählte Formular „Jetzt kostenlos prüfen lassen“ auf `/lp/gesetz` nutzt aktuell **nicht** die zentrale Lead-Benachrichtigung, sondern nur `submitVorschauAnfrage()`.

Dadurch passiert beim Absenden nur Folgendes:
- Eintrag landet in der Datenbank-Tabelle `vorschau_anfragen`.
- Es wird **keine** `notify-lead` Backend-Funktion aufgerufen.
- Deshalb kommt für dieses Formular **keine Telegram-Nachricht** an.

Ich habe gesehen, dass deine Tests dort tatsächlich gespeichert wurden, aber nicht in der normalen Lead-Tabelle bzw. Telegram-Pipeline auftauchen.

## Plan

1. **Formular `/lp/gesetz` korrekt anbinden**
   - In `src/pages/lp/Gesetz.tsx` zusätzlich `submitLead` importieren.
   - Nach erfolgreichem `submitVorschauAnfrage()` die zentrale Telegram-/Lead-Funktion `submitLead()` aufrufen.

2. **Payload sauber mappen**
   - Name → `name`
   - Telefon → `phone`
   - E-Mail → `email`
   - Firmenname + Webseiten-URL + Grund in `message`
   - CTA z. B. `gesetz_kostenlos_pruefen`
   - Dadurch kommt in Telegram klar an, dass es vom Formular `/lp/gesetz` stammt.

3. **Erfolg nicht mehr nur an Vorschau-Speicherung koppeln**
   - Die Datenbank-Speicherung in `vorschau_anfragen` bleibt bestehen.
   - Zusätzlich wird die zentrale Lead-Benachrichtigung ausgelöst.
   - Falls Telegram/Lead-Funktion fehlschlägt, soll der Nutzer nicht fälschlich komplett im Dunkeln bleiben; ich setze eine klare Fehlermeldung oder blockiere Erfolg nur dann, wenn die zentrale Lead-Übergabe nicht klappt.

4. **Kurz verifizieren**
   - Prüfen, dass die Komponente kompiliert.
   - Danach kann das Formular erneut getestet werden; es sollte dann über denselben Telegram-Pfad laufen wie die anderen funktionierenden Formulare.