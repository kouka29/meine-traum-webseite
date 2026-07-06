## Problem

Auf `/kostenlose-vorschau` zeigen 4 Portfolio-Karten das Bild „This site can't be reached" statt der echten Website-Vorschau:

- Elektrotechnik Fretter
- CBI – Sanitär & Heizung
- ME-KA – Maler- & Estrich GmbH
- Pro Smart Store

## Ursache

Die Screenshots in der Datenbank sind veraltete `auto/v3/…jpg`-Dateien (das aktuelle Format ist `auto/v5/`). Zum Zeitpunkt der Aufnahme war die Ziel-Domain kurz nicht erreichbar, deshalb hat der Screenshot-Dienst (Microlink) die Chrome-Fehlerseite fotografiert und diese landete im Storage. Die Domains selbst funktionieren jetzt wieder (HTTP 200 geprüft), aber das falsche Bild bleibt gespeichert, bis wir es neu erzeugen.

## Fix

Die vier betroffenen Karten neu screenshotten und dabei den Cache zwingend überschreiben.

### Schritte

1. Für jedes der 4 Portfolio-Projekte die Edge-Funktion `portfolio-screenshot` mit `force: true` aufrufen (`projectId`, `key` = Projekt-ID, `url` aus DB). Die Funktion:
   - lädt einen neuen Screenshot von der jetzt erreichbaren Domain,
   - speichert ihn unter `auto/v5/<id>.jpg`,
   - aktualisiert `portfolio_projects.screenshot_url` + `screenshot_updated_at`.
2. Vorschau-Seite prüfen, dass alle 4 Karten die echte Website zeigen.

Kein Code-Change nötig – nur einmaliges Re-Generieren der Bilder über die bestehende Funktion.

### Optional (falls gewünscht, sonst weglassen)

Kleine Härtung in `supabase/functions/portfolio-screenshot/index.ts`: den heruntergeladenen Screenshot verwerfen, wenn er offensichtlich eine Browser-Fehlerseite ist (z. B. Response-Statuscheck der Ziel-URL vor dem Speichern via `fetch(url, {method:"HEAD"})`; nur bei 2xx speichern). Damit passiert dieses „stale error screenshot"-Problem nicht wieder.
