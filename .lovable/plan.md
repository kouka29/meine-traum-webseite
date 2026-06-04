## Ziel

Beim Einmalkauf einer Website kann der Kunde verbindlich das Wachstumspaket dazubuchen. Sofort wird nur die Webseiten-Anzahlung via Stripe gezogen. Das Wachstumspaket wird als „gebucht (Rechnung)" gespeichert und nach Go-Live monatlich per Stripe-Invoice (mit Bezahllink Karte/SEPA/Überweisung) abgerechnet. Im Kundenportal kann der Kunde jederzeit auf automatisches Stripe-Abo umstellen.

## Was gebaut wird

### 1. Datenbank – neue Tabelle `growth_subscriptions`

```text
id, user_id (nullable bis Account verknüpft), customer_email,
purchase_id (FK purchases), package (basic|plus|premium),
monthly_amount_cents, billing_mode (manual_invoice | stripe_auto | cancelled),
status (pending_golive | active | past_due | cancelled),
min_term_months (12), started_at (= Go-Live), next_invoice_at,
stripe_subscription_id (nullable), stripe_customer_id,
created_at, updated_at
```

RLS: Kunde sieht eigene Zeile, service_role schreibt.

### 2. Checkout (`CheckoutFunnel` + `create-checkout`)

- Wachstumspaket bleibt im UI auswählbar, geht aber **nicht** als Line-Item zu Stripe
- Neue Pflicht-Checkbox vor Bezahlung: *"Ich bestelle verbindlich das Wachstumspaket [X] zu Y €/Monat. Mindestlaufzeit 12 Monate ab Go-Live, danach monatlich kündbar. Abrechnung zunächst per Rechnung."*
- Stripe-Metadata: `growth_package`, `growth_amount_cents`

### 3. Webhook (`payments-webhook`)

Bei `checkout.session.completed` mit `growth_package` in Metadata:
- Lege `growth_subscriptions`-Zeile an: `status=pending_golive`, `billing_mode=manual_invoice`
- Versende Bestätigungsmail „Wachstumspaket vorgemerkt – Abrechnung startet ab Go-Live"

### 4. Admin – Go-Live-Button

Im `AdminAngeboteTab` / Kundenliste: Button **„Website ist live → Wachstumspaket aktivieren"**
- Setzt `status=active`, `started_at=now()`, `next_invoice_at=now()+1 Monat`
- Triggert sofort erste Rechnung

### 5. Edge Function `growth-invoice-create` (intern, von Cron + Admin getriggert)

- Holt fällige Zeilen (`status=active`, `billing_mode=manual_invoice`, `next_invoice_at <= now()`)
- Erstellt für jede: Stripe Invoice (`auto_advance=true`, `collection_method=send_invoice`, `days_until_due=14`, `payment_settings.payment_method_types=['card','sepa_debit','customer_balance']`) → Stripe versendet Mail mit Bezahllink **und** zeigt IBAN für klassische Überweisung
- Setzt `next_invoice_at += 1 Monat`

### 6. Cron via `pg_cron`

Täglich 08:00 → ruft `growth-invoice-create` auf.

### 7. Kundenportal – neue Seite `/kundenportal/wachstumspaket`

- Karte „Wachstumspaket [Name] – Aktiv seit X" + nächste Rechnung + Status letzter Rechnung
- Tab/Button **„Auf automatische Stripe-Zahlung umstellen"** → öffnet Embedded Checkout `mode: "subscription"` mit passendem `lookup_key` (`growth_basic_monthly` etc.)
- Webhook bei `customer.subscription.created` mit Metadata `migrate_growth_id`: setzt `billing_mode=stripe_auto`, `stripe_subscription_id`, stoppt manuelle Invoices
- **Kündigen** (nach 12 Monaten Mindestlaufzeit): setzt `cancelled_at`, läuft bis Ende des bezahlten Monats

### 8. Dashboard-Hinweis

Dashboard-Karte „Wachstumspaket aktiv – Abrechnung per Rechnung" mit CTA „Jetzt auf Auto-Abzug umstellen (spart Bearbeitungsaufwand)".

### 9. Stripe-Produkte (nur Sandbox, sync nach Live automatisch)

`payments--create_product` + `create_price`:
- `growth_basic_monthly` – 29 €
- `growth_plus_monthly` – 49 €
- `growth_premium_monthly` – 79 €

## Reihenfolge der Umsetzung

1. Migration `growth_subscriptions` + RLS + Grants
2. Stripe-Produkte für Abo-Variante anlegen
3. `CheckoutFunnel`: Pflicht-Checkbox + Metadata
4. `payments-webhook`: Wachstumspaket-Eintrag bei Kauf anlegen + Bestätigungsmail
5. Edge Function `growth-invoice-create` + pg_cron
6. Admin Go-Live Button
7. Kundenportal-Seite + Stripe-Abo-Migration (inkl. Webhook-Handling)
8. Dashboard-Karte + Navigation

## Was bewusst NICHT gemacht wird

- Keine eigene PDF-Rechnungs-Engine (Stripe Invoice macht alles inkl. Mail)
- Keine eingebaute Zahlungsabgleich-Logik für klassische Überweisungen – läuft über Stripe `customer_balance`/Banking
- Keine automatische Account-Erstellung für Kunden ohne Login – Verknüpfung per Email beim ersten Login

Soll ich so starten?