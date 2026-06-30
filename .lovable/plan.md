# Visuelles Aufräumen (3 Punkte)

Keine Layout-/Funktionsänderung. Tabu: Supabase/Stripe/Pixel/Kundenportal bleibt unangetastet.

## 1) Emoji-Icons → lucide-react

Betroffen sind primär Daten-Arrays mit `icon: "…"` (Emoji-String) in:

- `src/pages/Handwerker.tsx` (10 Branchen-Items)
- `src/pages/lp/Gesetz.tsx` (~9 Items in mehreren Arrays)
- `src/pages/branchen/_shared.ts` (3 Cross-Links)
- `src/pages/branchen/*Hub.tsx` (Zahnärzte, Fitness, Ingenieure, Restaurants, Hotels, Autohaeuser, Steuerberater, Anwaelte, Architekten, Versicherungsmakler, Finanzberater, Yoga, Friseure, Kosmetik, MassgeschneiderteLoesungen — soweit vorhanden)
- `src/pages/trade/*Hub.tsx` (Elektriker, Maler, Sanitaer, Dachdecker, Schreiner, Fliesenleger, GartenLandschaft, Kaeltetechnik, KFZ)
- Stichprobe weiterer Komponenten via `rg "icon:\s*[\"']"` und `rg "[\\p{Emoji}]"` in JSX-Text

Vorgehen pro Datei:
- Typ des Items von `icon: string` auf `icon: LucideIcon` umstellen (`import type { LucideIcon } from "lucide-react"`).
- Mapping Emoji → Lucide (Auszug, deterministisch):
  - ⚡ → `Zap`, 🎨 → `Palette`, 🔧 → `Wrench`, 🏠 → `Home`, 🪵 → `TreePine`, 🧱 → `Brick`/`Square` (Fallback), 🌿 → `Leaf`, ❄️ → `Snowflake`, 🚗 → `Car`, ➕ → `Plus`
  - 📞 → `Phone`, 📅 → `Calendar`, 📋 → `ClipboardList`, 📸 → `Camera`, 📂 → `FolderOpen`, 📊 → `BarChart3`, 📱 → `Smartphone`, 📍 → `MapPin`
  - ✅ → `Check`, ✔️ → `Check`, 🚀 → `Rocket`, ⭐ → `Star`, 💰/💸 → `Euro`, 🔍 → `Search`, 🔗 → `Link2`, 👥 → `Users`, 👨‍⚕️ → `Stethoscope`, 🎓 → `GraduationCap`, 🏢 → `Building2`
  - 🏗️ → `HardHat`, 👷 → `HardHat`, ⚙️ → `Settings`, ⛈️ → `CloudLightning`, ♨️ → `Flame`, 🛁 → `Bath`, 🚨 → `Siren`, ⏰/⏱️ → `Clock`, 🍪 → `Cookie`, ⚖️ → `Scale`, 🏆 → `Trophy`, 💉 → `Syringe`, 😨 → `Frown`, 🥊 → `Dumbbell`
- Rendering: `<Item.icon size={20} className="text-primary" aria-hidden />` (bei dekorativen Listen) bzw. `text-muted-foreground` wenn Card-Subdetail. Einheitliche Größe 20.
- Bestehende Container-Größen (`w-12 h-12` etc.) bleiben — nur der Inhalt wird zum Icon. Kein Wechsel des Layouts.

Akzeptanz: `rg "icon:\s*[\"']" src` liefert keine Emoji-Strings mehr; keine sichtbaren Emoji im UI (Stichprobe via `rg` über häufige Emoji-Codepoints).

## 2) Gradient-Headlines reduzieren

Regel: **max. 1 `gradient-text` pro Seite**, ausschließlich auf der Haupt-Hero-H1.

Vorgehen pro Datei (26 Treffer): Erstes Vorkommen in der Hero-H1 behalten, alle weiteren `className="… gradient-text …"`-Vorkommen → `text-foreground` ersetzen (sonst Klassen unverändert). Bei mehrfachem `gradient-text` in einer Seite ohne klare Hero-H1 (z.B. `WebdesignPreise.tsx` mit 4 Treffern, `EmailAngebot.tsx` mit 5) bleibt nur das oberste Hero-Vorkommen.

Die CSS-Utility `.gradient-text` in `src/index.css` bleibt definiert.

## 3) Glow / Aurora beruhigen

- `src/index.css`: Opazitäten in den Aurora-/Radial-Gradient-Backgrounds (z.B. `aurora-bg`, `radial-glow`, `hero-glow`) halbieren (alle `hsl(... / X%)`-Werte → `X/2`). `shadow-glow` Utility selbst behalten, aber Blur/Spread reduzieren (≈ halbe Intensität).
- `shadow-glow`: pro Seite max. 1 Element. Vorgehen: in jedem Page-File alle Vorkommen außer dem ersten (Hero-CTA) entfernen.
- `backdrop-blur*`: nur in `src/components/Navbar.tsx` belassen. In Content-Cards / Popups / Banners (`PricingLeadPopup`, `PainPoints`, `CookieBanner`, `KostenloseVorschauV2`, `lp/EmailAngebot`, `lp/Gesetz`, `AGB`, `ui/button` Variant falls vorhanden) `backdrop-blur*`-Klassen entfernen; das umgebende `bg-…`/Border bleibt. Keine Layout-Klassen entfernen.

## Verifikation

- `rg "icon:\s*[\"'][^A-Za-z]" src` = 0
- `rg "gradient-text" src` zeigt pro Page-Datei ≤ 1 Hit (plus `index.css`)
- `rg "backdrop-blur" src` zeigt nur `Navbar.tsx` und ggf. `index.css`-Utility
- `npm run build` grün, `npm run lint` ≤ Baseline (65)

## Out of scope

Texte, Copy, Routing, Layout-Grid, Spacing, Farben-Tokens, Tabu-Bereiche (Supabase/Stripe/Pixel/Kundenportal-Komponenten).
