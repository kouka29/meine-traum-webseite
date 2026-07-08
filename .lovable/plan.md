## Finding 2 — `coupon_applies_to_nothing` bei CBI-Y1 / CBI-KAUF25

### Diagnose (bestätigt)
`supabase/functions/create-checkout/index.ts` baut alle Line-Items als ad-hoc `price_data` mit `product_data.name` (keine feste Stripe-Product-ID). Wenn ein Coupon in Stripe eine `applies_to.products`-Einschränkung hat, findet Stripe kein passendes Produkt → `StripeInvalidRequestError: coupon_applies_to_nothing` → 500. Zusätzlich läuft eine „MwSt. 19%"-Position immer mit, die von einem produkt-restringierten Coupon nie abgedeckt sein kann.

### Zwei mögliche Wege — bitte auswählen

**A) Operativer Fix (empfohlen, kein Code)**
Im Stripe-Dashboard bei den beiden Coupons `CBI-Y1` und `CBI-KAUF25` die „Specific products"-Einschränkung entfernen (auf „All products" stellen). Danach funktioniert der bestehende Flow ohne Codeänderung, weil die Coupons dann auf jedes Line-Item angewendet werden können. MwSt. wird von Stripe automatisch entsprechend proportional gekürzt.

**B) Code-Fix (Server berechnet Rabatt selbst)**
`session.discounts` entfernen. Stattdessen im Server aus `metadata.offer_code` + `DEMO_OFFERS` den Zielpreis auflösen und die primäre Paket-Line-Item auf `unit_amount = discountedNumber * 100` reduzieren, bevor MwSt. berechnet wird. Trusted-Totals-Check bleibt zuerst gegen den Regulärbetrag (aus `buchungen`) laufen — Rabatt wird erst danach angewendet.

Nachteile B:
- CBI-Y1 („40 € Rabatt für 12 Monate") lässt sich in einer Stripe-Subscription ohne Coupon nicht sauber zeitlich befristen — wir müssten entweder (a) den Kunden nach 12 Monaten manuell hochstufen, oder (b) einen zweiten Sub-Zyklus über Stripe-Automation abbilden. Weg A vermeidet das komplett.
- Duplizierte Preis-Logik zwischen `demoOffers.ts` (Client) und Edge-Function (Server), muss synchron gehalten werden.

### Empfehlung
Weg **A** — Coupons in Stripe auf „All products" umstellen. Kein Code-Change nötig, keine Neu-Implementierung der 12-Monats-Rabattlogik, keine Duplizierung von Preisregeln.

Wenn A gewählt: Ich markiere Finding 2 als „fixed (operational)" und der bestehende Server-Code funktioniert unverändert.
Wenn B gewählt: Ich baue die Server-seitige Rabattberechnung für den Kauf-Pfad (CBI-KAUF25 = −25 % einmalig) und lasse den Miete-Pfad (CBI-Y1) weiterhin über den Stripe-Coupon laufen (der dann in Stripe auf „All products" umgestellt sein muss).
