# Branchen-Sichtbarkeit auf der Startseite & Footer

## 1. Footer „Leistungen" umbauen (`src/components/Footer.tsx`)

Aktuell listet die Spalte nur Gewerke des Handwerks. Statt dessen die echten Branchen-Landingpages verlinken (eine pro Branche):

- Handwerker – `/handwerker`
- Elektriker – `/elektriker`
- Sanitär & Heizung – `/sanitaer` (bzw. `/webdesign-shk`)
- Dachdecker – `/dachdecker`
- Maler & Lackierer – `/maler`
- Ärzte – `/webdesign-aerzte`
- Immobilienmakler – `/webdesign-immobilienmakler`
- Coaches – `/webdesign-coaches`

Spaltenüberschrift „Leistungen" → „Branchen". Der Link „Webdesign Preise" wandert in die Spalte „Navigation".

## 2. Neue Sektion „Branchen" auf der Startseite

Neue Komponente `src/components/IndexBranchen.tsx` und Einbindung in `src/pages/Index.tsx` zwischen `IndexBenefits` und `IndexTestimonials`.

Inhalt: Grid aus Cards (2 / 3 / 4 Spalten responsive), jede Card = klickbarer `<Link>` mit Icon (lucide-react), Branchen-Name, ein Satz Nutzen, dezenter „Mehr erfahren →"-Affordance. Verwendet ausschließlich semantische Design-Tokens (`bg-card`, `text-foreground`, `border-border`, `hover:shadow-elegant`, `text-primary`).

Cards (8 Stück, alle bestehenden Landingpages):

| Branche | Route | Icon |
|---|---|---|
| Handwerker | `/handwerker` | Hammer |
| Elektriker | `/elektriker` | Zap |
| Maler & Lackierer | `/maler` | PaintRoller |
| Sanitär & Heizung (SHK) | `/sanitaer` | Wrench |
| Dachdecker | `/dachdecker` | Home |
| Ärzte & Praxen | `/webdesign-aerzte` | Stethoscope |
| Immobilienmakler | `/webdesign-immobilienmakler` | Building2 |
| Coaches & Trainer | `/webdesign-coaches` | GraduationCap |

Section-Header: „Webdesign für Ihre Branche" + Sub-Headline „Spezialisierte Landingpages mit branchenspezifischen Argumenten, Referenzen und Funktionen."

## Technische Hinweise
- Lazy-Load der neuen Komponente analog zu den anderen `Index*`-Sektionen (`React.lazy` + bestehender Suspense-Wrapper in `Index.tsx`).
- Keine neuen Dependencies; alle Icons via `lucide-react` (bereits installiert).
- Keine Routen-Änderungen, keine Backend-Änderungen.
