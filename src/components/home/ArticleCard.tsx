import Link from "next/link";
import clsx from "clsx";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { articleHref, formatPublishedDate, type CardPost } from "@/lib/types";

type Variant = "featured" | "standard" | "compact" | "list";

export function ArticleCard({
  post,
  variant = "standard",
  priority = false,
}: {
  post: CardPost;
  variant?: Variant;
  priority?: boolean;
}) {
  const href = articleHref(post);

  if (variant === "list") {
    return (
      <Link href={href} className="group flex gap-3 py-3">
        <div className="w-20 shrink-0 sm:w-24">
          <ResponsiveImage
            src={post.heroImage}
            alt={post.heroImageAlt ?? post.title}
            variant="square"
            sizes="96px"
          />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-red-600">
            {post.category.name}
          </span>
          <h3 className="mt-0.5 text-sm font-semibold leading-snug text-neutral-900 group-hover:underline">
            {post.title}
          </h3>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={href} className="group block">
        <ResponsiveImage
          src={post.heroImage}
          alt={post.heroImageAlt ?? post.title}
          variant="card"
          sizes="(min-width: 768px) 25vw, 50vw"
        />
        <span className="mt-2 block text-[11px] font-semibold uppercase tracking-wide text-red-600">
          {post.category.name}
        </span>
        <h3 className="mt-1 text-base font-semibold leading-snug text-neutral-900 group-hover:underline">
          {post.title}
        </h3>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={href} className="group block">
        <ResponsiveImage
          src={post.heroImage}
          alt={post.heroImageAlt ?? post.title}
          variant="hero"
          sizes="(min-width: 1024px) 66vw, 100vw"
          priority={priority}
        />
        <span className="mt-4 block text-xs font-semibold uppercase tracking-wide text-red-600">
          {post.category.name}
        </span>
        <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-neutral-950 group-hover:underline sm:text-4xl">
          {post.title}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-600">{post.excerpt}</p>
        <span className="mt-3 block text-xs text-neutral-400">{formatPublishedDate(post.publishedAt)}</span>
      </Link>
    );
  }

  return (
    <Link href={href} className={clsx("group block")}>
      <ResponsiveImage
        src={post.heroImage}
        alt={post.heroImageAlt ?? post.title}
        variant="card"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        priority={priority}
      />
      <span className="mt-3 block text-[11px] font-semibold uppercase tracking-wide text-red-600">
        {post.category.name}
      </span>
      <h3 className="mt-1.5 font-serif text-xl font-bold leading-snug text-neutral-950 group-hover:underline">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600">{post.excerpt}</p>
    </Link>
  );
}
