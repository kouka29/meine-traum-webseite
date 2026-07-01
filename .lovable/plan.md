## Ziel
Im Checkout-Funnel (`src/components/angebot/CheckoutFunnel.tsx`, Zahlungsart-Auswahl bei Zeile ~1251–1286) die Option **„Auf Rechnung"** sichtbar lassen, aber deaktivieren. Beim Hover erscheint ein Tooltip mit Hinweis und Kontaktmöglichkeiten.

## Änderungen (nur `src/components/angebot/CheckoutFunnel.tsx`)

1. **Default auf „online" erzwingen**: In dem `useState`/Effekt, der `payMethod` initialisiert, sicherstellen, dass `payMethod` bei Rendern nie auf `"rechnung"` steht (falls zuvor gesetzt → auf `"online"` zurückstellen).

2. **Rechnung-Button deaktivieren**:
   - `onClick` entfernen bzw. no-op.
   - Visuell abgedimmt: `opacity: 0.5`, `cursor: not-allowed`, kein Aktiv-Rahmen möglich.
   - `title`-Attribut als nativer Tooltip-Fallback: „Aktuell nicht verfügbar. Bitte kontaktiere uns telefonisch unter 06131 3076498 oder per Mail an info@meine-traum-webseite.de".
   - Zusätzlich: Wrapper mit CSS-`:hover`-Tooltip (kleines Popup absolut positioniert über dem Button) mit demselben Text und klickbaren Links (`tel:+4961313076498`, `mailto:info@meine-traum-webseite.de`).
   - Kleiner „Nicht verfügbar"-Badge am Button.

3. **Kein Backend-/Logik-Wechsel** in `src/pages/Angebot.tsx` — `isRechnung`-Zweige bleiben unberührt (werden nur nicht mehr erreicht, da UI sperrt).

## Wieder aktivieren (bei Ausfall Online-Zahlung)
Ein einzelnes Konstanten-Flag am Dateikopf, z. B.:
```ts
const RECHNUNG_ENABLED = false; // auf true setzen, falls Online-Zahlung ausfällt
```
Steuerung von `disabled`-Zustand, Tooltip-Anzeige und Default-`payMethod` an dieser einen Stelle.

## Kein Rollout auf andere Flows
`Angebot.tsx` / `Starter.tsx` / `Wachstumspaket` bleiben unverändert — es geht nur um die Zahlungsmethodenauswahl im Checkout-Funnel.