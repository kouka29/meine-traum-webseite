
## Ziel

Wenn `/preise?demo=SLUG` geöffnet wird und der Slug in einer zentralen Registry existiert, erscheint ein zentrales, hochwertiges Angebots-Popup, das beide Optionen (Miete + Kauf) mit durchgestrichenem Regulärpreis → Angebotspreis zeigt. Der gewählte Rabatt wird konsistent im Checkout-Funnel (Paket-, Zahlungs- und Auswahl-Schritt) angezeigt und serverseitig über den passenden Stripe-Coupon abgerechnet.

Ohne `demo` bleibt `/preise` unverändert.

## Änderungen

### 1) Neue Registry: `src/config/demoOffers.ts`

Typed `DemoOffer` + `DEMO_OFFERS` mit Slug-Lookup (case-insensitiv). Initial ein Eintrag `CBI` (Christopher, Pro):

- `miete`: `coupon: "CBI-Y1"`, `price: "59 €/Monat"`, `regular: "99 €/Monat"`, `discountedNumber: 59`, `regularNumber: 99`, `note: "1. Jahr Starter-Preis · danach 99 €/Monat · monatlich kündbar"`, `priceId: "pro_rent_monthly"`.
- `kauf`: `coupon: "CBI-KAUF25"`, `price: "1.492,50 €"`, `regular: "1.990 €"`, `discountedNumber: 1492.5`, `regularNumber: 1990`, `note: "25 % Rabatt · einmalig · netto"`, `priceId: "pro_purchase_deposit"`.
- `headline`, `sub`, `firstName`, `plan: "pro"`.
- Helper `getDemoOffer(slug?: string | null)` (case-insensitiv, null bei unbekannt).
- Helper `resolveLegacyOffer(offerCode)` → mapped `cbi-y1` / `cbi-kauf25` auf `{ demoSlug: "CBI", mode: "miete"|"kauf" }` für Rückwärtskompatibilität.

### 2) Neues Popup: `src/components/DemoOfferPopup.tsx`

Zentriertes, barrierefreies Modal (Radix `Dialog`, konsistent mit `PricingLeadPopup`):

- Header: MTW-Logo (`/logo.png`) + `Dein persönliches Angebot, {firstName}`.
- Große Headline `{headline}`, Sub `{sub}`.
- Kurze Pro-Feature-Liste (aus `rentPackages[Pro].features.slice(0,5)`).
- Zwei Options-Karten (mobil untereinander, Desktop nebeneinander):
  - Miete-Karte (Badge „Empfohlen"): `~~99 €/Monat~~ → 59 €/Monat`, Note, Button „Miete sichern – 59 €/Monat".
  - Kauf-Karte: `~~1.990 €~~ → 1.492,50 €`, Note, Button „Kaufen – 1.492,50 €".
- Fußzeile: „Alle Preise netto zzgl. 19 % MwSt. · Website in 7 Tagen live".
- Schließbar via X / Escape / Overlay-Klick.
- Klick auf eine Options-Karte → callback `onSelect({ mode, coupon, plan: "pro" })` → Popup schließen und Funnel öffnen.

### 3) `src/pages/WebdesignPreise.tsx` — Deep-Link-Handler & State

- Import `getDemoOffer`, `resolveLegacyOffer`, `DemoOfferPopup`.
- Neuer State: `demoOffer: DemoOffer | null`, `showDemoPopup: boolean`, `activeOffer: { mode, coupon } | null`.
- Im vorhandenen `useEffect` (Zeile 761):
  1. `demo` lesen → `getDemoOffer(demo)`. Wenn gefunden → `setDemoOffer`, `setShowDemoPopup(true)`, `setDemoSource(demo)`. Wenn ein `mode` param mitgegeben ist, vorwählen.
  2. Wenn kein `demo`, aber Legacy-`offer` → `resolveLegacyOffer` → gleiches Verhalten (Popup öffnen mit CBI).
  3. Wenn `demo`+`offer` → `demo` gewinnt; `offer` wird ignoriert.
- `<DemoOfferPopup>` unter dem Demo-Banner rendern mit `onSelect`, das:
  - `setActiveOffer({ mode, coupon })`
  - `setTab(mode)`
  - `setCheckoutPkg({ name: "Pro", priceId, mode })` (priceId aus `demoOffer[mode].priceId`)
  - Popup schließt.
- `demoSource` bleibt für den bestehenden gelben Banner erhalten.

### 4) `CheckoutFunnel.tsx` — Konsistente Anzeige an allen Stellen

Der Funnel hat bereits die `activeOffer`-`useMemo`-Logik und die Anzeige im Footer + Chip. Anpassungen:

- Neuer optionaler Prop `activeOfferOverride?: { mode, discountedNumber, regularNumber, label, note }` (statt sich auf `offerCode` + interne `OFFER_DISPLAY` zu verlassen). Wird von `WebdesignPreise` befüllt, wenn `activeOffer` gesetzt ist.
- Wenn `activeOfferOverride` vorhanden → nutzt es direkt (Guard: Paket muss dem in Override passenden Plan entsprechen und `paymentMode === override.mode`); sonst Fallback auf bestehende `OFFER_DISPLAY`-Logik (Rückwärtskompatibilität).
- **Neu**: Anzeige auch im **Paket-Schritt** (Pro-Karte) und **Zahlungs-Schritt**:
  - In der Paket-Karte für Pro: unterhalb des normalen Preises, falls `activeOffer` aktiv und Mode passt → `<line-through>{regularNumber €}</line-through> {discountedNumber €}` + Note.
  - Im Zahlungs-Schritt: bei „Miete monatlich" / „Einmalkauf" die entsprechende Zeile mit durchgestrichenem Regulär + Angebotspreis. Löst das gemeldete Problem „Kauf zeigt alten Preis".
- „Deine Auswahl"-Summary bleibt wie bisher, nutzt jetzt aber die Override-Werte.
- `basisEinmalig`/`basisMonatlich`/`gesamt*`/`heuteZuZahlen` bleiben unverändert (Client-Anzeige nur; echter Rabatt kommt vom Stripe-Coupon).
- Metadata: `offer_code` weiterhin an `create-checkout` schicken (aus `activeOffer.coupon` case-insensitiv als slug, z. B. `cbi-y1`), damit die serverseitige Whitelist greift.

### 5) `WebdesignPreise.tsx` → `CheckoutFunnel`-Props

- `activeOfferOverride` aus `demoOffer` + `activeOffer.mode` bauen und übergeben.
- `offerCode` weiterhin für Legacy-Fälle weitergeben (server nutzt nur diesen).

### 6) `supabase/functions/create-checkout/index.ts`

Bereits vorhanden:
- `OFFER_TO_COUPON` mit `cbi-y1` → `pro_rent_monthly` und `cbi-kauf25` → `pro_purchase_deposit`.
- Case-insensitives Matching (`offerRaw = metadata.offer_code.trim().toLowerCase()`).
- Validierung gegen `expectedPriceId` + Mode (recurring vs payment).
- Silent-Ignore bei Mismatch (Normalpreis).

Kleine Ergänzung:
- Sicherstellen, dass `metadata.offer_code` aus dem Funnel jetzt einer der beiden Slugs ist (nicht der rohe Coupon-Code). Falls der Coupon-Code (`CBI-Y1`, `CBI-KAUF25`) rein kommt, per Alias-Map auf den Slug normalisieren, damit die bestehende Whitelist greift. Kein Verhalten für andere Codes.

## Nicht im Scope

- Keine Änderung an bestehenden `priceId`s, Preisen oder `buildStripeItems`.
- Keine neuen Stripe-Coupons anlegen (Setup-Notiz: `CBI-KAUF25` muss noch manuell im Dashboard angelegt werden — 25 % einmalig).
- Kein neuer Rabatt-Weg für Starter/Premium.
- `PricingLeadPopup` bleibt unverändert (weiterhin der reguläre „Fast geschafft"-Flow).

## Akzeptanzkriterien

- `/preise?demo=CBI` → zentrales Popup mit beiden Optionen rabattiert (59 €, 1.492,50 €).
- Klick „Miete sichern" → Funnel öffnet, Pro-Miete vorgewählt, Paket-Schritt zeigt `~~99 €~~ 59 €`, Zahlungs-Schritt + Auswahl konsistent. Stripe zieht `CBI-Y1`.
- Klick „Kauf" → Funnel zeigt Pro-Kauf `~~1.990 €~~ 1.492,50 €` an allen Stellen. Stripe zieht `CBI-KAUF25`.
- Unbekannter oder fehlender `demo` → normale `/preise`-Seite ohne Popup.
- Legacy `?plan=pro&mode=miete&offer=cbi-y1` bzw. `offer=cbi-kauf25` → gleiches Popup + Funnel-Verhalten wie mit `demo=CBI`.
- Starter/Premium und normale Besucher unverändert.
