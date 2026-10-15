-- Home Cook Marketplace — initial schema

create extension if not exists pg_trgm;

-- Profiles ---------------------------------------------------------------
-- One row per signed-in user. A user becomes a cook once they finish onboarding.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  is_cook boolean not null default false,

  -- storefront (cooks only)
  slug text unique,
  kitchen_name text,
  bio text,
  area text,                -- neighbourhood / city shown to buyers
  whatsapp text,            -- digits only, with country code, e.g. 14165551234

  -- payment methods the cook accepts
  accepts_cash boolean not null default true,
  accepts_etransfer boolean not null default false,
  accepts_card boolean not null default false,
  etransfer_email text,

  -- how buyers get the food
  offers_pickup boolean not null default true,
  offers_delivery boolean not null default false,
  delivery_fee_cents integer not null default 0 check (delivery_fee_cents >= 0),

  -- Stripe Connect
  stripe_account_id text,
  stripe_charges_enabled boolean not null default false,

  created_at timestamptz not null default now(),
  constraint slug_format check (slug is null or slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

-- Create a profile automatically when someone signs in with Google for the first time.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Dishes -----------------------------------------------------------------
create type public.dish_category as enum ('main', 'appetizer', 'soup', 'dessert');

create table public.dishes (
  id uuid primary key default gen_random_uuid(),
  cook_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  description text check (char_length(description) <= 300),
  category public.dish_category not null,
  price_cents integer not null check (price_cents > 0),
  photo_url text,
  available boolean not null default true,
  created_at timestamptz not null default now()
);

create index dishes_cook_idx on public.dishes (cook_id);
create index dishes_category_idx on public.dishes (category) where available;
create index dishes_name_trgm_idx on public.dishes using gin (name gin_trgm_ops);

-- Orders -----------------------------------------------------------------
create type public.payment_method as enum ('cash', 'etransfer', 'card');
create type public.fulfillment as enum ('pickup', 'delivery');
create type public.order_status as enum ('pending', 'confirmed', 'completed', 'cancelled');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  cook_id uuid not null references public.profiles (id) on delete cascade,
  dish_id uuid references public.dishes (id) on delete set null,
  buyer_id uuid references public.profiles (id) on delete set null,  -- null for guest orders

  -- snapshot of what was ordered, so history survives dish edits
  dish_name text not null,
  unit_price_cents integer not null,
  quantity integer not null check (quantity between 1 and 50),
  delivery_fee_cents integer not null default 0,
  total_cents integer not null,

  buyer_name text not null,
  buyer_phone text not null,
  note text,
  fulfillment public.fulfillment not null default 'pickup',
  payment_method public.payment_method not null,

  status public.order_status not null default 'pending',
  paid boolean not null default false,
  stripe_session_id text unique,

  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index orders_cook_created_idx on public.orders (cook_id, created_at desc);
create index orders_buyer_idx on public.orders (buyer_id);

-- Row level security -----------------------------------------------------
alter table public.profiles enable row level security;
alter table public.dishes enable row level security;
alter table public.orders enable row level security;

-- Cook storefronts are public; everyone can read profiles.
create policy "profiles are viewable by everyone" on public.profiles
  for select using (true);
create policy "users update their own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Dishes: public read, cooks manage their own.
create policy "dishes are viewable by everyone" on public.dishes
  for select using (true);
create policy "cooks insert their own dishes" on public.dishes
  for insert with check (
    auth.uid() = cook_id
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_cook)
  );
create policy "cooks update their own dishes" on public.dishes
  for update using (auth.uid() = cook_id) with check (auth.uid() = cook_id);
create policy "cooks delete their own dishes" on public.dishes
  for delete using (auth.uid() = cook_id);

-- Orders are created server-side (service role) so prices can't be tampered with.
-- Cooks see and update orders placed with them; buyers see their own.
create policy "cooks read their orders" on public.orders
  for select using (auth.uid() = cook_id);
create policy "buyers read their orders" on public.orders
  for select using (auth.uid() = buyer_id);
create policy "cooks update their orders" on public.orders
  for update using (auth.uid() = cook_id) with check (auth.uid() = cook_id);

-- Stripe fields are only ever written by the server, so users may update every column but those.
revoke update on public.profiles from authenticated, anon;
grant update (
  full_name, avatar_url, is_cook, slug, kitchen_name, bio, area, whatsapp,
  accepts_cash, accepts_etransfer, accepts_card, etransfer_email,
  offers_pickup, offers_delivery, delivery_fee_cents
) on public.profiles to authenticated;
-- Cooks can change status but not money or payment fields of an order.
revoke update on public.orders from authenticated, anon;
grant update (status, paid, completed_at) on public.orders to authenticated;

-- Storage: public bucket for dish photos; users write only into their own folder.
insert into storage.buckets (id, name, public)
values ('dish-photos', 'dish-photos', true)
on conflict (id) do nothing;

create policy "dish photos are public" on storage.objects
  for select using (bucket_id = 'dish-photos');
create policy "users upload into their own folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'dish-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "users delete their own photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'dish-photos' and (storage.foldername(name))[1] = auth.uid()::text);
