## Ziel

Im Checkout-Popup (`src/components/angebot/CheckoutFunnel.tsx`, Schritt 1 „Welches Paket darf es sein?") zwei UI-Anpassungen, die sich ausschließlich auf die **Pro-Paket-Ansicht** auswirken. Starter/Premium bleiben visuell unverändert. Die MwSt-Rechenlogik wird als kleiner Helper ausgelagert, damit sie später auch für andere Pakete wiederverwendet werden kann.

---

## 1) Doppel-Badge auf der Pro-Karte

Datei: `src/components/angebot/CheckoutFunnel.tsx`, Block **StepPaket** (aktuell Zeilen ~909–916).

Aktuell wird nur ein Badge „EMPFOHLEN" (blauer BRAND_GRADIENT) gerendert, sobald `recommended === true`. Das wird für die Pro-Karte ersetzt durch zwei gestapelte Badges:

- **Oberes Badge** (dominant, warm/gold, nicht blau) — nur wenn ein aktiver Rabatt für diese Karte existiert (`mieteOffer || kaufOffer`):
  - Text: `🎁 Freundschaftsrabatt`
  - Farbe: `linear-gradient(135deg, #F59E0B, #F97316)` (Amber/Orange, entspricht bereits vorhandenem `--warning`-Token-Look), weiße Schrift, größere Padding-/Font-Werte als das Empfohlen-Badge.
- **Unteres Badge** (kleiner, sekundär) — wenn `recommended`:
  - Text: `Empfohlen`
  - Farbe: weiß mit BRAND-Rand + BRAND-Text (dezent), kleinere Schrift.

Positionierung: beide `position: absolute; right: 14px;`, Freundschaftsrabatt oben (`top: -12px`), „Empfohlen" darunter (`top: 18px`). Beide nur auf der Karte anzeigen, die dem `offerPlan` entspricht (also faktisch Pro). Für Starter/Premium bleibt exakt das bisherige einzelne EMPFOHLEN-Badge erhalten.

Bedingungslogik:
- `hasOffer = paketMatchesOffer && (mieteOffer || kaufOffer)` → Freundschaftsrabatt-Badge sichtbar.
- Wenn `hasOffer && recommended` → beide Badges (Freundschaftsrabatt oben, Empfohlen darunter, kleiner).
- Wenn `!hasOffer && recommended` → bisheriges einzelnes EMPFOHLEN-Badge (Starter/Premium unverändert).

---

## 2) Preiszusammenfassung „DEINE AUSWAHL" (Footer)

Datei: gleiche Datei, Footer-Block (aktuell Zeilen ~762–813). Betrifft nur den Zweig **Pro + Miete** (also `paymentMode === "miete"` und ausgewähltes Paket = Pro, unabhängig davon ob Rabatt aktiv ist — die Aufschlüsselung ist auch ohne Rabatt sinnvoll und der User wünscht sie explizit).

Neuer Aufbau statt der einzeiligen Preisanzeige:

```text
59,00 € netto/Monat
+ 11,21 € MwSt. (19%)
─────────────────────
70,21 € brutto/Monat        ← fett, größer
1. Jahr, danach 117,81 € brutto/Monat (99 € netto)   ← klein, wie bisher
```

Regeln:
- Netto-Wert = `effGesamtMonatlich` (bereits rabattierter Preis, falls Angebot aktiv, sonst `gesamtMonatlich`).
- MwSt = `netto * 0.19`, Brutto = `netto * 1.19`.
- Bei aktivem Angebot: erste Zeile zeigt zusätzlich den durchgestrichenen regulären Netto-Preis links vom rabattierten Netto (analog zur bisherigen Darstellung, aber innerhalb der Netto-Zeile).
- Untere kleine Zeile ersetzt den bisherigen `activeOffer.label` durch: `1. Jahr, danach {fmtEUR(bruttoRegulär)} brutto/Monat ({fmtEUR(nettoRegulär)} netto)`. Nur wenn `activeOffer && activeOffer.mode === "miete"` gezeigt (sonst entfällt die Zeile).
- Trennlinie über der Brutto-Zeile: 1px Border-Top in `rgba(79,63,240,0.15)`.

Für **Kauf-Modus, Starter, Premium, Kontakt-Schritt** bleibt die bestehende Darstellung 1:1 erhalten.

Erkennung „Pro-Paket": `currentPaket.id.toLowerCase().startsWith("pro")` (gleiche Konvention wie das bestehende `paketMatchesOffer`-Muster in Zeile 889).

---

## 3) Wiederverwendbare Rechenlogik

Am Dateikopf (oder in `src/lib/utils.ts`, wenn dort besser aufgehoben) kleine Helper einführen:

```ts
const MWST_RATE = 0.19;
export const nettoToBrutto = (netto: number) => Math.round(netto * (1 + MWST_RATE) * 100) / 100;
export const mwstAmount = (netto: number) => Math.round(netto * MWST_RATE * 100) / 100;
```

Verwendet in Punkt 2. Damit greift die Aufschlüsselung sofort, sobald wir sie später auch für Starter/Premium aktivieren möchten — der Preis wird nirgends hartcodiert.

---

## Nicht enthalten

- Keine Änderung an Stripe-Logik, Rabatt-Codes oder anderen Schritten des Funnels.
- Keine Änderungen an `DemoOfferPopup`, Angebot-Seite oder anderen Preis-Darstellungen außerhalb des Funnel-Popups.
- Kein Redesign der Karten-Struktur — nur Badge und Footer-Textblock.