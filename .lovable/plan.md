
# Plan: /kostenlose-vorschau als ehrliches Bewerbungs-Gate

## Ziel
Aktuelle Seite (`KostenloseVorschauV2`) durch ein ehrliches Bewerbungs-Gate ersetzen: Single-Page-Scroll mit Hero, Ablauf, Aussortier-Sektion, Bewerbungsformular, FAQ. Kein Fake-Timer, kein Verkaufsdruck. Plätze werden dynamisch geprüft — bei 0 freien Plätzen wird das Formular zur Warteliste.

## Routing
- Neue Datei `src/pages/KostenloseVorschauBewerbung.tsx` → `/kostenlose-vorschau`
- Alte Seite bleibt unter `/kostenlose-vorschau-alt` (Navigate-Aliases bleiben unverändert)
- `hideChatBot`-Regel in `src/App.tsx` erweitern: startsWith `/vorschau-start` **oder** `/kostenlose-vorschau` → KI-Bot wird hier ausgeblendet, nur WhatsApp-Floater bleibt

## Backend

### Neue Tabelle `vorschau_bewerbungen` (Migration)
Spalten (domänenspezifisch):
- `name`, `firmenname`, `gewerk`, `ort`
- `hat_website` (bool), `website_url` (nullable)
- `warum` (text, min. 30), `timeline`, `budget`
- `telefon`, `email`
- `status` — Default `neu`; erlaubt: `neu` | `freigegeben` | `abgelehnt` | `warteliste`
- `typ` — `bewerbung` | `warteliste`
- `source_cta` — Default `kostenlose-vorschau`
- Standard `id`, `created_at`, `updated_at`

Zugriff:
- INSERT für **anon + authenticated** (öffentliches Bewerbungsformular, kein Login)
- SELECT/UPDATE/DELETE nur `service_role` (Muad prüft im Admin-Bereich mit Admin-Passwort-Flow, nicht via Data API)
- RLS an, Grants sauber gesetzt

### Plätze
- Keine harte Konstante. Quelle: bestehende Tabelle `vorschau_settings` mit `page_key = "global"` (dieselbe Zahl, die Muad im Admin unter „Vorschau" pflegt) — `total_slots`
- Belegte Plätze = `count(*)` aus `vorschau_bewerbungen` mit `status = 'freigegeben'` im aktuellen Kalendermonat (`created_at`)
- `PLAETZE_FREI = max(0, total_slots - belegt)`
- Beide Queries beim Mount parallel; bei Fehler → fail-open (Formular bleibt „Bewerbung absenden", nicht Warteliste)

### Telegram-Notify
- Bestehende Edge Function `notify-lead` wiederverwenden (Text-Payload wie in Masterprompt spezifiziert, unterschiedlicher Text für Bewerbung vs. Warteliste)

## Seitenstruktur (Single-Page)

1. **Hero** — Headline „Kostenlose Website-Vorschau — aber nicht für jeden.", Subline mit `{PLAETZE_PRO_MONAT}`, zwei Status-Chips (Plätze frei grün/rot + aktueller Monat auf Deutsch), Primär-CTA scrollt zum Formular, Sekundärtext „Bewerbung dauert 90 Sekunden."
2. **So läuft's ab** — 3 nummerierte Cards mit Icons (Bewerbung → Prüfung ≤24 h → Onboarding + Vorschau)
3. **Warum wir aussortieren** — sachliche Liste (Branche, fehlende Infos, unrealistische Erwartung), Abschlusssatz
4. **Bewerbungsformular** — Card mit allen Feldern, Zod-Validierung, Datenschutz-Checkbox → `/datenschutz`, Submit-Button-Label + Info-Text abhängig von `PLAETZE_FREI`, Doppel-Submit blockiert, Inline-Success-State (keine Weiterleitung)
5. **FAQ** — shadcn Accordion mit den 5 vorgegebenen Fragen
6. **Floating WhatsApp-Button** — Nummer `+49 6131 3076500` (`https://wa.me/4961313076500`), Standard-MTW-Style, unten rechts, nur auf dieser Seite gerendert (globalen ChatAssistant hier deaktiviert)

## Design
- Bestehendes MTW-Design-System, semantische Tokens (`gradient-subtle-bg`, `text-foreground`, `bg-card`, `border-border`, `text-primary`), Poppins Headline / Inter Body
- Ruhig, viel Whitespace, keine Warn-Farben in der Aussortier-Liste
- Mobile-first: Buttons ≥ 48 px, `inputmode="tel"`, `type="email"`, Textarea min-height, Datenschutz-Checkbox groß genug
- `framer-motion`: einmaliges sanftes Reinfaden der Status-Chips im Hero, sonst zurückhaltend

## Validierung (Zod + react-hook-form, bestehendes Pattern)
- Alle Pflichtfelder
- Telefon: DE-Format tolerant (mit/ohne `+49`, Leerzeichen erlaubt) über Regex, normalisiert vor Insert
- E-Mail: Zod `.email()`
- `warum`: min. 30 Zeichen
- Datenschutz-Checkbox: muss `true` sein
- Submit-Button erst aktiv wenn Form gültig

## SEO
- `PageMeta` mit Titel „Kostenlose Website-Vorschau bewerben | MTW", Description < 160 Zeichen, `noindex=false`, canonical auf `/kostenlose-vorschau`
- Einzelne H1, semantische Sections

## Technische Details

Dateien:
- **NEU** `src/pages/KostenloseVorschauBewerbung.tsx` — komplette Seite (Hero, Sections, Formular, FAQ, WhatsApp-Floater)
- **NEU** `src/pages/kostenlose-vorschau/schema.ts` — Zod-Schema + Typen
- **NEU** Migration `create_vorschau_bewerbungen` (Table + Grants + RLS + Policies + `updated_at`-Trigger)
- **EDIT** `src/App.tsx` — Route-Import tauschen; Alt-Komponente auf `/kostenlose-vorschau-alt` mounten; `hideChatBot`-Bedingung erweitern
- **KEINE** Änderung an `src/integrations/supabase/client.ts` / `types.ts` (types werden nach Migration-Approval regeneriert)

Reihenfolge in der Umsetzung:
1. Migration einreichen (Approval durch User)
2. Nach Approval: Datei mit Formular anlegen (nutzt regenerierte Types), Route umbiegen, `hideChatBot` erweitern, altes Layout auf Alias mounten
3. Kurzer Bau-/Smoke-Check
