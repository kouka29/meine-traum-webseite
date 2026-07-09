## Ziel
Multi-Code-System im Checkout: ein Eingabefeld akzeptiert Rabatt-Codes (`discount`, einer aktiv) und Freischalt-Codes (`unlock`, beliebig viele). Validierung, Preisberechnung und Flags ausschließlich serverseitig. Erster neuer Code: `RECHNUNG24` (unlock → `invoice_allowed` pro Session).

## Betroffene Dateien

**Neu**
- `supabase/migrations/<ts>_checkout_sessions_and_codes.sql`
- `supabase/migrations/<ts>_seed_discount_codes.sql` (nur Seed – über Insert-Tool nach Schema-Migration)
- `supabase/functions/checkout-session-create/index.ts` (Session serverseitig anlegen)
- `supabase/functions/redeem-code/index.ts`
- `supabase/functions/remove-code/index.ts`
- `supabase/functions/_shared/pricing.ts` (serverseitige Preisberechnung, wird von redeem/remove und buchung-erstellen genutzt)

**Geändert**
- `supabase/config.toml` – drei neue Function-Einträge mit `verify_jwt = true`
- `supabase/functions/create-checkout/index.ts` – Coupon-Mapping stammt jetzt aus `checkout_sessions.applied_codes` statt aus `metadata.offer_code`; keine Client-Coupon-Whitelist mehr
- `supabase/functions/buchung-erstellen/index.ts` – liest `checkout_sessions` per `checkout_session_id`, prüft `invoice_allowed = session.invoice_allowed OR customer_accounts.invoice_allowed`, übernimmt applied_codes
- `src/components/angebot/CheckoutFunnel.tsx` – ruft beim Öffnen `checkout-session-create` auf, ersetzt aktuelle Frontend-Rabattlogik durch UI mit einem Code-Feld + Chips (Anzeige der aktiven Codes), Preise kommen aus Function-Response
- ggf. Update `supabase/functions/send-verification-code` und `verify-verification-code`: `checkout_session_id` muss auf `checkout_sessions.id` verweisen (Foreign Key), Sessions müssen also vorher existieren

## SQL-Migration (Schema)

```sql
-- 1. checkout_sessions
create table public.checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  angebots_nr text,
  email text,
  applied_codes jsonb not null default '[]'::jsonb,
  invoice_allowed boolean not null default false,
  expires_at timestamptz not null default (now() + interval '24 hours'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant all on public.checkout_sessions to service_role;
alter table public.checkout_sessions enable row level security;
alter table public.checkout_sessions force row level security;
-- keine Policies für anon/authenticated → kein Client-Zugriff

-- 2. discount_codes
create table public.discount_codes (
  code text primary key,
  type text not null check (type in ('discount','unlock')),
  stripe_coupon text,
  unlock_flag text,
  label text not null,
  active boolean not null default true,
  max_uses integer,
  used_count integer not null default 0,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  check (
    (type = 'discount' and stripe_coupon is not null and unlock_flag is null) or
    (type = 'unlock'   and unlock_flag is not null   and stripe_coupon is null)
  ),
  check (code = upper(code))
);
grant all on public.discount_codes to service_role;
alter table public.discount_codes enable row level security;
alter table public.discount_codes force row level security;

-- 3. code_redemption_log
create table public.code_redemption_log (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.checkout_sessions(id) on delete set null,
  ip_address inet not null,
  code text not null,
  success boolean not null,
  reason text,
  created_at timestamptz not null default now()
);
create index on public.code_redemption_log (ip_address, created_at);
create index on public.code_redemption_log (session_id, created_at);
grant all on public.code_redemption_log to service_role;
alter table public.code_redemption_log enable row level security;
alter table public.code_redemption_log force row level security;

-- 4. Verbindung zu order_verifications
-- order_verifications.checkout_session_id ist heute freies UUID-Feld ohne FK.
-- Wir ergänzen den FK, damit es nur einen Session-Begriff gibt.
alter table public.order_verifications
  add constraint order_verifications_session_fk
  foreign key (checkout_session_id) references public.checkout_sessions(id) on delete cascade;

-- 5. Cleanup
-- pg_cron Job: täglich abgelaufene checkout_sessions und redemption-Logs > 30 Tage löschen.
```

**Seed (per Insert-Tool nach Schema-Migration, damit unverändert bleibt):**
```sql
insert into public.discount_codes (code,type,stripe_coupon,unlock_flag,label) values
  ('CBI-Y1',      'discount','CBI-Y1',     null,              '1 Jahr Rabatt (Miete)'),
  ('CBI-KAUF25',  'discount','CBI-KAUF25', null,              '25 % Kauf-Rabatt'),
  ('RECHNUNG24',  'unlock',   null,        'invoice_allowed', 'Rechnungskauf freigeschaltet');
```

## Edge Functions

### `checkout-session-create`
- **Auth**: getClaims → user optional (Gast erlaubt). Rate-Limit über IP-Log analog redeem.
- **Input**: `{ angebots_nr?: string, email?: string }`
- **Ablauf**: insert `checkout_sessions`. Wenn `email` einem `customer_accounts` mit `invoice_allowed=true` entspricht, `session.invoice_allowed=true` initial. Response: `{ session_id, applied_codes: [], pricing, invoice_allowed }`.

### `redeem-code`
- **Input**: `{ session_id: uuid, code: string }`
- **Ablauf** (alles serverseitig, Service-Role):
  1. `code = code.trim().toUpperCase()`; IP aus `x-forwarded-for` / `cf-connecting-ip`.
  2. **Rate-Limits vor allem anderen**:
     - `count(*) from code_redemption_log where session_id=? → ≥10` → 429 + log
     - `count(*) from code_redemption_log where ip_address=? and success=false and created_at > now()-interval '60 min' → ≥20` → 429 + log
  3. Session laden, `expires_at` prüfen.
  4. `discount_codes` lookup: not found / inactive / expired / max_uses erreicht → `{ok:false, reason}` + log(success=false). Fehlermeldung **verrät nicht**, ob Code existiert (generisches "Code ungültig oder nicht mehr verfügbar").
  5. Bereits in `applied_codes` → `{ok:false, reason:'Code bereits eingelöst'}`.
  6. Bei `type='discount'`: alle bisherigen discount-Codes aus `applied_codes` entfernen, neuen anhängen, `replaced` in Antwort.
  7. Bei `type='unlock'`: hinzufügen, `session[unlock_flag] = true`. (Nur Whitelist erlaubter Flag-Namen: aktuell `invoice_allowed`.)
  8. `used_count = used_count + 1` (atomarer Update mit Prüfung auf `max_uses`).
  9. Preise über `_shared/pricing.ts` berechnen: Basis aus `buchungen`/`angebote` per `angebots_nr` → Coupon anwenden (nur Rechnungswert im UI, tatsächlicher Rabatt wird bei Stripe über Coupon-ID gesetzt) → Netto/MwSt 19%/Brutto.
  10. Session updaten (`applied_codes`, Flag), log(success=true).
- **Output**: `{ ok:true, applied_codes:[{code,label,type,discount_amount}], pricing:{netto,mwst,brutto}, invoice_allowed, replaced? }`

### `remove-code`
- **Input**: `{ session_id, code }`
- Entfernt Code aus `applied_codes`. Wenn Typ `unlock` und kein anderer aktiver Code das gleiche Flag setzt → Flag auf false. **Aber**: `customer_accounts.invoice_allowed` wird nie verändert. Preise neu berechnen. Log-Eintrag.

## create-checkout Anpassung
Statt Whitelist auf `metadata.offer_code` liest die Function `checkout_sessions.applied_codes` per `metadata.checkout_session_id`, mapped alle `discount`-Einträge über `discount_codes.stripe_coupon` und hängt sie an die Stripe-Session (Stripe erlaubt nur einen Coupon → passt zur „nur ein discount aktiv"-Regel). `applied_codes` und `invoice_allowed` werden zusätzlich in Stripe-Metadata gespiegelt (nur zur Nachvollziehbarkeit).

## buchung-erstellen Anpassung
Liest `checkout_sessions` per `checkout_session_id`. Endgültige Rechnungskauf-Berechtigung:
```
invoice_allowed = session.invoice_allowed OR customer_accounts.invoice_allowed
```
Beides frisch aus der DB. Frontend-Flag wird ignoriert. `applied_codes` werden zur Nachweiskette in `buchungen` gespeichert (neue Spalte `applied_codes jsonb`).

## Frontend (`CheckoutFunnel.tsx`)
- Beim Modal-Öffnen: `checkout-session-create` aufrufen, `session_id` in State halten.
- Bisheriges Offer-Code-Feld (CBI-Y1) und Invoice-Confirm-Modal-Feld auf gemeinsames Feld „Code einlösen" konsolidieren.
- Aktive Codes als Chips (Label + X-Button → `remove-code`).
- Preise (netto/mwst/brutto) aus jeder Function-Response übernehmen; keine Preisberechnung mehr im Client.
- „Rechnungskauf"-Option nur sichtbar, wenn Response `invoice_allowed=true`.

## Sicherheit (Zusammenfassung)
- Keine Code-Strings, keine Coupon-Whitelist, keine Preiskorrekturen im Client-Bundle.
- Alle drei Functions: Service Role, `getClaims` für User-Bindung (Gast erlaubt bei `checkout-session-create`), CORS, Zod-Validierung.
- `discount_codes`, `checkout_sessions`, `code_redemption_log`: `FORCE ROW LEVEL SECURITY`, keine Policies für anon/authenticated.
- Rate-Limit doppelt (Session + IP).
- Log-Meldungen an den Client bleiben generisch (kein Existenz-Leak).
- `invoice_allowed` beim finalen Bestell-Anlegen aus DB gelesen, nicht aus Frontend-State.

## DSGVO / Cleanup
- pg_cron Job täglich: `delete from code_redemption_log where created_at < now() - interval '30 days'` und `delete from checkout_sessions where expires_at < now() - interval '7 days'`.

## Offene Fragen
1. **Bestehende Flows während Migration**: `send-verification-code` legt heute `order_verifications` mit selbst gewählter `checkout_session_id` an — nach Einführung des FK muss vorher eine `checkout_sessions`-Zeile existieren. Soll `send-verification-code` bei fehlender Session eine implizit anlegen (Backwards-Compat), oder darf der Rechnungs-Verify-Flow strikt eine gültige Session voraussetzen (sauberer, aber Frontend muss zwingend zuerst `checkout-session-create` aufrufen)?
2. **discount_amount-Berechnung im UI**: Stripe-Coupons können prozentual sein und greifen erst in Stripe. Sollen wir im UI den erwarteten Rabattbetrag anzeigen (dann müssen wir die Coupon-Konfiguration in `discount_codes` spiegeln, z. B. `percent_off` / `amount_off`) oder nur den Label-Chip zeigen und den Rabatt erst im Stripe-Checkout sichtbar machen?
3. **`RECHNUNG24` Nutzungslimit**: `max_uses` global (z. B. 100) oder pro Kunde/E-Mail begrenzen? Letzteres bräuchte zusätzliche Log-Auswertung pro `email`.
4. **Gast-Checkout**: Falls `checkout-session-create` ohne eingeloggten User läuft, an welche `email` bindet sich `invoice_allowed`-Prüfung? Vorschlag: unlock nur zulassen, wenn Session eine bestätigte E-Mail hat (aus Verifizierungscode-Flow).
