import Link from "next/link";
import { ArticleCard } from "@/components/home/ArticleCard";
import type { CardPost } from "@/lib/types";
import { dictionaries, localeCategoryHref, type Locale } from "@/lib/i18n";

export function CategoryRail({
  name,
  slug,
  posts,
  locale,
}: {
  name: string;
  slug: string;
  posts: CardPost[];
  locale: Locale;
}) {
  if (posts.length === 0) return null;

  const t = dictionaries[locale];

  return (
    <section className="border-b border-neutral-200 py-8">
      <div className="mb-5 flex items-center justify-between border-b-2 border-neutral-950 pb-2">
        <h2 className="font-serif text-2xl font-bold text-neutral-950">{name}</h2>
        <Link
          href={localeCategoryHref(locale, slug)}
          className="text-xs font-semibold uppercase tracking-wide text-red-600 hover:underline"
        >
          {t.moreIn(name)}
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} locale={locale} variant="compact" />
        ))}
      </div>
    </section>
  );
}
