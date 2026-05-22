# Plan — Guided Checkout Funnel auf /a/[slug]

## Was gebaut wird

Ein 4-Schritt-Funnel der sich öffnet, sobald der Kunde ein Paket wählt. Desktop = Side-Panel rechts, Mobile = Full-Screen Bottom-Sheet. Endet direkt im Stripe Embedded Checkout.

```
Paket-Klick → Step 1: Zahlungsmodell → Step 2: Add-Ons → Step 3: Kontaktdaten → Step 4: Checkout (Stripe)
```

## Funnel-Verhalten

- **Trigger:** Klick auf "Paket wählen" Button öffnet sofort den Funnel-Container (kein zusätzlicher Scroll)
- **Desktop:** Side-Panel 480px breit, gleitet von rechts rein, Hintergrund abgedunkelt
- **Mobile:** Bottom-Sheet Full-Screen, von unten hochfahrend, ein Schritt pro Screen
- **Progress:** Desktop = Bar mit Labels (●━━●━━○━━○), Mobile = nur Punkte
- **Navigation:** "Zurück" oben links, "Weiter" sticky unten, Selection persistiert beim Hin/Her
- **Sticky Summary:** Aktueller Preis immer sichtbar (Desktop oben rechts im Panel, Mobile in der Bottom-Bar)

## Die 4 Schritte im Detail

### Step 1 — Zahlungsmodell wählen
Zwei große Karten nebeneinander (Desktop) / untereinander (Mobile):
- **Einmalkauf** — z.B. 2.490 € (Card mit Icon, Vorteilen: "Website gehört Ihnen", "keine laufenden Kosten")
- **Monatliche Miete** — z.B. 139 €/Monat (Card mit Badge "EMPFOHLEN", Vorteilen: "niedrigere Einstiegshürde", "alles inklusive")
- Eine Karte ist standardmäßig markiert (Miete, da niedrigerer Einstieg)

### Step 2 — Add-Ons / Upsells
Pro Angebot vom Admin konfigurierte Liste. Toggle-Cards mit:
- Icon + Name (z.B. 🛡️ Care-Paket Basic)
- Beschreibung (1 Zeile)
- Preis (+49 €/Monat oder +290 € einmalig)
- Optional: "Empfohlen"-Badge + Social Proof ("78% wählen das")
- Mehrfach-Auswahl möglich
- "Überspringen"-Link für die, die nichts wollen

### Step 3 — Kontaktdaten
Minimal: Vorname, Nachname, Firma, E-Mail, Telefon. AGB + Kostenpflichtig-Bestätigung. Speichert Lead-Eintrag in `leads`-Tabelle.

### Step 4 — Stripe Embedded Checkout
- Direkt im Funnel eingebettet (kein Redirect)
- Server-Funktion `create-checkout-funnel` baut Stripe Session dynamisch mit `price_data` aus gewählten Items
- Pro Zahlungsart entscheidet das Angebot: voller Betrag, Anzahlung (Prozent), oder Subscription
- Return-URL: bestehende `/kauf-erfolgreich`

## Datenmodell-Erweiterung

### `angebote` Tabelle — neue Spalten
- `addons` (jsonb) — Array von `{ id, name, description, price_cents, price_type: 'one_time'|'monthly', recommended, default_selected }`
- `payment_config` (jsonb) — `{ kauf: { mode: 'full'|'deposit', deposit_percent }, miete: { monthly_cents } }`
- (bereits vorhanden: `preis`, `normalpreis` für Einmalkauf)

### Neue Tabelle: `buchung_addons`
Nur falls für Reporting nötig — sonst in `buchungen.addons` (existiert schon).

## Admin-Bereich Erweiterung

Im `AngebotModal.tsx` neuer Tab/Section: **"Funnel-Konfiguration"**:

1. **Zahlungsarten** — Toggle pro Zahlungsart aktiv/inaktiv, Eingabe für Anzahlungs-%, Eingabe für Mietpreis
2. **Add-Ons** — Liste mit Add/Remove, pro Add-On:
   - Name, Beschreibung, Preis, Typ (einmalig/monatlich)
   - Checkbox "Empfohlen"
   - Checkbox "Standardmäßig vorausgewählt"
3. **Vorlagen-Auswahl** — Buttons "Care Basic", "Care Premium", "Logo-Design", "SEO Setup" als Quick-Insert für gängige Add-Ons (befüllen das Formular vor, Admin kann editieren)

## Neue Dateien

- `src/components/angebot/CheckoutFunnel.tsx` — Container mit Step-Logik, responsive
- `src/components/angebot/funnel/StepZahlungsmodell.tsx`
- `src/components/angebot/funnel/StepAddOns.tsx`
- `src/components/angebot/funnel/StepKontakt.tsx`
- `src/components/angebot/funnel/StepCheckout.tsx`
- `src/components/angebot/funnel/FunnelSummary.tsx` (sticky Preis-Anzeige)
- `src/components/admin/AngebotFunnelConfig.tsx` (neuer Admin-Tab)
- `supabase/functions/create-checkout-funnel/index.ts`

## Geänderte Dateien

- `src/pages/Angebot.tsx` — Paket-Buttons öffnen Funnel statt direktem Checkout
- `src/components/admin/AngebotModal.tsx` — neuer Funnel-Config-Tab
- DB-Migration für neue `angebote`-Spalten

## Reihenfolge der Umsetzung

1. **DB-Migration** — neue Spalten in `angebote` (mit sinnvollen Defaults für bestehende Angebote)
2. **Admin-UI** — Funnel-Config im `AngebotModal` (Test-Angebot konfigurieren)
3. **Funnel-Komponente** — Container + 4 Steps, responsive
4. **Edge Function** — `create-checkout-funnel` (Stripe `price_data` dynamisch)
5. **Integration** — Paket-Buttons in `Angebot.tsx` mit Funnel verdrahten
6. **QA** — Desktop + Mobile durchklicken

## Offene Fragen (kann ich später klären, blockieren nicht)

- Exakte Stripe-Behandlung von Subscription + One-Time-Addon im selben Checkout (Stripe erlaubt Mix in einer Session — wird in der Edge Function gelöst)
- Mailchimp/Mail-Trigger bei Lead-Creation aus Funnel (bestehende Logik wird wiederverwendet)

## Technische Notizen

- Funnel-State liegt lokal im Container (useState mit `{ paymentMode, selectedAddons, contact }`)
- Bei Funnel-Schließen ohne Abschluss: Lead wird NICHT gespeichert (erst ab Step 3 mit Bestätigung)
- Mobile-Breakpoint: 768px — darüber Side-Panel, darunter Bottom-Sheet
- Animationen: Tailwind `transition-transform` + `translate-x-full`/`translate-y-full` Slide-In
