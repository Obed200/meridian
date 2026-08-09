import { ArticleCard } from "@/components/home/ArticleCard";
import type { CardPost } from "@/lib/types";

export function HeroStory({
  lead,
  secondary,
}: {
  lead: CardPost;
  secondary: CardPost[];
}) {
  return (
    <section className="border-b border-neutral-200 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ArticleCard post={lead} variant="featured" priority />
        </div>
        <div className="divide-y divide-neutral-200 lg:col-span-1 lg:border-l lg:border-neutral-200 lg:pl-8">
          {secondary.map((post) => (
            <ArticleCard key={post.slug} post={post} variant="list" />
          ))}
        </div>
      </div>
    </section>
  );
}
