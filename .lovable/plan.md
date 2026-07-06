## Fixes für `/vorschau-start`

### 1. Header-Cutoff beheben

Die Navbar ist `fixed h-[72px]`. Aktuell hat der Funnel-Container nur `pt-6`, wodurch Konfetti-Badge, Checkmark-Circle und ProgressBar unter der Navbar verschwinden.

- In `src/pages/VorschauStart.tsx` das Wrapper-Padding auf `pt-24 md:pt-28` setzen (analog zu Index-Hero `pt-28 sm:pt-36`, minus Extra weil kein voller Hero).
- Jeder Step erbt dadurch korrekten Abstand — kein Overflow mehr.

### 2. Design-Sprache stärker an MTW angleichen

Aktuell wirkt der Funnel etwas „shadcn-generisch". Die restliche Seite nutzt:

- `variant="gradient"` Buttons (`gradient-bg`, primary → primary-glow)
- `gradient-hero-bg` als sanfter Seiten-Background
- Gradient-Headlines (`bg-clip-text`) für H1
- Große, weiche Cards mit `shadow-elegant`
- Poppins bold für Headlines

Änderungen:
- **VorschauStart.tsx**: Hintergrund von generischem `to-muted/30` auf `gradient-hero-bg` (bestehender Seitenhintergrund) umstellen.
- **Alle Primary-Buttons** in Step 0/1/2/3/4 auf `variant="gradient"` umstellen (statt Default).
- **Step-0 Headline** mit Gradient-Text (`bg-gradient-primary bg-clip-text text-transparent`) versehen, größer & prominenter.
- **Cards** (3-Icon-Ablauf, Recap): `shadow-elegant` statt `shadow-sm`, `rounded-3xl` statt `rounded-2xl` für weicheren Look.
- **Fragen-Cards** (Stil/Ziel): aktive Selection mit Gradient-Border + Glow statt reinem Ring.
- **ProgressBar**: Gradient-Fill statt flaches Primary.

### 3. „100% kostenlos" Messaging

Kernpunkt für Trust — soll klar sein: Der User zahlt nichts, Preis kommt erst nach Gefallen.

- **Step 0 (Gratulation)**: Neue Trust-Zeile direkt unter Subline:
  > „💚 **Komplett kostenlos & unverbindlich** — wir bauen deine Vorschau auf unsere Kosten. Erst wenn sie dir gefällt, sprechen wir über Preise. Gefällt sie dir nicht: entstehen dir keinerlei Kosten."

  Als eigene Card mit `border-primary/20 bg-primary/5` prominent hervorgehoben, direkt vor dem 3-Icon-Ablauf.

- **Step 4 (Termin)**: Kurze Reassurance direkt über dem Submit-Button:
  > „Kostenlos & unverbindlich · Keine Zahlungsdaten nötig"
  in kleinem Text mit Check-Icons, damit der letzte Klick angstfrei ist.

- **Step 5 (Danke)**: Reassurance-Line ergänzen:
  > „Erinnerung: Die Vorschau ist komplett kostenlos. Wenn sie dir nicht gefällt, war's das — ohne Wenn und Aber."

### Betroffene Dateien

- `src/pages/VorschauStart.tsx` (Padding + Background)
- `src/pages/vorschau-start/steps/Step0Gratulation.tsx` (Trust-Card, Gradient-Headline, Button)
- `src/pages/vorschau-start/steps/Step1Logo.tsx` (Button-Variant)
- `src/pages/vorschau-start/steps/Step2Fragen.tsx` (Button-Variant, Card-Polish)
- `src/pages/vorschau-start/steps/Step3Fotos.tsx` (Button-Variant)
- `src/pages/vorschau-start/steps/Step4Termin.tsx` (Reassurance + Button-Variant)
- `src/pages/vorschau-start/steps/Step5Danke.tsx` (Reassurance)
- `src/pages/vorschau-start/ProgressBar.tsx` (Gradient-Fill)

Keine Änderungen an Datenmodell, Backend oder Logik — reine Visual- & Copy-Anpassungen.