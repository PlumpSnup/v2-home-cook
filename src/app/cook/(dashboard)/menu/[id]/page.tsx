import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deleteDish } from "@/app/actions/cook";
import { DishForm } from "@/components/DishForm";
import { requireCook } from "@/lib/auth";
import { getDish } from "@/lib/queries";

export const metadata: Metadata = { title: "Edit dish" };

export default async function EditDishPage({ params }: { params: Promise<{ id: string }> }) {
  const cook = await requireCook();
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish || dish.cook_id !== cook.id) notFound();

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-semibold">Edit dish</h1>
      <DishForm dish={dish} />
      <form action={deleteDish.bind(null, dish.id)}>
        <button type="submit" className="btn-ghost w-full py-3 text-sm hover:text-brand-dark">
          Delete this dish
        </button>
      </form>
    </div>
  );
}
