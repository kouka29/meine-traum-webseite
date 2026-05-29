# Funnel: Paket-Auswahl vor "Wie möchten Sie zahlen?"

Aktuell startet der Checkout-Funnel (`src/components/angebot/CheckoutFunnel.tsx`) immer mit Schritt 1 "Wie möchten Sie zahlen?". Bei Angeboten mit mehreren Paketen (z. B. *One Pager* und *Corporate Webseite M*) soll vorher das Paket gewählt werden.

## Verhalten

- **1 Paket:** Funnel startet wie bisher mit „Zahlung". Keine Änderung sichtbar.
- **≥ 2 Pakete:** Funnel startet mit neuem Schritt „Paket" — Auswahl aus allen verfügbaren Paketen (Name, Preis einmalig / Miete, Empfehlungs-Badge). Erst danach kommt „Zahlung", „Extras", „Kontakt", „Bezahlen", „Fertig".

Das auf der Angebotsseite vorausgewählte Paket (über `openFunnel(paketId)`) wird im Funnel als vorausgewählt angezeigt — der Nutzer kann es dort aber noch ändern.

## Umsetzung

1. **`CheckoutFunnel` Props erweitern**
   - Neu: `pakete: FunnelPaket[]` (Liste aller verfügbaren Pakete)
   - `paket` bleibt als initial ausgewähltes Paket erhalten
   - Intern: `selectedPaket` state, initialisiert mit `paket.id`

2. **Step-Modell anpassen**
   - `stepLabels` dynamisch: wenn `pakete.length > 1` → `["Paket", "Zahlung", "Extras", "Kontakt", "Bezahlen", "Fertig"]`, sonst wie bisher
   - Step-Indizes über Helper (`paketStepEnabled`) statt fester Zahlen 0–4 ableiten, damit Back/Forward, Progress-Anzeige und `Schritt X von Y` korrekt bleiben

3. **Neue `StepPaket`-Komponente**
   - Cards-Liste analog zur bestehenden `PaketChooserSection` auf der Angebotsseite (visuell konsistent, kompakter für die Sidebar-Breite 520 px)
   - Klick wählt Paket aus; „Weiter" aktiv sobald gewählt
   - Setzt nach Wahl `paymentMode` zurück auf den passenden Default (Miete wenn `miete_monatlich` vorhanden, sonst Kauf), da `mieteEnabled` paketabhängig ist

4. **Aufruf in `src/pages/Angebot.tsx`**
   - `<CheckoutFunnel … pakete={pakete} paket={funnelPaket} … />` zusätzlich übergeben
   - Keine Änderung an `openFunnel` nötig

## Nicht enthalten

- Keine Änderung an Add-ons, Stripe-Items, Kontakt-Step, Backend-Aufruf `buchung-bestaetigen`.
- Keine Layout-Änderung an der Angebotsseite selbst — Paket-Cards dort bleiben unverändert.
