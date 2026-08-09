import Link from "next/link";
import { ArticleCard } from "@/components/home/ArticleCard";
import type { CardPost } from "@/lib/types";

export function CategoryRail({
  name,
  slug,
  posts,
}: {
  name: string;
  slug: string;
  posts: CardPost[];
}) {
  if (posts.length === 0) return null;

  return (
    <section className="border-b border-neutral-200 py-8">
      <div className="mb-5 flex items-center justify-between border-b-2 border-neutral-950 pb-2">
        <h2 className="font-serif text-2xl font-bold text-neutral-950">{name}</h2>
        <Link href={`/${slug}`} className="text-xs font-semibold uppercase tracking-wide text-red-600 hover:underline">
          More in {name} →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} variant="compact" />
        ))}
      </div>
    </section>
  );
}
