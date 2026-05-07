## Neue Seite: `/erstgespraech`

Empfangsseite für warme Leads aus dem Netzwerk, die per WhatsApp/Telefon Interesse gezeigt haben. Spricht zwei Szenarien an: **Neubau** und **Relaunch**. Ziel: Vertrauensaufbau + Terminbuchung mit niedriger Hürde.

### Dateien

- **Neu:** `src/pages/Erstgespraech.tsx`
- **Edit:** `src/App.tsx` — Lazy-Import + Route `/erstgespraech` hinzufügen (kein Navbar-Eintrag, taucht damit nicht im Hauptmenü auf)

### Sections (in Reihenfolge)

1. **Hero** — Headline, Subline, zwei CTAs (Primär `gradient` → `#termin-buchen`, Sekundär `outline-primary` → smooth-scroll auf Section #weiter via `onClick → scrollIntoView({behavior:'smooth'})`)
2. **Zwei-Wege-Section** (`id="weiter"`) — Zwei gleichwertige Cards (Neubau ✦ / Relaunch ↗) mit Icons aus `lucide-react` (`Sparkles`, `TrendingUp`), Headline, Text, 3 Bullets. Gleiche Border, gleiches Padding — kein bevorzugter Stil.
3. **Vertrauens-Section** — 3 Punkte horizontal (`grid md:grid-cols-3`) mit Icon + Titel + Text. Icons: `Target`, `BarChart3`, `Zap`.
4. **Mini-Portfolio** — Wiederverwendung von `IndexPortfolio` Komponente (zeigt bereits 3–4 DB/Fallback-Projekte mit Carousel und „Alle Projekte ansehen"-Link auf `/portfolio`). Eigene Überschrift davor optional — `IndexPortfolio` bringt eigene Headline mit, daher Reuse 1:1.
5. **Pullquote** — Großformatig zentriert, ohne Card-Stil. Großes `Quote`-Icon, Zitat in `text-2xl sm:text-3xl`, Name + Badge „5x mehr Anfragen" darunter. Viel `py`-Spacing.
6. **FAQ Accordion** — `<Accordion type="single" collapsible>` (eine Antwort gleichzeitig), 3 Fragen wie spezifiziert.
7. **Abschluss-CTA** — Section mit `gradient-hero-bg` (entspricht Brand-Lila inkl. #5B3DC8 ≈ hsl(250,56%,48%)), Headline, Subline, Button → `#termin-buchen`, Telefon `06131/30 765 00` als `tel:+4961313076500`-Link, Kleintext „Mo–Fr 9–18 Uhr · Auch per WhatsApp erreichbar".

### Design-System-Konformität

- Alle bestehenden Tokens: `gradient-text`, `gradient-bg`, `gradient-hero-bg`, `badge-label`, `section-padding`, `container-narrow`, `shadow-elevated`
- Komponenten: `Button` (Varianten `gradient`, `outline-primary`), `Card`/`CardContent`, `Accordion*`, `AnimatedSection`
- Keine neuen Fonts, keine neuen Farben, keine neuen Dependencies
- Header (`Navbar`) und Footer kommen automatisch über `App.tsx` Layout
- Mobile-first responsive (gleiches Pattern wie `Empfehlung.tsx`)

### Technische Details

- Smooth-Scroll: `document.getElementById('weiter')?.scrollIntoView({behavior:'smooth'})` auf dem Sekundär-Button
- Telefon-Link: `<a href="tel:+4961313076500">06131/30 765 00</a>`
- Termin-Platzhalter: alle Buttons referenzieren `#termin-buchen` als `href`
- Kein Eintrag in `Navbar.tsx` — Route ist nur direkt erreichbar
