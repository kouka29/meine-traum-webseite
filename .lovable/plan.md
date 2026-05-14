# KI-generiertes Vorschaubild für Demos

Ein Klick im Demo-Dialog erzeugt automatisch einen sauberen Screenshot der Webseite (Cookie-Banner versteckt) und setzt ihn als Vorschaubild.

## Konzept

Wir nutzen die bereits vorhandene **Microlink-Screenshot-API** (siehe `generate-mockup` Edge Function). Microlink unterstützt das **Verstecken von Cookie-Bannern via injiziertem CSS** (`screenshot.styles`) — kein zusätzlicher API-Key, kein neuer Provider, keine echte „Bild-KI" nötig (das wäre eine Halluzination, kein echter Webseiten-Screenshot).

## Änderungen

### 1. Neue Edge Function `generate-demo-screenshot`
- Input: `{ password, url }`
- Validiert Admin-Passwort (gleiche Brute-Force-Logik wie `generate-mockup`)
- Ruft Microlink mit Cookie-Banner-Blocker auf:
  - `screenshot.styles` injiziert CSS, das gängige Banner-Selektoren ausblendet:
    `[id*="cookie"], [class*="cookie"], [id*="consent"], [class*="consent"], #usercentrics-root, .CybotCookiebotDialog, #onetrust-banner-sdk, [id*="cmp"], .cc-window, body > div[role="dialog"] { display: none !important; } html, body { overflow: auto !important; }`
  - `waitUntil=networkidle0`, Viewport 1280×800, `fullPage=false`
- Lädt das PNG in den bestehenden Bucket `vorschau-demos` unter `screenshots/{timestamp}.png`
- Liefert `{ image_url }` zurück

### 2. UI-Erweiterung im Demo-Dialog (`AdminVorschauTab.tsx`)
Über dem „Vorschaubild"-Datei-Input:
- Neues Feld **„Webseite-URL für Auto-Screenshot"** (optional)
  - Vorbefüllt mit `external_url` des verlinkten Portfolio-Projekts (sofern vorhanden)
- Button **„✨ Screenshot generieren"** mit `Sparkles`-Icon
  - Disabled wenn URL leer oder Loading
  - Bei Erfolg: temporäres Preview-Image im Dialog anzeigen + neuen `image_url`-State setzen
- Beim Speichern (`saveDemo`): wenn ein generierter Screenshot vorliegt **und** keine Datei hochgeladen wurde → diesen als `image_url` speichern (Datei-Upload hat Vorrang, falls vorhanden)

### 3. Optional: vorhandenes `external_url`-Feld
`vorschau_demos` hat aktuell kein eigenes URL-Feld — wir benötigen das auch nicht zu speichern. Die URL ist nur transient für die Generierung. Bei verlinktem Portfolio kommt sie automatisch von dort, sonst manuell eingegeben.

## Hinweise zur Cookie-Banner-Unterdrückung

- CSS-Injection deckt **~90 %** gängiger Banner ab (Cookiebot, OneTrust, Usercentrics, CMP-Pattern, generische `[class*="cookie"]`).
- Edge-Cases (Banner im Shadow-DOM oder mit zufälligen IDs) lassen sich über zusätzliche `screenshot.scripts` (JS, das `document.querySelectorAll` durchgeht und alles mit „cookie/consent" im Text entfernt) abfangen — wird mit ausgeliefert.
- Microlink Free-Tier reicht für Admin-interne Nutzung (Rate-Limit ~50/Tag pro IP). Falls später mehr nötig: API-Key als Secret nachrüsten.

## Was NICHT gemacht wird
- Keine echte Bild-KI (Nano Banana etc.) für Webseiten-Screenshots — das würde halluzinierte Fake-Bilder erzeugen, nicht die echte Vorschau.
- Keine DB-Schema-Änderung.
