import type { Metadata } from "next";
import { DishForm } from "@/components/DishForm";
import { requireCook } from "@/lib/auth";

export const metadata: Metadata = { title: "Add a dish" };

export default async function NewDishPage({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  await requireCook();
  const { welcome } = await searchParams;
  return (
    <div className="space-y-5">
      <div>
        {welcome && <p className="text-sm font-medium text-brand">Step 2 of 2 — your kitchen is open!</p>}
        <h1 className="font-display text-2xl font-semibold">Add a dish</h1>
      </div>
      <DishForm />
    </div>
  );
}
