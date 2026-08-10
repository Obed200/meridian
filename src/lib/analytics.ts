import "server-only";
import { prisma } from "@/lib/prisma";

type Scope = { authorId?: string };

export async function getDashboardStats({ authorId }: Scope = {}) {
  const postWhere = authorId ? { authorId } : {};

  const [totalPosts, published, draft, totalViews] = await Promise.all([
    prisma.post.count({ where: postWhere }),
    prisma.post.count({ where: { ...postWhere, status: "PUBLISHED" } }),
    prisma.post.count({ where: { ...postWhere, status: "DRAFT" } }),
    prisma.pageView.count({
      where: authorId ? { post: { authorId } } : {},
    }),
  ]);

  return { totalPosts, published, draft, totalViews };
}

export async function getTopPosts(limit = 5, { authorId }: Scope = {}) {
  const grouped = await prisma.pageView.groupBy({
    by: ["postId"],
    where: authorId ? { post: { authorId } } : {},
    _count: { postId: true },
    orderBy: { _count: { postId: "desc" } },
    take: limit,
  });

  if (grouped.length === 0) return [];

  const posts = await prisma.post.findMany({
    where: { id: { in: grouped.map((g) => g.postId) } },
    include: { category: true },
  });
  const postById = new Map(posts.map((p) => [p.id, p]));

  return grouped
    .map((g) => {
      const post = postById.get(g.postId);
      if (!post) return null;
      return { post, views: g._count.postId };
    })
    .filter((x): x is { post: (typeof posts)[number]; views: number } => x !== null);
}

export async function getViewsOverTime(days = 14, { authorId }: Scope = {}) {
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const rows = authorId
    ? await prisma.$queryRaw<Array<{ day: string; count: bigint }>>`
        SELECT strftime('%Y-%m-%d', pv.viewedAt) as day, COUNT(*) as count
        FROM PageView pv
        JOIN Post p ON p.id = pv.postId
        WHERE pv.viewedAt >= ${since} AND p.authorId = ${authorId}
        GROUP BY day
        ORDER BY day ASC
      `
    : await prisma.$queryRaw<Array<{ day: string; count: bigint }>>`
        SELECT strftime('%Y-%m-%d', viewedAt) as day, COUNT(*) as count
        FROM PageView
        WHERE viewedAt >= ${since}
        GROUP BY day
        ORDER BY day ASC
      `;

  const countByDay = new Map(rows.map((r) => [r.day, Number(r.count)]));

  const series: Array<{ date: string; views: number }> = [];
  for (let i = 0; i < days; i += 1) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    series.push({ date: key, views: countByDay.get(key) ?? 0 });
  }

  return series;
}

export async function getViewsByCategory({ authorId }: Scope = {}) {
  const categories = await prisma.category.findMany({
    include: {
      posts: {
        where: authorId ? { authorId } : {},
        select: { _count: { select: { views: true } } },
      },
    },
  });

  return categories
    .map((c) => ({
      category: c.name,
      views: c.posts.reduce((sum, p) => sum + p._count.views, 0),
    }))
    .filter((c) => c.views > 0)
    .sort((a, b) => b.views - a.views);
}

export async function getViewsByLocale({ authorId }: Scope = {}) {
  const posts = await prisma.post.findMany({
    where: authorId ? { authorId } : {},
    select: { locale: true, _count: { select: { views: true } } },
  });

  const totals = { RW: 0, EN: 0 };
  for (const post of posts) {
    totals[post.locale] += post._count.views;
  }

  return [
    { locale: "Kinyarwanda", views: totals.RW },
    { locale: "English", views: totals.EN },
  ].filter((row) => row.views > 0);
}

export async function getAuthorLeaderboard(limit = 8) {
  const editors = await prisma.user.findMany({
    where: { role: "EDITOR" },
    select: {
      id: true,
      name: true,
      posts: {
        select: { status: true, _count: { select: { views: true } } },
      },
    },
  });

  return editors
    .map((editor) => {
      const published = editor.posts.filter((p) => p.status === "PUBLISHED").length;
      const views = editor.posts.reduce((sum, p) => sum + p._count.views, 0);
      return {
        id: editor.id,
        name: editor.name,
        posts: editor.posts.length,
        published,
        views,
        avgViews: published > 0 ? Math.round(views / published) : 0,
      };
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}
