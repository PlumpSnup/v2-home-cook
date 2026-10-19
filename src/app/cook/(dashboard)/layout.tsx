import { CookNav } from "@/components/CookNav";
import { requireCook } from "@/lib/auth";

export default async function CookLayout({ children }: { children: React.ReactNode }) {
  await requireCook();
  return (
    <div className="mx-auto max-w-3xl pt-3">
      <CookNav />
      <div className="pt-5">{children}</div>
    </div>
  );
}
