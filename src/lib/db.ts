import "server-only";
import postgres from "postgres";
import { databaseUrl } from "./env";

const globalForDb = globalThis as unknown as { sql?: postgres.Sql; schemaReady?: Promise<void> };

function client() {
  globalForDb.sql ??= postgres(databaseUrl(), {
    // Neon (and most hosted Postgres) needs TLS; a local database doesn't.
    ssl: /localhost|127\.0\.0\.1/.test(databaseUrl()) ? false : "require",
    max: 5,
    idle_timeout: 20,
    prepare: false,
    transform: { undefined: null },
    // Return timestamps as ISO strings so rows can be passed straight to client components.
    types: {
      timestamptz: {
        to: 1184,
        from: [1184, 1114],
        serialize: (x: Date | string) => (x instanceof Date ? x.toISOString() : x),
        parse: (x: string) => new Date(x).toISOString(),
      },
    },
  });
  return globalForDb.sql;
}

/** The app creates its own tables the first time it connects, so there's no SQL to run by hand. */
const SCHEMA = /* sql */ `
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  avatar_url text,
  is_cook boolean not null default false,

  slug text unique check (slug is null or slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  kitchen_name text,
  bio text,
  area text,
  whatsapp text,

  accepts_cash boolean not null default true,
  accepts_etransfer boolean not null default false,
  accepts_card boolean not null default false,
  etransfer_email text,

  offers_pickup boolean not null default true,
  offers_delivery boolean not null default false,
  delivery_fee_cents integer not null default 0 check (delivery_fee_cents >= 0),

  stripe_account_id text,
  stripe_charges_enabled boolean not null default false,

  created_at timestamptz not null default now()
);

create table if not exists dishes (
  id uuid primary key default gen_random_uuid(),
  cook_id uuid not null references profiles (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  description text check (char_length(description) <= 300),
  category text not null check (category in ('main', 'appetizer', 'soup', 'dessert')),
  price_cents integer not null check (price_cents > 0),
  photo_url text,
  available boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists dishes_cook_idx on dishes (cook_id);
create index if not exists dishes_available_idx on dishes (available, created_at desc);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  cook_id uuid not null references profiles (id) on delete cascade,
  dish_id uuid references dishes (id) on delete set null,
  buyer_id uuid references profiles (id) on delete set null,

  dish_name text not null,
  unit_price_cents integer not null,
  quantity integer not null check (quantity between 1 and 50),
  delivery_fee_cents integer not null default 0,
  total_cents integer not null,

  buyer_name text not null,
  buyer_phone text not null,
  note text,
  fulfillment text not null default 'pickup' check (fulfillment in ('pickup', 'delivery')),
  payment_method text not null check (payment_method in ('cash', 'etransfer', 'card')),

  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  paid boolean not null default false,
  stripe_session_id text unique,

  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index if not exists orders_cook_created_idx on orders (cook_id, created_at desc);
create index if not exists orders_buyer_idx on orders (buyer_id);

-- v2: storefronts (cover photo, cuisines) and multi-dish orders ---------------
alter table profiles add column if not exists cover_url text;
alter table profiles add column if not exists cuisines text[] not null default '{}';

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  dish_id uuid references dishes (id) on delete set null,
  dish_name text not null,
  unit_price_cents integer not null,
  quantity integer not null check (quantity between 1 and 50)
);
create index if not exists order_items_order_idx on order_items (order_id);
create index if not exists order_items_dish_idx on order_items (dish_id);

-- Orders placed before carts had one dish each; copy them into order_items once.
insert into order_items (order_id, dish_id, dish_name, unit_price_cents, quantity)
select o.id, o.dish_id, o.dish_name, o.unit_price_cents, o.quantity
from orders o
where o.unit_price_cents is not null
  and not exists (select 1 from order_items i where i.order_id = o.id);

-- On orders, dish_name is now a short summary and quantity the total number of meals.
alter table orders alter column unit_price_cents drop not null;
update orders set dish_name = quantity || ' × ' || dish_name, unit_price_cents = null
where unit_price_cents is not null;
alter table orders drop constraint if exists orders_quantity_check;
`;

async function ensureSchema() {
  globalForDb.schemaReady ??= client()
    .unsafe(SCHEMA)
    .then(() => undefined)
    .catch((error) => {
      globalForDb.schemaReady = undefined; // retry on the next request
      throw error;
    });
  return globalForDb.schemaReady;
}

/** Tagged-template SQL. Always parameterised: `await sql\`select * from dishes where id = ${id}\``. */
export async function db() {
  await ensureSchema();
  return client();
}
