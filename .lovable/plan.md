## Ziel
Neuen Demo-Angebots-Eintrag `"ME-KA"` (Erik / Herr Meyer, Sie-Form) hinzufügen und im Angebots-Popup eine optionale Sie-Anrede unterstützen. Bestehendes CBI/ZAK-Verhalten bleibt bit-genau gleich.

## Änderungen

### 1. `src/config/demoOffers.ts`
- Interface `DemoOffer` um zwei optionale Felder erweitern:
  - `anrede?: "du" | "sie"` (default „du")
  - `anredeName?: string`
- Neuer Eintrag `DEMO_OFFERS["ME-KA"]`:
  - `slug: "ME-KA"`, `firstName: "Erik"`, `anrede: "sie"`, `anredeName: "Herr Meyer"`
  - `plan: "pro"`, `headline: "Pro-Website zum Preis von Starter"`
  - `sub: "Volle Pro-Leistung — Sonderkondition nur für Sie."`
  - `features`: 1:1 aus CBI übernehmen (keine du/Sie-Formen darin, Regressionsrisiko null).
  - `miete`: `coupon "MTW-Y1"`, `offerCode "mtw-y1"`, `price "59 €/Monat"`, `regular "99 €/Monat"`, `discountedNumber 59`, `regularNumber 99`, `note "1. Jahr Starter-Preis · danach 99 €/Monat · monatlich kündbar"`, `priceId "pro_rent_monthly"`.
  - `kauf`: `coupon "MTW-KAUF25"`, `offerCode "mtw-kauf25"`, `price "1.492,50 €"`, `regular "1.990 €"`, `discountedNumber 1492.5`, `regularNumber 1990`, `note "25 % Rabatt · einmalig · netto"`, `priceId "pro_purchase_deposit"`.
- `getDemoOffer` bleibt unverändert (bereits case-insensitiv via `toUpperCase`; `"ME-KA"` matcht exakt inkl. Bindestrich).

### 2. `src/components/DemoOfferPopup.tsx`
Einziger hardcodierter Du-Text ist die Begrüßung (Zeile 65):
```
Dein persönliches Angebot, {offer.firstName}
```
Anpassen zu:
```
{offer.anrede === "sie"
  ? `Ihr persönliches Angebot, ${offer.anredeName ?? offer.firstName}`
  : `Dein persönliches Angebot, ${offer.firstName}`}
```
Alle anderen Texte (`headline`, `sub`, `features`, `note`, Button-Labels wie „Miete sichern"/„Kaufen", Footer) sind neutral bzw. kommen 1:1 aus der Registry → bleiben unverändert. Kein Fall, in dem CBI/ZAK sich optisch/textlich verändert.

Hinweis Wortlaut: „Guten Tag Herr Meyer" aus dem Prompt ist eine Zwei-Wege-Formulierung. Im Popup steht bisher „Dein persönliches Angebot, …" — die konsistente Sie-Übersetzung dazu ist „Ihr persönliches Angebot, Herr Meyer". Wenn du stattdessen wortwörtlich „Guten Tag Herr Meyer" willst, sag Bescheid, dann tausche ich den Sie-Zweig entsprechend.

### 3. Voraussetzung DB (kein Code)
Wie bei ZAK: `discount_codes` muss die Zeilen für `MTW-Y1` und `MTW-KAUF25` mit aktivem Stripe-Coupon enthalten, damit der Rabatt serverseitig greift. Diese Codes sind bereits für ZAK vorgesehen — falls schon angelegt, keine weitere Aktion nötig.

## Nicht angefasst
- `CheckoutFunnel.tsx`, `WebdesignPreise.tsx`, Stripe-/Coupon-Logik, Preise, `priceId`s.
- CBI- und ZAK-Einträge.
- Verhalten von `/preise` ohne `demo`-Param.

## Akzeptanz
- `/preise?plan=pro&mode=miete&demo=ME-KA` → Popup mit Sie-Begrüßung („Ihr persönliches Angebot, Herr Meyer"), Miete-Karte 99 → 59 €/Monat inkl. Folgepreis-Hinweis, Kauf-Karte 1.990 € → 1.492,50 €.
- Checkout Miete → `MTW-Y1`, Checkout Kauf → `MTW-KAUF25` (via bestehende `offerCode`-Weiterleitung an `create-checkout`).
- `/preise?…&demo=CBI` und `/preise` ohne Params unverändert.
