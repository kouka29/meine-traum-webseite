## Status

Keine Code-Änderung nötig. Die Screenshot-Pipeline cached bereits korrekt:

- **Storage:** `portfolio-images/auto/v5/<key>.jpg` mit `cacheControl: 31536000` (1 Jahr).
- **Datenbank:** `portfolio_projects.screenshot_url` hält die Public-URL persistent.
- **Edge Function `portfolio-screenshot`:** prüft vor jedem Render, ob die Datei im Bucket existiert. Wenn ja → sofort Cache-URL zurück, kein Microlink-Call. Nur `force: true` (Admin-Button) rendert wirklich neu.
- **Portfolio-Seite:** lädt die Projekte aus `portfolioCache.ts` (5 min SessionStorage) und rendert direkt `image_url` oder `screenshot_url` — kein Function-Call beim Anzeigen.

## Auslöser für „neu rendern" (nur diese drei)

1. Admin-Button **„Screenshot neu generieren"** pro Projekt.
2. Admin-Button **„Fehlende Screenshots erzeugen"** (Backfill, nur leere Zeilen).
3. Storage-Pfad-Bump in der Edge Function (z. B. `auto/v5` → `auto/v6`) — einmaliges Neu-Rendern pro Projekt nach dem Bump.

## Nichts zu tun

Plan wird auf Wunsch des Users nicht implementiert — es bleibt beim aktuellen Verhalten.
