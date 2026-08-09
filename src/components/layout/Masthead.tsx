import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MobileNav } from "@/components/layout/MobileNav";

export async function Masthead() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="relative border-b border-neutral-900 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5 text-[11px] text-neutral-500 sm:px-6">
        <span>{today}</span>
        <Link href="/admin/login" className="hover:text-neutral-800">
          Staff login
        </Link>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between border-t border-neutral-200 px-4 py-4 sm:px-6">
        <Link href="/" className="font-serif text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
          The Meridian Post
        </Link>
        <MobileNav categories={categories} />
      </div>

      <nav className="hidden border-t border-neutral-900 bg-neutral-950 md:block">
        <ul className="mx-auto flex max-w-6xl items-center gap-6 px-6 text-sm font-medium text-neutral-200">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/${c.slug}`}
                className="inline-block border-b-2 border-transparent py-2.5 transition-colors hover:border-red-600 hover:text-white"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
