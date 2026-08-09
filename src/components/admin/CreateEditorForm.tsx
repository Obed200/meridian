"use client";

import { useActionState, useState } from "react";
import { createEditor, type CreateEditorResult } from "@/lib/actions/users";

export function CreateEditorForm() {
  const [state, formAction, pending] = useActionState<CreateEditorResult | null, FormData>(
    createEditor,
    null
  );
  const [copied, setCopied] = useState(false);

  const success = state && "success" in state;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      {success ? (
        <div className="rounded border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-900">
            Editor account created for {state.email}
          </p>
          <p className="mt-2 text-xs text-green-800">
            Share this temporary password with them now — it won&apos;t be shown again.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="rounded bg-white px-3 py-1.5 font-mono text-sm text-neutral-900 ring-1 ring-green-200">
              {state.tempPassword}
            </code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(state.tempPassword);
                setCopied(true);
              }}
              className="rounded border border-green-300 px-2 py-1 text-xs font-medium text-green-800 hover:bg-green-100"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      ) : null}

      <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="name" className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
            Full name
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-52 rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-red-600"
            placeholder="Jamie Chen"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-64 rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-red-600"
            placeholder="jamie@meridianpost.local"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
        >
          {pending ? "Creating…" : "Create editor"}
        </button>
        {state && "error" in state ? (
          <p className="w-full text-sm text-red-600">{state.error}</p>
        ) : null}
      </form>
    </div>
  );
}
