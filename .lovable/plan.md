## Ziel
Ein neues, dezentes Chat-Widget mit dem MTW-Maskottchen (State-abhängige Avatare), Marken-Verlauf `#8441E3 → #3488DF` nur auf Floating-Button + Panel-Header. Rein additiv — keine Edge-Functions, kein Stripe, kein Pixel, kein Kundenportal wird angefasst. Bestehende `chat-assistant` + `notify-lead` + `check-vorschau-availability` Functions werden nur konsumiert.

## Dateien

### Neu: `src/components/ChatAssistant.tsx`
Single-File-Komponente (ersetzt in `App.tsx` den bisherigen Import auf `@/components/ChatAssistant/ChatAssistant`; alte Datei bleibt unangetastet im Repo, wird nur nicht mehr importiert — rein additiver Ersatz).

Struktur:
- **Assets-Import**: 5 statische PNG-Imports aus `src/assets/mascot/`
  - `idle` = 01, `greeting` = 09, `thinking` = 06, `success` = 04, `nudge` = 07
- **State**: `open`, `messages`, `input`, `loading`, `availability {available,isFull}`, `avatarState` ∈ `idle|greeting|thinking|success|nudge`, `showConsent`, `showLeadForm`, `leadSubmitted`, Lead-Felder (`name`, `phone`, `company` = Honeypot).
- **Persistenz**: `sessionStorage` für Offen-Zustand (`mtw_chat_open`), Consent-Gesehen-Flag (`mtw_chat_consent_v1`) und Nachrichten (`mtw_chat_msgs_v2`).
- **Route-Hide**: gleicher Ausschluss-Set wie bisher (Admin, Kundenportal, Angebot, Checkout, Erfolg).

### Update: `src/App.tsx`
- Import-Pfad wechseln: `import ChatAssistant from "@/components/ChatAssistant";`
- Sonst nichts. Alle Route-Regeln bleiben identisch.

### Update: `tailwind.config.ts` (nur wenn nötig)
- Keine Änderung — Verlauf wird per Inline-Style `linear-gradient(135deg,#8441E3,#3488DF)` gesetzt, um Token-Sauberkeit nicht anzufassen.

## Verhalten

### Floating-Button (z-40)
- Fixiert unten rechts, rund (56×56 desktop, 52×52 mobile), Verlauf-Hintergrund, sanfter Box-Shadow.
- Enthält `idle`-Maskottchen (`object-contain`, ~70% des Buttons).
- Mobile-Offset: `bottom-24 md:bottom-5` — hebt Widget über etwaige Sticky-CTA-Bar.
- Dezente Idle-Animation: eigene Keyframe `float` in `<style>`-Tag oder via Tailwind arbitrary — 3s ease-in-out, ±4px, `prefers-reduced-motion: reduce` respektiert.

### Panel
- Breite ~360px (`w-[360px] max-w-[calc(100vw-2rem)]`), `max-h-[70vh]`, abgerundet, Schatten, weißer Body.
- **Header**: Marken-Verlauf + weißer Text. Links Avatar (48×48, wechselt per State), Mitte "KI-Assistent" (Poppins) + Zeile "Antwortet in Sekunden". Rechts kleines Badge `KI` (weiß/10 % Alpha) und Close-Button.
- **Consent-Zeile** (dünn, nur wenn `!consentDismissed`): "Dieser Chat wird KI-gestützt verarbeitet (Google Gemini via Lovable). Mit dem Senden stimmst du zu. Mehr: [Datenschutz](/datenschutz)."
- **Nachrichtenliste**: scrollbar, User rechts (primary bubble), Assistant links (muted bubble), auto-scroll ans Ende.
- **Loading-Zeile**: kleine Bubble mit drei animierten Punkten; Header-Avatar wechselt auf `thinking`.
- **Composer**: `<textarea>` + Send-Button (Enter sendet, Shift+Enter Umbruch).
- **Footer/Handoff-CTA**: immer sichtbar
  - `available > 0` → Button „Kostenlose Vorschau sichern ({available} frei)"
  - `isFull` → Button „Rückruf anfordern"
  - `availability === null` (noch nicht geladen) → Button ohne Zahl „Kostenlose Vorschau sichern"
  - Klick klappt Inline-Lead-Formular auf.

### Kontextabhängige Begrüßung
Beim ersten Öffnen (leere Message-Historie) je nach `pathname`:
- startsWith `/preise` oder `/webdesign-preise` → "Fragen zu den Paketen? Ich helf dir das passende zu finden."
- startsWith `/portfolio` → "Suchst du ein Beispiel für deine Branche?"
- sonst → "Hi! Ich bin dein Assistent von MTW. Was möchtest du wissen?"
Avatar-State: `greeting` für 2.5s, dann `idle`.

### Chat-Call
`supabase.functions.invoke("chat-assistant", { body: { messages, page: pathname } })`.
Response: `{ reply, available, isFull }` → Nachrichten anhängen, `availability` updaten, `avatarState` zurück auf `idle`.
Fehlerpfad: Fallback-Nachricht mit Telefonnummer, `avatarState = idle`.

### Verfügbarkeit
Beim Öffnen einmalig `supabase.functions.invoke("check-vorschau-availability", {})` (falls Function fehlschlägt → still ignorieren, Button bleibt neutral). Antworten von `chat-assistant` überschreiben den Wert.

### Lead-Formular (Inline)
Felder: `Name`, `Telefon`, Honeypot `company` (off-screen, `honeypotFieldProps` aus `@/lib/submitLead`).
Submit → `supabase.functions.invoke("notify-lead", { body: {...} })` mit:
```
{ name, phone, company, source_page: pathname, source_cta: "chatbot", message: "Chatbot-Lead" }
```
- Honeypot befüllt → still `return` (kein Netzwerk-Call), UI zeigt trotzdem „Danke".
- Erfolg → `avatarState = success` (bleibt), Danke-Bubble „Danke! Muad meldet sich.", Formular schließen, `leadSubmitted = true` in sessionStorage.
- Fehler → Inline-Fehlermeldung mit Telefonnummer.

Hinweis: `submitLead()` helper wird bewusst NICHT genutzt, weil er `source_page` selbst setzt und das Feld-Set etwas anders formt — hier direkter `invoke`, um dem Prompt (`source_cta: "chatbot"`, Message exakt „Chatbot-Lead") 1:1 zu entsprechen. `honeypotFieldProps` wird weiter aus `@/lib/submitLead` importiert (kein Duplikat).

### Kein Auto-Öffnen
`useChatTriggers` wird nicht mehr eingebunden (bleibt als Datei bestehen, wird für spätere Phase reaktivierbar).

### Accessibility
- `role="dialog"` + `aria-label` am Panel, `aria-live="polite"` an der Nachrichtenliste, Focus-Trap light: Auto-Focus Textarea beim Öffnen, Escape schließt Panel.
- Bilder mit sprechendem `alt="MTW Maskottchen"` + `aria-hidden` an dekorativen Instanzen.

## Verifikation
1. `bun run build` grün.
2. `bun x tsgo --noEmit` grün.
3. `bun run lint` — Fehleranzahl ≤ Baseline (65).
4. Manuell (Playwright optional): Widget öffnet, Consent sichtbar, Nachricht senden → Loading-Avatar 06 → Reply, Handoff-Formular → Danke-State mit Avatar 04.

## Nicht-Änderungen
- `supabase/functions/**` unverändert.
- `src/lib/stripe.ts`, `MetaPixel.tsx`, Kundenportal-Routen — kein Diff.
- `src/hooks/useChatTriggers.ts` bleibt (unbenutzt).
- Alte `src/components/ChatAssistant/**` bleibt physisch, wird nur nicht mehr importiert.
