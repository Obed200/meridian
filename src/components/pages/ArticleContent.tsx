import { prisma } from "@/lib/prisma";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { ArticleHero } from "@/components/article/ArticleHero";
import { ArticleBody } from "@/components/article/ArticleBody";
import { ViewTracker } from "@/components/article/ViewTracker";
import { AdSlot } from "@/components/layout/AdSlot";
import { ArticleCard } from "@/components/home/ArticleCard";
import { SiteHeader } from "@/components/pages/SiteHeader";
import { dictionaries, localeCategoryHref, otherLocale, toDbLocale, type Locale } from "@/lib/i18n";

async function getSwitchHref(locale: Locale, key: string | null) {
  if (!key) return undefined;
  const other = otherLocale(locale);
  const match = await prisma.category.findFirst({
    where: { locale: toDbLocale(other), key },
    select: { slug: true },
  });
  return match ? localeCategoryHref(other, match.slug) : undefined;
}

export async function getArticle(locale: Locale, categorySlug: string, postSlug: string) {
  const post = await prisma.post.findUnique({
    where: { locale_slug: { locale: toDbLocale(locale), slug: postSlug } },
    include: { category: true, author: true },
  });
  if (!post || post.status !== "PUBLISHED" || post.category.slug !== categorySlug) {
    return null;
  }
  return post;
}

export async function ArticleContent({
  locale,
  post,
}: {
  locale: Locale;
  post: NonNullable<Awaited<ReturnType<typeof getArticle>>>;
}) {
  const t = dictionaries[locale];
  const switchHref = await getSwitchHref(locale, post.category.key);

  const more = await prisma.post.findMany({
    where: { status: "PUBLISHED", categoryId: post.categoryId, id: { not: post.id } },
    orderBy: { publishedAt: "desc" },
    take: 3,
    include: { category: true },
  });

  return (
    <div className="pb-16">
      <SiteHeader locale={locale} switchHref={switchHref} />
      <ViewTracker postId={post.id} />

      <ArticleHeader
        title={post.title}
        excerpt={post.excerpt}
        category={post.category}
        authorName={post.author.name}
        publishedAt={post.publishedAt}
        locale={locale}
      />
      <ArticleHero src={post.heroImage} alt={post.heroImageAlt ?? post.title} />

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_300px]">
        <div>
          <ArticleBody body={post.body} />
          <div className="mt-10">
            <AdSlot variant="in-article" locale={locale} />
          </div>
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <AdSlot variant="sidebar" locale={locale} />
          </div>
        </aside>
      </div>

      {more.length > 0 ? (
        <div className="mx-auto mt-16 max-w-5xl border-t border-neutral-200 px-4 pt-10 sm:px-6">
          <h2 className="mb-6 font-serif text-2xl font-bold text-neutral-950">{t.moreInHeading(post.category.name)}</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {more.map((p) => (
              <ArticleCard key={p.slug} post={p} locale={locale} variant="standard" />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
