## Ziel
Auf der Startseite (`IndexBranchen.tsx`) wird die „Handwerker"-Card aufklappbar bzw. öffnet ein Popup mit den Handwerks-Unterkategorien (Elektriker, Maler, Sanitär/SHK, Dachdecker). Die freigewordenen Plätze im Grid werden mit neuen Branchen gefüllt, die nachweislich hohe Nachfrage nach Webdesign haben.

## 1. Handwerker-Card mit Sub-Branchen

- Die Handwerker-Card bleibt erste Position im Grid, ist aber **kein** `<Link>` mehr, sondern ein `<button>`, der ein Radix-Popover öffnet (bereits im Projekt: `@/components/ui/popover`). Popover statt Dialog, weil leichter, direkt an der Card verankert und mobil als unterer Sheet-ähnlicher Layer ebenfalls gut nutzbar.
- Inhalt des Popovers: Headline „Handwerks-Gewerke", 5 Links mit Icon:
  - Handwerker (Übersicht) → `/handwerker`
  - Elektriker → `/elektriker` (Zap)
  - Maler & Lackierer → `/maler` (PaintRoller)
  - Sanitär & Heizung (SHK) → `/sanitaer` (Wrench)
  - Dachdecker → `/dachdecker` (Home)
- Optisches Signal an der Card: kleines „5 Gewerke" Badge + Chevron-Down-Icon statt Pfeil, damit erkennbar ist, dass sie auffächert.
- Tastatur/Accessibility: `aria-haspopup`, `aria-expanded`, ESC schließt (Radix-Standard).
- Keine Routen- oder Backend-Änderung. Keine neuen Dependencies.

## 2. Neue Branchen im Grid

Die vier Handwerks-Unterkategorien werden aus dem Top-Level-Grid entfernt (leben jetzt nur noch im Popover). An ihre Stelle treten Branchen mit hoher Webdesign-Nachfrage im DACH-Raum, die zum bestehenden Lokal-/KMU-Fokus passen:

| Branche | Route* | Icon | Begründung |
|---|---|---|---|
| Handwerker (mit Popover) | `/handwerker` | Hammer | bleibt |
| Ärzte & Praxen | `/webdesign-aerzte` | Stethoscope | bestehende LP |
| Immobilienmakler | `/webdesign-immobilienmakler` | Building2 | bestehende LP |
| Coaches & Trainer | `/webdesign-coaches` | GraduationCap | bestehende LP |
| Gastronomie & Restaurants | `/branchen/gastronomie` | UtensilsCrossed | sehr hohes Suchvolumen „Webdesign Restaurant", Reservierungen + Speisekarte |
| Anwälte & Steuerberater | `/branchen/kanzleien` | Scale | hochpreisige Branche, starke Nachfrage nach seriösen Websites |
| Fitness- & Yogastudios | `/branchen/fitness` | Dumbbell | lokale Studios, Kursbuchungen, hohe Konkurrenz |
| Hotels & Pensionen | `/branchen/hotellerie` | BedDouble | Direktbuchungen statt Booking-Provision, klassischer Webdesign-Bedarf |

\* Für die vier neuen Branchen existieren noch keine Landingpages. **Diese Card-Links verweisen vorerst auf den Kontakt-/Vorschau-Flow** (`/kontakt?branche=gastronomie` usw.), damit nichts in 404 läuft. Eigene LPs können später ergänzt werden – außerhalb dieses Plans.

Ergibt **8 Cards** wie bisher, Grid-Layout (2/3/4 Spalten) bleibt.

## 3. Footer

Footer-Spalte „Branchen" bleibt wie sie ist (listet weiterhin die einzelnen Gewerke + bestehenden LPs). Keine Änderung – Footer ist die „flache" Übersicht, die Startseite ist kuratiert.

## Technisches

- Nur `src/components/IndexBranchen.tsx` wird geändert.
- Verwendet Radix Popover (`@/components/ui/popover`) – bereits vorhanden.
- Neue Icons aus `lucide-react`: `ChevronDown`, `UtensilsCrossed`, `Scale`, `Dumbbell`, `BedDouble`. Alle Teil von lucide-react, keine Installation nötig.
- Strikt semantische Tokens (`bg-card`, `bg-primary/10`, `text-primary`, `border-border`, `hover:shadow-elegant`) – keine Hardcoded-Farben.
- Lazy-Loading-Setup in `Index.tsx` bleibt unverändert.
