## Ursache: Rabatt wird an zwei Stellen gleichzeitig gerechnet

Bei `?plan=pro&mode=miete&offer=cbi-y1` läuft CBI-Y1 aktuell durch **zwei getrennte Rabatt-Pfade**, die sich überlagern:

### Pfad A — URL-Offer als Basis-Override (Client, nur UI)
`src/components/angebot/CheckoutFunnel.tsx`
- Zeilen 20-43: `OFFER_DISPLAY["cbi-y1"]` rechnet `discounted = base − 40` (99 → 59).
- Zeilen 411-438: `activeOffer` liefert base=99, discounted=59.
- Zeile 530: `offerDelta = 40`.
- Zeilen 531-535: `effBasisMonatlich = 59`, `effHeuteZuZahlen = 59`.
- Zeilen 897-901 / 1035 / 1981-1983: Zusammenfassung und Sticky-Footer zeigen 59 € bzw. `serverPricing.netto`.

### Pfad B — Auto-Redeem als eingelöster Rabattcode (Client → Server)
`src/components/angebot/CheckoutFunnel.tsx`
- Zeilen 313-320: Beim Öffnen wird `offerCode` automatisch an `redeem-code` geschickt, mit `base_net_cents = effHeuteZuZahlen*100 = 5900` (also bereits die 59 €).
- Zeilen 541-565: Session-Base wird laufend auf `effHeuteZuZahlen` (59 €) synchronisiert.

`supabase/functions/redeem-code/index.ts`
- Zeilen 152-166: Ruft Stripe-Coupon CBI-Y1 ab und zieht dessen `amount_off` (~47,60 € / 4760 ct) von den 5900 ct ab → **1140 ct = 11,40 €**.
- Response landet in `serverPricing` und in `appliedCodes` als „CBI-Y1 · −47,60 €" Chip.

### Pfad C — Stripe-Checkout (Server)
`supabase/functions/create-checkout/index.ts`
- Zeilen 252-260: Line-Item nutzt Client-`amount_cents`. In `buildStripeItems` (Zeile 592) ist das `basisMonatlich` = **99 € roh** (nicht die 59 €).
- Zeilen 296-329: Weil CBI-Y1 in `session.applied_codes` steckt, wird zusätzlich der Stripe-Coupon angehängt → 99 − 40 = 59 €.
- Ergebnis auf Stripe: 59 € (korrekt, aber inkonsistent zur UI-Anzeige von 11,40 €).

### Zusammenlauf-Punkt
Beide Pfade treffen sich in der `checkout_sessions.base_net_cents` bzw. `session.applied_codes` und werden in der UI-Preisleiste als kombinierte „Server-Preisquelle" gerendert. Die tatsächliche Stripe-Rechnung ergibt einen dritten, wieder anderen Betrag (59 €).

---

## Zielverhalten
- Der über `?offer=` gesetzte Angebotspreis ist die **einzige** Rabattquelle.
- Der gleiche Code darf **nicht** zusätzlich als einlösbarer Rabattcode in `checkout_sessions.applied_codes` landen.
- Optional als **rein informativer Chip** (ohne erneuten Preisabzug) in „Aktive Codes" darstellbar.
- Server und UI zeigen denselben Betrag: **59,00 € netto · 11,21 € MwSt · 70,21 € brutto** für den ersten Miet-Monat.

---

## Umsetzung

### 1) `src/components/angebot/CheckoutFunnel.tsx`
- **Auto-Redeem entfernen** (Zeilen 313-320): kein automatisches `redeem-code` mehr für `offerCode`.
- **Session-Base ist Rohpreis** (Zeile 543): `base_net_cents` = `Math.round(heuteZuZahlen * 100)` (die *ungekürzte* Basis), nicht `effHeuteZuZahlen`. Damit ist die Session-Preisbasis unabhängig vom URL-Offer und kann eigenständige Rabattcodes (die es künftig geben könnte) korrekt bewerten.
- **UI-Preisquelle bei aktivem URL-Offer**: In den drei Renderstellen (`SummaryBox`, Sticky-Footer bei ~1035 und 1981-1983) hat `effHeuteZuZahlen` (Client, 59 €) Vorrang, wenn `activeOffer` gesetzt ist. `serverPricing` wird für die Anzeige ignoriert, solange nur der URL-Offer aktiv ist. Sobald echte Codes (Unlock/Rechnung) dazukommen, bleibt `serverPricing.invoice_allowed` / Unlock-Chip-Info nutzbar, der Basisbetrag kommt aber weiterhin aus `effHeuteZuZahlen`.
- **Manuelle Eingabe des Offer-Codes blocken** (Zeilen 340-360 im `redeem-code`-Aufruf-Handler): Wenn User CBI-Y1 tippt und `offerCode` bereits identisch aktiv ist → toast „Dieser Angebotspreis ist bereits aktiv" statt Server-Call.
- **„Aktive Codes"-Bereich**: Wenn `activeOffer` vorhanden, zusätzlich einen **informativen Chip** rendern: `„CBI-Y1 · Angebotspreis 59 €/Monat"` (kein `−…€`, keine Remove-Aktion). Quelle: `OFFER_DISPLAY[offerCode]` / `activeOffer.note`, nicht `appliedCodes`.

### 2) `supabase/functions/create-checkout/index.ts`
- Zeilen 296-329: Guard einbauen — wenn `metadata.offer_code` gesetzt ist **und** derselbe Code in `session.applied_codes` liegt, wird der Stripe-Coupon **nur einmal** angehängt (aktueller Zustand ist ok, sobald Pfad B weg ist). Zusätzlich: wenn Line-Item bereits den reduzierten `unit_amount` enthält, **nicht** noch einen Coupon anhängen — Heuristik über Metadaten `offer_code_applied_in_line_items: "true"` reicht nicht, deshalb bleibt der Vertrag: **Client sendet Rohpreis-Line-Items, Server hängt den Coupon genau einmal an.**
- Prüfung ergänzen: `if (session.applied_codes.includes(metadata.offer_code)) → doppelt`, dann fehler-loggen und trotzdem nur einen Coupon anhängen.
- `metadata.offer_code` bekommt Vorrang: Wenn gesetzt, wird der Coupon aus einer Mapping-Tabelle (`OFFER_CODE → stripe_coupon`) resolved (nicht aus der Session), damit auch bei leerer/gestörter Session der URL-Offer greift. Falls die Session denselben Code führt, wird er ignoriert.

### 3) `supabase/functions/redeem-code/index.ts`
- Zusätzliche Ablehnung: Wenn `code === metadata.offer_code_hint` (übergeben durch den Client), 400 mit klarer Meldung. Alternativ reine Client-Guard (siehe 1) reicht — Server-seitig kein zwingender Zusatz.

### 4) `supabase/functions/buchung-erstellen/index.ts`
- Sicherstellen, dass die serverseitige Preisverifikation den gleichen Vertrag nutzt: Line-Items-Basis = Rohpreis, Rabatt = **entweder** URL-Offer-Coupon **oder** eingelöster Session-Rabatt, **nie beides**. Konsistenz-Check gegen die schon existierende Stripe-Session (`amount_total`) bleibt maßgeblich.

---

## Verifikation (nach Freigabe)
- `?plan=pro&mode=miete&offer=cbi-y1` öffnen.
- Erwartet in Zusammenfassung + Sticky-Footer: **59,00 € · 11,21 € MwSt · 70,21 € brutto**.
- „Aktive Codes" zeigt CBI-Y1 als informativen Chip ohne `−…€`.
- Netzwerk: Kein `redeem-code`-Call beim Öffnen. `checkout-session-create` bekommt `base_net_cents = 9900`.
- Nach „Weiter zur Zahlung": Stripe-Session-Betrag = **7021 ct**.
- Manueller Versuch, CBI-Y1 im Codefeld einzugeben → Toast „bereits aktiv", kein Server-Call.

## Offene Fragen
1. Soll der Chip für den URL-Offer **immer** erscheinen (informativ) oder **gar nicht** (weil bereits als durchgestrichener Preis im Paket-Tile sichtbar)? Standard-Empfehlung: **informativ anzeigen**, damit der User erkennt, dass der Code aktiv ist.
2. Soll `create-checkout` die `OFFER_CODE → stripe_coupon`-Auflösung aus `discount_codes` (DB) oder aus einer kleinen Konstante im Function-Code lesen? Standard-Empfehlung: **DB**, konsistent mit dem restlichen Multi-Code-System.
