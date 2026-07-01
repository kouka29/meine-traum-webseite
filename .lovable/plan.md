## Ziel
Der KI-Assistent in `supabase/functions/chat-assistant/index.ts` gibt aktuell Platzhalter wie "[Link einfügen]" aus, weil ihm echte Infos fehlen. Der SYSTEM_PROMPT soll um einen Block mit echten Daten und einer strikten Regel gegen Platzhalter erweitert werden.

## Änderung
- **Datei:** `supabase/functions/chat-assistant/index.ts`
- **Aktion:** Innerhalb des `SYSTEM_PROMPT`-Template-Strings (nach dem bestehenden Textblock, vor dem abschließenden Backtick) den vom Nutzer vorgegebenen Block `"ECHTE SEITEN & INFOS ..."` + `"STRIKTE REGEL — KEINE PLATZHALTER ..."` einfügen.
- **Scope:** Nur dieser String-Block. Keine andere Logik, CORS, API-Calls oder Importe ändern.

## Validierung
- `bun run build` muss grün durchlaufen.
- Keine weiteren Dateien werden berührt.