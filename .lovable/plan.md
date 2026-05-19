
# Erweiterung Angebotssystem

## 1. Datenmodell (Payload-Erweiterung, keine DB-Migration nötig außer Storage)

Neues optionales Feld `pakete` im Base64-Payload:

```ts
pakete?: Array<{
  id: string
  name: string                // "Starter", "Pro"
  badge?: string              // z.B. "Empfohlen"
  beschreibung?: string
  preis: number
  normalpreis?: number | null
  miete_monatlich?: number | null
  anzahlung?: number | null
  stripe_link: string
  leistungen: Leistung[]
  optionen?: Option[]         // Add-ons NUR für dieses Paket
  bundles?: Bundle[]          // Bundles NUR für dieses Paket
}>
pdf_path?: string             // Storage-Pfad zum Original-PDF
```

Fallback: wenn `pakete` leer/fehlt → bestehende flache Struktur weiterverwenden (Backward-Compat).

## 2. Storage (Migration nötig)

- Neuer privater Bucket `angebot-uploads`
- RLS: nur Service-Role darf hochladen/lesen
- Kundenseite lädt PDF über neuen Edge-Function-Endpoint `angebot-pdf` (validiert PIN+ID, liefert signierte URL, 5 Min gültig)

## 3. AngebotModal Umbau (`src/components/admin/AngebotModal.tsx`)

- **Modus-Toggle oben**: "Einzelangebot" vs "Mehrere Pakete"
- **Multi-Paket-Editor**: bis zu 3 Pakete als Akkordeon, jedes mit eigenem Editor (Name, Badge, Preis, Stripe-Link, Beschreibung, Leistungen, Add-on-Optionen, Bundles)
- **Gültigkeit**: number-Input "X Tage" + Schnellbuttons 7/14/30
- **Sparkles-Button** (KI-Neuformulierung) neben jedem Freitext: Nachricht, Wachstumspaket-Beschreibung, jede Leistungs-Beschreibung, jede Paket-Beschreibung → ruft neue Edge-Function `rephrase-text`
- **Upload-Bereich**: Datei wird zusätzlich zu KI-Parsing in `angebot-uploads` Bucket gespeichert, `pdf_path` in State gespeichert
- **Live-Vorschau-Button**: "Kundenansicht öffnen" — baut Payload aus aktuellem Formstate, Base64-Encode, öffnet `/angebot?d=...&preview=1` in neuem Tab (Preview-Mode überspringt PIN)

## 4. Edge Functions

### `parse-angebot-upload` (Update)
Tool-Schema erweitern: zusätzlich `pakete` extrahieren — wenn Dokument mehrere Pakete (Starter/Pro/Premium) enthält, in `pakete[]` mit eigenen Leistungen mappen statt flach in `leistungen`.

### `rephrase-text` (NEU)
- Input: `{ password, text, kontext: "nachricht"|"leistung"|"wachstumspaket"|"paket", ton?: "professionell"|"locker" }`
- Output: `{ text: string }`
- Verwendet Lovable AI `google/gemini-2.5-flash`

### `angebot-pdf` (NEU)
- Input: `{ id, pin }`
- Lädt Angebot aus DB, prüft PIN, prüft `ablauf_datum`, liefert signierte URL aus Storage

### `admin-leads` (Update)
- `angebot-upload-pdf` action: nimmt base64 + filename, lädt nach Storage, returned `pdf_path`

## 5. Angebot.tsx Umbau (`src/pages/Angebot.tsx`)

- Wenn `data.pakete?.length > 0` → **Paket-Switcher** oberhalb der Leistungen (Karten oder Tabs)
- Aktives Paket bestimmt: Leistungen, Preis-Card, Add-ons, Bundles, Stripe-CTA
- Bei aktivem Paket: bestehende Add-on/Bundle-Logik gilt INNERHALB des Pakets
- **PDF-Download-Button** in Hero-Bereich (nur wenn `pdf_path` vorhanden) → ruft `angebot-pdf` Edge-Function
- **Preview-Mode**: `?preview=1` Param → PIN-Gate skip, "Vorschau-Banner" oben

## 6. Reihenfolge

1. Migration: Storage-Bucket + RLS
2. Edge Functions: `rephrase-text`, `angebot-pdf`, Update `parse-angebot-upload`, Update `admin-leads`
3. AngebotModal: Multi-Paket-Editor + freie Gültigkeit + Sparkles + Upload-zu-Storage + Live-Vorschau
4. Angebot.tsx: Paket-Switcher + Preview-Mode + PDF-Download
