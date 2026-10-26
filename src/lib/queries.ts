import { db } from "./db";
import type { Sale } from "./sales";
import type { Dish, KitchenCard, Order, OrderItem, Profile } from "./types";

function likePattern(q?: string) {
  const term = q?.trim().slice(0, 60);
  return term ? `%${term.replace(/[\\%_]/g, (c) => `\\${c}`)}%` : null;
}

/**
 * Kitchens for the home page. With a search term, a kitchen matches when one of its dishes,
 * its name or one of its cuisines matches, and the matching dishes come back in `matches`.
 * Kitchens with nothing available are hidden; the busiest kitchens come first.
 */
export async function searchKitchens({ q, city, cuisine }: { q?: string; city?: string; cuisine?: string }) {
  const sql = await db();
  const pattern = likePattern(q);
  return sql<KitchenCard[]>`
    with menu as (
      select d.id, d.cook_id, d.name, d.description, d.price_cents, d.photo_url, d.created_at,
        coalesce((select sum(i.quantity) from order_items i where i.dish_id = d.id), 0) as sold
      from dishes d
      where d.available
    )
    select p.id, p.slug, p.kitchen_name, p.full_name, p.avatar_url, p.area, p.cuisines,
      p.offers_pickup, p.offers_delivery,
      coalesce(p.cover_url, (
        select m.photo_url from menu m where m.cook_id = p.id and m.photo_url is not null
        order by m.sold desc, m.created_at desc limit 1
      )) as cover,
      (select min(m.price_cents) from menu m where m.cook_id = p.id)::int as min_price,
      (select max(m.price_cents) from menu m where m.cook_id = p.id)::int as max_price,
      (select coalesce(json_agg(x), '[]') from (
        select m.id, m.name, m.price_cents from menu m where m.cook_id = p.id
        order by m.sold desc, m.created_at desc limit 3
      ) x) as popular,
      ${
        pattern
          ? sql`(select json_agg(x) from (
              select m.id, m.name, m.price_cents from menu m
              where m.cook_id = p.id and (m.name ilike ${pattern} or m.description ilike ${pattern})
              order by m.sold desc limit 4
            ) x)`
          : sql`null`
      } as matches
    from profiles p
    where p.is_cook and p.slug is not null
      and exists (select 1 from menu m where m.cook_id = p.id)
      ${city ? sql`and p.area = ${city}` : sql``}
      ${cuisine ? sql`and ${cuisine} = any(p.cuisines)` : sql``}
      ${
        pattern
          ? sql`and (
              p.kitchen_name ilike ${pattern}
              or exists (select 1 from unnest(p.cuisines) c where c ilike ${pattern})
              or exists (select 1 from menu m where m.cook_id = p.id
                         and (m.name ilike ${pattern} or m.description ilike ${pattern}))
            )`
          : sql``
      }
    order by (select coalesce(sum(m.sold), 0) from menu m where m.cook_id = p.id) desc, p.created_at desc
    limit 60`;
}

/** Cities and cuisines that open kitchens actually use, for the home page filters. */
export async function getKitchenFilters() {
  const sql = await db();
  const [row] = await sql<{ cities: string[]; cuisines: string[] }[]>`
    with open_kitchens as (
      select p.area, p.cuisines from profiles p
      where p.is_cook and exists (select 1 from dishes d where d.cook_id = p.id and d.available)
    )
    select
      coalesce((select array_agg(distinct area order by area) from open_kitchens where area is not null), '{}') as cities,
      coalesce((select array_agg(distinct c order by c) from open_kitchens, unnest(cuisines) c), '{}') as cuisines`;
  return row;
}

export async function getDish(id: string) {
  if (!isUuid(id)) return null;
  const sql = await db();
  const [dish] = await sql<Dish[]>`select * from dishes where id = ${id}`;
  return dish ?? null;
}

export async function getProfile(id: string) {
  const sql = await db();
  const [profile] = await sql<Profile[]>`select * from profiles where id = ${id}`;
  return profile ?? null;
}

export async function getCookBySlug(slug: string) {
  const sql = await db();
  const [cook] = await sql<Profile[]>`select * from profiles where slug = ${slug} and is_cook`;
  return cook ?? null;
}

export async function getCookDishes(cookId: string) {
  const sql = await db();
  // Best sellers first, so the first photo makes a good cover.
  return sql<Dish[]>`
    select d.* from dishes d where d.cook_id = ${cookId}
    order by d.available desc,
      (select coalesce(sum(i.quantity), 0) from order_items i where i.dish_id = d.id) desc,
      d.created_at desc`;
}

export async function getOrder(id: string) {
  if (!isUuid(id)) return null;
  const sql = await db();
  const [order] = await sql<Order[]>`select * from orders where id = ${id}`;
  return order ?? null;
}

/** Completed orders recent enough to cover this month and the 30-day chart. */
export async function getRecentSales(cookId: string, since: string) {
  const sql = await db();
  return sql<Sale[]>`
    select o.quantity, o.total_cents, o.completed_at,
      coalesce((select json_agg(json_build_object('dish_name', i.dish_name, 'quantity', i.quantity))
                from order_items i where i.order_id = o.id), '[]') as items
    from orders o
    where o.cook_id = ${cookId} and o.status = 'completed' and o.completed_at >= ${since}`;
}

export async function getOrderItems(orderId: string) {
  const sql = await db();
  return sql<OrderItem[]>`select * from order_items where order_id = ${orderId} order by dish_name`;
}

export function isUuid(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}
