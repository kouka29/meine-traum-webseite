## Ziel
Die Enterprise-Preis-Anzeigen (Miete & Kauf) auf `/preise` und allen Branchen-Preisseiten sollen dieselbe Farbe (`text-primary`) und Schriftgröße (`text-3xl`) wie die regulären Paket-Preise erhalten.

## Betroffene Stellen
1. **Miete Enterprise** (`src/pages/WebdesignPreise.tsx` ~Z. 890):
   - Aktuell: `text-sm text-muted-foreground`
   - Ziel: `font-heading text-3xl font-bold text-primary mb-1`
   - Text: "Auf Anfrage – meist unter 300 €/Monat"

2. **Kauf Enterprise** (`src/pages/WebdesignPreise.tsx` ~Z. 948):
   - Aktuell: `font-heading text-2xl font-bold text-foreground mb-1`
   - Ziel: `font-heading text-3xl font-bold text-primary mb-1`
   - Text: "Auf Anfrage"

## Technische Details
- Keine Textinhalte ändern, nur Tailwind-Klassen.
- Keine Änderungen an Admin, Kundenportal, Stripe oder Tracking.
- Branchen-Preisseiten übernehmen die Änderung automatisch (Wrapper um `WebdesignPreise`).

## Validierung
- Build grün (TypeScript + Vite).
- Visueller Check auf `/preise`.