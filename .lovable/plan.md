## Ziel
Auf der Startseite (`src/components/IndexPortfolio.tsx`) sollen exakt dieselben Projekte und das gleiche Karten-Design wie auf `/portfolio` erscheinen — nur in einem horizontal scrollenden Embla-Karussell mit Autoplay (statt Grid).

## Änderungen

**Nur `src/components/IndexPortfolio.tsx` anpassen** (Portfolio-Seite bleibt unverändert):

1. **Datenmodell angleichen**
   - `PortfolioItem` um `description` und `screenshot_url` erweitern.
   - In `getCachedPortfolio()`-/`fetchPortfolio()`-Mapping `description` und `screenshot_url` übernehmen — identisch zu `Portfolio.tsx`.
   - Fallback-Items von 3 auf dieselben 6 (TechStart, Yoga Studio Flow, DigitalBoost, Kanzlei Weber, FitLife Coaching, GreenTech Solutions) erweitern, identisch zu `fallbackProjects` in `Portfolio.tsx` inkl. Fallback-Bild-Imports (`kanzlei.jpg`, `fitlife.jpg`, `greentech.jpg`).
   - `FALLBACK_IMAGES` entsprechend ergänzen.

2. **Karten-Markup 1:1 von Portfolio übernehmen**
   - Bisheriges `Inner`-Markup ersetzen durch das `card`-Markup aus `Portfolio.tsx`:
     - Browser-Mockup-Rahmen (Ampel-Punkte, abgerundete Karte, Border, Shadow)
     - 16:9 Bild mit Hover-Scroll (`object-position` Transition, `flatImages`-Logik, `reducedMotion`)
     - Hover-Overlay „Live ansehen"
     - Kategorie-Badge, Titel, Beschreibung mit `line-clamp-2` + „Weiterlesen" auf Mobile, „Ansehen →" rechts unten
   - `normalizeImageSrc` aus `Portfolio.tsx` mit übernehmen (Bevorzugung `image_url` → `screenshot_url`).
   - State `reducedMotion`, `flatImages`, `expandedDescs` ergänzen.

3. **Karussell-Wrapper beibehalten**
   - Embla `Carousel` mit `Autoplay` (4 s, `stopOnMouseEnter`) bleibt.
   - `CarouselItem`: `basis-full sm:basis-1/2 lg:basis-1/3` bleibt — Karte rendert als Kind.
   - Link-Wrapper (`<a target="_blank">`) bleibt um die Karte herum, wenn `external_url` gesetzt.
   - Stopp-on-Interaction beim Toggle von „Weiterlesen": Klick-Event innerhalb der Karte über `e.stopPropagation()` und `e.preventDefault()` (wie auf Portfolio-Seite) verhindert ungewollte Link-Navigation.

4. **Sichtbares Verhalten**
   - Pfeile (`CarouselPrevious/Next`) bleiben.
   - „Alle Projekte ansehen"-Button unten bleibt.
   - Section-Überschrift bleibt.

## Nicht-Ziele
- Portfolio-Seite (`src/pages/Portfolio.tsx`) wird nicht geändert.
- Keine Änderungen an Datenbank/Edge Functions/Cache-Layer.
- Keine neuen Routen, kein neues Design-Token.

## Technische Details
- Datei: nur `src/components/IndexPortfolio.tsx`.
- Imports zusätzlich nötig: `kanzleiImg`, `fitlifeImg`, `greentechImg` aus `@/assets/portfolio/...`, `ExternalLink`, `ArrowRight` aus `lucide-react`.
- Imports entfernen, die nicht mehr genutzt werden: `Picture`, `PictureSource`, `supabaseImage`, `supabaseImageSrcSet`, `?as=picture`-Varianten (nicht mehr nötig, da Portfolio-Karte plain `<img>` nutzt).
