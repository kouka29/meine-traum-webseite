## Ziel
Im Admin eine Screenshot-Vorschau pro Portfolio-Projekt mit einem "neu generieren"-Button (force) und Cache-Busting via Timestamp. Die öffentliche Portfolio-Seite bleibt unverändert (nutzt nur gespeicherte URLs).

## 1. Datenbank-Migration
- `portfolio_projects.screenshot_url` existiert bereits.
- Spalte hinzufügen: `screenshot_updated_at timestamptz`.

## 2. Edge Function `portfolio-screenshot`
- Body um optionales `force: boolean` erweitern.
- Bei `force === true`: Cache-Check (storage.list) überspringen → immer Microlink aufrufen, `upsert: true` im Bucket (bereits gesetzt), und beim DB-Update zusätzlich `screenshot_updated_at = new Date().toISOString()` schreiben.
- Bei Cache-Hit (force false): wenn `projectId` vorhanden und `screenshot_updated_at` in DB leer, setze es auf jetzt (damit Vorschau einen Timestamp hat).
- Hilfsfunktion `writeScreenshotUrl` erweitern um `screenshot_updated_at` mitzuschreiben.
- Re-deploy via supabase--deploy_edge_functions.

## 3. admin-leads Function
- `portfolio-list` Select um `screenshot_updated_at` ergänzen.
- `portfolio-update` darf weiterhin keine `screenshot_*`-Felder vom Client annehmen (read-only).

## 4. Admin-UI (`src/pages/AdminLeads.tsx`)
- `PortfolioProject`-Type um `screenshot_updated_at: string | null` ergänzen.
- In der Projekt-Listenzeile die kleine `w-20 h-15`-Thumbnail durch eine größere Vorschau ersetzen:
  - `aspect-video w-[200px]` Block links neben Infos
  - Quelle: `image_url` falls vorhanden, sonst `screenshot_url` mit `?v=${encodeURIComponent(screenshot_updated_at || '')}` als Cache-Buster.
  - Darunter dezent: `zuletzt generiert: <formatiertes Datum>` (nur wenn vorhanden, sonst „noch nicht generiert").
- Neuer Action-Button "Screenshot neu generieren" (Icon `RefreshCw`) pro Projekt, nur sichtbar wenn `external_url` gesetzt:
  - Lokaler `regeneratingId`-State für Spinner pro Zeile.
  - Ruft `supabase.functions.invoke("portfolio-screenshot", { body: { url, key: p.id, projectId: p.id, force: true } })`.
  - Erfolg: `toast.success`, lokal `screenshot_url`/`screenshot_updated_at` aus Response übernehmen, sonst `fetchPortfolio()`.
  - Fehler: `toast.error` mit Fehlertext.
- Backfill-Button (existiert bereits) bleibt; nutzt weiterhin `force` nicht (nur fehlende).

## 5. Öffentliche Portfolio-Seite
- Keine Änderungen. Generieren passiert nur im Admin und einmalig beim Speichern eines neuen Projekts.

## Technische Hinweise
- Cache-Buster nur auf `screenshot_url` anwenden, nicht auf manuell hochgeladene `image_url` (die ändert ihren Pfad beim Upload bereits).
- Edge Function gibt im Response zusätzlich `screenshot_updated_at` zurück, damit Admin sofort aktualisieren kann.
