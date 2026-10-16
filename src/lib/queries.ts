import { db } from "./db";
import type { Category, Dish, DishWithCook, Order, Profile } from "./types";

/** Search available dishes across the marketplace. */
export async function searchDishes({ q, category }: { q?: string; category?: Category }) {
  const sql = await db();
  const term = q?.trim().slice(0, 60);
  const pattern = term ? `%${term.replace(/[\\%_]/g, (c) => `\\${c}`)}%` : null;
  return sql<DishWithCook[]>`
    select d.*, json_build_object(
      'kitchen_name', p.kitchen_name, 'slug', p.slug, 'area', p.area, 'avatar_url', p.avatar_url
    ) as cook
    from dishes d
    join profiles p on p.id = d.cook_id and p.is_cook
    where d.available
      ${category ? sql`and d.category = ${category}` : sql``}
      ${pattern ? sql`and (d.name ilike ${pattern} or d.description ilike ${pattern} or p.kitchen_name ilike ${pattern})` : sql``}
    order by d.created_at desc
    limit 60`;
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
  return sql<Dish[]>`
    select * from dishes where cook_id = ${cookId}
    order by available desc, created_at desc`;
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
  return sql<Pick<Order, "quantity" | "total_cents" | "completed_at" | "dish_name">[]>`
    select quantity, total_cents, completed_at, dish_name from orders
    where cook_id = ${cookId} and status = 'completed' and completed_at >= ${since}`;
}

export function isUuid(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}
