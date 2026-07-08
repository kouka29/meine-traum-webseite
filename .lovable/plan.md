## Ziel
Nachweis-Log für den Klick auf „Bestellung verbindlich aufgeben" (Stage 1 des Invoice-Confirm-Modals) analog zum AGB-Akzeptanz-Log speichern, und den Code nach erfolgreicher Verifikation dauerhaft unbrauchbar machen.

## Ist-Zustand
- AGB-Klick wird in `buchungen` mit `ip_adresse`, `user_agent`, `agb_akzeptiert`, `agb_version` geloggt (Muster in `buchung-erstellen/index.ts`, `getClientIp` liest `x-forwarded-for` / `cf-connecting-ip`).
- `order_verifications` enthält aktuell: `email`, `angebots_id`, `code_hash`, `attempts`, `expires_at`, `consumed_at`, `verified`, `checkout_session_id`, `created_at`.
- Verify-Function setzt `consumed_at=now()` + `verified=true`, lässt aber `code_hash` bestehen.
- Frontend hält den Code nur temporär im Input-State (`invoiceCodeInput`); es gibt keine `console.log`s des Codes. Vor Auslieferung nochmal per Suche bestätigen.

## Änderungen

### 1. Neue Migration `order_verifications_binding_audit.sql`
Spalten auf `order_verifications` ergänzen (jeweils `IF NOT EXISTS`):
- `binding_ip text`
- `binding_user_agent text`
- `binding_confirmed_at timestamptz` (Zeitpunkt des „Bestellung verbindlich aufgeben"-Klicks)
- `binding_text_version text NOT NULL DEFAULT '1.0'` (Version des im Popup gezeigten verbindlichen Bestelltextes — analog `agb_version`, für spätere Textänderungen)

### 2. Edge Function `send-verification-code`
Beim Einfügen der Zeile zusätzlich speichern:
- `binding_ip` via `getClientIp(req)` (kopiere Helper aus `buchung-erstellen`)
- `binding_user_agent` aus Header `user-agent`, sanitized auf 500 Zeichen
- `binding_confirmed_at = new Date().toISOString()`
- `binding_text_version = '1.0'`

Keine Änderungen an Response oder Frontend-Aufruf.

### 3. Edge Function `verify-verification-code`
Nach erfolgreichem Match:
- Update-Statement erweitern: `code_hash = null, attempts = 999` zusätzlich zu `consumed_at`, `verified = true`.
- Damit ist die Zeile mehrfach abgesichert:
  - `consumed_at IS NOT NULL` → nächster Lookup ignoriert sie (`is('consumed_at', null)`).
  - `code_hash IS NULL` → selbst wenn die Zeile wieder auftauchen würde, matched kein Klartext-Code mehr (SHA-256 liefert nie `null`).
  - `attempts >= MAX_ATTEMPTS` → Fallback-Sperre.

### 4. Frontend-Audit (nur Verifikation, keine Änderung geplant)
Vor Commit per `rg` bestätigen, dass weder in `CheckoutFunnel.tsx` noch in den Edge Functions `console.log(code)` oder ähnliches existiert. Falls doch: entfernen. Der Code wird ausschließlich im Speicher der Edge Function und im Input-Feld des Users gehalten, nie in Logs/Toasts geschrieben.

### 5. Nachweiskette (Dokumentation, kein Code)
Am Ende hat jeder Rechnungskauf zwei zusammenhängende Audit-Datensätze:
- `order_verifications` → Klick auf „Bestellung verbindlich aufgeben" (IP, UA, Timestamp, Textversion, verifizierter Code).
- `buchungen` → tatsächliche Bestellanlage nach Code-Verifikation (eigene IP, UA, AGB-Version). Verknüpft über `email` + `angebots_id`.

## Keine Änderungen an
- `send-transactional-email` / Template.
- Admin-UI (`AdminKundenTab`).
- Frontend-Flow des `InvoiceConfirmModal` (State bleibt wie ist).

## Verifikation
- Nach dem Migrationslauf per `supabase--read_query`: Testeintrag zeigt gefüllte `binding_ip`/`binding_user_agent`/`binding_confirmed_at`.
- Nach erfolgreichem Verify: `code_hash IS NULL AND verified = true AND consumed_at IS NOT NULL`.
- Ein zweiter Verify-Aufruf mit demselben Code + Session liefert „Kein aktiver Code. Bitte neu anfordern." (Row wird durch `is('consumed_at', null)` gefiltert).
