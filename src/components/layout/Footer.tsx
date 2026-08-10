import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { dictionaries, localeCategoryHref, localeHome, toDbLocale, type Locale } from "@/lib/i18n";

export async function Footer({ locale }: { locale: Locale }) {
  const categories = await prisma.category.findMany({
    where: { locale: toDbLocale(locale) },
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });

  const t = dictionaries[locale];

  return (
    <footer className="mt-16 border-t border-neutral-900 bg-neutral-950 text-neutral-400">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link href={localeHome(locale)} className="font-serif text-2xl font-bold text-white">
          The Meridian Post
        </Link>
        <p className="mt-2 max-w-md text-sm">{t.footerTagline}</p>

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-neutral-800 pt-8 text-sm sm:grid-cols-4">
          {categories.map((c) => (
            <Link key={c.slug} href={localeCategoryHref(locale, c.slug)} className="hover:text-white">
              {c.name}
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-neutral-800 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} The Meridian Post. {t.allRightsReserved}
          </span>
          <Link href="/admin/login" className="hover:text-neutral-300">
            {t.staffLogin}
          </Link>
        </div>
      </div>
    </footer>
  );
}
