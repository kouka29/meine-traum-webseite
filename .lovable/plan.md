
## Ziel

Das auf `/handwerker` etablierte Apple-style Design (Aurora/Mesh-Gradients, Glassmorphism, Gradient-Headlines, 3D-Device-Mockups, Marquee, Premium-Shadows) wird auf die gesamte Website ausgerollt. Gleichzeitig bleibt das bisherige Design erhalten und kann per Admin-Toggle live umgeschaltet werden — global für alle Besucher.

## 1. Datenbank (1 Migration)

Neue Tabelle `design_settings` (Single-Row mit `id = 1`):

```
- id (int, PK, default 1, CHECK id = 1)
- apple_design_enabled (boolean, default false)
- updated_at (timestamptz, default now())
```

RLS:
- `SELECT` für `anon, authenticated` → `true` (jeder darf den aktuellen Modus lesen, damit die Site weiß welches Design rendern)
- `UPDATE/INSERT/DELETE` nur via Service Role (Admin nutzt bestehende `admin-leads`-Edge-Function-Pattern bzw. eine neue kleine Edge-Function `admin-design-toggle` mit `ADMIN_PASSWORD`-Check)

Seed: ein Row mit `apple_design_enabled = false` (damit nichts bricht — Classic ist Default; `/handwerker` wird unten gesondert behandelt).

## 2. Globaler Design-Mode-Provider

Neue Datei `src/contexts/DesignModeProvider.tsx`:
- React Context `DesignModeContext` mit `{ appleDesign: boolean, loading: boolean }`
- Lädt beim App-Start `design_settings` aus Supabase (SELECT, RLS public)
- Subscribed via Supabase Realtime auf Änderungen (damit Toggle sofort live wirkt)
- Hook: `useDesignMode()`

In `src/App.tsx` als Provider um `<Routes>` legen.

Realtime: Migration aktiviert `ALTER PUBLICATION supabase_realtime ADD TABLE public.design_settings`.

## 3. Apple-Design auf der gesamten Website

Strategie: **Nicht jede Page einzeln duplizieren**, sondern Design-Tokens + ein paar Shared-Components ableiten und über `useDesignMode()` umschalten. Das hält den Code wartbar.

### 3a. Token-Layer in `src/index.css`
Neue Utility-Klasse `.apple-mode` (wird via Provider an `<body>` gehängt), die folgende Tokens überschreibt, wenn aktiv:
- Erweiterte Gradients (Aurora/Mesh radial-gradients)
- Glassmorphism-Hilfsklassen (`.glass-card`, `.glass-nav`)
- Größere Border-Radius (1rem → 1.5rem)
- Premium-Shadows
- Refined Letter-Spacing für Headlines

### 3b. Bestehende Shared-Components erhalten optionale Apple-Varianten
Anpassung (klein, additiv) in:
- `src/components/Navbar.tsx` → Glass-Effekt + Backdrop-Blur wenn Apple aktiv
- `src/components/Footer.tsx` → dunklerer Subtle-Gradient
- `src/components/CTABanner.tsx`, `FreePreviewCTA.tsx`, `PainPoints.tsx`, `IndexServices.tsx`, `IndexBenefits.tsx`, `IndexTestimonials.tsx`, `IndexPortfolio.tsx`, `IndexFAQ.tsx`, `SocialProofBar.tsx` → bekommen jeweils gradient-text Headlines, Aurora-Background-Layer und Glass-Cards via `cn(... appleDesign && "...")`
- `src/pages/Index.tsx` + alle `Webdesign*.tsx` + `LandingpageErstellen.tsx` etc.: Hero-Section bekommt Aurora-Background-Layer und Gradient-Headline-Variante; Buttons werden zur `variant="gradient"` mit Apple-Shadow

### 3c. `/handwerker` Sonderbehandlung
Der bisherige "alte Handwerker-Stand" (vor Apple-Redesign) wird als `src/pages/HandwerkerClassic.tsx` aus der Git-Historie wiederhergestellt. `Handwerker.tsx` (Apple-Version) bleibt. Routing:

```
/handwerker → appleDesign ? <Handwerker /> : <HandwerkerClassic />
```

## 4. Admin-Toggle

In `src/pages/AdminLeads.tsx` ganz oben (über den Tabs/Tabellen) ein **Schalter-Banner**:

```
[Globales Design]   ⬤ Apple Design aktiv  [ Switch ]
                    Wirkt sofort für alle Besucher.
```

- Verwendet `<Switch />` aus shadcn
- Onchange ruft Edge-Function `admin-design-toggle` auf (gleicher Pattern wie bestehende admin-Funktionen; akzeptiert `ADMIN_PASSWORD` aus Session)
- Optimistic UI + Toast

## 5. Edge-Function `admin-design-toggle`

`supabase/functions/admin-design-toggle/index.ts`:
- POST: Body `{ password, appleDesignEnabled }`
- Validiert Password gegen `ADMIN_PASSWORD`
- `UPDATE design_settings SET apple_design_enabled = $1, updated_at = now() WHERE id = 1` via Service Role
- CORS-Header

## 6. Geänderte/neue Dateien (Zusammenfassung)

```text
NEU:
  supabase/migrations/<ts>_design_settings.sql
  supabase/functions/admin-design-toggle/index.ts
  src/contexts/DesignModeProvider.tsx
  src/pages/HandwerkerClassic.tsx      (Restore alte Version)

EDIT:
  src/index.css                         (Apple-Tokens unter .apple-mode)
  src/App.tsx                           (Provider, /handwerker switch)
  src/pages/AdminLeads.tsx              (Toggle-Banner)
  src/components/Navbar.tsx
  src/components/Footer.tsx
  src/components/CTABanner.tsx
  src/components/FreePreviewCTA.tsx
  src/components/PainPoints.tsx
  src/components/SocialProofBar.tsx
  src/components/IndexServices.tsx
  src/components/IndexBenefits.tsx
  src/components/IndexTestimonials.tsx
  src/components/IndexPortfolio.tsx
  src/components/IndexFAQ.tsx
  src/pages/Index.tsx
  src/pages/Services.tsx
  src/pages/About.tsx
  src/pages/Portfolio.tsx
  src/pages/Contact.tsx
  src/pages/WebdesignAgentur.tsx
  src/pages/WebsiteErstellenLassen.tsx
  src/pages/LandingpageErstellen.tsx
  src/pages/WebsiteRelaunch.tsx
  src/pages/ConversionOptimierung.tsx
  src/pages/KostenloserWebsiteCheck.tsx
  src/pages/WebdesignPreise.tsx
  src/pages/WebdesignSHK.tsx
  src/pages/WebdesignHandwerker.tsx
  src/pages/WebdesignAerzte.tsx
  src/pages/WebdesignImmobilienmakler.tsx
  src/pages/WebdesignCoaches.tsx
  src/pages/IndividuelleSoftware.tsx
```

## 7. Verifikation

- Build grün
- Toggle on → komplette Site bekommt Aurora-Backgrounds, Glass-Nav, Gradient-Headlines, Premium-Shadows
- Toggle off → identisch zum jetzigen Zustand (außer /handwerker, das automatisch zur Classic-Version zurück wechselt)
- /preise Stripe-Buttons funktionieren in beiden Modi
- Realtime: Toggle in /admin → andere offene Tabs aktualisieren ohne Reload

## Hinweise

- Texte/Inhalte/Strukturen ändern sich **nicht** — nur visueller Layer.
- Bestehende Brand-Farbe (`hsl(250 56% 48%)`), Poppins/Inter und DSGVO-Komponenten bleiben.
- Da fast jede Page-Datei einen kleinen Patch bekommt, ist der Umfang groß; das Logik-Volumen aber gering (Klassen-Conditionals).
