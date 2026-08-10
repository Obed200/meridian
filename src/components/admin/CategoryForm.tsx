"use client";

import { useActionState } from "react";
import { createCategory, type ActionResult } from "@/lib/actions/categories";

export function CategoryForm() {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    createCategory,
    null
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="name" className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
          New category name
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={60}
          placeholder="e.g. Waruziko"
          className="w-56 rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-red-600"
        />
      </div>
      <div>
        <label htmlFor="locale" className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
          Language
        </label>
        <select
          id="locale"
          name="locale"
          defaultValue="RW"
          className="rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-red-600"
        >
          <option value="RW">Kinyarwanda</option>
          <option value="EN">English</option>
        </select>
      </div>
      <div>
        <label htmlFor="key" className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
          Cross-language key (optional)
        </label>
        <input
          id="key"
          name="key"
          maxLength={60}
          placeholder="e.g. politics"
          title="Links this category to its equivalent in the other language, e.g. both Politiki and Politics using key 'politics'"
          className="w-48 rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-red-600"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add category"}
      </button>
      {state && "error" in state ? (
        <p className="w-full text-sm text-red-600">{state.error}</p>
      ) : null}
    </form>
  );
}
