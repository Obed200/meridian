import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function Footer() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });

  return (
    <footer className="mt-16 border-t border-neutral-900 bg-neutral-950 text-neutral-400">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <span className="font-serif text-2xl font-bold text-white">The Meridian Post</span>
        <p className="mt-2 max-w-md text-sm">
          Independent journalism, clearly told. Reporting on the stories that shape our world,
          our economy, and our communities.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-neutral-800 pt-8 text-sm sm:grid-cols-4">
          {categories.map((c) => (
            <Link key={c.slug} href={`/${c.slug}`} className="hover:text-white">
              {c.name}
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-neutral-800 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} The Meridian Post. All rights reserved.</span>
          <Link href="/admin/login" className="hover:text-neutral-300">
            Staff login
          </Link>
        </div>
      </div>
    </footer>
  );
}
