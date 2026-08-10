import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/admin/PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const [post, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: [{ locale: "asc" }, { name: "asc" }] }),
  ]);

  if (!post) notFound();
  if (session!.user.role !== "ADMIN" && post.authorId !== session!.user.id) {
    redirect("/admin/posts");
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900">Edit post</h1>
      <PostForm
        categories={categories}
        post={{
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          body: post.body,
          categoryId: post.categoryId,
          locale: post.locale,
          status: post.status,
          featured: post.featured,
          heroImage: post.heroImage,
        }}
      />
    </div>
  );
}
