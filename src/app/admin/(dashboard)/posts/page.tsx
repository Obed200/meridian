import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deletePost, togglePublish } from "@/lib/actions/posts";

export default async function PostsListPage() {
  const session = await auth();
  const isAdmin = session!.user.role === "ADMIN";

  const posts = await prisma.post.findMany({
    where: isAdmin ? {} : { authorId: session!.user.id },
    include: {
      category: true,
      author: true,
      _count: { select: { views: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Posts</h1>
          <p className="text-sm text-neutral-500">
            {isAdmin ? "All posts across the newsroom." : "Posts you've authored."}
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
        >
          New post
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              {isAdmin ? <th className="px-4 py-3">Author</th> : null}
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {posts.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-neutral-900">
                  <Link href={`/admin/posts/${p.id}/edit`} className="hover:text-red-600">
                    {p.title}
                  </Link>
                  {p.featured ? (
                    <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-800">
                      Featured
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-neutral-500">{p.category.name}</td>
                {isAdmin ? <td className="px-4 py-3 text-neutral-500">{p.author.name}</td> : null}
                <td className="px-4 py-3">
                  <span
                    className={
                      p.status === "PUBLISHED"
                        ? "rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
                        : "rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600"
                    }
                  >
                    {p.status === "PUBLISHED" ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-500">{p._count.views}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <form action={togglePublish.bind(null, p.id)}>
                      <button type="submit" className="text-xs font-medium text-neutral-600 hover:underline">
                        {p.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <form action={deletePost.bind(null, p.id)}>
                      <button type="submit" className="text-xs font-medium text-red-600 hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="px-4 py-8 text-center text-neutral-400">
                  No posts yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
