import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteCategory } from "@/lib/actions/categories";
import { CategoryForm } from "@/components/admin/CategoryForm";

async function handleDelete(categoryId: string) {
  "use server";
  await deleteCategory(categoryId);
}

export default async function CategoriesPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/admin/dashboard");
  }

  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: [{ locale: "asc" }, { name: "asc" }],
  });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-neutral-900">Categories</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Categories organize the public site&apos;s navigation and homepage rails.
      </p>

      <div className="mb-6 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <CategoryForm />
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Language</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Key</th>
              <th className="px-4 py-3">Posts</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium text-neutral-900">{c.name}</td>
                <td className="px-4 py-3">
                  <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                    {c.locale === "RW" ? "Kinyarwanda" : "English"}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-500">/{c.locale === "RW" ? "" : "en/"}{c.slug}</td>
                <td className="px-4 py-3 text-neutral-400">{c.key ?? "—"}</td>
                <td className="px-4 py-3 text-neutral-500">{c._count.posts}</td>
                <td className="px-4 py-3 text-right">
                  <form action={handleDelete.bind(null, c.id)}>
                    <button
                      type="submit"
                      disabled={c._count.posts > 0}
                      className="text-xs font-medium text-red-600 hover:underline disabled:text-neutral-300 disabled:no-underline"
                      title={c._count.posts > 0 ? "Reassign or delete its posts first" : "Delete category"}
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
