# Slot-Reservierung & Lead-Qualifizierung

Du hast völlig recht: Aktuell wird optisch suggeriert, dass mit jedem Lead ein Platz "weg" ist – tatsächlich passiert in der Datenbank aber nichts. Das ist inkonsistent (der Counter im Hero ändert sich nicht) und gefährlich (Spam-Leads könnten alle Plätze blockieren). Die Lösung: Plätze werden nur reserviert, wenn es echte Substanz dahinter gibt.

## Neue Logik (Hybrid)

| Aktion des Kunden | Was passiert mit Platz | Was sieht der Kunde |
|---|---|---|
| Nur Anfrage abschicken | Nichts. Du qualifizierst manuell im Admin | "Anfrage eingegangen, wir melden uns" |
| Termin direkt buchen | Platz wird automatisch reserviert (`taken_slots +1`) | "Platz vorgemerkt – nach dem Gespräch ist er fix deiner" |
| Du qualifizierst im Admin | Platz wird reserviert, optional Bestätigungs-Mail | (per Mail) "Dein Platz ist jetzt offiziell gesichert" |

## Was geändert wird

### 1. Datenbank
Neue Spalte `status` in der `leads`-Tabelle:
- `new` (Default) – Lead ist eingegangen, noch nicht geprüft
- `qualified` – Du hast geprüft & für gut befunden, Platz reserviert
- `rejected` – Passt nicht (kein Platz blockiert)
- `customer` – Wurde zum zahlenden Kunden

Neue Spalte `slot_reserved` (boolean) – damit klar ist, ob für diesen Lead ein Platz blockiert wurde (verhindert Doppelzählung).

### 2. Erfolgsbildschirm `KostenloseVorschau2.tsx`
Die Headline & Texte werden **soft & einladend** umformuliert:
- Aktuell: "Perfekt, dein Platz ist gesichert! 🎉"
- Neu: "Danke {name}! Wir melden uns kurz telefonisch, um zu schauen, ob es passt – dann sichern wir deinen Platz."

Bei direkter Termin-Buchung (Hybrid):
- Neu: "Dein Termin steht – Platz ist für dich vorgemerkt. Nach unserem kurzen Gespräch wird er fix deiner."

### 3. Slot-Counter Logik
Bei Termin-Buchung im Funnel: nach erfolgreichem `confirmBooking` wird `taken_slots` in `vorschau_settings` automatisch um 1 erhöht (per neuer SECURITY DEFINER RPC-Funktion `increment_taken_slot()`, damit RLS nicht im Weg steht). Lead bekommt `slot_reserved = true` und `status = 'qualified'`.

### 4. Admin-Bereich `AdminLeads.tsx`
Pro Lead-Karte gibt es jetzt:
- **Status-Badge** (Neu / Qualifiziert / Abgelehnt / Kunde) mit Farbcodierung
- **Status-Dropdown** zum Ändern
- **Button "Platz reservieren & Mail senden"** (nur sichtbar wenn `slot_reserved = false`) – setzt `slot_reserved = true`, erhöht `taken_slots`, setzt Status auf `qualified`, sendet optional Bestätigungs-Mail an Kunden
- **Filter**: Alle / Neu / Qualifiziert / Abgelehnt / Kunden
- Sicherheitsnetz: Wenn Status auf `rejected` gesetzt wird und vorher ein Platz reserviert war → `taken_slots -1` (Platz wird freigegeben)

### 5. Neue E-Mail-Templates
- `lead-qualified.tsx` – "Dein Platz ist jetzt offiziell gesichert" (an Kunde, beim manuellen Qualifizieren)
- Bestehende `booking-confirmation.tsx` bleibt für Direktbuchungen

## Technische Details

**Migration:**
```sql
ALTER TABLE leads 
  ADD COLUMN status text NOT NULL DEFAULT 'new' 
    CHECK (status IN ('new','qualified','rejected','customer')),
  ADD COLUMN slot_reserved boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.increment_taken_slot()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE vorschau_settings
  SET taken_slots = LEAST(taken_slots + 1, total_slots)
  WHERE id = 1;
END; $$;

CREATE OR REPLACE FUNCTION public.decrement_taken_slot()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE vorschau_settings
  SET taken_slots = GREATEST(taken_slots - 1, 0)
  WHERE id = 1;
END; $$;

GRANT EXECUTE ON FUNCTION public.increment_taken_slot() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_taken_slot() TO authenticated;
```

**RLS-Update für `leads`:**
Die bestehende UPDATE-Policy "Anyone can attach booking to a lead once" wird erweitert, damit beim Buchen auch `slot_reserved = true` und `status = 'qualified'` gesetzt werden dürfen.

**Admin-Funktion** (`admin-leads` Edge Function): Erweitern um Update-Endpoint für Status & Slot-Reservierung (mit Service-Role, da RLS Admin-Updates blockiert).

**Files:**
- `src/pages/KostenloseVorschau2.tsx` – Texte umformulieren, RPC-Call nach Buchung
- `src/pages/AdminLeads.tsx` – Status-UI, Filter, Aktions-Buttons
- `supabase/functions/admin-leads/index.ts` – PATCH-Endpoint für Status-Updates
- `supabase/functions/_shared/transactional-email-templates/lead-qualified.tsx` – neues Template
- `supabase/functions/_shared/transactional-email-templates/registry.ts` – Template registrieren
- Migration für Schema + RPC-Funktionen

## Was du danach hast

1. Counter im Hero verhält sich konsistent: er ändert sich **nur**, wenn wirklich jemand einen Platz beansprucht (Termin gebucht oder von dir qualifiziert)
2. Kein Spam-Risiko – Fake-Leads blockieren keine Plätze mehr
3. Klarer Workflow im Admin: Du siehst auf einen Blick, welche Leads warten und kannst per Klick qualifizieren oder ablehnen
4. Ehrliche Kunden-Kommunikation: Niemand fühlt sich getäuscht, weil "sein Platz" einfach existiert
