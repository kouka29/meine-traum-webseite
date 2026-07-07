# MTW — Angebots-Popup + Preis-Konsistenz v2 (Update-Plan)

Erweitert den bestehenden Plan um zwei fehlende Punkte:
**(A)** Preis der Bestellzusammenfassung im Kontakt-Schritt nutzt jetzt Angebotspreis (MwSt/Gesamt daraus abgeleitet).
**(B)** Bei aktivem Demo-Angebot läuft der komplette Checkout in einem **zentrierten Modal** statt der Seitenleiste.

Registry (`src/config/demoOffers.ts`), `DemoOfferPopup`, Deep-Link-Handler, Legacy-`offer`-Fallback und die serverseitige Coupon-Validierung sind bereits umgesetzt und bleiben unverändert.

## Änderungen

### 1) `src/components/angebot/CheckoutFunnel.tsx`

**Layout-Umschaltung (Sidebar ↔ zentriertes Modal)**
- Neuer optionaler Prop `layout?: "sidebar" | "centered"` (default `"sidebar"`).
- `layout === "centered"`:
  - Wrapper: `alignItems: "center"`, `justifyContent: "center"`, `padding: 24`.
  - Panel: `maxWidth: 680`, `height: "auto"`, `maxHeight: "calc(100vh - 48px)"`, `borderRadius: 20`, andere Shadow, Animation `funnelZoomIn` statt `funnelSlideIn`.
  - Mobile (< 767px): weiterhin Vollbild-Slide-Up (kein Fremdverhalten).
- Alle Inhalts-/Step-Container bleiben identisch; nur die Hülle wechselt.

**Bestellzusammenfassung „Deine Bestellung" (im `StepKontakt`, Zeilen ~1391–1477) auf Angebotspreis umstellen**
- Neuer effektiver Basis-Preis pro Modus, aus `activeOffer` abgeleitet, im Parent berechnet:
  - `effBasisMonatlich = activeOffer?.mode === "miete" ? activeOffer.discounted : basisMonatlich`
  - `effBasisEinmalig  = activeOffer?.mode === "kauf"  ? activeOffer.discounted : basisEinmalig`
  - `effGesamtMonatlich`, `effGesamtEinmalig`, `effHeuteZuZahlen` analog (Delta = `activeOffer.base - activeOffer.discounted`).
- `StepKontakt` bekommt zusätzlich `activeOffer` und nutzt die eff-Werte:
  - Positionszeile Pro-Paket: `{effBasisMonatlich}/Monat` bzw. `{effBasisEinmalig} einmalig`, mit durchgestrichenem Regulärpreis daneben, wenn `activeOffer.mode` matcht.
  - Optionale Note darunter: „1. Jahr, danach {regular €}/Monat" (nur Miete).
  - `summary.heuteZuZahlen`, MwSt (`* 19 / 100`) und Gesamtpreis brutto (`* 119 / 100`) werden aus `effHeuteZuZahlen` gerechnet (nicht mehr aus dem alten `heuteZuZahlen`).
- Footer-Summary (Zeilen ~730–780) wird ebenfalls auf die eff-Werte umgestellt, damit „Deine Auswahl" und „Heute zu zahlen" konsistent sind. Die bestehende `line-through`-Anzeige bleibt erhalten.
- Add-ons bleiben unrabattiert (Angebot gilt nur für Pro-Basis).
- `buildStripeItems` bleibt unverändert (regulärer Preis an Stripe; Coupon macht den Abzug serverseitig — bereits so validiert).

### 2) `src/pages/WebdesignPreise.tsx`

- Beim `<CheckoutFunnel>` zusätzlich `layout={activeOffer ? "centered" : "sidebar"}` übergeben. Sonst alles wie bisher.

### 3) Nicht angefasst
- `create-checkout/index.ts` (Coupon-Whitelist/Validierung bereits vorhanden).
- `DemoOfferPopup.tsx`, `demoOffers.ts` (bereits umgesetzt).
- Sidebar-Verhalten für Nicht-Demo-Besucher bleibt exakt gleich.
- Preise, `priceId`s, Success-/Return-URLs unverändert.

## Technische Notizen

- Ein einziger „effektiver Preis"-Block im Funnel-Parent, alle Anzeigen (Footer, Kontakt-Summary, MwSt, Brutto) lesen daraus → keine doppelte Rechenlogik.
- Rundung MwSt/Brutto weiter mit `Math.round(x * 19)/100` bzw. `*119/100` — Verhalten identisch zum jetzigen Muster, nur Eingabewert wechselt auf `effHeuteZuZahlen`.
- `layout="centered"` nutzt dieselben Steps/Header/Progress/Footer — keine Duplikate.
- Escape/X/Overlay-Klick funktionieren unverändert.

## Akzeptanzkriterien (Delta)

- `/preise?demo=CBI` → Angebots-Popup, danach Checkout als **zentriertes Modal** (nicht Sidebar). Ohne `demo` weiterhin Sidebar.
- Kontakt-Schritt „Deine Bestellung": Pro-Paket 59 €/Monat bzw. 1.492,50 € einmalig, MwSt und Gesamt daraus gerechnet (z. B. Miete: MwSt 11,21 €, brutto 70,21 €).
- Footer „Heute zu zahlen" identisch mit „Deine Bestellung".
- Stripe zieht weiterhin den korrekten Coupon (`CBI-Y1` / `CBI-KAUF25`) — kein Verhalten geändert.
