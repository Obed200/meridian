"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { requireAdmin } from "@/lib/session";

const categorySchema = z.object({
  name: z.string().trim().min(2).max(60),
  locale: z.enum(["RW", "EN"]),
  key: z
    .string()
    .trim()
    .max(60)
    .transform((v) => (v.length ? v.toLowerCase() : null))
    .nullable(),
});

export type ActionResult = { error: string } | { success: true };

export async function createCategory(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    locale: formData.get("locale"),
    key: formData.get("key") ?? "",
  });
  if (!parsed.success) {
    return { error: "Please provide a valid category name (2-60 characters) and language." };
  }

  const { name, locale, key } = parsed.data;
  const slug = slugify(name);
  const existing = await prisma.category.findFirst({
    where: { locale, OR: [{ name }, { slug }] },
  });
  if (existing) {
    return { error: "A category with that name already exists in that language." };
  }

  await prisma.category.create({ data: { name, slug, locale, key } });
  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/en");
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
  revalidatePath("/en");
  return { success: true };
}
