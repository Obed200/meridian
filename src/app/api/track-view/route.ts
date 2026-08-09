import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({ postId: z.string().min(1) });

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const post = await prisma.post.findUnique({ where: { id: parsed.data.postId } });
  if (!post || post.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  await prisma.pageView.create({
    data: {
      postId: parsed.data.postId,
      referrer: request.headers.get("referer") ?? undefined,
    },
  });

  return NextResponse.json({ ok: true });
}
