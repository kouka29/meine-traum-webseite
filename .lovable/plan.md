## Ziel
Mobile-Checkout (< md) in `src/components/angebot/CheckoutFunnel.tsx` so umbauen, dass die Paket-/Zahlungs-Karten den größten Teil des Screens bekommen, alles als **eine** Einheit scrollt und unten nur eine schlanke, immer sichtbare Aktionsleiste (Brutto-Preis + „Weiter") sitzt. Desktop bleibt unverändert.

## Ausgangslage (bestätigt im Code)
- Ein einziger `<div>`-Panel-Wrapper (Zeile 738) mit fixem Header (755), fixem Progress (809), Scroll-Body (851, `flex:1 minHeight:0 overflowY:auto`) und einem **fetten Footer** (958–1121), der auf Mobile fast den halben Screen frisst:
  - „DEINE AUSWAHL" + Preis-Aufschlüsselung (netto/MwSt/brutto, Angebotszusatz, „1. Jahr, danach …")
  - „Weiter →"-Button
  - `<TrustBlock />` = VISA/Mastercard/SEPA/Klarna-Logos + „Erste Monatsmiete jetzt …" + Disclaimer (12 Monate) + Garantie-Banner „🛡️ Website in 7 Tagen live …"
- Struktur ist bereits Flex-Column mit `minHeight:0` im Scroll-Body — das Layout an sich funktioniert; nur der Footer ist zu hoch.
- Keine shadcn `<Dialog>` — reines Inline-Style-Overlay. Kein zusätzlicher `overflow` im Inneren.
- `useIsMobile()` (`src/hooks/use-mobile.tsx`, `< 768px`) ist bereits vorhanden.

## Fix (nur Layout, Mobile-only, keine Preise/Texte/Logik ändern)

### 1. Mobile-Flag einführen
Am Anfang der Komponente:
```tsx
const isMobile = useIsMobile();
```
Import ergänzen.

### 2. Overlay + Panel Mobile → Vollbild (Zeilen 697–753)
- Overlay: auf Mobile `padding: 0`, `alignItems: "stretch"`, `justifyContent: "stretch"` (statt centered/sidebar).
- Panel: auf Mobile
  - `width: "100%"`, `maxWidth: "none"`,
  - `height: "100dvh"`, `maxHeight: "100dvh"`,
  - `borderRadius: 0`,
  - `boxShadow: "none"`.
- Desktop-Zweige (`isCentered`) unverändert; alle bestehenden `100vh`-Ausdrücke sind bereits `100dvh`.

### 3. Footer aufteilen (Zeilen 958–1121)
Auf Mobile wird der bisherige Footer in zwei Teile geteilt:

**a) In den Scroll-Body (Zeile 851–955) am Ende einfügen** (nur wenn `isMobile && currentKey !== "bezahlen" && currentKey !== "fertig"`):
- Der komplette „DEINE AUSWAHL"-Block mit Preis-Aufschlüsselung (die IIFE für Miete/Pro und die Alternativ-Anzeige, plus `heuteLabel` und `activeOffer.label`) — identisch zum aktuellen Footer-Inhalt, nur ohne `borderTop`/Sticky-Styles.
- `<TrustBlock />` (Logos + Disclaimer + Garantie-Banner „Website in 7 Tagen live …").
- Zusätzlicher Bottom-Spacer `paddingBottom: 96` innerhalb des Scroll-Bodys nur auf Mobile, damit die Sticky-Leiste nicht den letzten Inhalt verdeckt.

**b) Sticky-Leiste am Panel-Boden (ersetzt den bisherigen fetten Footer nur auf Mobile)**:
```tsx
<div style={{
  flexShrink: 0,
  padding: "10px 16px",
  borderTop: "1px solid rgba(79,63,240,0.1)",
  background: "#fff",
  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
}}>
  <div style={{ fontSize: 15, fontWeight: 800, color: TEXT_DARK, lineHeight: 1.1 }}>
    {/* Kompakter Brutto-Preis: 
        - miete: fmtEUR2(nettoToBrutto(effGesamtMonatlich)) + " /Monat" (bzw. reg wenn kein Angebot)
        - kauf/kontakt: fmtEUR(effGesamtEinmalig bzw. effHeuteZuZahlen) */}
  </div>
  <button /* identisch zum bisherigen Weiter-Button (Handler, disabled, Labels, Icon), aber kompakter: minHeight: 48, minWidth: 140, width nicht 100% */ />
</div>
```
Kein TrustBlock, keine Aufschlüsselung, keine Logos in dieser Leiste.

**c) Desktop-Zweig** (`!isMobile`): existierender Footer-Block (Zeilen 958–1121) bleibt exakt wie er ist.

Umsetzung technisch: den bestehenden Footer-JSX-Block in ein Ternary `{!isMobile ? (<currentFooter/>) : (<slimStickyBar/>)}` packen; den Scroll-Body-Container erweitert um ein `{isMobile && currentKey !== "bezahlen" && currentKey !== "fertig" && <MobileSummaryAndTrust/>}` als letztes Kind. Zur Wiederverwendung wird der bestehende „DEINE AUSWAHL"-Preisblock zu einer lokalen Sub-Komponente `PriceBreakdown` extrahiert (dieselben Props/Closures wie bisher — ist eine reine Umsortierung, keine Logikänderung).

### 4. Sicherstellen (bereits im Code, nur bestätigen — kein Change nötig)
- Scroll-Body hat `flex:1 minHeight:0 overflowY:auto overscrollBehavior:contain WebkitOverflowScrolling:touch` ✅
- Kein zweiter `overflow-y` mit fester Höhe im Inneren.
- Panel-`overflow:hidden` bleibt (verhindert Overlay-Bleed, unterbindet aber nicht den inneren Scroll).

## Nicht angefasst
Preise, Rabatt-Logik, Stepper, Server-Pricing, Stripe-Schritte („bezahlen"/„fertig" — diese Steps haben ohnehin keinen Footer), Content der Paket-Karten, `StepZahlung`/`StepPaket`/`StepAddOns`/`StepKontakt`.

## Akzeptanz
- iPhone 375–390 × 667 px: alle Paket-Karten per normalem Scrollen erreichbar; Preis-Aufschlüsselung + Zahlart-Logos + Disclaimer + Garantie-Banner sind Teil des Scroll-Flusses (unten).
- Genau **ein** Scroll-Bereich, kein winziger innerer Streifen.
- Sticky-Leiste (kompakter Preis + „Weiter →", Button ≥ 48 px hoch) immer sichtbar, verdeckt dank `pb-[96px]` keinen Inhalt.
- Keine horizontale Scroll-Leiste.
- Desktop-Layout (`md+`) unverändert.
