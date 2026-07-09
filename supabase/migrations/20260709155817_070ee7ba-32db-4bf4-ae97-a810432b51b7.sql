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

create or replace function public.touch_checkout_sessions_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;
create trigger checkout_sessions_touch before update on public.checkout_sessions
  for each row execute function public.touch_checkout_sessions_updated_at();

-- 2. discount_codes
create table public.discount_codes (
  code text primary key,
  type text not null check (type in ('discount','unlock')),
  stripe_coupon text,
  unlock_flag text,
  label text not null,
  percent_off numeric(5,2),           -- optional, für UI-Anzeige (Rabatt %)
  amount_off_cents integer,           -- optional, für UI-Anzeige (fester Betrag)
  active boolean not null default true,
  max_uses integer,
  used_count integer not null default 0,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  check (
    (type = 'discount' and stripe_coupon is not null and unlock_flag is null) or
    (type = 'unlock'   and unlock_flag  is not null and stripe_coupon is null)
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
create index code_redemption_log_ip_time_idx on public.code_redemption_log (ip_address, created_at);
create index code_redemption_log_session_time_idx on public.code_redemption_log (session_id, created_at);
grant all on public.code_redemption_log to service_role;
alter table public.code_redemption_log enable row level security;
alter table public.code_redemption_log force row level security;

-- 4. Nachweiskette auf buchungen
alter table public.buchungen
  add column if not exists applied_codes jsonb not null default '[]'::jsonb;
