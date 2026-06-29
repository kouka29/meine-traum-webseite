## Ziel

15 neue, konversionsstarke Landingpages — eine pro Branche, die bisher nur auf `/kontakt?branche=...` verlinkt. Jede Seite folgt dem bewährten Elektriker-Aufbau (Hero → Pain Points → Steps → Features → Testimonial → Pricing → Cross-Links → Lead-Formular → Final CTA), aber mit branchen-spezifischem Wording, Icons, Argumenten und Beispielen.

## 1. TradeHub generalisieren

`src/components/trade/TradeHub.tsx` wird branchen-neutral:

- Cross-Links-Überschrift wird konfigurierbar (`crossLinksH2`, Default „Auch für andere Branchen") statt hartkodiertes „Auch für andere Handwerksbetriebe".
- „Alle Branchen →"-Link unten wird konfigurierbar (`allBranchesLabel`, `allBranchesPath`, Default `/` mit Sprung zur Branchen-Sektion).
- „Nicht sicher welches Paket passt?"-Link wird konfigurierbar (`pricingContactPath`, Default `/kontakt`).
- Neuer optionaler Prop `pricingNames` (z. B. für Praxen „Einzelpraxis / Wachstumspraxis / Marktführer"), Fallback bleibt `TRADE_NAMES`.
- Telefon-CTA-Texte bleiben (Mainz-Nummer ist universell), nur Wording in den Trust-Listen wird über Config gesteuert.
- Optional `heroEmoji`/`heroAccentColor` zur leichten visuellen Differenzierung.

Keine Breaking Changes: Bestehende 5 Hub-Configs (Handwerker/Elektriker/Maler/Sanitär/Dachdecker) bleiben funktional, die neuen Felder sind optional.

## 2. 15 neue Landingpages

Jede Seite = eigene Datei in `src/pages/branchen/`, die `TradeHub` mit branchen-spezifischer Config rendert. Alle bekommen passende Lucide-Icon-Akzente, ein eigenes Badge-Farbschema und mindestens ein realistisches, branchen-typisches Testimonial.

### Hauptbranchen (7)

| Route | Datei | Branche | Schwerpunkt |
|---|---|---|---|
| `/fitness` | `FitnessHub.tsx` | Fitness- & Yogastudios | Online-Kursbuchung, Mitgliederakquise, Probestunden-CTA |
| `/kanzleien` | `KanzleienHub.tsx` | Anwälte & Steuerberater | Vertrauen, Mandanten-Akquise, Fachgebiete, sichere Mandantenmappe |
| `/ingenieure` | `IngenieureHub.tsx` | Ingenieure & Planer | Referenzprojekte, B2B-Auftraggeber, Fachkräfte-Recruiting |
| `/gastronomie` | `GastronomieHub.tsx` | Gastronomie & Hotellerie | Speisekarte/Zimmer, Reservierung, Lieferdienst, Google Maps |
| `/einzelhandel` | `EinzelhandelHub.tsx` | Einzelhandel & Shops | Local SEO, Sortiment, Öffnungszeiten, optional Shop-Anbindung |
| `/reinigung` | `ReinigungHub.tsx` | Reinigungsdienstleister | Gewerbe vs. Privat, Angebot anfragen, Service-Gebiete |
| `/logistik` | `LogistikHub.tsx` | Logistiker & Speditionen | B2B-Angebotsanfrage, Fuhrpark, Spezialisierungen |

### „Maßgeschneiderte Lösungen" (8)

| Route | Datei | Branche | Schwerpunkt |
|---|---|---|---|
| `/friseure` | `FriseureHub.tsx` | Friseure & Kosmetik | Online-Terminbuchung, Instagram-Integration, Preisliste |
| `/zahnaerzte` | `ZahnaerzteHub.tsx` | Zahnärzte & KFO | Termin online, Leistungen, Angstpatienten, Notdienst |
| `/autohaeuser` | `AutohaeuserHub.tsx` | Autohäuser & Kfz-Werkstätten | Fahrzeugangebote, Werkstatt-Termin, TÜV/HU |
| `/physiotherapeuten` | `PhysioHub.tsx` | Physio- & Ergotherapeuten | Kassen/Privat, Termin, Leistungsspektrum |
| `/gartenbau` | `GartenbauHub.tsx` | Garten- & Landschaftsbau | Vorher/Nachher-Bilder, saisonale Angebote |
| `/schreiner` | `SchreinerHub.tsx` | Schreiner & Tischler | Referenz-Galerie (Möbel, Küchen), individuelle Anfrage |
| `/tieraerzte` | `TieraerzteHub.tsx` | Tierärzte | Termin, Notdienst, Spezialgebiete (Kleintiere/Pferde) |
| `/floristen` | `FloristenHub.tsx` | Floristen | Anlässe (Hochzeit/Trauer), Lieferung, Saisonangebote |

## 3. Routing & Integration

- `src/App.tsx`: 15 neue `lazy()`-Imports + 15 Routen. Pattern: `<Route path="/fitness" element={<FitnessHub />} />` (analog für alle).
- `src/components/IndexBranchen.tsx`: Alle `to: "/kontakt?branche=xyz"` werden auf die neuen Top-Level-Routen umgestellt (z. B. `/fitness`, `/zahnaerzte` etc.). Die Popover-Subitems und Hauptkarten zeigen jetzt auf echte Landingpages.
- `public/sitemap.xml`: Die 15 neuen URLs ergänzen.

## 4. SEO pro Seite

Jede Hub-Page nutzt `SEOHead` mit:
- branchen-spezifischem `title` (z. B. „Webdesign für Zahnärzte — mehr Patienten in Mainz & DACH | Meine Traum Website")
- 150-160-Zeichen-Description mit Branche + Mehrwert
- `structuredData: "Service"` mit `serviceType` = Branche

## 5. Was bleibt unangetastet

- Bestehende Hubs (Elektriker/Maler/SHK/Dachdecker/Handwerker) und deren Sub-Routen
- `HandwerkerLeadForm` wird wiederverwendet, der `branche`-Prop trägt die neue Branche ins Lead-System (`notify-lead`)
- Pricing-Pakete (`rentPackages` aus `WebdesignPreise`) — werden 1:1 wiederverwendet, optional über `pricingNames` umbenannt für Nicht-Handwerks-Branchen

## Aufwand & Output

- 1 Komponenten-Refactor (TradeHub minimal erweitert, abwärtskompatibel)
- 15 neue Page-Dateien (~40-60 Zeilen Config je Datei)
- 1 App.tsx-Update (Imports + Routen)
- 1 IndexBranchen.tsx-Update (Links auf neue Routen)
- 1 sitemap.xml-Update

Die Seiten sind sofort live, indexierbar, in den Branchen-Cards verlinkt und Lead-Tracking-fähig.
