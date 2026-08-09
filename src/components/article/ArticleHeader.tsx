import Link from "next/link";
import { formatPublishedDate } from "@/lib/types";

export function ArticleHeader({
  title,
  excerpt,
  category,
  authorName,
  publishedAt,
}: {
  title: string;
  excerpt: string;
  category: { slug: string; name: string };
  authorName: string;
  publishedAt: Date | null;
}) {
  return (
    <header className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
      <Link
        href={`/${category.slug}`}
        className="text-xs font-semibold uppercase tracking-wide text-red-600 hover:underline"
      >
        {category.name}
      </Link>
      <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-neutral-950 sm:text-5xl sm:leading-tight">
        {title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-neutral-600">{excerpt}</p>
      <div className="mt-5 flex items-center gap-2 border-y border-neutral-200 py-3 text-sm text-neutral-500">
        <span className="font-medium text-neutral-800">By {authorName}</span>
        <span aria-hidden>·</span>
        <time>{formatPublishedDate(publishedAt)}</time>
      </div>
    </header>
  );
}
