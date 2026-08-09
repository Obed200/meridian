"use client";

import { useState } from "react";
import Link from "next/link";

export function MobileNav({
  categories,
}: {
  categories: Array<{ slug: string; name: string }>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={open}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
      >
        <span className="h-0.5 w-5 bg-neutral-900" />
        <span className="h-0.5 w-5 bg-neutral-900" />
        <span className="h-0.5 w-5 bg-neutral-900" />
      </button>

      {open ? (
        <nav className="absolute inset-x-0 top-full z-20 border-b border-neutral-200 bg-white px-4 py-3 shadow-lg">
          <ul className="flex flex-col divide-y divide-neutral-100">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-sm font-medium text-neutral-800"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
