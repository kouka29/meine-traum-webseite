alter table public.checkout_sessions
  add column if not exists base_net_cents integer,
  add column if not exists environment text not null default 'sandbox' check (environment in ('sandbox','live'));