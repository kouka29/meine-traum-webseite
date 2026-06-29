## Status heute
Aktuell nutzt die KI-Generierung **nur** Titel, Kategorie und Ergebnis aus dem Admin-Formular. Die echte Website (`external_url`) wird **nicht** besucht. Beschreibungen sind dadurch generisch und nicht inhaltsbezogen.

## Ziel
Wenn im Projekt eine `external_url` hinterlegt ist, holt die Edge Function den tatsächlichen Seiteninhalt und übergibt ihn der KI als Faktenbasis. So entsteht eine echte, projektspezifische Beschreibung (z. B. tatsächliche Leistungen, Region, USPs).

## Backend — `supabase/functions/generate-portfolio-description/index.ts`
1. Input erweitern: zusätzlich `url?: string` akzeptieren (vom Admin als `external_url` mitgesendet).
2. Wenn `url` vorhanden ist:
   - Website abrufen mit `fetch(url, { redirect: "follow", signal: AbortSignal.timeout(8000) })` + realistischem User-Agent.
   - HTML säubern: `<script>`/`<style>`/`<noscript>` entfernen, Tags strippen, Whitespace normalisieren, `<title>` und `<meta name="description">` separat extrahieren.
   - Auf ~4.000 Zeichen kürzen (reicht für Above-the-fold + Leistungen, hält Tokenkosten klein).
   - Fehler (Timeout, 4xx/5xx, leerer Body) → still ignorieren und ohne Website-Kontext weitergenerieren.
3. User-Prompt erweitern um Block:
   ```
   Echte Website-Inhalte (Faktenbasis, NICHT wörtlich zitieren):
   Titel: …
   Meta: …
   Text: …
   ```
4. System-Prompt um eine Regel ergänzen: „Wenn Website-Inhalte vorliegen, beziehe dich auf konkrete, dort genannte Leistungen/Branche/Region statt allgemeiner Floskeln. Keine wörtlichen Zitate, keine Markennamen-Wiederholung."
5. Antwortformat & Fehlerhandling (401/402/429) bleiben unverändert.

## Frontend — `src/pages/AdminLeads.tsx`
- Im `supabase.functions.invoke("generate-portfolio-description", …)`-Aufruf zusätzlich `url: projectForm.external_url` mitsenden.
- Button-Label/Tooltip kurz ergänzen: „nutzt Website-Inhalt, wenn URL hinterlegt".
- Kein neuer State, keine UI-Umbauten.

## Nicht enthalten
- Kein Caching der gescrapten Inhalte (bei jedem Klick frisch).
- Kein Headless-Browser/Microlink — reines `fetch` + HTML-Strip reicht für statische Hero-/Leistungs-Inhalte. JS-only-SPAs werden bewusst nur best-effort abgedeckt; in dem Fall greift weiterhin der bisherige Titel/Kategorie/Ergebnis-Pfad.
- Keine Schema-/DB-Änderung.
