-- 0019: trial_witnesses (doc 17). Recorded AFTER a RED trial clears, never
-- gating the clear itself - the witness was already the safety check-in,
-- this just asks their first name afterwards, per 17.5's flow.
--
-- No contact fields, ever (17.2's central rule) - first name and
-- relationship only, so naming a witness never creates a GDPR obligation
-- toward a non-customer.

create table public.trial_witnesses (
  user_id       uuid not null references public.profiles(id) on delete cascade,
  trial_num     integer not null references public.trials(num),
  witness_name  text not null check (length(btrim(witness_name)) between 1 and 40),
  relationship  text check (relationship is null or length(btrim(relationship)) <= 40),
  recorded_at   timestamptz not null default now(),
  primary key (user_id, trial_num)
);

alter table public.trial_witnesses enable row level security;

create policy trial_witnesses_select on public.trial_witnesses
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

grant select (trial_num, witness_name, relationship, recorded_at)
  on public.trial_witnesses to authenticated;

-- record_witness: requires the trial already cleared (17.7 - "cannot be
-- recorded for a trial that was never cleared"), same pattern as
-- grade_trial. Upsert, since this isn't a sealed record like a letter -
-- doc 17 never says it's immutable, and correcting a misspelled name
-- shouldn't need support intervention.
create or replace function public.record_witness(
  p_trial_num integer, p_witness_name text, p_relationship text
) returns json
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'NOT_AUTHED'; end if;
  if not exists (select 1 from completions where user_id = v_uid and trial_num = p_trial_num) then
    raise exception 'NOT_CLEARED';
  end if;
  if btrim(coalesce(p_witness_name, '')) = '' then
    raise exception 'NAME_REQUIRED';
  end if;

  insert into trial_witnesses (user_id, trial_num, witness_name, relationship)
  values (v_uid, p_trial_num, btrim(p_witness_name), nullif(btrim(coalesce(p_relationship, '')), ''))
  on conflict (user_id, trial_num) do update
    set witness_name = excluded.witness_name,
        relationship = excluded.relationship,
        recorded_at = now();

  return json_build_object('recorded', p_trial_num);
end;
$function$;

revoke all on function public.record_witness(integer, text, text) from public, anon;
grant execute on function public.record_witness(integer, text, text) to authenticated;
