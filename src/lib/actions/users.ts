"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const editorSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
});

export type CreateEditorResult =
  | { error: string }
  | { success: true; email: string; tempPassword: string };

function generateTempPassword(): string {
  return randomBytes(9).toString("base64url");
}

export async function createEditor(
  _prev: CreateEditorResult | null,
  formData: FormData
): Promise<CreateEditorResult> {
  await requireAdmin();

  const parsed = editorSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { error: "Please provide a valid name and email address." };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return { error: "A user with that email already exists." };
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 10);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: "EDITOR",
    },
  });

  revalidatePath("/admin/users");
  return { success: true, email: parsed.data.email, tempPassword };
}

export async function deleteUser(userId: string): Promise<{ error: string } | { success: true }> {
  const session = await requireAdmin();

  if (session.user.id === userId) {
    return { error: "You cannot delete your own account." };
  }

  const postCount = await prisma.post.count({ where: { authorId: userId } });
  if (postCount > 0) {
    return { error: "Cannot delete an editor who has authored posts. Reassign or delete their posts first." };
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
  return { success: true };
}
