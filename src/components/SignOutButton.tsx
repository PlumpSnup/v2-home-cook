import { signOutAction } from "@/app/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button type="submit" className="btn-ghost w-full py-3 text-sm">
        Sign out
      </button>
    </form>
  );
}
