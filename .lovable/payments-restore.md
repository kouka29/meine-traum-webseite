# Payments Restore Guide

Stand: vor Remix deaktiviert. So aktivierst du Stripe-Checkout im geremixten Projekt wieder:

## 1. Stripe in Lovable Cloud aktivieren
- Lovable → Payments → Stripe (seamless) aktivieren.
- Dadurch werden automatisch gesetzt:
  - Secret `STRIPE_SANDBOX_API_KEY`
  - Secret `PAYMENTS_SANDBOX_WEBHOOK_SECRET`
  - Env-Var `VITE_PAYMENTS_CLIENT_TOKEN` (in `.env.development` / `.env.production`)

## 2. Produkte & Preise neu anlegen
Im geremixten Stripe-Account müssen die 6 Preise mit denselben `lookup_key`s erstellt werden:

| lookup_key | Modell | Brutto/Netto | Betrag (netto) | Typ |
|---|---|---|---|---|
| `starter_purchase_deposit` | Einzelkämpfer Kauf – 50 % Anzahlung | netto | siehe `WebdesignPreise.tsx` Kauf-Sektion | one-time |
| `pro_purchase_deposit` | Wachstums-Betrieb Kauf – 50 % Anzahlung | netto | siehe Code | one-time |
| `premium_purchase_deposit` | Marktführer Kauf – 50 % Anzahlung | netto | siehe Code | one-time |
| `starter_rent_monthly` | Einzelkämpfer Miete | netto | 59 €/Monat | recurring monthly |
| `pro_rent_monthly` | Wachstums-Betrieb Miete | netto | 99 €/Monat | recurring monthly |
| `premium_rent_monthly` | Marktführer Miete | netto | 159 €/Monat | recurring monthly |

Stripe Tax: aktiviert (19 % MwSt automatisch).
Mindestlaufzeit Mietmodell: 12 Monate (per `subscription_data.metadata` dokumentiert).

## 3. priceId-Felder in `src/pages/WebdesignPreise.tsx` wieder eintragen
Die folgenden `priceId`-Zeilen wurden vor dem Remix entfernt — bitte exakt wieder einfügen:

**rentPackages** (Array um Zeile 26):
```ts
// Einzelkämpfer
priceId: "starter_rent_monthly",
// Wachstums-Betrieb
priceId: "pro_rent_monthly",
// Marktführer
priceId: "premium_rent_monthly",
```

**buyPackages** (Array um Zeile 156):
```ts
// Einzelkämpfer
priceId: "starter_purchase_deposit",
// Wachstums-Betrieb
priceId: "pro_purchase_deposit",
// Marktführer
priceId: "premium_purchase_deposit",
```

## 4. Verifizieren
- `/preise` öffnen → Buttons "Website jetzt sichern" sollen den Stripe-Embedded-Checkout öffnen (nicht das Lead-Popup).
- Test-Kreditkarte: `4242 4242 4242 4242`, beliebiges zukünftiges Datum, beliebige CVC.
- Nach erfolgreichem Test-Kauf landet der Nutzer auf `/kauf-erfolgreich`.

## Was im Code unverändert bleibt (NICHT löschen!)
Diese Dateien sind weiterhin vorhanden und voll funktionsfähig — sie werden nur nicht mehr aufgerufen, solange die `priceId`s fehlen:
- `src/components/StripeCheckoutDialog.tsx`
- `src/components/PaymentTestModeBanner.tsx`
- `src/lib/stripe.ts`
- `supabase/functions/create-checkout/index.ts`
- `supabase/config.toml` → `[functions.create-checkout]` Block
- npm-Pakete: `@stripe/react-stripe-js`, `@stripe/stripe-js`

Der `StripeCheckoutDialog` wird in `WebdesignPreise.tsx` weiterhin gerendert, bleibt aber inaktiv (`open={false}`), solange kein `priceId` gesetzt ist.