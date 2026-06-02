## Ziel
Erfolgsseite `/kauf-erfolgreich` zeigt passenden Text — Anzahlung bei Einmalkauf, Miet-Abo bei monatlich.

## Änderungen

**1. `src/components/StripeCheckoutDialog.tsx`**
- `returnUrl` um `&kind=${kind}` erweitern, damit die Erfolgsseite weiß, was gebucht wurde.
- `kind` in den `useEffect`-Dependencies ergänzen.

**2. `src/pages/KaufErfolgreich.tsx`**
- `kind` aus URL lesen (`searchParams.get("kind")`).
- Zwei Text-Varianten:
  - **deposit** (bestehend): „Vielen Dank für Ihre Anzahlung! … Ihre 50 % Anzahlung … Anzahlungs-Rechnung als PDF … Restzahlung bei Go-Live (50 % per Rechnung)."
  - **rent**: „Vielen Dank für Ihre Buchung! Ihr Miet-Abo ist aktiv." Cards:
    - Bestätigung per E-Mail mit erster Monatsrechnung als PDF
    - Onboarding innerhalb von 24 h (gleich)
    - Monatliche Abrechnung — erste Monatsmiete eingezogen, danach automatisch monatlich, Mindestlaufzeit 12 Monate, danach jederzeit kündbar
- Default bleibt `deposit` (für alte Links und Direktaufrufe).

Kein Backend-Call nötig — `kind` ist im Frontend bereits bekannt.
