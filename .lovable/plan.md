Die aktuelle Branchen-Sektion auf der Startseite (8 Einzelkarten: Handwerker + 7 Branchen) wird in 8 Meta-Kategorien umgebaut. Karten mit mehreren Unterbranchen erhalten einen Radix-Popover (wie aktuell bei Handwerker). Einzel-Branchen mit eigener Landingpage verlinken direkt.

Geplante 8-Karten-Struktur:

1. **Handwerker** — Popover mit 5 Gewerken (bestehend: Elektriker, Maler, SHK, Dachdecker, Alle Handwerker)
2. **Gesundheit & Wellness** — Popover: Ärzte & Praxen (/webdesign-aerzte), Fitness- & Yogastudios (/kontakt?branche=fitness)
3. **Beratung & Kanzleien** — Popover: Coaches & Trainer (/webdesign-coaches), Anwälte & Steuerberater (/kontakt?branche=kanzleien)
4. **Immobilien & Bau** — Popover: Immobilienmakler (/webdesign-immobilienmakler), Ingenieure & Planer (/kontakt?branche=ingenieure)
5. **Gastronomie** — Direktlink (/kontakt?branche=gastronomie), Text: Restaurants, Cafés, Lieferdienste
6. **Hotels & Pensionen** — Direktlink (/kontakt?branche=hotellerie)
7. **Einzelhandel & Shops** — Direktlink (/kontakt?branche=einzelhandel), Text: Lokale Geschäfte, Boutiquen, E-Commerce
8. **Dienstleistungen** — Popover: Reinigungsdienstleister (/kontakt?branche=reinigung), Logistiker & Speditionen (/kontakt?branche=logistik)

Änderungen in `src/components/IndexBranchen.tsx`:
- Neues Daten-Array `metaBranchen` mit 8 Einträgen. Jedes Item enthält `name`, `icon`, `text`, plus optional `items: [{name, path, icon}]` für Popover-Gruppen.
- Render-Logik: Wenn `items` vorhanden → Popover-Trigger wie bisher. Sonst → `<Link>`-Card mit Direktverlinkung.
- Icons über lucide-react (z. B. HeartPulse für Gesundheit, Scale für Kanzleien, Truck für Dienstleistungen, ShoppingBag für Einzelhandel, Cpu für Ingenieure).
- Grid bleibt `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5`.
- Mobile UX: Popover-Content bleibt klickbar, Touch-Targets ≥ 44 px.

Keine neuen Landingpages werden angelegt — neue Branchen verlinken auf `/kontakt?branche=…` als Platzhalter.

Keine Änderungen an anderen Seiten außerhalb der Branchen-Sektion.
