"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { requireAdmin } from "@/lib/session";

const categorySchema = z.object({
  name: z.string().trim().min(2).max(60),
});

export type ActionResult = { error: string } | { success: true };

export async function createCategory(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = categorySchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { error: "Please provide a valid category name (2-60 characters)." };
  }

  const slug = slugify(parsed.data.name);
  const existing = await prisma.category.findFirst({
    where: { OR: [{ name: parsed.data.name }, { slug }] },
  });
  if (existing) {
    return { error: "A category with that name already exists." };
  }

  await prisma.category.create({ data: { name: parsed.data.name, slug } });
  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCategory(categoryId: string): Promise<ActionResult> {
  await requireAdmin();

  const postCount = await prisma.post.count({ where: { categoryId } });
  if (postCount > 0) {
    return { error: "Cannot delete a category that still has posts assigned to it." };
  }

  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}
