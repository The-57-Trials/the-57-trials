-- ============================================================
-- Append-only consent record.
--
-- Under the Consumer Contracts Regulations 2013 the 14-day cancellation right
-- for immediately-supplied digital content only ends if the member expressly
-- consented AND acknowledged losing it. Without a record of both, reg 31
-- extends the cancellation window by up to twelve months — meaning every
-- customer could demand a full refund for a year. This table is that record.
--
-- user_id deliberately has NO foreign key: the health confirmation must
-- survive account deletion for its stated 6-year retention, so deleting a
-- profile must not cascade this away. The uuid is inert on its own.
-- ============================================================

create table public.consents (
  id               bigint generated always as identity primary key,
  user_id          uuid        not null,
  recorded_at      timestamptz not null default now(),
  health_version   text,
  health_confirmed boolean     not null default false,
  waiver_version   text,
  waiver_accepted  boolean     not null default false,
  terms_version    text,
  terms_accepted   boolean     not null default false,
  marketing_optin  boolean     not null default false
);
create index consents_user_idx on public.consents (user_id);

alter table public.consents enable row level security;

-- Readable by the member it belongs to, and by race control. Never writable
-- from a client: only the signup trigger inserts, as definer.
create policy consents_select on public.consents
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

revoke all on public.consents from anon, authenticated;
grant select on public.consents to authenticated;

-- Capture the consent flags submitted at signup alongside the profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(coalesce(nullif(trim(m ->> 'display_name'), ''), split_part(new.email, '@', 1)), 40)
  );

  insert into public.consents (
    user_id, health_version, health_confirmed,
    waiver_version, waiver_accepted,
    terms_version, terms_accepted, marketing_optin
  )
  values (
    new.id,
    m ->> 'health_version',   coalesce((m ->> 'health_confirmed')::boolean, false),
    m ->> 'waiver_version',   coalesce((m ->> 'waiver_accepted')::boolean, false),
    m ->> 'terms_version',    coalesce((m ->> 'terms_accepted')::boolean, false),
    coalesce((m ->> 'marketing_optin')::boolean, false)
  );

  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
