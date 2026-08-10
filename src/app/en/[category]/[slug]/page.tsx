import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleContent, getArticle } from "@/components/pages/ArticleContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getArticle("en", category, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function EnglishArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const post = await getArticle("en", category, slug);
  if (!post) notFound();
  return <ArticleContent locale="en" post={post} />;
}
