## Ziel

Bestehende Seite `/kostenlose-vorschau` behält Design, Hero und alle Sektionen oberhalb des Funnels. Angepasst werden nur: Funnel-Fragen, Success-Screen, Warteliste-Modus, Backend-Felder. Wort „Bewerbung" wird überall im Funnel/Success entfernt und durch „Anfrage" / handlungsbasierte Formulierung ersetzt.

## 1. Funnel-Fragen (Datei: `src/pages/KostenloseVorschauV2.tsx`)

### 1a. Conditional URL-Feld
- In Schritt „Hast du aktuell eine Website?" (nutzt bereits `hasWebsite` mit 3 Optionen) unter den Karten ein `AnimatePresence`-Feld einblenden, sobald eine der beiden „Ja"-Optionen gewählt ist.
- Label „Link zu deiner aktuellen Website", `type="url"`, optional, Platzhalter `https://…`, gebunden an das bereits existierende `state.currentWebsite`. Bei Wechsel auf „Nein" nur ausblenden, Wert im State behalten.

### 1b. Neuer Schritt „Budget-Rahmen" vor Kontaktdaten
- Aktueller Ablauf ist 5 Schritte, Kontaktdaten sind Schritt 5. Neuer Schritt 5 = Budget, Kontaktdaten werden Schritt 6. Fortschritts-Anzeige und `next/prev`-Grenzen auf 6 anheben.
- Zwei State-Felder: `budgetModell: 'kaufen' | 'mieten' | 'unklar' | ''` und `budgetWert: string`.
- Stufe A: zwei große Karten (`TileButton`-Stil) für „Kaufen (Einmalzahlung)" und „Mieten (monatlich)". Darunter dezenter Textlink „Ich bin mir noch nicht sicher" → setzt `budgetModell='unklar'`, `budgetWert='unsicher'` und schaltet Weiter-Button frei.
- Stufe B: nach Auswahl von „kaufen" oder „mieten" erscheinen Chips (Grid 2 Spalten mobil, min. 48 px Touch-Target). Chip-Listen wie im Prompt (Kaufen: 6 Ranges + „Unsicher"; Mieten: 5 Ranges + „Unsicher"). Single-Select, speichert Label in `budgetWert`.
- Validierung: Weiter nur wenn `budgetModell` gesetzt und (`budgetModell==='unklar'` ODER `budgetWert` gesetzt).

### 1c. Hinweis-Box unter dem Formular
- Direkt nach `</form>` (noch innerhalb der `#formular`-Card) eine dezente Info-Zeile mit `Info`-Icon, `border-border`, `bg-muted/40`, Text max. 2 Zeilen: „Hinweis: Wir bauen jede Vorschau von Hand. Deshalb schauen wir kurz, ob's für dich und für uns passt. Details dazu bekommst du direkt nach dem Absenden." Keine Warn-Farben.

## 2. Success-Screen erweitern

Bestehender `SuccessScreen` bleibt, wird um drei Blöcke ergänzt (unterhalb der aktuellen zwei Karten):
- **„Warum wir manchmal Nein sagen"**: schlichte Section, Bullets mit dezentem `Check`-Icon, Text wie im Prompt, Abschluss-Zeile.
- **FAQ**: `shadcn Accordion` mit den 5 Items aus dem Prompt.
- **Sekundär-CTA**: Text-Link „Frage vorab? Schreib uns direkt auf WhatsApp" (nutzt `settings.phone_number`).
- Danke-Header umtexten: `„Danke, {firstName} — wir sind dran."` + neuer Sub-Text. Kein Auto-Scroll (bereits so).
- Warteliste-Variante: Danke-Text `„Danke, {firstName} — du stehst auf der Liste. Wir melden uns Anfang {nextMonthLabel}, sobald neue Plätze frei sind."` Die „Warum wir manchmal Nein sagen"-Section wird im Warteliste-Fall ausgeblendet (nicht sinnvoll), FAQ bleibt.
- Terminbuchungs-Karte (rechts) auf Warteliste-Fall bereits unterdrückt lassen.

## 3. Warteliste-Modus (bei 0 freien Plätzen)

- Wenn `remainingSlots <= 0`: aktuelle Logik zeigt weiterhin den vollen Funnel, nur mit anderen Texten. Neu: kompletter Multi-Step-Funnel wird durch **kompakten Warteliste-Funnel** ersetzt (an Ort und Stelle im DOM, kein Redirect).
- Header über dem Mini-Funnel: „🚫 Diesen Monat sind alle Vorschau-Plätze vergeben." + Sub-Text.
- Mini-Funnel: nur `firstName` (Pflicht), `email` (Pflicht), `phone` (optional mit WhatsApp-Hinweis), Datenschutz-Checkbox. Submit-Button „Auf die Warteliste".
- Insert in `leads` mit `is_waitlist=true`, `status='warteliste'`, `notes='waitlist'`. Danach gleicher (angepasster) Success-Screen.
- Wort „Bewerbung" in allen Hero-/Badge-Texten prüfen und ersetzen.

## 4. Backend

### 4a. Migration (neue Spalten in `leads`)
- `budget_modell text` (nullable)
- `budget_wert text` (nullable)
- `website_url` NICHT neu — bestehendes `current_website` wird weiterhin verwendet.
- `typ` NICHT neu — bestehendes `is_waitlist` bleibt; zusätzlich Status-Werte `'freigegeben'`, `'abgelehnt'`, `'warteliste'` sind bereits als `text` erlaubt (keine Enum-Änderung nötig).

### 4b. Platz-Zähler
- Neue clientseitige Abfrage beim Seitenladen (parallel zu `useVorschauSettings`): `select count(*) from leads where status='freigegeben' and created_at >= date_trunc('month', now())`. Ergebnis `belegt`.
- `PLAETZE_PRO_MONAT` als Konstante (Default 5) oben in `KostenloseVorschauV2.tsx`.
- `PLAETZE_FREI = Math.max(0, PLAETZE_PRO_MONAT - belegt)`. Fail-open: bei Query-Fehler `PLAETZE_FREI = PLAETZE_PRO_MONAT`.
- Der bestehende `isWaitlist`-Pfad (aktuell aus `vorschau_settings.taken_slots`) wird durch diesen Wert überschrieben; bestehende Slot-Anzeige-Texte im Hero bleiben, gefüttert mit dem neuen Wert.
- Damit `anon` das Zählen darf, RLS von `leads` prüfen und (falls nötig) eine SECURITY DEFINER-Funktion `public.count_freigegebene_leads_this_month()` mit `GRANT EXECUTE TO anon, authenticated` anlegen — keine Zeilendaten werden freigegeben, nur ein Integer.

### 4c. Submit-Handler
- In `handleSubmit` zusätzlich `budget_modell` und `budget_wert` in das Insert aufnehmen.
- Bestehenden `submitLead`-Aufruf (Telegram via `notify-lead`) um Zusatz-Info erweitern: Website-URL, Gewerk, Budget in die `message`-Zeile packen — genaues Format laut Prompt.
- Warteliste-Mini-Form eigener Submit-Handler mit denselben Notify-Kanälen, Payload: „⏳ WARTELISTE — /kostenlose-vorschau …".
- Doppel-Submit ist bereits per `submitting`-Flag blockiert; Fehler-Toast an neuen Text anpassen: „Da ist was schiefgelaufen — versuch's nochmal oder schreib uns auf WhatsApp".

## 5. Textbereinigung „Bewerbung"

Global auf `/kostenlose-vorschau` und deren Sub-Komponenten (`KostenloseVorschauV2.tsx`, ggf. gebundene Sektionen in `useVorschauSettings`-Daten): Vorkommen von „Bewerbung/bewerben" durch „Anfrage/anfragen" bzw. handlungsbasierte Formulierung ersetzen. DB-Inhalte (vorschau_settings) werden **nicht** angefasst — Hinweis an dich, falls dort ein Text „bewerben" enthält.

## 6. Design/Validierung

- Nur MTW-Design-System-Tokens, keine neuen Farben.
- Chips mit `min-h-12`, `text-sm font-semibold`, `rounded-xl`, `border-2`.
- URL-Validierung: leer erlaubt, sonst `new URL(v)` in try/catch — bei Fehler nur Hinweis, kein Blocker.
- Handy-Validierung DE: bestehende `submitLead`-Prüfung genügt.

## Offene Punkte

- **Chips als Default für Budget** (statt Slider) — implementiere ich so, außer du sagst „Slider bitte".
- **PLAETZE_PRO_MONAT = 5** wird als Konstante im File hardgecodet; änderbar per Edit.
- WhatsApp-Nummer wird aus `settings.phone_number` gezogen (bereits vorhanden).
- Bestehender „Terminbuchen"-Zweig im Success-Screen bleibt erhalten (nicht durch neuen Danke-Text ersetzt), damit User im Erfolgsfall weiterhin direkt einen Slot wählen kann. Sag Bescheid, wenn dieser Zweig entfernt werden soll.
