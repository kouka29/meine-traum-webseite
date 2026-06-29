# Screenshots zuverlässig wie die echte Website aussehen lassen

## Problem
Microlink liefert bei manchen Seiten ein unvollständiges/leeres Bild, weil:
- Viewport zu klein (1000×1600) → Mobile-Layout oder Layout-Sprünge
- `waitUntil: networkidle2` + nur 1,5s Wartezeit → Hero-Slider, Lazy-Images und Animationen sind noch nicht fertig
- Cookie-Banner werden nur per `hide` (CSS) entfernt — manche Seiten blockieren den Inhalt mit Overlay/Body-Scroll-Lock, der bleibt
- Fallback-Retry reduziert Höhe und Wartezeit → macht es eher schlechter, nicht besser
- Kein `device`/`scaleFactor` für Retina → unscharf
- Kein Provider-Fallback, wenn Microlink scheitert

## Lösung

### 1. Edge Function `portfolio-screenshot` qualitativ aufbohren
- Viewport auf echte Desktop-Größe: **1440×900**, `deviceScaleFactor=2` (Retina-scharf)
- `waitUntil=networkidle0` + großzügigeres `waitForTimeout` (Default **4500 ms**, max 15 s)
- Statt nur `hide`: zusätzlich `scripts`-Param mit kleinen JS-Snippets, die typische Consent-Overlays + `body.overflow=auto` zurücksetzen (Borlabs, Usercentrics, Cookiebot, Complianz, iubenda, OneTrust)
- Optionales Pre-Action: `scroll=true` (lädt Lazy-Bilder), danach zurück nach oben
- `adblock=true`, `animations=false` (Microlink-Param) für ruhige Aufnahme
- Smarter Retry-Fallback **mit längerer Wartezeit** (nicht kürzerer): zweiter Versuch `waitFor=8000`, `waitUntil=load`, scale=1
- Optionaler 2. Provider als Fallback (z. B. ScreenshotOne / thum.io) hinter Secret `SCREENSHOT_FALLBACK_PROVIDER` — nur wenn Microlink final scheitert

### 2. Mehr Steuerung im Admin
Im "Erweitert"-Panel pro Projekt zusätzlich:
- Numerisches Feld **Viewport-Höhe** (Default 900, bis 4000 für Long-Pages)
- Checkbox **Vollständige Seite** (`fullPage=true`) — für Long-Scroll-Sites
- Checkbox **Vor Aufnahme scrollen** (lazy-load triggern)
- Checkbox **Retina (2×)**
- Vorschau zeigt zusätzlich Dateigröße + Aufnahme-Zeitpunkt; Toast meldet, wenn Fallback-Provider griff

### 3. Konsistenz im Cache-Pfad
- Pfad-Bump auf `auto/v4/<key>.jpg`, damit neue Qualitätseinstellungen nicht durch alte Cache-Treffer überschrieben werden
- `force=true` löscht zusätzlich vorhandene `v4`-Datei vor Upload (echte Neugenerierung statt nur Upsert)

## Technische Details
- Datei: `supabase/functions/portfolio-screenshot/index.ts`
  - Neue Body-Felder: `viewportHeight`, `fullPage`, `scrollBefore`, `retina`
  - Microlink-URL-Builder erweitern um `device`, `scripts`, `adblock`, `animations`, `scroll`
- Datei: `src/pages/AdminLeads.tsx`
  - Erweitert-Panel um 4 Felder, an `invoke` weiterreichen
  - Erfolgs-Toast zeigt `provider` aus Response
- Kein neues Secret nötig, solange Fallback-Provider weggelassen wird; wenn gewünscht: `add_secret` für `SCREENSHOTONE_ACCESS_KEY` (optional, separat fragen)

## Offen
Soll ich den optionalen Zweit-Provider (ScreenshotOne) gleich mitbauen, oder erst Microlink-Tuning + Admin-Optionen umsetzen und schauen, ob das reicht?
