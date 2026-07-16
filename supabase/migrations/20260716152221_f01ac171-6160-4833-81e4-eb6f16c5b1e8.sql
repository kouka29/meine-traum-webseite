
-- =========================================================================
-- MIGRATION A: Rollen
-- =========================================================================

do $$ begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin');
  end if;
end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create policy "user_roles: select own"
  on public.user_roles for select
  to authenticated
  using (auth.uid() = user_id);
-- absichtlich KEINE insert/update/delete policy; nur service_role via Backend

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- =========================================================================
-- Gemeinsame updated_at-Trigger-Funktion (existiert bereits als touch_updated_at)
-- =========================================================================
-- public.touch_updated_at() ist vorhanden.

-- =========================================================================
-- MIGRATION B: Termin-Cockpit Kern-Tabellen
-- =========================================================================

-- ---------- sales_leads ----------
create table if not exists public.sales_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  mobil text,
  sms_consent boolean not null default false,
  kanal text,                      -- Herkunft: telefon / webformular / empfehlung / ...
  website_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- partial unique indexes: kein Duplikat bei gleicher Mobilnummer / gleicher Email
create unique index if not exists sales_leads_mobil_uniq
  on public.sales_leads (mobil)
  where mobil is not null;

create unique index if not exists sales_leads_email_uniq
  on public.sales_leads (lower(email))
  where email is not null;

grant select, insert, update, delete on public.sales_leads to authenticated;
grant all on public.sales_leads to service_role;

alter table public.sales_leads enable row level security;

create policy "sales_leads: admin all"
  on public.sales_leads for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger sales_leads_touch_updated_at
  before update on public.sales_leads
  for each row execute function public.touch_updated_at();

-- ---------- appointments ----------
-- Status: geplant | bestaetigt | abgesagt | erschienen | no_show  ('verschoben' bewusst entfernt)
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  sales_lead_id uuid not null references public.sales_leads(id) on delete cascade,
  start_at timestamptz not null,
  end_at timestamptz not null,
  dauer_min integer not null default 30 check (dauer_min between 15 and 120),
  status text not null default 'geplant'
    check (status in ('geplant','bestaetigt','abgesagt','erschienen','no_show')),
  termin_typ text not null default 'beratung',   -- beratung / vor-ort / online / ...
  kanal text not null default 'telefon',         -- wie der Termin zustande kam
  ergebnis text,                                 -- freitext, Ausgang des Termins
  sequence integer not null default 0,           -- ICS SEQUENCE, +1 bei Reschedule
  short_code text not null,                      -- 10 base58 Zeichen, keine 0/O/I/l
  public_token text not null,                    -- 43 base64url Zeichen
  token_expires_at timestamptz not null,
  last_notified_at timestamptz,                  -- fuer 4h-Ampel im Cockpit
  confirmed_at timestamptz,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_at > start_at)
);

create unique index if not exists appointments_short_code_uniq  on public.appointments (short_code);
create unique index if not exists appointments_public_token_uniq on public.appointments (public_token);
create index if not exists appointments_start_at_idx    on public.appointments (start_at);
create index if not exists appointments_sales_lead_idx  on public.appointments (sales_lead_id);
create index if not exists appointments_status_idx      on public.appointments (status);

grant select, insert, update, delete on public.appointments to authenticated;
grant all on public.appointments to service_role;

alter table public.appointments enable row level security;

create policy "appointments: admin all"
  on public.appointments for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger appointments_touch_updated_at
  before update on public.appointments
  for each row execute function public.touch_updated_at();

-- ---------- notifications ----------
-- typ: bestaetigung | reminder_24h | reminder_2h | no_show_followup | rescheduled | cancelled
--      (internal_sales_notify laeuft NICHT ueber diese Queue, sondern per mode:'direct' im Mailer)
-- status: pending | sending | sent | skipped | failed
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  kanal text not null check (kanal in ('email','sms')),
  typ text not null check (typ in (
    'bestaetigung','reminder_24h','reminder_2h','no_show_followup','rescheduled','cancelled'
  )),
  scheduled_for timestamptz not null,
  status text not null default 'pending'
    check (status in ('pending','sending','sent','skipped','failed')),
  versuche integer not null default 0,
  sent_at timestamptz,
  last_error text,
  provider_message_id text,
  payload jsonb,     -- z.B. Snapshot fuer rescheduled/cancelled (alter/neuer Slot etc.)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- partial unique: nur die "einmal pro Termin"-Typen sind einmalig,
-- rescheduled/cancelled duerfen mehrfach vorkommen.
create unique index if not exists notifications_once_idx
  on public.notifications (appointment_id, kanal, typ)
  where typ in ('bestaetigung','reminder_24h','reminder_2h','no_show_followup');

create index if not exists notifications_due_idx
  on public.notifications (scheduled_for)
  where status = 'pending';

create index if not exists notifications_status_idx on public.notifications (status);

grant select, insert, update, delete on public.notifications to authenticated;
grant all on public.notifications to service_role;

alter table public.notifications enable row level security;

create policy "notifications: admin all"
  on public.notifications for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger notifications_touch_updated_at
  before update on public.notifications
  for each row execute function public.touch_updated_at();

-- ---------- availability_rules ----------
-- weekday-Konvention: 0=Sonntag, 1=Montag, ..., 6=Samstag (extract(dow from ...))
create table if not exists public.availability_rules (
  id uuid primary key default gen_random_uuid(),
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  slot_minutes integer not null default 15 check (slot_minutes between 5 and 120),
  timezone text not null default 'Europe/Berlin',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time > start_time)
);
comment on column public.availability_rules.weekday is '0=Sonntag, 1=Montag, ..., 6=Samstag (extract(dow from date))';

grant select, insert, update, delete on public.availability_rules to authenticated;
grant all on public.availability_rules to service_role;

alter table public.availability_rules enable row level security;

create policy "availability_rules: admin all"
  on public.availability_rules for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger availability_rules_touch_updated_at
  before update on public.availability_rules
  for each row execute function public.touch_updated_at();

-- Seed Mo-Fr 09:00-12:00 + 14:00-17:30, 15min slots, Europe/Berlin
insert into public.availability_rules (weekday, start_time, end_time, slot_minutes, timezone, active)
select w, s, e, 15, 'Europe/Berlin', true
from (values
  (1,'09:00'::time,'12:00'::time),
  (1,'14:00','17:30'),
  (2,'09:00','12:00'),
  (2,'14:00','17:30'),
  (3,'09:00','12:00'),
  (3,'14:00','17:30'),
  (4,'09:00','12:00'),
  (4,'14:00','17:30'),
  (5,'09:00','12:00'),
  (5,'14:00','17:30')
) as v(w,s,e)
where not exists (select 1 from public.availability_rules);

-- ---------- blocked_slots ----------
create table if not exists public.blocked_slots (
  id uuid primary key default gen_random_uuid(),
  start_at timestamptz not null,
  end_at timestamptz not null,
  reason text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_at > start_at)
);

create index if not exists blocked_slots_range_idx on public.blocked_slots (start_at, end_at);

grant select, insert, update, delete on public.blocked_slots to authenticated;
grant all on public.blocked_slots to service_role;

alter table public.blocked_slots enable row level security;

create policy "blocked_slots: admin all"
  on public.blocked_slots for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger blocked_slots_touch_updated_at
  before update on public.blocked_slots
  for each row execute function public.touch_updated_at();

-- ---------- appointment_events ----------
create table if not exists public.appointment_events (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  event_type text not null,           -- created / rescheduled / cancelled / no_show / confirmed / erschienen / ...
  payload jsonb,
  created_by uuid references auth.users(id) on delete set null,
  actor text,                          -- 'admin' | 'public' | 'system'
  created_at timestamptz not null default now()
);

create index if not exists appointment_events_appointment_idx on public.appointment_events (appointment_id, created_at desc);

grant select, insert on public.appointment_events to authenticated;
grant all on public.appointment_events to service_role;

alter table public.appointment_events enable row level security;

create policy "appointment_events: admin all"
  on public.appointment_events for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ---------- public_rate_limit ----------
-- Nur service_role via Edge Functions. RLS aktiv, KEINE Policies (Default-Deny fuer anon/authenticated).
create table if not exists public.public_rate_limit (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  minute_bucket timestamptz not null,
  count integer not null default 1,
  created_at timestamptz not null default now(),
  unique (ip_hash, minute_bucket)
);

create index if not exists public_rate_limit_cleanup_idx on public.public_rate_limit (minute_bucket);

grant all on public.public_rate_limit to service_role;
-- KEIN grant an anon/authenticated. KEINE Policies. Nur Backend darf zugreifen.

alter table public.public_rate_limit enable row level security;

-- =========================================================================
-- pg_net + pg_cron aktivieren (fuer Schritt 4 Cron-Job)
-- =========================================================================
create extension if not exists pg_net;
create extension if not exists pg_cron;
