## MTW Vorschau-Funnel `/vorschau-start`

Exklusiver 6-Step Onboarding-Funnel für gesicherte Vorschau-Plätze. Mobile-first, Du-Ansprache, MTW-Branding.

### 1. Datenbank (Migration)

**Neue Tabelle `funnel_leads`:**
- `id uuid pk`, `created_at`, `updated_at`
- `firmenname`, `ort`, `gewerk`, `leistungen` (text)
- `hat_website bool`, `website_url text`
- `stil text` (hell-modern|dunkel-edel|logo-angepasst|ueberrascht)
- `ziel text` (mehr-anfragen|professioneller|mitarbeiter|google)
- `kein_logo bool default false`, `logo_url text`
- `foto_urls text[] default '{}'`
- `termin_datum date`, `termin_uhrzeit text`, `kontaktart text` (phone|video)
- `name`, `telefon`, `email` (validiert), `datenschutz_akzeptiert bool`
- `source_cta text default 'vorschau-funnel'`, `source_page text`
- `status text default 'neu'`, `month_key text`

**RLS:** Insert für `anon` erlaubt (Formular ist öffentlich), Select/Update nur `service_role`. GRANTs: `INSERT` an `anon`+`authenticated`, `ALL` an `service_role`.

**vorschau_settings:** Neue Row `page_key = 'vorschau-funnel'` mit `total_slots = 5`, damit Slot-Zählung getrennt läuft. Bestehende `increment_taken_slot(p_page_key)` und `check-vorschau-availability` Edge Function werden wiederverwendet.

**Storage:** Neuer public Bucket `funnel-uploads` (RLS: insert anon, read public). Pfade: `{funnel_uuid}/logo/…`, `{funnel_uuid}/fotos/…`.

### 2. Route & Chrome

- `/vorschau-start` in `App.tsx` mit Navbar + Footer (nicht in `standalone`-Liste).
- Lazy-loaded page `src/pages/VorschauStart.tsx`.
- SEO: PageMeta „Deine Website-Vorschau · MTW", `noindex` (exklusiver Bereich).

### 3. State-Management

- Zentraler React Context `FunnelStateProvider` in `src/pages/vorschau-start/state.tsx`.
- Persistenz in `sessionStorage` (Key `mtw_funnel_v1`), rehydriert beim Mount. Uploads (URLs) persistent, aber Files nicht.
- `funnel_uuid` einmalig via `crypto.randomUUID()` erzeugt, für Storage-Pfade + finale Insert-Row.

### 4. Steps (`src/pages/vorschau-start/steps/`)

Ein Screen pro Step, framer-motion fade+slide (250ms). Progress-Bar oben („Schritt X von 5", Steps 1–5, Step 0 ohne Bar, Step 6 = Danke).

- **Step0Gratulation** — `canvas-confetti` einmalig, Live-Slots via `check-vorschau-availability` (`page_key='vorschau-funnel'`), Fallback-Text falls Fehler. Monat via `Intl.DateTimeFormat('de-DE', {month:'long'})`. CTA „Los geht's".
- **Step1Logo** — Dropzone (react-dropzone oder nativ), sofort-Upload zu Storage bei Auswahl mit Spinner, Thumbnail-Preview + Entfernen. Link „Ich habe kein Logo" → `kein_logo=true`, überspringt validierungslos.
- **Step2Fragen** — 5 Sub-Steps (interner Index) mit eigenen Weiter/Zurück Buttons: Firma+Ort, Gewerk+Leistungen, Website (Radio + optionale URL), Stil (4 Karten), Ziel (4 Karten). Karten-UI mit `MarketingCard`-Stil.
- **Step3Fotos** — Multi-Dropzone max 3, sofort-Upload, Thumbnails, „Weiter" + „Überspringen".
- **Step4Termin** — shadcn `Calendar` (`pointer-events-auto`), disabled-Logik: Weekends, vor `heute + 2 Werktage`, nach `+14 Tage`. Werktage-Berechnung als kleine Utility (`addBusinessDays`). Zeitslot-Grid 09/10/11/14/15/16/17. Radio Telefon/Video. Kontaktfelder mit `inputmode`/`type`. DE-Handynummer-Validierung via regex `^(\+49|0)[1-9]\d{8,12}$`. Datenschutz-Checkbox verpflichtend. Submit-Button mit Spinner, `disabled` gegen Doppel-Klick.
- **Step5Danke** — Checkmark-Animation (framer-motion SVG), Recap-Card, WhatsApp-FAB (Nummer `06131 30 765 00` → wa.me-Link `4961313076500`).

### 5. Submit-Flow

1. Zod-Schema validiert kompletten State.
2. `supabase.from('funnel_leads').insert({...})` mit `id = funnel_uuid`.
3. `supabase.rpc('increment_taken_slot', { p_page_key: 'vorschau-funnel' })`.
4. `supabase.functions.invoke('notify-lead', { body: { source_cta: 'vorschau-funnel', … formatierte Felder … } })` — bestehende Function nimmt bereits generischen Payload; Telegram-Formatierung dort ist okay (source_cta wird durchgereicht, Rest im `message`-Feld als vorformatierter Text mit Emojis wie im Prompt spezifiziert).
5. Bei Fehler: Toast mit WhatsApp-Fallback-Link, Button re-enable.

### 6. Design-Tokens

Nutzt bestehende `--primary` (250 56% 48%), Poppins Headings, Inter Body, `rounded-2xl`, `shadow-lg`. Sticky-CTA mobil: `sticky bottom-0` mit backdrop-blur. Touch-Targets min-h-12.

### 7. Dependencies

- `canvas-confetti` + Typings (nur Step 0, lazy import).
- react-dropzone (optional; nativer `<input type=file>` mit Drag-Handling reicht auch — bevorzugt nativ, um Bundle klein zu halten).

### Dateien

```
supabase/migrations/<ts>_funnel_leads.sql
src/pages/VorschauStart.tsx
src/pages/vorschau-start/state.tsx
src/pages/vorschau-start/utils.ts        (Werktage, Validatoren, Uploader)
src/pages/vorschau-start/ProgressBar.tsx
src/pages/vorschau-start/steps/Step0Gratulation.tsx
src/pages/vorschau-start/steps/Step1Logo.tsx
src/pages/vorschau-start/steps/Step2Fragen.tsx
src/pages/vorschau-start/steps/Step3Fotos.tsx
src/pages/vorschau-start/steps/Step4Termin.tsx
src/pages/vorschau-start/steps/Step5Danke.tsx
src/App.tsx                              (Route ergänzen)
```

### Offene Annahmen (falls nicht anders gewünscht)

- WhatsApp-Nummer: `+49 6131 3076500` (aus Prompt-Platzhalter).
- Fotos: HEIC wird akzeptiert im accept-Attribut, aber nicht clientseitig konvertiert (Handy-Uploads landen meist bereits als JPG bei modernen iOS-Versionen).
- Keine E-Mail-Bestätigung an den Lead in dieser Version — nur Telegram-Notify + Admin-Sicht via bestehendes Admin-Panel (funnel_leads wird dort später ergänzt, nicht Teil dieses Plans).