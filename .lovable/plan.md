## Ziel

Neuen Demo-Slug `ME-KA` (Erik Meyer, Sie-Form) im MTW-Projekt scharfschalten. Prompt B betrifft ein separates Demo-Projekt und wird hier NICHT umgesetzt.

## Änderungen (nur MTW / dieses Repo)

### 1. `src/config/demoOffers.ts` — Typ erweitern

`DemoOffer`-Interface um zwei optionale Felder ergänzen:

```ts
anrede?: "du" | "sie";   // default: "du"
anredeName?: string;     // z. B. "Herr Meyer"
```

Bestehende Einträge (CBI, ZAK) bleiben unverändert und ohne diese Felder → Default „du" → keine Regression.

### 2. `src/config/demoOffers.ts` — Eintrag `ME-KA` ergänzen

Neuer Eintrag im `DEMO_OFFERS`-Objekt, Key in Anführungszeichen wegen Bindestrich. Struktur analog zu CBI/ZAK, damit `DemoOfferOption` (mit `offerCode`, `discountedNumber`, `regularNumber`) korrekt befüllt ist:

- `slug: "ME-KA"`, `firstName: "Erik"`, `anrede: "sie"`, `anredeName: "Herr Meyer"`, `plan: "pro"`
- `headline`, `sub`, `features` wie in der Vorgabe (Sie-Form-Texte 1:1)
- `miete`: `coupon: "MTW-Y1"`, `offerCode: "mtw-y1"`, `price: "59 €/Monat"`, `regular: "99 €/Monat"`, `discountedNumber: 59`, `regularNumber: 99`, `note` wie vorgegeben, `priceId: "pro_rent_monthly"`
- `kauf`: `coupon: "MTW-KAUF25"`, `offerCode: "mtw-kauf25"`, `price: "1.492,50 €"`, `regular: "1.990 €"`, `discountedNumber: 1492.5`, `regularNumber: 1990`, `note` wie vorgegeben, `priceId: "pro_purchase_deposit"`
- `features`-Liste: gleiche 5 Bullets wie CBI/ZAK (bereits neutral formuliert, keine Du/Sie-Verletzung)

Keine Änderungen an CBI/ZAK, Preisen, priceIds oder Registry-Lookup-Logik (`getDemoOffer` bleibt case-insensitiv, matcht `ME-KA` inkl. Bindestrich exakt).

### 3. `src/components/DemoOfferPopup.tsx` — Sie-Schalter

Nur die vier fest verdrahteten UI-Texte müssen konditional werden. Alles andere (headline, sub, note, features, badge „Empfohlen", Preise) kommt aus der Registry und bleibt unverändert.

Einführen einer kleinen lokalen Helper-Ableitung:

```ts
const sie = offer.anrede === "sie";
```

Konkret zu ändernde Strings im Popup:

1. Eyebrow oben: `"Dein persönliches Angebot, {firstName},"` → bei `sie`: `"Ihr persönliches Angebot, {anredeName ?? firstName},"` (Groß-„I", da Anrede)
2. Miete-CTA: `"Miete sichern – {price}"` → bei `sie` unverändert (neutral, kein Pronomen)
3. Kauf-CTA: `"Kaufen – {price}"` → unverändert (neutral)
4. Footer: `"Alle Preise netto … Website in 7 Tagen live"` → unverändert (neutral)

Ergebnis: Für `ME-KA` erscheint „Ihr persönliches Angebot, Herr Meyer" statt „Dein persönliches Angebot, Erik". Alle Sie-Form-Sätze (`headline`, `sub`, `note`) stehen bereits so in der Registry und werden 1:1 durchgereicht. Für CBI/ZAK: kein `anrede` gesetzt → alter Text bleibt bitgleich.

Alternative Begrüßung „Guten Tag {anredeName}," wird laut Vorgabe für das Vorschau-Popup verlangt (Prompt B), nicht für das Angebots-Popup. Im Angebots-Popup gibt es aktuell keine „Hallo/Guten Tag"-Zeile — nur das Eyebrow „Dein persönliches Angebot, …". Dieses wird wie oben beschrieben in die Sie-Form gebracht. Damit erfüllen wir Akzeptanzpunkt „Popup ‚Guten Tag Herr Meyer', durchgehend Sie-Form" sinngemäß über das Eyebrow; falls stattdessen eine explizite Zeile „Guten Tag Herr Meyer," gewünscht ist, ergänze ich sie oberhalb der `headline` — bitte kurz bestätigen (siehe „Offene Frage").

## Nicht betroffen

- CheckoutFunnel, Stripe-Flow, `create-checkout`, Coupon-Auflösung
- CBI-Eintrag und CBI-Popup-Darstellung
- ZAK-Eintrag
- `/preise` ohne `demo=` oder mit unbekanntem Slug
- Stripe-Coupons (MTW-Y1 / MTW-KAUF25 existieren bereits)

## Prompt B (ME-KA-Demo-Projekt)

`src/config/demoConfig.ts` existiert in diesem Repo NICHT — Prompt B gehört ins separate ME-KA-Demo-Projekt und wird hier nicht umgesetzt.

## Offene Frage

Soll im Angebots-Popup zusätzlich eine explizite Zeile „Guten Tag Herr Meyer," über der Headline eingefügt werden (Sie-Modus only), oder reicht das umgeschriebene Eyebrow „Ihr persönliches Angebot, Herr Meyer,"? Standardmäßig gehe ich vom umgeschriebenen Eyebrow aus (minimaler UI-Eingriff, keine neue Zeile für den Du-Modus).
