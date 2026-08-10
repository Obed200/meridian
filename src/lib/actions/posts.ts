"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { requireSession } from "@/lib/session";
import { saveHeroImage } from "@/lib/actions/upload";

const postSchema = z.object({
  title: z.string().trim().min(4).max(160),
  excerpt: z.string().trim().min(10).max(280),
  body: z.string().trim().min(20),
  categoryId: z.string().min(1),
  locale: z.enum(["RW", "EN"]),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  featured: z.boolean(),
});

export type SavePostResult = { error: string } | { success: true; postId: string };

async function assertCanEditPost(postId: string) {
  const session = await requireSession();
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    throw new Error("Post not found");
  }
  if (session.user.role !== "ADMIN" && post.authorId !== session.user.id) {
    throw new Error("You do not have permission to modify this post.");
  }
  return { session, post };
}

export async function savePost(
  _prev: SavePostResult | null,
  formData: FormData
): Promise<SavePostResult> {
  const session = await requireSession();

  const postId = String(formData.get("postId") ?? "").trim() || null;

  let existing = null;
  if (postId) {
    existing = await prisma.post.findUnique({ where: { id: postId } });
    if (!existing) return { error: "Post not found." };
    if (session.user.role !== "ADMIN" && existing.authorId !== session.user.id) {
      return { error: "You do not have permission to edit this post." };
    }
  }

  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    categoryId: formData.get("categoryId"),
    locale: formData.get("locale") ?? existing?.locale,
    status: formData.get("status"),
    featured: formData.get("featured") === "on",
  });

  if (!parsed.success) {
    return { error: "Please check the form: title, excerpt, body, category, and language are required." };
  }

  // A post's language is fixed at creation; edits keep the original locale
  // regardless of what the (disabled) form field submits.
  const locale = existing ? existing.locale : parsed.data.locale;

  const category = await prisma.category.findUnique({
    where: { id: parsed.data.categoryId },
  });
  if (!category || category.locale !== locale) {
    return { error: "Please select a category that matches the post's language." };
  }

  let heroImage = existing?.heroImage ?? "";
  const imageFile = formData.get("heroImage");
  if (imageFile instanceof File && imageFile.size > 0) {
    const result = await saveHeroImage(imageFile);
    if ("error" in result) {
      return { error: result.error };
    }
    heroImage = result.url;
  }
  if (!heroImage) {
    return { error: "A hero image is required." };
  }

  const wasPublished = existing?.status === "PUBLISHED";
  const willPublish = parsed.data.status === "PUBLISHED";
  const publishedAt = existing?.publishedAt ?? null;

  if (existing) {
    await prisma.post.update({
      where: { id: existing.id },
      data: {
        title: parsed.data.title,
        excerpt: parsed.data.excerpt,
        body: parsed.data.body,
        categoryId: parsed.data.categoryId,
        status: parsed.data.status,
        featured: parsed.data.featured,
        heroImage,
        heroImageAlt: parsed.data.title,
        publishedAt: !wasPublished && willPublish ? new Date() : publishedAt,
      },
    });
    revalidatePath("/admin/posts");
    revalidatePath("/");
    revalidatePath("/en");
    return { success: true, postId: existing.id };
  }

  const baseSlug = slugify(parsed.data.title);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.post.findFirst({ where: { slug, locale } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const created = await prisma.post.create({
    data: {
      title: parsed.data.title,
      slug,
      locale,
      excerpt: parsed.data.excerpt,
      body: parsed.data.body,
      categoryId: parsed.data.categoryId,
      status: parsed.data.status,
      featured: parsed.data.featured,
      heroImage,
      heroImageAlt: parsed.data.title,
      authorId: session.user.id,
      publishedAt: willPublish ? new Date() : null,
    },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath("/en");
  return { success: true, postId: created.id };
}

export async function togglePublish(postId: string) {
  const { post } = await assertCanEditPost(postId);
  const nextStatus = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

  await prisma.post.update({
    where: { id: postId },
    data: {
      status: nextStatus,
      publishedAt: nextStatus === "PUBLISHED" ? post.publishedAt ?? new Date() : post.publishedAt,
    },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath("/en");
}

export async function deletePost(postId: string) {
  await assertCanEditPost(postId);
  await prisma.post.delete({ where: { id: postId } });
  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath("/en");
}

export async function deletePostAndRedirect(postId: string) {
  await deletePost(postId);
  redirect("/admin/posts");
}
