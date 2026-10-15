import { createClient } from "./supabase/server";
import type { Category, DishWithCook } from "./types";

const DISH_WITH_COOK = "*, cook:profiles!inner(kitchen_name, slug, area, avatar_url, is_cook)";

/** Search available dishes across the marketplace. */
export async function searchDishes({ q, category }: { q?: string; category?: Category }) {
  const supabase = await createClient();
  let query = supabase
    .from("dishes")
    .select(DISH_WITH_COOK)
    .eq("available", true)
    .eq("cook.is_cook", true)
    .order("created_at", { ascending: false })
    .limit(60);

  if (category) query = query.eq("category", category);

  const term = q?.trim().replace(/[%_,()\\*]/g, " ").trim();
  if (term) query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as DishWithCook[];
}
