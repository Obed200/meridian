import { auth } from "@/auth";
import {
  getAuthorLeaderboard,
  getDashboardStats,
  getTopPosts,
  getViewsByCategory,
  getViewsByLocale,
  getViewsOverTime,
} from "@/lib/analytics";
import {
  AuthorLeaderboard,
  TopPostsChart,
  ViewsByCategoryChart,
  ViewsByLocaleChart,
  ViewsOverTimeChart,
} from "@/components/admin/AnalyticsCharts";

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-neutral-900">{value.toLocaleString()}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  const isAdmin = session!.user.role === "ADMIN";
  const scope = isAdmin ? {} : { authorId: session!.user.id };

  const [stats, topPosts, viewsOverTime, viewsByCategory, viewsByLocale, leaderboard] = await Promise.all([
    getDashboardStats(scope),
    getTopPosts(6, scope),
    getViewsOverTime(14, scope),
    getViewsByCategory(scope),
    getViewsByLocale(scope),
    isAdmin ? getAuthorLeaderboard(8) : Promise.resolve([]),
  ]);

  const avgViewsPerPost = stats.published > 0 ? Math.round(stats.totalViews / stats.published) : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {isAdmin ? "Newsroom Dashboard" : "Your Dashboard"}
        </h1>
        <p className="text-sm text-neutral-500">
          {isAdmin ? "Site-wide performance across all authors." : "Performance for posts you've authored."}
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatTile label="Total views" value={stats.totalViews} />
        <StatTile label="Avg. views / post" value={avgViewsPerPost} />
        <StatTile label="Total posts" value={stats.totalPosts} />
        <StatTile label="Published" value={stats.published} />
        <StatTile label="Drafts" value={stats.draft} />
      </div>

      <div className="mb-6">
        <ViewsOverTimeChart data={viewsOverTime} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopPostsChart
          data={topPosts.map((p) => ({ title: p.post.title, views: p.views }))}
        />
        <ViewsByCategoryChart data={viewsByCategory} />
      </div>

      <div className={isAdmin ? "grid grid-cols-1 gap-6 lg:grid-cols-2" : ""}>
        <ViewsByLocaleChart data={viewsByLocale} />
        {isAdmin ? <AuthorLeaderboard data={leaderboard} /> : null}
      </div>
    </div>
  );
}
