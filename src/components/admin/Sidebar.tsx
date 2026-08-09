"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { signOutAction } from "@/lib/actions/auth";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", adminOnly: false },
  { href: "/admin/posts", label: "Posts", adminOnly: false },
  { href: "/admin/categories", label: "Categories", adminOnly: true },
  { href: "/admin/users", label: "Editors", adminOnly: true },
];

export function Sidebar({
  role,
  name,
}: {
  role: "ADMIN" | "EDITOR";
  name: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-neutral-800 bg-neutral-950 text-neutral-200">
      <div className="border-b border-neutral-800 px-5 py-5">
        <span className="font-serif text-xl font-bold text-white">The Meridian Post</span>
        <p className="mt-0.5 text-xs uppercase tracking-wide text-neutral-500">Newsroom</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems
          .filter((item) => !item.adminOnly || role === "ADMIN")
          .map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "block rounded px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-red-600 text-white"
                    : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
      </nav>

      <div className="border-t border-neutral-800 px-4 py-4">
        <p className="truncate text-sm font-medium text-white">{name}</p>
        <p className="text-xs text-neutral-500">{role === "ADMIN" ? "Administrator" : "Editor"}</p>
        <form action={signOutAction} className="mt-3">
          <button
            type="submit"
            className="w-full rounded border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white"
          >
            Sign out
          </button>
        </form>
        <Link
          href="/"
          className="mt-2 block text-center text-xs text-neutral-500 hover:text-neutral-300"
        >
          View public site →
        </Link>
      </div>
    </aside>
  );
}
