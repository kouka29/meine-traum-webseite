## Ziel
Portfolio-Seite (`/portfolio`) soll spürbar schneller wirken – kein langes Warten auf Bilder/Daten, kein leerer Loader-Bildschirm.

## Diagnose (warum es aktuell langsam wirkt)
1. **Blockierender Loader:** `Portfolio.tsx` zeigt nur einen Spinner bis Supabase antwortet, obwohl bereits 6 hochwertige Fallback-Projekte im Code stehen. Bei langsamer Verbindung sieht der Nutzer sekundenlang nichts.
2. **Große JPG-Bilder:** `src/assets/portfolio/*.jpg` werden ungekomprimiert/ohne moderne Formate (WebP/AVIF) geladen.
3. **Alle Bilder gleichzeitig:** Kein Priorisieren – auch unsichtbare Karten unten laden sofort mit hoher Priorität.
4. **Kein Caching zwischen Seiten:** Index-Portfolio und `/portfolio` fetchen unabhängig, jedes Mal neu.
5. **Supabase-Query holt `*`** statt nur benötigte Spalten (inkl. evtl. großer Felder).

## Maßnahmen

### 1. Sofortiges Rendern statt Spinner
- Fallback-Projekte direkt anzeigen, Supabase-Daten im Hintergrund nachladen und sanft ersetzen.
- Loader-State entfernen → Seite ist visuell sofort da (perceived performance).

### 2. Bildoptimierung
- `vite-imagetools` Plugin einbauen und Portfolio-Bilder als WebP + responsives `srcset` (z. B. 400/800/1200px) importieren.
- `<img>` bekommt `sizes`, `loading="lazy"` (außer erste Reihe → `loading="eager"` + `fetchpriority="high"`), bestehende `width/height` bleiben für CLS.

### 3. Query schlanker
- In `Portfolio.tsx` `select("*")` → explizite Spaltenliste (wie in `IndexPortfolio.tsx`).
- `is_visible`-Filter + `sort_order` bleiben; zusätzlich kleines `limit` falls sinnvoll.

### 4. Shared Cache zwischen Index & Portfolio
- Leichten In-Memory-Cache (Modul-Singleton in z. B. `src/lib/portfolioCache.ts`) oder einfaches Pattern: erstes Fetch-Result in `sessionStorage` ablegen und beim Mount sofort als Initial-State nutzen → zweiter Besuch der Seite ist instant.

### 5. Kleinere Wins
- `<link rel="preconnect">` zum Supabase-Origin in `index.html` (DNS/TLS schon warm, wenn Fetch losgeht).
- Externe Projekt-Bilder (falls `image_url` auf Supabase-Storage zeigt) mit `?width=...&quality=75` Transform-Parametern (Supabase Image Transformations) anfordern.

## Reihenfolge der Umsetzung
1. Fallback sofort rendern + Spalten-Select (schnellster sichtbarer Effekt, minimal Risiko)
2. SessionStorage-Cache
3. `vite-imagetools` + WebP/srcset + lazy/eager-Strategie
4. `preconnect` in `index.html`
5. Optional: Supabase Storage Transformations für dynamische Bilder

## Nicht im Scope
- Design-/Layout-Änderungen
- Server-Side-Rendering / Framework-Wechsel
- Backend-Schema-Änderungen
