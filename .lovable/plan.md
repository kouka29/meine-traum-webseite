## Ziel
Die Preise der Miet- und Kauf-Pakete (Starter / Pro / Premium) auf allen Preis-Seiten wieder in die Markenfarbe (Violett/Primary) setzen, wie auf dem Referenz-Bild gezeigt.

## Betroffene Bereiche
1. **Hauptpreis-Seite** (`/preise` → `src/pages/WebdesignPreise.tsx`)
   - `PackageCard` (Miete): `text-foreground` → `text-primary` bei `pkg.price`
   - `BuyCard` (Kauf): `text-foreground` → `text-primary` bei `pkg.price`
2. **Branchen-Preis-Seiten** (falls dieselbe Komponente/Logik genutzt wird)
   - `src/pages/trade/ElektrikerPreise.tsx`
   - `src/pages/trade/SanitaerPreise.tsx`
   - `src/pages/trade/DachdeckerPreise.tsx`
   - `src/pages/trade/HandwerkerPreise.tsx`
3. **Checkout-Funnel / Angebot** (`src/components/angebot/CheckoutFunnel.tsx`, `src/pages/Angebot.tsx`)
   - Preis-Anzeige im Funnel und auf dem Angebots-PDF-View auf `text-primary` prüfen und anpassen.

## Umsetzung
- In den betroffenen Komponenten die Tailwind-Klasse der Preis-Elemente von `text-foreground` auf `text-primary` (bzw. `hsl(var(--primary))`) ändern.
- Keine Layout-, Text- oder Funktionsänderungen.
- Keine Änderungen an Admin, Kundenportal, Stripe-Logik oder Tracking.

## Technische Details
- Design-Token: `--primary: 253 63% 57%` (#6A4BD6)
- Nur die eigentliche Preis-Zahl (z. B. „59 €/Monat“, „990 € einmalig“) wird eingefärbt.
- Sekundäre Texte (zzgl. MwSt., Vergleichs-Hinweise etc.) bleiben `text-muted-foreground`.

## Validierung
- Build grün (TypeScript + Vite).
- Visueller Check auf `/preise` und einer Branchen-Preis-Seite.