## Recherche: Noch nicht erwähnte Branchen mit hoher Webdesign-Nachfrage

Auf der Website bereits abgedeckt: Handwerker (Elektriker, Maler, SHK, Dachdecker), Gesundheit & Wellness (Ärzte, Fitness), Beratung & Kanzleien (Coaches, Anwälte/Steuerberater), Immobilien & Bau (Makler, Ingenieure), Gastronomie, Hotels, Einzelhandel, Dienstleistungen (Reinigung, Logistik).

Branchen mit **hoher Nachfrage** nach Websites, die noch nicht vorkommen:

1. **Friseure & Kosmetik** – Sehr lokale Kundschaft, hoher Bedarf an Terminbuchung und Galerien.
2. **Zahnärzte & Kieferorthopäden** – Ähnlich wie Ärzte, aber separate Zielgruppe mit eigenen Bedürfnissen.
3. **Autohäuser & Kfz-Werkstätten** – Große Umsätze, Fahrzeugpräsentation und Werkstatt-Termine online.
4. **Physiotherapeuten & Ergotherapeuten** – Wachsende Branche, Terminbuchung und Patienteninfo zentral.
5. **Garten- & Landschaftsbau** – Saisonal, Portfolio und Kontaktanfragen online essenziell.
6. **Schreiner & Tischler** – Handwerk mit hochwertiger Präsentation, Maßanfertigungen zeigen.
7. **Tierärzte** – Tierhalter suchen gezielt online Praxen, Terminbuchung wichtig.
8. **Floristen** – Lokale Sichtbarkeit, Blumenabos und Online-Shop für besondere Anlässe.

Weitere Kandidaten mit moderatem bis hohem Potenzial: Bäcker & Konditoreien, Psychotherapeuten, Pflegedienste, Sicherheitsdienste, Architekten, Event-Agenturen, Fotografen, Reisebüros, Versicherungsmakler.

---

## Umsetzungsplan

### Ziel
Die 8. Karte im Branchen-Grid soll zu einer **Popover-Karte** „Maßgeschneiderte Lösungen für weitere Branchen" umgebaut werden. Gastronomie und Hotels werden zu einer Karte „Gastronomie & Hotellerie" zusammengefasst, sodass 7 Hauptkarten + 1 Weitere-Branchen-Karte entstehen.

### Änderungen in `src/components/IndexBranchen.tsx`

1. **Gastronomie & Hotels zusammenfassen**
   - Neue kombinierte Karte: Name „Gastronomie & Hotellerie", Icon `UtensilsCrossed` oder gemischtes Icon, Text vereint beide Branchen.
   - Link-Ziel: `/kontakt?branche=gastronomie-hotellerie`.

2. **8. Karte als Popover-Karte erstellen**
   - Name: „Maßgeschneiderte Lösungen" (oder kurz „Weitere Branchen" je nach Platz).
   - Icon: `Sparkles` oder `Briefcase`.
   - Text: „Maßgeschneiderte Lösungen für weitere Branchen – wir finden das passende Konzept für Sie."
   - Popover-Inhalt: Liste der 5–7 zusätzlichen Branchen als verlinkte Einträge mit passenden Icons (z. B. `Scissors` für Friseure, `Car` für Autohäuser, `Flower2` für Floristen, `TreePine` für Gartenbau, `PawPrint` für Tierärzte, `Armchair` für Schreiner, `Activity` für Physiotherapeuten, `Smile` für Zahnärzte).
   - Jeder Eintrag linkt auf `/kontakt?branche=<slug>`.

3. **Visuelle Konsistenz**
   - Die Popover-Karte nutzt denselben `PopoverCard`-Komponenten-Stil wie Handwerker, Gesundheit & Wellness etc.
   - Badge zeigt Anzahl der Unterbranchen an (z. B. „7 Branchen").

### Abgelehnte Alternative
- Keine separate Landingpage für jede Unterbranche der 8. Karte (zu aufwändig, stattdessen vereinheitlichte Kontakt-Links mit Branchen-Parametern).

### Ergebnis
- 7 Hauptkarten im 4-Spalten-Raster.
- 1 achte Popover-Karte mit 5–7 zusätzlichen Branchen.
- Sauberes, nicht überladenes Grid.