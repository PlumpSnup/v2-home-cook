import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deleteDish } from "@/app/actions/cook";
import { DishForm } from "@/components/DishForm";
import { requireCook } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Dish } from "@/lib/types";

export const metadata: Metadata = { title: "Edit dish" };

export default async function EditDishPage({ params }: { params: Promise<{ id: string }> }) {
  const cook = await requireCook();
  const { id } = await params;
  const supabase = await createClient();
  const { data: dish } = await supabase.from("dishes").select("*").eq("id", id).eq("cook_id", cook.id).maybeSingle<Dish>();
  if (!dish) notFound();

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-semibold">Edit dish</h1>
      <DishForm dish={dish} userId={cook.id} />
      <form action={deleteDish.bind(null, dish.id)}>
        <button type="submit" className="w-full py-3 text-sm font-medium text-muted hover:text-brand-dark">
          Delete this dish
        </button>
      </form>
    </div>
  );
}
