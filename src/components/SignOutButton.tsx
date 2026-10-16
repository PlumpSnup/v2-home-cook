import { signOutAction } from "@/app/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button type="submit" className="w-full py-3 text-sm font-medium text-muted hover:text-ink">
        Sign out
      </button>
    </form>
  );
}
