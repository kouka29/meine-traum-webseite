## Buchungsplattform mit Stripe & Google Calendar in /preise

Vollwertige Buchungs- und Bezahlplattform direkt auf der Preisseite. Kunden können ein Paket wählen, einen Termin buchen, der automatisch in den Google Kalender synchronisiert wird, und sicher bezahlen (Anzahlung oder Vollbetrag) via Stripe.

---

### 1. Bezahlung – Lovable Payments (Stripe)

- Lovable's eingebaute Stripe-Integration aktivieren (`enable_stripe_payments`) – kein eigener Stripe-Account nötig, Test-Modus sofort verfügbar.
- Vorher Eligibility-Check (`recommend_payment_provider`) laufen lassen.
- Pro Paket auf `/preise` ein Stripe-Produkt + Preis anlegen:
  - **Starter** – Anzahlung 199 € (Rest nach Go-Live)
  - **Business** – Anzahlung 299 €
  - **Premium / Enterprise** – Beratungstermin 0 € (nur Buchung, keine Zahlung) oder Anzahlung 499 €
- Optional: Miet-Pakete als Stripe **Subscription** (monatlich wiederkehrend).
- Tax-Handling: „Tax calculation only" (+0,5 %) – passend für DE/EU B2B mit Reverse Charge.

### 2. Buchung – eigener Slot-Kalender

- Neue Tabelle `bookings` (Datum, Uhrzeit, Lead-ID, Paket, Stripe-Session-ID, Status: `pending` / `paid` / `confirmed` / `cancelled`, Google-Event-ID).
- Neue Tabelle `availability_rules` (Wochentag, Start/Ende, Slot-Dauer, Puffer) – Admin-konfigurierbar.
- Edge Function `get-available-slots`: berechnet freie Slots aus Regeln minus bereits gebuchte.
- Doppelbuchungs-Schutz via DB-Unique-Constraint (`booking_date`, `booking_time`).

### 3. Google Calendar Sync

- Google Calendar Connector verbinden (OAuth-Flow für deinen Agentur-Kalender).
- Edge Function `sync-booking-to-calendar`:
  - bei Status `paid` → Event erstellen (Titel „[Paket] – [Kunde]", Teilnehmer = Kunde, Google-Meet-Link automatisch).
  - bei Storno → Event löschen.
- Verfügbarkeit zusätzlich gegen Google-Kalender prüfen (busy-Slots ausblenden).

### 4. UX auf /preise (mobil-optimiert, conversion-fokussiert)

```text
[Paket-Karte]
   ↓ Klick „Termin buchen & sichern"
[Modal Step 1: Kalender]  Datum + verfügbare Slots als große Touch-Targets (≥56 px)
   ↓
[Modal Step 2: Kontaktdaten]  Vorname, Firma, Telefon, E-Mail (FloatingFields wie PricingLeadPopup)
   ↓
[Modal Step 3: Bezahlung]  „Jetzt 199 € anzahlen – Restbetrag nach Freigabe"
   ↓ Stripe Checkout (neuer Tab)
   ↓ Webhook bestätigt Zahlung
[Success Page /buchung-erfolgreich]  Termin + Google-Meet-Link + Kalender-Datei (.ics)
```

- Kein-Risiko-Copy: „100 % Geld-zurück, falls Demo nicht überzeugt"
- Trust-Signale unter CTA: Stripe-Logo, SSL, „12 Betriebe vertrauen uns"
- Sticky Mobile-CTA bleibt erhalten

### 5. Edge Functions & Webhooks

- `create-checkout-session` – legt Stripe-Session an mit Booking-Metadata
- `stripe-webhook` (`verify_jwt = false`) – `checkout.session.completed` → Booking auf `paid`, triggert Calendar-Sync + Bestätigungs-E-Mail
- `cancel-booking` – Storno + Refund via Stripe API + Calendar-Event löschen

### 6. Admin-Bereich

- Neuer Tab „Buchungen" in `/admin`: Liste aller Bookings (Status, Zahlung, Kalender-Sync), Storno-Button, manueller Status-Wechsel.
- Verfügbarkeitsregeln editierbar (Mo–Fr 9–17, Slot 30 min etc.).

### 7. E-Mail-Flow (nutzt vorhandenes `send-transactional-email`)

- `booking-confirmation` (existiert bereits) – an Kunde nach Zahlung
- Neue Vorlage `booking-internal` – an Inhaber

---

### Technische Reihenfolge

1. Stripe aktivieren + Produkte anlegen
2. DB-Migration: `bookings`, `availability_rules`
3. Edge Functions: slots, checkout, webhook, calendar-sync
4. Google Calendar Connector verbinden
5. UI: Booking-Modal in `/preise` (3-Step), Success-Page
6. Admin-Tab Buchungen
7. End-to-End-Test im Stripe-Test-Modus

---

### Klärungsbedarf vor Implementierung

1. **Bezahlmodell**: Anzahlung pro Paket (z. B. 199/299/499 €) **oder** Vollpreis sofort **oder** nur kostenloses Erstgespräch buchen + Zahlung später per Rechnung?
2. **Slot-Verfügbarkeit**: feste Zeiten (Mo–Fr 9–17, 30 min) oder soll ich aus deinem Google-Kalender freie Slots ziehen?
3. **Welcher Google-Account** wird Kalender-Owner (für OAuth-Verbindung)?
4. **Subscription** für Miet-Pakete oder erstmal nur Einmal-Zahlungen?
