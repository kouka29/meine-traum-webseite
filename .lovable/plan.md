## Ziel
Im Portfolio-Modal "Neues Projekt" / "Bearbeiten" (in `src/pages/AdminLeads.tsx`) erhält das Feld **Beschreibung** einen "✨ KI generieren"-Button, der eine kurze, knackige Portfolio-Beschreibung (1–2 Sätze, ~160–220 Zeichen) im Stil eines Senior Webdesign-Copywriters erzeugt.

## Backend
Neue Edge Function `supabase/functions/generate-portfolio-description/index.ts`:
- Input: `{ password, title, category, result, current? }`
- Auth: `ADMIN_PASSWORD` Check (gleich wie `rephrase-text`)
- Modell: `google/gemini-3-flash-preview` via Lovable AI Gateway
- System-Prompt: Rolle "Senior Conversion-Copywriter & Webdesign-Experte". Schreibt **genau einen** prägnanten deutschen Satz (18–28 Wörter), der das Projekt für die Portfolio-Karte beschreibt. Variiert Stil/Schwerpunkt (Conversion, Design, Vertrauen, lokale Sichtbarkeit …) ähnlich `generate-demo-description`. Verboten: Anführungszeichen, Floskeln, Emojis, Firmenname im Satz wiederholen, Sie-Anrede.
- 429/402 sauber durchreichen
- Function in `supabase/config.toml` als `verify_jwt = false` registrieren

## Frontend (`src/pages/AdminLeads.tsx`)
- Im Projekt-Modal über dem `<Textarea>` für "Beschreibung" rechts kleinen Button "✨ KI generieren" (Sparkles-Icon, ghost/sm).
- Klick: ruft `supabase.functions.invoke("generate-portfolio-description", { body: { password: adminPassword, title, category, result, current: description } })`.
- Loading-State (Spinner im Button, Button disabled solange Titel leer).
- Erfolg → setzt `description` State, toast "Beschreibung generiert".
- Fehler → toast mit Message (401/429/402 spezifisch).

## Nicht enthalten
- Keine Änderung an anderen Formularen.
- Keine Schema-/DB-Änderung.
