import { prisma } from "@/lib/prisma";
import { HeroStory } from "@/components/home/HeroStory";
import { CategoryRail } from "@/components/home/CategoryRail";
import { AdSlot } from "@/components/layout/AdSlot";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    prisma.post.findFirst({
      where: { status: "PUBLISHED", featured: true },
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const lead =
    featured ??
    (await prisma.post.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    }));

  if (!lead) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center text-neutral-500 sm:px-6">
        No stories published yet.
      </div>
    );
  }

  const secondary = await prisma.post.findMany({
    where: { status: "PUBLISHED", id: { not: lead.id } },
    orderBy: { publishedAt: "desc" },
    take: 4,
    include: { category: true },
  });

  const railPosts = await Promise.all(
    categories.map((category) =>
      prisma.post.findMany({
        where: { status: "PUBLISHED", categoryId: category.id, id: { not: lead.id } },
        orderBy: { publishedAt: "desc" },
        take: 4,
        include: { category: true },
      })
    )
  );

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <HeroStory lead={lead} secondary={secondary} />

      {categories.map((category, i) => (
        <div key={category.id}>
          <CategoryRail name={category.name} slug={category.slug} posts={railPosts[i]} />
          {i === 1 ? (
            <div className="border-b border-neutral-200 py-8">
              <AdSlot variant="in-feed" />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
