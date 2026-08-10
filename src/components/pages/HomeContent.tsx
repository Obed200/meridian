import { prisma } from "@/lib/prisma";
import { HeroStory } from "@/components/home/HeroStory";
import { CategoryRail } from "@/components/home/CategoryRail";
import { AdSlot } from "@/components/layout/AdSlot";
import { SiteHeader } from "@/components/pages/SiteHeader";
import { dictionaries, toDbLocale, type Locale } from "@/lib/i18n";

export async function HomeContent({ locale }: { locale: Locale }) {
  const dbLocale = toDbLocale(locale);

  const [featured, categories] = await Promise.all([
    prisma.post.findFirst({
      where: { status: "PUBLISHED", featured: true, locale: dbLocale },
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany({ where: { locale: dbLocale }, orderBy: { name: "asc" } }),
  ]);

  const lead =
    featured ??
    (await prisma.post.findFirst({
      where: { status: "PUBLISHED", locale: dbLocale },
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    }));

  if (!lead) {
    return (
      <>
        <SiteHeader locale={locale} />
        <div className="mx-auto max-w-6xl px-4 py-24 text-center text-neutral-500 sm:px-6">
          {dictionaries[locale].noStories}
        </div>
      </>
    );
  }

  const secondary = await prisma.post.findMany({
    where: { status: "PUBLISHED", locale: dbLocale, id: { not: lead.id } },
    orderBy: { publishedAt: "desc" },
    take: 4,
    include: { category: true },
  });

  const railPosts = await Promise.all(
    categories.map((category) =>
      prisma.post.findMany({
        where: { status: "PUBLISHED", locale: dbLocale, categoryId: category.id, id: { not: lead.id } },
        orderBy: { publishedAt: "desc" },
        take: 4,
        include: { category: true },
      })
    )
  );

  return (
    <>
      <SiteHeader locale={locale} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <HeroStory lead={lead} secondary={secondary} locale={locale} />

        {categories.map((category, i) => (
          <div key={category.id}>
            <CategoryRail name={category.name} slug={category.slug} posts={railPosts[i]} locale={locale} />
            {i === 1 ? (
              <div className="border-b border-neutral-200 py-8">
                <AdSlot variant="in-feed" locale={locale} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}
