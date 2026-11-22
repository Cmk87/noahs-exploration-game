-- Family sync for Noah's Exploration Game.
-- One row per family, keyed by the SHA-256 of the family code.
-- The anon key can call only these two functions. It cannot list the table.
-- Apply this in the Supabase SQL editor, or with the Supabase connector.

create table if not exists public.family_sync (
  id text primary key,
  doc jsonb not null default '{}'::jsonb,
  rev bigint not null default 0,
  updated_at timestamptz not null default now(),
  constraint family_sync_id_hash check (id ~ '^[0-9a-f]{64}$')
);

alter table public.family_sync enable row level security;

revoke all on table public.family_sync from public, anon, authenticated;

-- No policies: anon and authenticated cannot select, insert, update or delete.
-- The functions below are the only door, and each call names one hash.

create or replace function public.sync_pull(p_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.family_sync%rowtype;
begin
  if p_id is null or p_id !~ '^[0-9a-f]{64}$' then
    raise exception 'bad id';
  end if;
  select * into rec from public.family_sync where id = p_id;
  if not found then
    return jsonb_build_object('rev', 0, 'keys', '{}'::jsonb);
  end if;
  return jsonb_build_object('rev', rec.rev, 'keys', rec.doc);
end;
$$;

create or replace function public.sync_push(p_id text, p_rev bigint, p_keys jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.family_sync%rowtype;
  inserted_rev bigint;
begin
  if p_id is null or p_id !~ '^[0-9a-f]{64}$' then
    raise exception 'bad id';
  end if;
  if p_keys is null or jsonb_typeof(p_keys) <> 'object' then
    raise exception 'bad keys';
  end if;
  if octet_length(p_keys::text) > 400000 then
    raise exception 'too big';
  end if;

  if p_rev = 0 then
    insert into public.family_sync (id, doc, rev)
    values (p_id, p_keys, 1)
    on conflict (id) do nothing
    returning rev into inserted_rev;
    if inserted_rev is not null then
      return jsonb_build_object('conflict', false, 'rev', inserted_rev, 'keys', p_keys);
    end if;
  end if;

  select * into rec from public.family_sync where id = p_id for update;
  if not found then
    return jsonb_build_object('conflict', true, 'rev', 0, 'keys', '{}'::jsonb);
  end if;
  if rec.rev <> p_rev then
    return jsonb_build_object('conflict', true, 'rev', rec.rev, 'keys', rec.doc);
  end if;
  update public.family_sync
     set doc = p_keys,
         rev = rec.rev + 1,
         updated_at = now()
   where id = p_id;
  return jsonb_build_object('conflict', false, 'rev', rec.rev + 1, 'keys', p_keys);
end;
$$;

revoke all on function public.sync_pull(text) from public;
revoke all on function public.sync_push(text, bigint, jsonb) from public;
grant execute on function public.sync_pull(text) to anon, authenticated;
grant execute on function public.sync_push(text, bigint, jsonb) to anon, authenticated;
