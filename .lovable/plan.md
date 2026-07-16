
# Termin-Cockpit — Umsetzungsplan v5 (final)

Alles aus v5 gilt. Drei Korrekturen eingearbeitet, danach starte ich direkt Schritt 1.

## Korrektur 1 — Mailer bekommt zwei explizite Modi

`appointment-mailer` Payload:

```
{ mode: 'queued', notification_id: uuid }
  → Claim (§A), typabhängiger Skip-Check (§B), Statusschreiben,
    last_notified_at (§H), provider_message_id.

{ mode: 'direct', template: string, to: string, data: object,
  reply_to?: string, ics?: {...} }
  → KEIN Claim, KEIN Skip-Check, KEIN Statusschreiben,
    keine notifications-Zeile. Fire-and-forget, Fehler nur ins Log.
```

`internal_sales_notify` ist der **einzige** Nutzer von `mode:'direct'` und steht deshalb auch **nicht** im `notifications.typ`-CHECK. Alles andere (bestaetigung, reminder_24h, reminder_2h, no_show_followup, rescheduled, cancelled) läuft ausschließlich über `mode:'queued'`.

Ergänzung §A: der erste Guard im Mailer ist `INTERNAL_SECRET`-Header, danach Modus-Switch.

## Korrektur 2 — no-show ist re-triggerbar

`appointments-admin/no-show` legt die `no_show_followup`-Zeile per Upsert an, damit ein zweiter no-show nach einer Korrektur nicht am partial-unique-Index scheitert:

```sql
insert into notifications
  (appointment_id, kanal, typ, scheduled_for, status)
values
  (:appointment_id, 'email', 'no_show_followup', now() + interval '15 minutes', 'pending')
on conflict (appointment_id, kanal, typ)
  where typ in ('bestaetigung','reminder_24h','reminder_2h','no_show_followup')
do update set
  status = 'pending',
  scheduled_for = now() + interval '15 minutes',
  versuche = 0,
  sent_at = null,
  last_error = null,
  provider_message_id = null,
  updated_at = now();
```

Die `where`-Klausel im `on conflict` ist Pflicht, sonst findet Postgres den partial Index nicht.

## Korrektur 3 — `no_show_count` ersatzlos gestrichen

`sales_leads.no_show_count` entfällt aus §J Migration B. Statt Denormalisierung fragt der no-show-Handler live:

```sql
select count(*) from appointments
 where sales_lead_id = :lead_id and status = 'no_show';
```

Nach `update appointments set status='no_show' ...` in **derselben** Transaktion. Ergebnis `< 2` → Upsert aus Korrektur 2 ausführen. Sonst kein Nachfass.

Das Badge „2× No-Show" im Cockpit-UI nutzt dieselbe Abfrage (bzw. eine View, wenn Aggregation über mehrere Leads gebraucht wird).

Selbstkorrigierend: ein Fehlklick auf no-show, der zu `erschienen` korrigiert wird, senkt den Count wieder — die Zahl ist immer die Wahrheit im Moment der Abfrage.

## Kleinigkeit — §K bereinigt

`for update skip locked` + sofortiges `commit` ist toter Code. Der endgültige Cron-Loop:

```
-- 1) Reaper
update notifications
  set status='pending', updated_at=now()
  where status='sending' and updated_at < now() - interval '10 minutes';

-- 2) Fällige Zeilen selektieren (kein Lock nötig, der Claim im Mailer sichert ab)
select id from notifications
 where status='pending' and scheduled_for <= now()
 order by scheduled_for
 limit 50;

-- 3) Für jede id: Mailer per HTTP mit x-internal-secret,
--    body = { mode:'queued', notification_id: id }.

-- 4) Cleanup
delete from public_rate_limit where minute_bucket < now() - interval '1 hour';
```

## Alles andere aus v5 — unverändert bestätigt

Claim-Logik, typabhängiger Skip-Check, rescheduled/cancelled über die Queue mit partial-unique-Index, Reaper, Self-Exclusion (`id <> :appointment_id`) in allen Overlap- und Slot-Checks, `dauer_min` serverseitig zu `end_at`, `availability_rules.timezone` je Zeile ausgelesen, `last_notified_at` für die 4h-Ampel, `'verschoben'` aus Status-Enum entfernt, Secrets `INTERNAL_SECRET`/`SALES_NOTIFY_EMAIL`/`TERMIN_FROM_EMAIL`/`TERMIN_REPLY_TO`.

## Nächster Schritt (nach Implement plan-Klick) — Schritt 1

1. Migration A: `app_role` enum, `user_roles`, GRANTs, RLS (nur SELECT `auth.uid()=user_id`), `has_role` SECURITY DEFINER (`search_path=public`).
2. Migration B (mit allen v5-Korrekturen + drei Korrekturen aus dieser Runde): `sales_leads` (**ohne** `no_show_count`), `appointments` (`last_notified_at`, Status-Enum ohne `verschoben`), `notifications` (Status `+sending`, typ ohne `internal_sales_notify`, `created_at`/`updated_at`+Trigger, partial-unique-Index), `availability_rules` (weekday-Konvention als Kommentar, `timezone`-Spalte), `blocked_slots`, `appointment_events`, `public_rate_limit` (RLS enabled, NULL-Policies). GRANTs + Policies. Partial unique indexes auf `sales_leads (mobil)` und `sales_leads (lower(email))`. Seed `availability_rules` weekday 1–5 · 09:00–12:00 + 14:00–17:30 · slot_minutes 15.
3. `generate_secret INTERNAL_SECRET` (64) + Vault-Spiegel für pg_cron-Header.
4. `add_secret SALES_NOTIFY_EMAIL`, `TERMIN_FROM_EMAIL`, `TERMIN_REPLY_TO` — Nutzer trägt Werte ein.
5. `supabase--insert` für pg_cron-Job (alle 5 min → `appointments-cron` mit `x-internal-secret`).

Danach Schritt 2 (Admin-API), Schritt 3 (Mailer + Renderer), Schritt 4 (Cron), Schritt 6a/6b/6c (UI + Public). Schritt 5 leer, Schritt 7 SMS nach Live-Gang.
