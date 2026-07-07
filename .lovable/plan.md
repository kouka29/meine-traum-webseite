## Ziel

Externe Deep-Links (z. B. aus Demo-Vorschauen) auf `/preise?plan=pro&mode=kauf&demo=CBI&offer=cbi-kauf25` sollen:
- den richtigen Tab (Kauf / Miete) vorwählen,
- das richtige Paket im bestehenden `CheckoutFunnel` öffnen,
- die Herkunft (`demo=CBI`) als Quelle mittragen,
- optional einen Angebots-Code (`offer=…`) in einen **serverseitig validierten** Stripe-Coupon übersetzen.

Bestehende Tabs, `PackageCard`/`BuyCard`, `openRentCheckout` / `openBuyCheckout`, `CheckoutFunnel`, Preise, `priceId`s und der Stripe-Flow bleiben unverändert — es wird **nur ergänzt**.

## Änderungen

### 1) `src/pages/WebdesignPreise.tsx` — Deep-Link-Handling

- `useSearchParams` aus `react-router-dom` importieren.
- `Tabs` von unkontrolliert (`defaultValue="miete"`) auf **kontrolliert** umstellen: neuer State `tab: "miete" | "kauf"` (Default `"miete"`), `value={tab} onValueChange={setTab}`.
- Neue States: `demoSource: string | null`, `offerCode: string | null`.
- Neuer `useEffect` (einmalig beim Mount):
  1. `plan`, `mode`, `demo`, `offer` aus den Search-Params lesen (alles lowercase / trim).
  2. Wenn `mode === "miete"` → `setTab("miete")`, sonst wenn `mode === "kauf"` → `setTab("kauf")`.
  3. `demo` → `setDemoSource(demo)`, `offer` → `setOfferCode(offer)`.
  4. Paket-Lookup per `id`-Präfix auf `priceId` (robust gegen Reihenfolge):
     - `starter` → `starter_rent_monthly` / `starter_purchase_deposit`
     - `pro` → `pro_rent_monthly` / `pro_purchase_deposit`
     - `premium` → `premium_rent_monthly` / `premium_purchase_deposit`
     - In `rentPackages` bzw. `buyPackages` per `p.priceId === <ziel>` finden.
  5. Falls Paket gefunden: `openRentCheckout` bzw. `openBuyCheckout` mit `{ name, priceId }` aufrufen → der bestehende `CheckoutFunnel` öffnet sich exakt wie bei einem Klick.
  6. Wenn `plan` fehlt/unbekannt: nur Tab setzen, kein Funnel öffnen.
- Dezenter Hinweis-Banner unter dem bestehenden Demo-Banner, nur wenn `demoSource` gesetzt ist: „Aus Ihrer Demo-Vorschau ({demoSource})".
- `CheckoutFunnel`-Aufruf am Ende der Datei um neue Props ergänzen: `sourceDemo={demoSource ?? undefined}` und `offerCode={offerCode ?? undefined}`.

### 2) `src/components/angebot/CheckoutFunnel.tsx` — Props durchreichen

- Interface `Props` um `sourceDemo?: string` und `offerCode?: string` erweitern; im Component-Signature destrukturieren.
- Bei der bereits vorhandenen Lead-/Buchungs-Erstellung (`supabase.functions.invoke("buchung-bestaetigen", …)` bzw. dem vorgelagerten `notify-lead`/Buchungs-Insert) `source_demo` (bzw. `source_cta: "demo:<code>"`) im Payload mitschicken, sofern gesetzt.
- Im `StepBezahlen`-Aufruf die `metadata` erweitern:
  ```
  ...(offerCode ? { offer_code: offerCode } : {}),
  ...(sourceDemo ? { demo_source: sourceDemo } : {}),
  ```
  `offer_code` ist der Auslöser für den Coupon serverseitig; es wird **nie clientseitig** ein Rabattbetrag berechnet.

### 3) `supabase/functions/create-checkout/index.ts` — Coupon serverseitig

- Neues Coupon-Mapping (hart codiert, keine URL-Werte durchreichen):
  ```
  const OFFER_TO_COUPON: Record<string, { coupon: string; requiredPriceId: string }> = {
    "cbi-y1":     { coupon: "CBI-Y1",     requiredPriceId: "pro_rent_monthly" },
    "cbi-kauf25": { coupon: "CBI-KAUF25", requiredPriceId: "pro_purchase_deposit" },
  };
  ```
- Nach dem bestehenden Trusted-Totals-Check:
  1. `metadata.offer_code` lesen, kleinschreiben, im Mapping suchen.
  2. Aus `buchungen.pakete` (bereits geladen für `resolveTrustedTotals`) den `priceId` des Basis-Pakets ermitteln — oder alternativ `metadata.paket` + Konvention (`<paket>_rent_monthly` bzw. `<paket>_purchase_deposit` je nach `payment_mode`).
  3. Wenn `mapping.requiredPriceId === ermittelterPriceId` → beim `stripe.checkout.sessions.create(...)` `discounts: [{ coupon: mapping.coupon }]` mitgeben. Sonst ignorieren.
  4. Coupon nur setzen, wenn `mode === "payment"` für `pro_purchase_deposit` bzw. `mode === "subscription"` für `pro_rent_monthly` (Passung Duration/Once).
- Wichtig: `automatic_tax` / `allow_promotion_codes` bleiben unverändert. Fehlender/unbekannter `offer_code` → kein Coupon, kein Fehler (Normalpreis).
- **Trusted-Total-Check bleibt unberührt** — der Client-Subtotal muss weiterhin dem hinterlegten Auftrag entsprechen; der Rabatt wird erst danach von Stripe auf die Session angewendet.

### 4) Coupons in Stripe (Voraussetzung, kein Code)

Einmalig im Stripe-Dashboard anlegen (Sandbox + Live):
- `CBI-Y1`: −40,00 € EUR, Duration „Multiple months" = 12
- `CBI-KAUF25`: −25 %, Duration „Once"

Coupon-IDs müssen exakt `CBI-Y1` bzw. `CBI-KAUF25` heißen (matcht das Mapping oben).

## Akzeptanzkriterien

- `/preise?mode=miete` → Tab „Mieten" aktiv, kein Funnel.
- `/preise?plan=pro&mode=kauf&demo=CBI` → Tab „Kaufen", Funnel für Pro-Kauf offen, Banner „Aus Ihrer Demo-Vorschau (CBI)".
- `/preise?plan=pro&mode=miete&demo=CBI&offer=cbi-y1` → Pro-Miete, Stripe zeigt Coupon `CBI-Y1` (59 € statt 99 € für 12 Monate).
- `/preise?plan=pro&mode=kauf&demo=CBI&offer=cbi-kauf25` → Pro-Kauf, Coupon `CBI-KAUF25` (1.492,50 € statt 1.990 €).
- Falscher/fehlender `offer` oder Mismatch mit priceId → normaler Preis, kein Fehler.
- `demo=CBI` landet als Quelle im Lead/Buchung + in Stripe-Session-Metadata.
- Ohne Params verhält sich `/preise` exakt wie bisher.

## Nicht im Scope

- Änderungen an Preisen, `priceId`s, `PackageCard`/`BuyCard`, Tab-UI.
- Automatische Rabattanzeige im UI (bewusst nicht — Rabatt ist Stripe-seitig sichtbar).
- Neue Landingpage-Varianten.
