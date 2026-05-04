# Admin-Steuerung für /kostenlose-vorschau-v2

Aktuell teilen sich `/kostenlose-vorschau` und `/kostenlose-vorschau-v2` dieselbe Einstellungs-Zeile (`vorschau_settings.id = 1`) sowie dieselben Demos/FAQs. Damit du V2 unabhängig pflegen kannst (Countdown, Plätze, Hero-Texte, Sichtbarkeit, Demos, FAQs, Testimonials-Auswahl etc.), führen wir einen **Page-Key** ein und einen **Seiten-Umschalter** im Admin-Tab.

## Datenbank (Migration)

Neue Spalte `page_key text not null default 'v1'` zu:
- `vorschau_settings` – plus zweite Zeile mit `page_key='v2'` (Kopie der aktuellen V1-Werte als Startpunkt). Unique-Index auf `page_key`.
- `vorschau_demos` – jede Demo gehört zu einer Seite. Bestehende Zeilen bleiben `'v1'`; V2 startet leer (oder optional kopiert).
- `vorschau_faqs` – analog.

`testimonials` und `portfolio_projects` bleiben global. Welche davon auf V2 erscheinen, wird über zwei neue Tabellen `vorschau_page_testimonials(page_key, testimonial_id, sort_order)` und `vorschau_page_portfolio(page_key, portfolio_id, sort_order)` gesteuert (nur die verknüpften werden auf der jeweiligen Seite angezeigt; ist nichts verknüpft → Fallback alle sichtbaren, damit nichts kaputt geht).

RPCs `increment_taken_slot` / `decrement_taken_slot` bekommen Parameter `p_page_key text default 'v1'`.

## Hook

`useVorschauSettings(pageKey: 'v1' | 'v2' = 'v1')`:
- Lädt `vorschau_settings`, `vorschau_demos`, `vorschau_faqs` gefiltert nach `page_key`.
- Lädt Testimonials/Portfolio über die Verknüpfungstabellen (mit Fallback).
- Realtime-Channel pro pageKey.

## Seiten

- `KostenloseVorschau.tsx` → `useVorschauSettings('v1')` (Default, keine Änderung im Verhalten).
- `KostenloseVorschauV2.tsx` → `useVorschauSettings('v2')`. Slot-Reservierungs-RPCs mit `p_page_key='v2'`.

## Admin (`AdminVorschauTab.tsx`)

Ganz oben ein Tab- bzw. Select-Umschalter **„Seite: V1 / V2"**. Der gesamte bestehende UI-Block (Countdown, Plätze, Hero, Final-CTA, Sichtbarkeits-Switches, Demos, FAQs) wird einfach für die gewählte `page_key` gerendert – gleicher Code, anderer Datensatz.

Zusätzlich pro Seite:
- **Testimonials-Auswahl**: Multi-Select aus globalen `testimonials`, speichert in `vorschau_page_testimonials`.
- **Portfolio-Auswahl**: analog für `vorschau_page_portfolio`.

## Technische Details

- Migration ist additiv und rückwärtskompatibel (Default `'v1'`, V1 verhält sich unverändert).
- RLS: bestehende Policies erweitern wir auf die neuen Tabellen (öffentliches Read für sichtbare Inhalte, Admin schreibt über Service-Role wie heute).
- TypeScript-Typen in `useVorschauSettings.ts` und im Admin-Tab um `page_key` ergänzen.
- Realtime-Subscriptions in `useVorschauSettings` filtern serverseitig per `filter: page_key=eq.v2`.

## Was du danach im Admin kannst

Für V1 **und** V2 getrennt:
Plätze (total/taken), Countdown-Modus & -Ziel, Hero-Badge/H1/Sub/CTA, Final-CTA, alle Sichtbarkeits-Switches, Telefonnummer, Demo-Liste, FAQ-Liste, ausgewählte Testimonials und Portfolio-Projekte.
