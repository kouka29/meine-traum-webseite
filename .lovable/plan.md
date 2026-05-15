# Stripe Embedded Checkout für Kauf-Pakete + Sekundär-CTA "Anfragen"

## Ziel
Auf den drei Kauf-Karten (Starter 990 €, Pro 1.990 €, Premium 3.590 €) bekommt der **„Jetzt kaufen & starten"-Button** den Stripe Embedded Checkout für die **50 % Anzahlung**. Darunter ein **sekundärer Outline-Button „Lieber erst beraten lassen"**, der das bestehende `PricingLeadPopup` öffnet. Mini-Trust-Hinweis + Zahlungs-Logos darunter.

Die Miet-Karten und Enterprise bleiben unverändert (öffnen weiterhin das Popup).

---

## 1. Backend: Stripe Edge Functions

Voraussetzungen sind bereits da: `STRIPE_SANDBOX_API_KEY`, `PAYMENTS_SANDBOX_WEBHOOK_SECRET`, Produkte in Stripe angelegt (Deposit-Preise: `starter_purchase_deposit` 495 €, `pro_purchase_deposit` 995 €, `premium_purchase_deposit` 1.795 €).

Neu zu erstellen:
- `supabase/functions/_shared/stripe.ts` — Gateway-Client (`createStripeClient`, `verifyWebhook`)
- `supabase/functions/create-checkout/index.ts` — erstellt Embedded Checkout Session (`ui_mode: "embedded_page"`, `mode: "payment"`, `automatic_tax: { enabled: true }` für 19 % MwSt.)
- `supabase/functions/payments-webhook/index.ts` — empfängt `checkout.session.completed`, schreibt in neue `purchases`-Tabelle
- `supabase/config.toml` — `verify_jwt = false` für `create-checkout` und `payments-webhook`

**Tax-Mode:** Option 2 — `automatic_tax: { enabled: true }` (+0,5 %). Stripe rechnet 19 % MwSt. automatisch auf den Netto-Anzahlungsbetrag drauf. Keine Managed Payments (Zielmarkt DE, niedrige Volumina, wir wollen kein „LINK.COM*" auf der Bankabrechnung der Kunden).

## 2. Datenbank — neue Tabelle `purchases`

Felder: `stripe_session_id` (unique), `stripe_customer_id`, `stripe_payment_intent_id`, `package` (`starter|pro|premium`), `deposit_amount_cents`, `total_amount_cents` (= 2 × deposit), `currency`, `customer_email`, `customer_name`, `status` (`deposit_paid|completed|refunded`), `lead_id` (nullable FK auf `leads`), `environment`, `created_at`, `updated_at`.

RLS: nur Service-Role schreibt; Admin liest via bestehendem `admin-leads`-Pattern (`ADMIN_PASSWORD`).

## 3. Frontend — `WebdesignPreise.tsx`

**`BuyCard` umbauen** (`Pkg`-Typ erweitern um `priceId: string`):

```text
┌──────────────────────────────┐
│  [ Jetzt kaufen & starten →]│  ← gradient/primary, öffnet Stripe-Dialog
│  [ Lieber erst beraten     ]│  ← outline-primary, öffnet PricingLeadPopup
│  💳 Visa MC SEPA Klarna     │  ← graue Mini-Logos
│  50 % Anzahlung jetzt ·     │  ← text-xs muted
│  Rest bei Go-Live           │
└──────────────────────────────┘
```

Pro Karte:
- Primär-Button → `openStripeCheckout(pkg.priceId, pkg.name)`
- Sekundär-Button → `openPopup(pkg.badge)` (bestehendes Verhalten)
- Trust-Strip: 4 Mini-SVG-Logos (Visa, Mastercard, SEPA, Klarna) als Inline-SVGs in `text-muted-foreground`
- Zwei Zeilen Mini-Text (zahlungsmodell)

**Neue Komponente** `src/components/StripeCheckoutDialog.tsx`:
- Shadcn `Dialog` als Container
- Lädt `@stripe/stripe-js` + `@stripe/react-stripe-js` (Pin: `9.2.0` / `6.2.0`)
- Mountet `EmbeddedCheckoutProvider` + `EmbeddedCheckout` mit `clientSecret` aus `supabase.functions.invoke("create-checkout", { body: { priceId, environment } })`
- `return_url`: `${origin}/kauf-erfolgreich?session_id={CHECKOUT_SESSION_ID}`

**Neue Helfer-Datei** `src/lib/stripe.ts` — `getStripe()`, `getStripeEnvironment()` (aus `VITE_PAYMENTS_CLIENT_TOKEN`-Prefix abgeleitet).

**Neue Seite** `src/pages/KaufErfolgreich.tsx` — Dankesseite mit nächsten Schritten („Wir melden uns innerhalb von 24 h zur Onboarding-Mail …"), Route in `App.tsx` registrieren.

**`PaymentTestModeBanner`** im Layout einbauen — zeigt im Preview/Sandbox einen Hinweis; im Production-Build mit Live-Token unsichtbar.

## 4. Senior-Consultant-Hinweise (Geschäftslogik)

- **Subscription „Wachstumspaket" wird beim Direktkauf NICHT mitverkauft** — separate Upsell-Mail nach Go-Live (sonst Checkout zu komplex)
- Nach erfolgreichem Stripe-Checkout: automatische Confirmation-Mail mit:
  - Anzahlungs-Rechnung (Stripe generiert PDF)
  - Restzahlungs-Hinweis (50 % bei Go-Live)
  - Onboarding-Fragebogen-Link
- `lead_id` in `purchases` erlaubt späteres Verknüpfen, falls der Käufer vorher schon im Funnel war (Email-Match in Webhook)

## 5. Aufgabenreihenfolge

1. `_shared/stripe.ts`, `create-checkout`, `payments-webhook`, `config.toml`
2. Migration `purchases`-Tabelle + RLS
3. `priceId`-Feld zu `buyPackages` hinzufügen
4. `src/lib/stripe.ts`, `StripeCheckoutDialog`, `PaymentTestModeBanner`
5. `BuyCard` umbauen (zwei Buttons + Trust-Strip)
6. `KaufErfolgreich`-Seite + Route
7. Test: Sandbox-Karte `4242 4242 4242 4242` → Webhook → DB-Eintrag prüfen

## Außerhalb des Scopes (separate Schritte)

- Live-Mode-Aktivierung (Go-Live-Flow im Stripe-Dashboard)
- Restzahlungs-Rechnung (passiert manuell per Stripe-Dashboard nach Go-Live)
- Subscription-Checkout für Miet-Pakete (kommt separat — andere User-Journey)
