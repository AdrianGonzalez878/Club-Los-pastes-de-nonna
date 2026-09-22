-- Club Nonna · Los Pastes de Nonna
-- Pega este archivo en el SQL Editor de Supabase y ejecútalo.

create extension if not exists pgcrypto;

create table if not exists promotions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  visits_required integer not null check (visits_required > 0),
  reward text not null,
  active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  whatsapp text not null unique,
  stamps integer not null default 0 check (stamps >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists visits (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers (id) on delete cascade,
  location_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists redemptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers (id) on delete cascade,
  promotion_id uuid not null references promotions (id),
  location_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists visits_customer_created_idx
  on visits (customer_id, created_at desc);

create index if not exists redemptions_customer_created_idx
  on redemptions (customer_id, created_at desc);

-- Una visita por cliente por día calendario en America/Mexico_City
create unique index if not exists visits_one_per_customer_per_mexico_city_day
  on visits (
    customer_id,
    ((timezone('America/Mexico_City', created_at))::date)
  );

-- Solo una promoción activa a la vez. La dueña cambia la regla aquí, no en el código.
create unique index if not exists promotions_one_active
  on promotions (active)
  where active;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists customers_set_updated_at on customers;
create trigger customers_set_updated_at
before update on customers
for each row
execute procedure set_updated_at();

insert into promotions (slug, name, visits_required, reward, active, sort_order)
values (
  'paste-gratis-5',
  '5 visitas, un paste de regalo',
  5,
  'Un paste gratis',
  true,
  1
)
on conflict (slug) do nothing;

create or replace function register_visit(p_code text, p_location_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer customers%rowtype;
  v_promo promotions%rowtype;
  v_today date := (timezone('America/Mexico_City', now()))::date;
begin
  select * into v_promo
  from promotions
  where active
  order by sort_order asc
  limit 1;

  if not found then
    raise exception 'NO_PROMOTION' using errcode = 'P0001';
  end if;

  select * into v_customer
  from customers
  where code = upper(trim(p_code))
  for update;

  if not found then
    raise exception 'NOT_FOUND' using errcode = 'P0002';
  end if;

  if v_customer.stamps >= v_promo.visits_required then
    raise exception 'REWARD_PENDING' using errcode = 'P0003';
  end if;

  if exists (
    select 1
    from visits
    where customer_id = v_customer.id
      and (timezone('America/Mexico_City', created_at))::date = v_today
  ) then
    raise exception 'ALREADY_TODAY' using errcode = 'P0004';
  end if;

  insert into visits (customer_id, location_id)
  values (v_customer.id, p_location_id);

  update customers
  set stamps = stamps + 1
  where id = v_customer.id
  returning * into v_customer;

  return jsonb_build_object(
    'code', v_customer.code,
    'name', v_customer.name,
    'whatsapp', v_customer.whatsapp,
    'stamps', v_customer.stamps,
    'visits_required', v_promo.visits_required,
    'reward', v_promo.reward,
    'promotion_name', v_promo.name
  );
end;
$$;

create or replace function redeem_reward(p_code text, p_location_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer customers%rowtype;
  v_promo promotions%rowtype;
begin
  select * into v_promo
  from promotions
  where active
  order by sort_order asc
  limit 1;

  if not found then
    raise exception 'NO_PROMOTION' using errcode = 'P0001';
  end if;

  select * into v_customer
  from customers
  where code = upper(trim(p_code))
  for update;

  if not found then
    raise exception 'NOT_FOUND' using errcode = 'P0002';
  end if;

  if v_customer.stamps < v_promo.visits_required then
    raise exception 'NOT_ENOUGH' using errcode = 'P0005';
  end if;

  insert into redemptions (customer_id, promotion_id, location_id)
  values (v_customer.id, v_promo.id, p_location_id);

  update customers
  set stamps = 0
  where id = v_customer.id
  returning * into v_customer;

  return jsonb_build_object(
    'code', v_customer.code,
    'name', v_customer.name,
    'whatsapp', v_customer.whatsapp,
    'stamps', v_customer.stamps,
    'visits_required', v_promo.visits_required,
    'reward', v_promo.reward,
    'promotion_name', v_promo.name
  );
end;
$$;

revoke all on function register_visit(text, text) from public, anon, authenticated;
revoke all on function redeem_reward(text, text) from public, anon, authenticated;
grant execute on function register_visit(text, text) to service_role;
grant execute on function redeem_reward(text, text) to service_role;

alter table promotions enable row level security;
alter table customers enable row level security;
alter table visits enable row level security;
alter table redemptions enable row level security;

-- Sin políticas públicas. El servidor usa la service role key, que omite RLS.
