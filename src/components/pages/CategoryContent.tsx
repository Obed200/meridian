import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/home/ArticleCard";
import { AdSlot } from "@/components/layout/AdSlot";
import { SiteHeader } from "@/components/pages/SiteHeader";
import { dictionaries, localeCategoryHref, otherLocale, toDbLocale, type Locale } from "@/lib/i18n";

export async function getCategoryBySlug(locale: Locale, slug: string) {
  return prisma.category.findUnique({
    where: { locale_slug: { locale: toDbLocale(locale), slug } },
  });
}

async function getSwitchHref(locale: Locale, key: string | null) {
  if (!key) return undefined;
  const other = otherLocale(locale);
  const match = await prisma.category.findFirst({
    where: { locale: toDbLocale(other), key },
    select: { slug: true },
  });
  return match ? localeCategoryHref(other, match.slug) : undefined;
}

export async function CategoryContent({ locale, categorySlug }: { locale: Locale; categorySlug: string }) {
  const category = await getCategoryBySlug(locale, categorySlug);
  if (!category) notFound();

  const t = dictionaries[locale];
  const switchHref = await getSwitchHref(locale, category.key);

  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED", categoryId: category.id },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  if (posts.length === 0) {
    return (
      <>
        <SiteHeader locale={locale} switchHref={switchHref} />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h1 className="mb-2 font-serif text-4xl font-bold text-neutral-950">{category.name}</h1>
          <p className="text-neutral-500">{t.noStories}</p>
        </div>
      </>
    );
  }

  const [lead, ...rest] = posts;

  return (
    <>
      <SiteHeader locale={locale} switchHref={switchHref} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 border-b-2 border-neutral-950 pb-3 font-serif text-4xl font-bold text-neutral-950">
          {category.name}
        </h1>

        <div className="mb-10">
          <ArticleCard post={lead} locale={locale} variant="featured" priority />
        </div>

        {rest.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(0, 3).map((post) => (
              <ArticleCard key={post.slug} post={post} locale={locale} variant="standard" />
            ))}
          </div>
        ) : null}

        {rest.length > 3 ? (
          <>
            <div className="my-10">
              <AdSlot variant="in-feed" locale={locale} />
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rest.slice(3).map((post) => (
                <ArticleCard key={post.slug} post={post} locale={locale} variant="standard" />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
