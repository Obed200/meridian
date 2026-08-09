import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { ArticleHero } from "@/components/article/ArticleHero";
import { ArticleBody } from "@/components/article/ArticleBody";
import { ViewTracker } from "@/components/article/ViewTracker";
import { AdSlot } from "@/components/layout/AdSlot";
import { ArticleCard } from "@/components/home/ArticleCard";

async function getPost(category: string, slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true, author: true },
  });
  if (!post || post.status !== "PUBLISHED" || post.category.slug !== category) {
    return null;
  }
  return post;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPost(category, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const post = await getPost(category, slug);
  if (!post) notFound();

  const more = await prisma.post.findMany({
    where: { status: "PUBLISHED", categoryId: post.categoryId, id: { not: post.id } },
    orderBy: { publishedAt: "desc" },
    take: 3,
    include: { category: true },
  });

  return (
    <div className="pb-16">
      <ViewTracker postId={post.id} />

      <ArticleHeader
        title={post.title}
        excerpt={post.excerpt}
        category={post.category}
        authorName={post.author.name}
        publishedAt={post.publishedAt}
      />
      <ArticleHero src={post.heroImage} alt={post.heroImageAlt ?? post.title} />

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_300px]">
        <div>
          <ArticleBody body={post.body} />
          <div className="mt-10">
            <AdSlot variant="in-article" />
          </div>
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <AdSlot variant="sidebar" />
          </div>
        </aside>
      </div>

      {more.length > 0 ? (
        <div className="mx-auto mt-16 max-w-5xl border-t border-neutral-200 px-4 pt-10 sm:px-6">
          <h2 className="mb-6 font-serif text-2xl font-bold text-neutral-950">
            More in {post.category.name}
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {more.map((p) => (
              <ArticleCard key={p.slug} post={p} variant="standard" />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
