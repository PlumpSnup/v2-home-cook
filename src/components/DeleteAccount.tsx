"use client";

import { useRef, useTransition } from "react";
import { deleteAccount } from "@/app/actions/cook";

/** A "Delete account" button that asks "Are you sure?" in a dialog before deleting anything. */
export function DeleteAccount({ kitchen }: { kitchen: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [pending, start] = useTransition();

  return (
    <section className="card space-y-3 border-danger/30 p-5">
      <h2 className="font-semibold">Delete account</h2>
      <p className="text-sm text-muted">
        Permanently delete your kitchen, menu, photos and orders. This can’t be undone.
      </p>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="btn border border-danger/40 bg-surface px-4 py-2.5 text-danger hover:bg-danger/5 [--edge:color-mix(in_oklab,var(--color-danger)_35%,transparent)]"
      >
        Delete account
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="delete-title"
        className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-3xl bg-surface p-6 text-ink shadow-2xl backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
        onClick={(e) => e.target === dialog.current && !pending && dialog.current?.close()}
      >
        <h2 id="delete-title" className="font-display text-xl font-semibold">
          Are you sure?
        </h2>
        <p className="mt-2 text-sm text-muted">
          This permanently deletes <strong className="text-ink">{kitchen}</strong>: your menu, dish photos, orders and
          sales history. Your menu link will stop working. This can’t be undone.
        </p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            disabled={pending}
            className="btn-secondary order-2 py-2.5 sm:order-1"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => start(() => deleteAccount())}
            disabled={pending}
            className="btn order-1 bg-danger py-2.5 text-white hover:bg-danger/90 sm:order-2 [--edge:color-mix(in_oklab,var(--color-danger)_70%,black)]"
          >
            {pending ? "Deleting…" : "Yes, delete my account"}
          </button>
        </div>
      </dialog>
    </section>
  );
}
