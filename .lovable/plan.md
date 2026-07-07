## Kontext

Der Deep-Link-Handler (`?plan`, `?mode`, `?demo`, `?offer`) und die serverseitige Coupon-Validierung sind bereits implementiert (`WebdesignPreise.tsx`, `CheckoutFunnel.tsx`, `create-checkout/index.ts`). Fehlend ist nur noch die **UI-Anzeige** des reduzierten Preises im Funnel — damit der Kunde den Rabatt bereits vor Stripe sieht.

Wichtig: Der abgerechnete Rabatt kommt weiterhin ausschließlich aus dem serverseitig validierten Stripe-Coupon. Die UI zeigt den Preis nur an, sie berechnet keinen wirksamen Rabatt.

## Änderungen (nur `src/components/angebot/CheckoutFunnel.tsx`)

### 1) Offer-Whitelist clientseitig (nur für Anzeige)

Am Dateikopf eine kleine, gespiegelte Whitelist ergänzen — identische IDs wie in `create-checkout`:

```ts
const OFFER_DISPLAY: Record<string, {
  requiredPaketId: "pro";
  requiredMode: "kauf" | "miete";
  compute: (base: number) => { discounted: number; label: string; note?: string };
}> = {
  "cbi-y1": {
    requiredPaketId: "pro",
    requiredMode: "miete",
    compute: (base) => ({
      discounted: Math.max(0, base - 40),
      label: "1. Jahr, danach 99 €/Monat",
      note: "Angebotspreis für 12 Monate (CBI-Y1)",
    }),
  },
  "cbi-kauf25": {
    requiredPaketId: "pro",
    requiredMode: "kauf",
    compute: (base) => ({
      discounted: Math.round(base * 0.75 * 100) / 100,
      label: "−25 % (CBI-KAUF25)",
    }),
  },
};
```

Matching case-insensitiv (`offerCode?.trim().toLowerCase()`), Paket-Match per `currentPaket.id.toLowerCase().startsWith("pro")`.

### 2) Aktiver Offer als `useMemo`

Innerhalb der Component:

```ts
const activeOffer = useMemo(() => {
  const key = offerCode?.trim().toLowerCase();
  if (!key) return null;
  const cfg = OFFER_DISPLAY[key];
  if (!cfg) return null;
  const paketOk = currentPaket.id.toLowerCase().startsWith(cfg.requiredPaketId);
  if (!paketOk || paymentMode !== cfg.requiredMode) return null;
  const base = cfg.requiredMode === "miete"
    ? Number(currentPaket.miete_monatlich || 0)
    : Number(currentPaket.preis || 0);
  if (!base) return null;
  const { discounted, label, note } = cfg.compute(base);
  return { base, discounted, label, note, mode: cfg.requiredMode };
}, [offerCode, currentPaket, paymentMode]);
```

### 3) Anzeige an drei Stellen

- **Paket-Schritt** (Karte für Pro): unterhalb des normalen Preises einen kleinen Badge/Absatz, wenn `activeOffer` aktiv:  
  `<durchgestrichen 99 €> → 59 €/Monat · „1. Jahr, danach 99 €"` (bzw. `1.492,50 € · „−25 %"` im Kauf).  
  Der normal gerenderte Basispreis bleibt bestehen (nicht ersetzen — nur ergänzen).
- **Zahlung-Schritt** und **Extras-Schritt** in der „Deine Auswahl"-/Summary-Sektion: gleiche Zeile („Basispreis" → Angebotspreis mit durchgestrichenem Original + Fußnote).
- **Kontakt-Schritt** in der Summary-Zeile ebenfalls anzeigen, damit der Preis direkt vor dem Klick auf „Kostenpflichtig bestellen" konsistent bleibt.

Nur Anzeige — `basisEinmalig`, `basisMonatlich`, `gesamtEinmalig`, `gesamtMonatlich`, `heuteZuZahlen` und `buildStripeItems()` bleiben unverändert. Stripe rechnet weiterhin den vollen Netto-Betrag ab und zieht den Coupon serverseitig ab. Der Trusted-Totals-Check in `create-checkout` bleibt unberührt (Client-Subtotal = ungerabatteter Basispreis, Coupon nachgelagert).

### 4) Dezenter Offer-Hinweis oben im Panel

Direkt unter dem Panel-Header (nur wenn `activeOffer`):

```
🎁 Angebot aktiv: {activeOffer.note ?? activeOffer.label}
```
in Brand-Farbe/Chip-Style — konsistent mit dem bestehenden Demo-Banner auf `/preise`.

## Nicht im Scope

- Keine Änderung an `WebdesignPreise.tsx` (Deep-Link + Tab + Banner bereits fertig).
- Keine Änderung an `create-checkout/index.ts` (Coupon-Mapping + Trusted-Totals bereits fertig).
- Keine Änderung an Preisen, `priceId`s, `buildStripeItems`, Buchungs-Payload-Struktur.
- Keine Rabattlogik für andere Pakete als Pro (Whitelist restriktiv).

## Akzeptanzkriterien

- `/preise?plan=pro&mode=miete&offer=cbi-y1` → Funnel öffnet, Pro-Miete-Karte zeigt `~~99 €~~ 59 €/Monat` + „1. Jahr, danach 99 €". Summary zeigt 59 €. Stripe zieht Coupon `CBI-Y1` ab.
- `/preise?plan=pro&mode=kauf&offer=cbi-kauf25` → Pro-Kauf-Karte zeigt `~~1.990 €~~ 1.492,50 €` + „−25 %". Stripe zieht Coupon `CBI-KAUF25` ab.
- `offer=cbi-y1` mit Starter/Premium oder mit Kauf-Modus → keine UI-Änderung, normaler Preis, keine Fehler.
- Unbekannter `offer` → keine UI-Änderung.
- Ohne `offer` → Funnel exakt wie bisher.
