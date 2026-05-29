# Kundenportal – Implementierungsplan (MVP)

Login per Magic Link. Account-Erstellung automatisch bei Buchung, manueller Lead-Anlage und Angebotserstellung. Bestandskunden auf Anfrage. Vier MVP-Features: Dashboard, Stripe-Rechnungen, Wunsch-Tickets, Stripe Customer Portal.

## 1. Auth-Setup (Magic Link)

- Supabase Auth: Email-Provider aktiv, Passwort-Signup **deaktiviert** (nur OTP/Magic Link)
- **Auto-Confirm: ON** (keine extra Bestätigungsmail – Login-Link bestätigt automatisch)
- Auth Redirect URLs (Site URL + Additional Redirects) auf Preview-, Published- und Custom-Domain
- Custom Auth Email Template für Magic Link (gebrandet, Poppins/Inter, Primary-Farbe)

## 2. Datenbank

**Neue Tabelle `customer_accounts`** (verknüpft `auth.users` mit Leads/Buchungen/Angeboten – ein Account kann mehrere Buchungen/Angebote haben):
- `user_id` (FK → auth.users), `email` (unique), `first_name`, `company_name`, `phone`, `stripe_customer_id`, `created_at`

**Neue Tabelle `customer_tickets`** (Wunsch-/Änderungstickets):
- `id`, `user_id`, `subject`, `message`, `status` (`open` | `in_progress` | `done`), `priority`, `attachments` (jsonb für Storage-Pfade), `admin_response`, `created_at`, `updated_at`

**Neue Tabelle `customer_ticket_messages`** (Verlauf/Threading):
- `id`, `ticket_id`, `author_type` (`customer` | `admin`), `message`, `attachments`, `created_at`

**Erweiterung bestehender Tabellen:**
- `leads`: `+ user_id uuid` (nullable, FK → auth.users)
- `buchungen`: `+ user_id uuid` (nullable)
- `angebote`: `+ user_id uuid` (nullable)

**RLS-Policies:**
- `customer_accounts`: User sieht/ändert nur eigene Zeile (`auth.uid() = user_id`)
- `customer_tickets` + `_messages`: User sieht nur eigene; INSERT nur mit eigener `user_id`
- `leads`/`buchungen`/`angebote`: zusätzliche SELECT-Policy „Eigene über user_id sichtbar"
- Service-Role behält Vollzugriff (Admin)

**Storage-Bucket `ticket-attachments`** (privat, User darf nur eigenen Ordner `{user_id}/...`).

## 3. Auto-Account-Erstellung (drei Trigger-Punkte)

Pro Punkt: Edge Function holt/erstellt User per `supabase.auth.admin.createUser({ email, email_confirm: true })`, legt `customer_accounts`-Zeile an, verknüpft `user_id` mit Lead/Buchung/Angebot. Idempotent über E-Mail.

1. **Buchung erfolgreich** (`buchung-bestaetigen` + `payments-webhook` `checkout.session.completed`): Account anlegen, `stripe_customer_id` speichern, Buchung verknüpfen, Willkommens-Mail mit „Jetzt einloggen"-Link.
2. **Manuelle Lead-Anlage im Admin** (`NewLeadModal`): Checkbox „Portal-Zugang anlegen" (default an) → ruft neue Edge Function `customer-create-account` auf.
3. **Angebotserstellung** (`AngebotModal`): Beim Erstellen eines Angebots → Account + Verknüpfung, Angebots-E-Mail enthält „Angebot im Kundenportal ansehen"-Link.

## 4. Kundenportal-Routen (`/kundenportal/...`)

- `/kundenportal/login` – E-Mail-Feld → `signInWithOtp({ email, options: { emailRedirectTo: '/kundenportal' } })` → „Check deine E-Mails"
- `/kundenportal` (geschützt) – **Dashboard**: Begrüßung, aktive Buchung(en) mit Paket-Name + Status, nächste Zahlung, offene Tickets, vorhandene Angebote zur Ansicht
- `/kundenportal/vertrag` – Paket, Extras, Laufzeit, Mietbeginn, Kündigungsinfos
- `/kundenportal/rechnungen` – Liste aus Stripe (`invoices.list` per Edge Function `stripe-customer-invoices`) mit PDF-Download-Link (`hosted_invoice_url` / `invoice_pdf`)
- `/kundenportal/tickets` – Liste + „Neuer Wunsch"-Button + Detail-View mit Threading + Bild-Upload
- `/kundenportal/angebote` – nur sichtbar wenn Angebote verknüpft, Link auf bestehende `/angebot/:id`-Seite
- `/kundenportal/einstellungen` – Stammdaten ändern (Name, Firma, Telefon) + Button „Zahlungsmethode & Abo verwalten" → Stripe Customer Portal

**Geschütztes Layout** `KundenportalLayout` mit Sidebar (Dashboard / Vertrag / Rechnungen / Wünsche / Angebote / Einstellungen / Logout), Session-Check via `onAuthStateChange` + `getUser()`, Redirect auf `/kundenportal/login` wenn nicht eingeloggt.

## 5. Neue Edge Functions

- `customer-create-account` – idempotent: User anlegen/finden, `customer_accounts` upsert, optional Verknüpfung (lead_id/buchung_id/angebots_id)
- `stripe-customer-invoices` – holt `stripe_customer_id` des eingeloggten Users → `stripe.invoices.list({ customer })` → gibt gefilterte Liste zurück (JWT-verified)
- `stripe-customer-portal` – erstellt `billingPortal.sessions.create({ customer, return_url })` → gibt URL zurück, Frontend redirected
- `customer-create-ticket` (oder direkt via RLS-INSERT) – Validierung + optional Admin-Benachrichtigungsmail
- `customer-admin-respond-ticket` (Admin) – Antwort schreiben + Kunden-Benachrichtigungsmail

Alle Edge Functions mit `verify_jwt = true` außer wo Webhook (Stripe).

## 6. Admin-Erweiterung

- Neuer Tab **„Tickets"** in `/admin`: Liste aller `customer_tickets` mit Filter (Status, Kunde), Detail-Drawer mit Antwort-Feld, Status-Setzen
- `NewLeadModal`: Checkbox „Portal-Zugang anlegen + Einladung senden"
- `AngebotModal`: nach Erstellen automatisch Account-Anlage + Einladungs-Mail mit Magic Link
- **Bestandskunden „auf Anfrage"**: Lead-Detail bekommt Button „Portal-Zugang anlegen & einladen" → ruft `customer-create-account`

## 7. E-Mail-Templates (transactional)

- `customer-welcome` – nach erster Account-Anlage („Dein Kundenportal ist bereit")
- `customer-magic-link` – Standard Supabase Auth-Mail, gebrandet
- `customer-ticket-created` – Admin-Benachrichtigung (du)
- `customer-ticket-response` – Kunden-Benachrichtigung („Wir haben deinen Wunsch beantwortet")

## 8. Out of Scope (Phase 2/3)

Onboarding-Checkliste, Asset-Library, Analytics-Anzeige, Empfehlungsprogramm im Portal, Upgrade-Flows, automatische Migration aller Bestandskunden. Wird nach MVP-Launch geplant.

## Technische Notizen

```text
auth.users ──┐
             ├── customer_accounts (1:1, user_id PK-ähnlich)
             │       │
             │       ├── leads (n:1 via user_id)
             │       ├── buchungen (n:1 via user_id)
             │       ├── angebote (n:1 via user_id)
             │       └── customer_tickets (n:1)
             │                └── customer_ticket_messages (n:1)
             │
Stripe Customer ↔ customer_accounts.stripe_customer_id
```

- Magic-Link-Mails laufen über bestehende Email-Infrastruktur (pgmq queue)
- Stripe Customer Portal muss im Stripe Dashboard einmalig konfiguriert werden (Branding, erlaubte Aktionen: Abo kündigen, Zahlungsmethode ändern, Rechnungen) – du machst das in **Stripe → Settings → Billing → Customer portal**
- Reihenfolge der Migrations: Tabellen + RLS → bestehende Tabellen erweitern → Storage-Bucket + Policies
- Bestehende `/angebot/:id`-Flow bleibt unverändert; Portal ist additiv