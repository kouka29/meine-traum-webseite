## Problem
Im Checkout-Funnel (`src/components/angebot/CheckoutFunnel.tsx`) scrollt auf dem Smartphone nur ein winziger innerer Streifen zwischen Header und Footer. Ursache ist ein klassischer Flex-Bug plus `100vh`-Problem auf Mobile Safari.

## Root Cause (bestätigt im Code)

Panel (Zeile 738–753) ist bereits eine Flex-Spalte mit Header (shrink-0), Body (flex:1) und Footer (shrink-0) — Struktur passt. Aber:

1. **Body scroll (Zeile 851–855)**: `flex: 1, overflowY: "auto"` — **ohne `minHeight: 0`**. Flex-Items haben default `min-height: auto` und können nicht unter ihre Inhaltshöhe schrumpfen. Ergebnis: Body wächst über die verfügbare Höhe, `overflow-y:auto` greift kaum → winziger Scroll-Streifen.
2. **Panel maxHeight (Zeile 745)**: `calc(100vh - 48px)` — auf iOS Safari inkl. Adressleiste falsch; muss `100dvh` sein.
3. Body hat kein `overscroll-behavior: contain` und kein `-webkit-overflow-scrolling: touch` — Scroll fühlt sich zäh an und propagiert.
4. Kein bekannter überliegender `overflow:hidden`-Vorfahre außer Panel selbst (gewollt).

Kein `DialogContent` von shadcn im Einsatz — reines Custom-Overlay mit Inline-Styles.

## Fix (nur Layout, keine Inhalte)

Zwei Stellen in `src/components/angebot/CheckoutFunnel.tsx`:

### 1. Panel-Wrapper (Zeile 738–754)
- `maxHeight: isCentered ? "calc(100vh - 48px)" : "100%"` → `maxHeight: isCentered ? "calc(100dvh - 48px)" : "100dvh"`
- `height: isCentered ? "auto" : "100%"` → bleibt (100% des gestretchten Overlays passt); zusätzlich `maxHeight` sorgt für dvh-Grenze auch im Sidebar-Fall.
- Overlay-Wrapper (Zeile 699–712): kein Change nötig, `inset:0` liefert bereits die volle Fläche.

### 2. Scroll-Body (Zeile 851–855)
```
style={{
  flex: 1,
  minHeight: 0,              // ← der eigentliche Fix
  overflowY: "auto",
  overscrollBehavior: "contain",
  WebkitOverflowScrolling: "touch",
  padding: "20px",
}}
```

Header (761 `flexShrink:0`) und Footer (959 `flexShrink:0`) bleiben unverändert — Button ist damit sticky am unteren Panel-Rand und immer erreichbar.

## Akzeptanz
- Viewport 375–390 px: gesamter Step scrollt in **einem** Bereich zwischen Header und sticky Footer.
- Kein doppelter/winziger Scroll-Streifen.
- „Weiter"-Button dauerhaft sichtbar (sticky Footer, bereits gegeben).
- Desktop (`isCentered`) unverändert — `100dvh` verhält sich dort wie `100vh`.
- Keine horizontale Scroll-Leiste (keine Breitenänderung).

## Nicht angefasst
Preise, Texte, Auswahl-Karten, Reihenfolge, Business-Logik, Stripe-/Session-Code.
