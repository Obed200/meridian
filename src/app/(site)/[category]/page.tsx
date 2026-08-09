import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/home/ArticleCard";
import { AdSlot } from "@/components/layout/AdSlot";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};
  return { title: category.name };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED", categoryId: category.id },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h1 className="mb-2 font-serif text-4xl font-bold text-neutral-950">{category.name}</h1>
        <p className="text-neutral-500">No stories published in this section yet.</p>
      </div>
    );
  }

  const [lead, ...rest] = posts;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 border-b-2 border-neutral-950 pb-3 font-serif text-4xl font-bold text-neutral-950">
        {category.name}
      </h1>

      <div className="mb-10">
        <ArticleCard post={lead} variant="featured" priority />
      </div>

      {rest.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(0, 3).map((post) => (
            <ArticleCard key={post.slug} post={post} variant="standard" />
          ))}
        </div>
      ) : null}

      {rest.length > 3 ? (
        <>
          <div className="my-10">
            <AdSlot variant="in-feed" />
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(3).map((post) => (
              <ArticleCard key={post.slug} post={post} variant="standard" />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
