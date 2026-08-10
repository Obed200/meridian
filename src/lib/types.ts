import { localeArticleHref, type Locale } from "@/lib/i18n";

export type CardPost = {
  slug: string;
  title: string;
  excerpt: string;
  heroImage: string;
  heroImageAlt: string | null;
  publishedAt: Date | null;
  category: { slug: string; name: string };
};

export function articleHref(post: CardPost, locale: Locale): string {
  return localeArticleHref(locale, post.category.slug, post.slug);
}

export function formatPublishedDate(date: Date | null, locale: Locale = "en"): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString(locale === "rw" ? "rw" : "en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
