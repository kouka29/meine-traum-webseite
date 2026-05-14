# KI-Button: Demo-Beschreibung generieren

Im Demo-Bearbeiten-Dialog (`src/components/admin/AdminVorschauTab.tsx`) bekommt das Feld **Beschreibung** einen kleinen "✨ Mit KI generieren"-Button. Ein Klick erzeugt einen kurzen, verkaufsstarken Text im Stil der bestehenden ME-KA-Beschreibung.

## Referenz-Stil (ME-KA)
> „Modernes Redesign für einen Malerbetrieb mit Fokus auf klare Struktur, Vertrauen und Conversion-Optimierung zur Steigerung von Kundenanfragen."

→ Eine Zeile, 1 Satz, ~15–25 Wörter, Branche + Nutzen + Conversion-Bezug.

## Änderungen

**1. Neue Edge Function `generate-demo-description`**
- Input: `{ trade, company }`
- Ruft Lovable AI Gateway (`google/gemini-3-flash-preview`) mit System-Prompt:
  > „Du bist Senior Conversion-Copywriter für lokale Dienstleister. Schreibe genau **einen** deutschen Satz (15–25 Wörter), der eine neu gestaltete Website kurz und verkaufsstark beschreibt. Stil: sachlich, professionell, mit Branchenbezug, Vertrauen und Conversion-Nutzen. Keine Anführungszeichen, keine Emojis, kein Firmenname."
- User-Message: `Branche: {trade}\nFirma: {company}`
- Behandelt 429/402 → JSON-Error zurück
- `verify_jwt = true` (Admin-Tab läuft eingeloggt; Standard reicht)

**2. UI im Dialog (Zeilen 780–783)**
- Label-Zeile bekommt rechts einen kleinen `Button size="sm" variant="ghost"` mit `Sparkles`-Icon: **„Mit KI generieren"**
- Disabled wenn `!demoForm.company` oder während Loading (Spinner)
- Bei Erfolg: `setDemoForm(f => ({ ...f, description: text }))` + Toast „Beschreibung generiert"
- Bei Fehler: Toast mit Meldung (Rate-Limit / Credits / generisch)

## Technische Details
- Aufruf via `supabase.functions.invoke('generate-demo-description', { body: { trade, company } })`
- Lokaler State `genLoading` im Komponenten-Scope
- Keine DB-Änderungen, keine neuen Pakete
