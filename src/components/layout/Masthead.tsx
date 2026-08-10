import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MobileNav } from "@/components/layout/MobileNav";
import {
  dictionaries,
  localeCategoryHref,
  localeHome,
  otherLocale,
  toDbLocale,
  type Locale,
} from "@/lib/i18n";

export async function Masthead({
  locale,
  switchHref,
}: {
  locale: Locale;
  switchHref?: string;
}) {
  const categories = await prisma.category.findMany({
    where: { locale: toDbLocale(locale) },
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });

  const t = dictionaries[locale];

  const today = new Date().toLocaleDateString(t.dateLocale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const resolvedSwitchHref = switchHref ?? localeHome(otherLocale(locale));

  return (
    <header className="relative border-b border-neutral-900 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5 text-[11px] text-neutral-500 sm:px-6">
        <span>{today}</span>
        <div className="flex items-center gap-4">
          <Link href={resolvedSwitchHref} className="font-semibold hover:text-neutral-800">
            {t.switchLanguage}
          </Link>
          <Link href="/admin/login" className="hover:text-neutral-800">
            {t.staffLogin}
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between border-t border-neutral-200 px-4 py-4 sm:px-6">
        <Link href={localeHome(locale)} className="font-serif text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
          The Meridian Post
        </Link>
        <MobileNav categories={categories} locale={locale} />
      </div>

      <nav className="hidden border-t border-neutral-900 bg-neutral-950 md:block">
        <ul className="mx-auto flex max-w-6xl items-center gap-6 px-6 text-sm font-medium text-neutral-200">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={localeCategoryHref(locale, c.slug)}
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
