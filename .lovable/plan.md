
# Individuelles Angebotssystem — Implementierungsplan

## Übersicht

Zwei Teile:
1. **Admin-Erweiterung** im bestehenden `AdminLeads`-Dashboard: neuer Button pro Lead, "Angebot erstellen"-Modal, neuer Tab "Angebote", Supabase-Tabelle.
2. **Neue Route `/angebot`** mit PIN-Gate und vollständig gestalteter Angebotsseite (Hero, Leistungen, Preis, FAQs, CTA, Sticky-Bar, Abgelaufen-State).

---

## 1. Datenbank

Neue Tabelle `public.angebote` (via Migration) — exakt wie vom User vorgegeben, plus:
- RLS aktiv
- Policy: `Service role can manage angebote` (ALL, service_role) — Schreib-/Leseoperationen laufen über die Admin-Edge-Function mit Passwort-Check, nicht direkt vom Client
- Policy: `Anyone can read by id` (SELECT, anon) **NICHT** nötig — die Angebotsseite dekodiert alles aus dem Base64-Link, kein DB-Lookup erforderlich (PIN ist ebenfalls im Base64 enthalten, da das eh nur "soft gate" ist)
- Optionaler Index auf `erstellt_am DESC` für die Tabellen-Sortierung

> Hinweis: Da die komplette Angebotsdaten im Base64-Link liegen, ist die Tabelle nur fürs Admin-Tracking (Übersicht/Löschen). Das ist konsistent mit der Anforderung "Status berechnet aus ablauf_datum".

---

## 2. Admin-Erweiterung (`src/pages/AdminLeads.tsx` + neue Komponenten)

### 2A — Neuer Button pro Lead-Karte
- In der Lead-Karte (in der Action-Button-Reihe) neuer Outline-Button "Angebot erstellen" mit `FileText`-Icon
- Custom Styling: `border-[#4F3FF0] text-[#4F3FF0] bg-transparent hover:bg-[#4F3FF0]/10`
- onClick öffnet das neue `<AngebotModal lead={lead} />`

### 2B — Angebot-Modal (neue Komponente `src/components/admin/AngebotModal.tsx`)
- Dialog (shadcn) mit Scrollbereich
- Auto-fill aus Lead: `lead_name = first_name`, `lead_email = email`, Branche aus `trade`
- Felder:
  - Persönliche Nachricht (Textarea, maxLength 200, Zähler anzeigen)
  - PIN (5-stellig, numerisch) + "Zufällig generieren"-Button (`Math.floor(10000 + Math.random()*90000)`)
  - Preis (number, required), Normalpreis (number, optional)
  - Gültigkeit (Select: 7/14/30 Tage → berechnet `ablauf_datum`)
  - Stripe Payment Link (URL, required)
  - Leistungen: Array-State, 3 leere Default-Einträge, +Button bis max 6, Felder (emoji, titel, beschreibung), Löschen pro Eintrag
  - FAQs: Array-State, +Button bis max 5, Felder (frage, antwort), Löschen pro Eintrag
- Validation mit Zod vor Generierung
- "Angebot-Link generieren":
  1. Baut JSON-Payload aus allen Feldern
  2. Base64-kodiert (`btoa(unescape(encodeURIComponent(JSON.stringify(data))))` für UTF-8-Safety)
  3. URL: `https://meine-traum-webseite.de/angebot?d=<BASE64>`
  4. Speichert Datensatz in `angebote` via Admin-Edge-Function (siehe unten)
  5. Zeigt Erfolgs-Card: grüne Copy-Box mit Link, prominente PIN-Anzeige mit Copy, "Vorschau öffnen"-Button (`window.open`)

### 2C — Neuer Tab "Angebote"
- Neuer Tab nach "Referenzen", vor "Kostenlose Vorschau" mit `FileText`-Icon
- Neue Komponente `src/components/admin/AdminAngeboteTab.tsx`
- Tabelle: Kundenname / Email / Preis / Erstellt am / Läuft ab / Status / Aktionen
- Status: clientseitig aus `ablauf_datum` berechnet → grün/grau Badge
- Aktionen: "Link kopieren" (rebuild URL aus `base64_data`), "Löschen" (mit Confirm)
- Daten via Admin-Edge-Function laden

### Admin-Edge-Function-Erweiterung (`supabase/functions/admin-leads/index.ts`)
Das bestehende Admin-Endpoint mit Passwort-Check um Routen erweitern:
- `POST` mit `action: "create_angebot"` → Insert in `angebote`
- `POST` mit `action: "list_angebote"` → Select all
- `POST` mit `action: "delete_angebot", id` → Delete

Falls saubere Trennung gewünscht: neue Function `admin-angebote`. Entscheidung: **bestehende Function erweitern**, um Passwort-Gating und Codepfad zu teilen.

---

## 3. Neue Route `/angebot`

### Route-Registrierung
- In `src/App.tsx`: Lazy-Import `Angebot`, Route `<Route path="/angebot" element={<Angebot />} />`

### Seite `src/pages/Angebot.tsx`
- Liest `?d=<base64>` aus URL, dekodiert via `decodeURIComponent(escape(atob(...)))`
- Bei Decode-Fehler: Fallback-Card "Ungültiger Link"
- State: `unlocked: boolean`, `pinInput: string`, `pinError: boolean`

### 3A — PIN-Gate
- Fullscreen-Overlay mit zentrierter weißer Card
- `Lock`-Icon, Headline, Subline, 5-stelliges Password-Input
- Submit: vergleicht mit `data.pin` → bei korrekt: `setUnlocked(true)`
- Falscher PIN: roter Errortext

### 3B — Angebotsseite (nach Unlock)
Implementiert als eigenständige Komponenten in `src/pages/Angebot.tsx` oder Unterordner `src/components/angebot/`:
- `HeroSection` (Badge, H1 mit Gradient-Span auf "maßgeschneidertes", persönliche Nachricht, Countdown-Box)
- `CountdownTimer` (Hook mit `setInterval`, TT:HH:MM:SS, cleanup)
- `LeistungenGrid` (2-col → 1-col mobile)
- `PreisCard` (zentral, großer Preis, optional durchgestrichener Normalpreis)
- `FAQAccordion` (shadcn `Accordion`)
- `FinalCTA` (Gradient-Card, Button öffnet `stripe_link` in neuem Tab)
- `StickyBottomBar` (erscheint bei `scrollY > 0.3 * scrollHeight`, fixed bottom)
- `AbgelaufenOverlay` (wenn `Date.now() > ablauf_datum`: graues Fullscreen-Overlay mit Kontakt-CTA)

### Styling
- Eigenständige Sektion ohne Navbar/Footer → entweder Layout-Sonderfall via `useLocation` in `App.tsx` (Navbar/Footer ausblenden für `/angebot`) **oder** in der Page selbst ein eigenes Root-Layout. Empfehlung: **Navbar/Footer in `App.tsx` conditional ausblenden** (`pathname === "/angebot"`), damit die Seite vollflächig wirkt.
- Inline-Styles bzw. `style={{}}` mit den exakten Hex-Werten aus dem Brief — bewusst NICHT die globalen Design-Tokens, da der User explizit ein dediziertes Farbschema (#4F3FF0 etc.) für diese Seite fordert. Font "Plus Jakarta Sans" via Google-Fonts-Link in `index.html` (oder lokal im `<head>` der Page-Komponente injizieren).

### Copy-Sprache
- Alle Texte in formellem "Sie", Begriffe wie "Investitionsvolumen", "starten", "umsetzen", "Kapazität reserviert bis" — wie im Brief vorgegeben

---

## 4. Reihenfolge der Umsetzung

1. **Migration** für `angebote`-Tabelle (Approval durch User abwarten)
2. **Edge-Function** `admin-leads` um Angebot-Actions erweitern
3. **Admin-UI**: `AngebotModal` + Button in Lead-Karte + Tab + `AdminAngeboteTab`
4. **Route `/angebot`**: Page + Subkomponenten + Navbar/Footer-Hide-Logik
5. **Test**: Lead → Angebot generieren → Link öffnen → PIN eingeben → Seite prüfen → Countdown → Sticky-Bar → Abgelaufen-State (manuell mit `ablauf_datum` in Vergangenheit)

---

## Offene Punkte / Bestätigung erbeten

- **PIN-Sicherheit**: Da der PIN im Base64-Link mitkodiert ist, ist er für jeden, der den Link hat + Base64 dekodieren kann, sichtbar. Das ist ein "Soft-Gate" gegen versehentliches Weiterleiten, kein echter Schutz. → OK so, oder soll der PIN nur in DB liegen und beim Unlock per Edge-Function geprüft werden? (Letzteres ist sicherer, aber komplexer.)
- **Domain im Link**: Hardcoded `https://meine-traum-webseite.de/angebot` — OK, oder soll `window.location.origin` als Fallback in Dev/Preview greifen?
- **Navbar/Footer auf `/angebot`**: Ausblenden (Standalone-Look) — bestätigt?

