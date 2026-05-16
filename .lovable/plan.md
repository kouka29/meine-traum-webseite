# Plan: Stripe-Payments reaktivieren

Stand: Die Stripe-Secrets (`STRIPE_SANDBOX_API_KEY`, `PAYMENTS_SANDBOX_WEBHOOK_SECRET`) sind noch im Projekt vorhanden. Edge Functions (`create-checkout`, `payments-webhook`), `StripeCheckoutDialog`, `src/lib/stripe.ts` und die npm-Pakete sind unverändert da. Es fehlen nur die `priceId`-Zeilen in `src/pages/WebdesignPreise.tsx` sowie ggf. die Payments-Connection in Lovable Cloud.

## Schritt 1 — Stripe Payments Connection prüfen (Du)
Öffne **Lovable Cloud → Payments**. Falls die Verbindung noch besteht (Status „Connected"), weiter zu Schritt 2. Falls nicht: **Stripe Payments neu aktivieren** (seamless). Dadurch werden ggf. `VITE_PAYMENTS_CLIENT_TOKEN` und die Webhook-URL automatisch neu gesetzt.

## Schritt 2 — Produkte/Preise im Stripe-Sandbox prüfen (Du)
Es müssen 6 Preise mit folgenden `lookup_key`s existieren (gleiche wie vorher):

| lookup_key | Modell | Typ |
|---|---|---|
| `starter_purchase_deposit` | Einzelkämpfer Kauf – 50% Anzahlung | one-time |
| `pro_purchase_deposit` | Wachstums-Betrieb Kauf – 50% Anzahlung | one-time |
| `premium_purchase_deposit` | Marktführer Kauf – 50% Anzahlung | one-time |
| `starter_rent_monthly` | Einzelkämpfer Miete | recurring monthly |
| `pro_rent_monthly` | Wachstums-Betrieb Miete | recurring monthly |
| `premium_rent_monthly` | Marktführer Miete | recurring monthly |

Falls sie noch da sind: nichts tun. Falls nicht: Sag mir Bescheid, dann lege ich sie via Stripe-Tool im Sandbox neu an.

## Schritt 3 — `priceId`-Felder im Code wieder eintragen (Ich)
In `src/pages/WebdesignPreise.tsx`:
- `rentPackages`: je `priceId: "starter_rent_monthly" | "pro_rent_monthly" | "premium_rent_monthly"`
- `buyPackages`: je `priceId: "starter_purchase_deposit" | "pro_purchase_deposit" | "premium_purchase_deposit"`

Damit aktiviert sich der bereits gerenderte `StripeCheckoutDialog` automatisch wieder, und die Buttons „Website jetzt sichern" öffnen den Stripe Embedded Checkout statt des Lead-Popups.

## Schritt 4 — Verifizieren (Ich + Du)
- `/preise` öffnen → Buttons „Website jetzt sichern" öffnen den Stripe-Dialog.
- Sandbox-Testkarte `4242 4242 4242 4242` → Erfolg landet auf `/kauf-erfolgreich`.
- `purchases`-Tabelle prüfen (Webhook-Eintrag).

## Schritt 5 — Aufräumen
- `.lovable/payments-restore.md` löschen (nicht mehr benötigt).

---

**Bitte bestätige kurz:** Ist die Stripe-Payments-Connection in Lovable Cloud noch aktiv (Schritt 1) und sind die 6 Preise im Sandbox noch vorhanden (Schritt 2)? Dann setze ich Schritt 3 direkt um.