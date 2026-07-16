
# Termin-Cockpit — Umsetzungsplan (Analyse + Plan, kein Code)

## 1. Analyse: Bestehende Admin-Auth

- Route: `/admin` → `src/pages/AdminLeads.tsx` (einzige Admin-Seite, hostet mehrere Tabs).
- Auth-Mechanik: **Kein Supabase-Auth, keine Rollenprüfung, keine `user_roles`-Tabelle, keine `has_role`-Funktion.** Der Admin gibt in einem lokalen Passwort-Feld (`useState("")`) das Secret `ADMIN_PASSWORD` ein. Dieses wird bei JEDEM Request als `body.password` an die Edge Functions (`admin-leads`, `admin-design-toggle`, …) mitgeschickt und dort serverseitig gegen `Deno.env.get("ADMIN_PASSWORD")` verglichen.
- Es gibt kein Session-Cookie, kein JWT, kein `auth.users`-Konto für den Admin.
- Kundenportal (`/kundenportal`) nutzt hingegen echtes Supabase-Auth (`customer_accounts`), das ist **eine getrennte Welt** und darf hier nicht als Admin-Auth verwendet werden.

Konsequenz: Neue Cockpit-Endpunkte müssen dasselbe Passwort-Schema verwenden (oder wir führen zusätzlich echtes Admin-Auth ein — das wäre ein separates Vorhaben, nicht Teil dieses Plans).

## 2. Bestehende Dateien, die angefasst werden müssen

- `src/App.tsx` — neue Routen `/admin/cockpit` (+ optional Detailrouten) und öffentliche Token-Route `/termin/:token` registrieren.
- `src/pages/AdminLeads.tsx` — Tab-Leiste um „Termin-Cockpit" erweitern oder Link zur eigenen Route setzen; Passwort-Weitergabe an neue Tab-Komponente.
- `supabase/config.toml` — neue Edge Functions eintragen (`appointments-admin` mit `verify_jwt=false` wegen Passwort-Schema, `appointments-public` mit `verify_jwt=false` für Token-Aktionen, `appointments-cron` mit `verify_jwt=false` für pg_cron-Trigger).
- `src/integrations/supabase/client.ts` — **nicht anfassen** (auto-generiert); `types.ts` regeneriert sich nach Migration automatisch.
- `src/components/Footer.tsx` / `Navbar.tsx` — **nicht anfassen**, Cockpit ist rein intern.

## 3. Neu anzulegende Dateien

Frontend:
- `src/pages/admin/TerminCockpit.tsx` — Hauptseite (Liste/Kalender, Filter, Statistik).
- `src/components/cockpit/AppointmentList.tsx`
- `src/components/cockpit/AppointmentCalendar.tsx` (Woche/Tag-Ansicht)
- `src/components/cockpit/NewAppointmentDialog.tsx` (Termin anlegen + Lead-Suche/Neuanlage)
- `src/components/cockpit/AppointmentDetailDrawer.tsx` (verschieben, absagen, Notizen, Event-Log)
- `src/components/cockpit/AvailabilityRulesEditor.tsx`
- `src/components/cockpit/BlockedSlotsEditor.tsx`
- `src/pages/TerminToken.tsx` — öffentliche Seite `/termin/:token` (bestätigen / verschieben / absagen).
- `src/lib/cockpitApi.ts` — Wrapper für alle `appointments-admin`-Aufrufe (Passwort mitschicken).

Backend (Edge Functions):
- `supabase/functions/appointments-admin/index.ts` — CRUD + Aktionen (list, create, reschedule, cancel, complete, no-show, block-slot, rule-upsert), Passwort-geschützt.
- `supabase/functions/appointments-public/index.ts` — Token-basiert: `get`, `confirm`, `reschedule`, `cancel`.
- `supabase/functions/appointments-cron/index.ts` — wird von pg_cron alle 5 min getriggert: Reminder-Mails/SMS (24h, 1h vorher), No-Show-Nachfass (2h nach Termin, wenn Status ≠ completed/no-show).
- `supabase/functions/_shared/ics.ts` — .ics-Generator.
- `supabase/functions/_shared/transactional-email-templates/appointment-confirmation.tsx`
- `supabase/functions/_shared/transactional-email-templates/appointment-reminder.tsx`
- `supabase/functions/_shared/transactional-email-templates/appointment-rescheduled.tsx`
- `supabase/functions/_shared/transactional-email-templates/appointment-cancelled.tsx`
- `supabase/functions/_shared/transactional-email-templates/appointment-noshow-followup.tsx`
- `registry.ts` erweitern.

Datenbank-Migration (eine Datei):
- `sales_leads`, `appointments`, `notifications`, `availability_rules`, `blocked_slots`, `appointment_events` inkl. RLS-Policies, GRANTs, Trigger `updated_at`, sowie pg_cron-Job (via `supabase--insert`, nicht Migration, weil URL/Key projekt-spezifisch).

## 4. Tabellen- und Namenskonflikte

DB-Check: **Keine** der geplanten Tabellen (`sales_leads`, `appointments`, `notifications`, `availability_rules`, `blocked_slots`, `appointment_events`) existiert bereits.

Kein Konflikt mit `customer_accounts`, `checkout_sessions`, `discount_codes`, `code_redemption_log`.

Aber: es existiert bereits eine Tabelle **`leads`** (mit `booking_date`/`booking_time`, aus dem Vorschau-Funnel). Empfehlung: bewusst separaten Namen `sales_leads` verwenden (kein Rename), damit der Vorschau-Funnel unangetastet bleibt. Optional in Schritt 6 ein View/Adapter, um beide Quellen im Cockpit anzuzeigen — **nicht** in Grundplan.

## 5. Extensions

`pg_cron` ✅ aktiv, `pg_net` ✅ aktiv. Kein Setup nötig.

## 6. Risiken für bestehende Funktionalität

- **Kein Risiko für Checkout / Stripe / `payments-webhook`** — keine Datei/Tabelle wird angefasst.
- **Kein Risiko für Kundenportal** — Auth-Systeme sind getrennt; `customer_accounts` bleibt unangetastet.
- **Kein Risiko für den Vorschau-Funnel `leads`-Tabelle**, solange wir `sales_leads` als neue Tabelle anlegen (nicht `leads` erweitern).
- **`supabase/config.toml`**: Nur additiv (neue Function-Blöcke). Bestehende Einträge nicht ändern.
- **Email-Infrastruktur (`send-transactional-email`, Registry, `process-email-queue`)**: Wir fügen nur neue Templates hinzu. Kein bestehendes Template ändern.
- **Router (`App.tsx`)**: nur neue `<Route>`-Einträge, keine bestehenden ändern.
- **AdminLeads.tsx**: minimal-invasiver Tab-Zusatz (oder externer Link), Passwort-Flow bleibt gleich.
- **SMS-Versand**: neuer Connector (Twilio oder GatewayAPI) muss vom Nutzer verbunden werden — falls nicht möglich, SMS abschaltbar per Feature-Flag (kein Blocker für den Rest).
- **Passwort-Auth ist schwach**: Cockpit hat lesbare Personendaten. Deutlich sagen: langfristig echtes Supabase-Admin-Auth (mit `user_roles` + `has_role`) einbauen. Nicht in diesem Plan, aber als Follow-up empfehlen.

## 7. Aufteilung in 6 Bau-Schritte (nicht überlappend)

**Schritt 1 — DB-Fundament**
Dateien: 1 Migration (neu). Legt `sales_leads`, `appointments`, `notifications`, `availability_rules`, `blocked_slots`, `appointment_events` mit RLS, GRANTs, `updated_at`-Trigger, Token-Spalten, Enum-Types an. Anschließend `supabase--insert` für pg_cron-Job (separat, weil URL/Key).
Keine Frontend- oder Function-Datei.

**Schritt 2 — Admin-API (Edge Function)**
Dateien (neu): `supabase/functions/appointments-admin/index.ts`, `supabase/functions/_shared/ics.ts`. `supabase/config.toml` (bestehend) additiv erweitern.
Aktionen: list, get, create-lead+appointment, reschedule, cancel, complete, no-show, availability-rules CRUD, blocked-slots CRUD. Alle Passwort-gated.
Kein Frontend, keine Templates.

**Schritt 3 — Email-Templates + Wiring**
Dateien (neu): 5 Template-Dateien unter `_shared/transactional-email-templates/`. `registry.ts` (bestehend) erweitern. `appointments-admin` (aus Schritt 2) ruft `send-transactional-email` mit .ics-Anhang-Fallback (Link statt Attachment) für Bestätigung auf.
Kein Frontend.

**Schritt 4 — Cron-Function + Notifications**
Dateien (neu): `supabase/functions/appointments-cron/index.ts`. `supabase/config.toml` additiv.
Verarbeitet fällige Reminder aus `notifications`-Tabelle (24h, 1h vorher, 2h danach), schreibt Status. SMS optional via Connector-ENV, wenn gesetzt.
Kein Frontend, keine neuen Templates.

**Schritt 5 — Cockpit-UI**
Dateien (neu): `src/pages/admin/TerminCockpit.tsx`, `src/lib/cockpitApi.ts`, `src/components/cockpit/{AppointmentList,AppointmentCalendar,NewAppointmentDialog,AppointmentDetailDrawer,AvailabilityRulesEditor,BlockedSlotsEditor}.tsx`.
Angefasst: `src/App.tsx` (Route `/admin/cockpit`), `src/pages/AdminLeads.tsx` (Tab-Link zum Cockpit — reines Ergänzen).
Keine Function-Datei.

**Schritt 6 — Public Token-Flow**
Dateien (neu): `supabase/functions/appointments-public/index.ts`, `src/pages/TerminToken.tsx`.
Angefasst: `src/App.tsx` (Route `/termin/:token`), `supabase/config.toml` (additiv).
Kein Cockpit-, kein DB-Schema-Change.

Reihenfolge-Garantie: Jeder Schritt fasst ausschließlich die genannten Dateien an. Überlappungen nur bei `src/App.tsx` (Schritt 5 + 6, je eine Route) und `supabase/config.toml` (Schritt 2, 4, 6, je ein additiver Block) — dort keine Konflikte, da separate Einträge.

## Offene Punkte zur Bestätigung vor Bau

- SMS-Provider: Twilio (Connector vorhanden) oder GatewayAPI — soll ich in Schritt 4 einbauen oder erst später? Ohne SMS läuft alles via Email.
- Admin-Auth: beim Passwort-Schema bleiben oder in einem separaten Vorbau echtes Supabase-Admin-Auth (user_roles + has_role) einführen?
- .ics: als Attachment (aktuell Lovable-Email-Infra unterstützt keine Attachments — Doku sagt explizit: Storage-Link nutzen). Ok, wenn wir statt Attachment einen signierten Download-Link auf ein temporäres Storage-Objekt versenden?
