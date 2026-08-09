export type CardPost = {
  slug: string;
  title: string;
  excerpt: string;
  heroImage: string;
  heroImageAlt: string | null;
  publishedAt: Date | null;
  category: { slug: string; name: string };
};

export function articleHref(post: CardPost): string {
  return `/${post.category.slug}/${post.slug}`;
}

export function formatPublishedDate(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
