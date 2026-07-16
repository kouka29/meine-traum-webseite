## Ziel
`src/config/demoOffers.ts` als einzige Quelle für Demo-Angebote etablieren, ZAK ergänzen, das tote Inline-Duplikat aus dem CheckoutFunnel entfernen.

## Ist-Zustand (bereits ok)
- `WebdesignPreise.tsx` importiert `getDemoOffer` / `buildFunnelOfferOverride` aus `@/config/demoOffers` und übergibt `activeOfferOverride` sowie `offerCode` an den `CheckoutFunnel`.
- Auflösung via `?demo=<slug>` ist bereits case-insensitiv (`getDemoOffer` macht `toUpperCase`).
- Server (`create-checkout`) nimmt `offer_code` aus der Metadata und holt den Stripe-Coupon aus der Tabelle `discount_codes` (Spalte `code`).

## Änderungen

### 1. `src/config/demoOffers.ts` — ZAK ergänzen
`DEMO_OFFERS` bekommt neben `CBI` einen zweiten Eintrag `ZAK`, exakte Kopie von CBI, geänderte Felder:
- `slug: "ZAK"`
- `firstName: "Ahmed"`
- `miete.coupon: "MTW-Y1"`, `miete.offerCode: "mtw-y1"`
- `kauf.coupon: "MTW-KAUF25"`, `kauf.offerCode: "mtw-kauf25"`

Alle übrigen Felder (`plan`, `headline`, `sub`, `features`, Preise, `discountedNumber`, `regularNumber`, `notes`, `priceId`) 1:1 wie CBI.

### 2. `src/components/angebot/CheckoutFunnel.tsx` — Inline-Duplikat entfernen
- `OFFER_DISPLAY`-Objekt (Zeilen ~21–44 mit `"cbi-y1"` / `"cbi-kauf25"`) komplett löschen.
- In `activeOffer` (Zeilen ~424–435) und `offersByMode` (Zeilen ~452–471) den `OFFER_DISPLAY`-Fallback-Zweig entfernen. Übrig bleibt jeweils nur der `activeOfferOverride`-Pfad, der von `WebdesignPreise` aus der Registry gespeist wird. Wenn kein Override gesetzt ist → `null` bzw. `{}` zurückgeben.

Das ändert nichts am CBI-Verhalten, weil `WebdesignPreise` bereits `funnelOfferOverride` aus der Registry setzt.

### 3. Auflösung `?demo=ZAK` (keine Codeänderung nötig)
- `getDemoOffer("ZAK")` liefert nach Schritt 1 den Eintrag → Popup öffnet.
- Nach Auswahl im Popup setzt `handleDemoSelect` `offerCode` auf `mtw-y1` bzw. `mtw-kauf25` (aus `demoOffer.miete.offerCode` / `kauf.offerCode`).
- `CheckoutFunnel` reicht `offer_code` an `create-checkout` weiter → Server sucht in `discount_codes` und wendet Stripe-Coupon an.

## Voraussetzung serverseitig (kein Code, nur Datenbank)
Damit Endpreis bei ZAK korrekt abgerechnet wird, müssen in der Tabelle `discount_codes` folgende Zeilen existieren (analog zu den bestehenden CBI-Einträgen):

| code | type | stripe_coupon | active |
|---|---|---|---|
| MTW-Y1 | discount | <Stripe-Coupon-ID für 1. Jahr Rabatt Miete> | true |
| MTW-KAUF25 | discount | <Stripe-Coupon-ID für 25 % Kauf> | true |

Wenn diese Zeilen fehlen, bleibt die UI-Anzeige rabattiert (das Override kommt aus der Registry), aber Stripe rechnet den Regulärpreis ab. Ich lege die DB-Zeilen im Build-Schritt an, sobald du bestätigst welche Stripe-Coupon-IDs verwendet werden sollen — oder ob dieselben wie bei CBI (`CBI-Y1`, `CBI-KAUF25`) recycled werden dürfen.

## Nicht betroffen
- Normaler `/preise`-Flow ohne `demo=`
- CBI-Flow (`?demo=CBI`, Legacy `?offer=cbi-y1|cbi-kauf25`)
- Preise, Texte, Rabattlogik, Stripe-Integration