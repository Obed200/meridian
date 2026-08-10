"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import "@uiw/react-md-editor/markdown-editor.css";
import { savePost, type SavePostResult } from "@/lib/actions/posts";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type Category = { id: string; name: string; locale: "RW" | "EN" };

export function PostForm({
  categories,
  post,
}: {
  categories: Category[];
  post?: {
    id: string;
    title: string;
    excerpt: string;
    body: string;
    categoryId: string;
    locale: "RW" | "EN";
    status: "DRAFT" | "PUBLISHED";
    featured: boolean;
    heroImage: string;
  };
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<SavePostResult | null, FormData>(
    savePost,
    null
  );
  const [body, setBody] = useState(post?.body ?? "");
  const [preview, setPreview] = useState<string | null>(post?.heroImage ?? null);
  const [locale, setLocale] = useState<"RW" | "EN">(post?.locale ?? "RW");

  const visibleCategories = useMemo(
    () => categories.filter((c) => c.locale === locale),
    [categories, locale]
  );

  useEffect(() => {
    if (state && "success" in state) {
      router.push("/admin/posts");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-6">
      {post ? <input type="hidden" name="postId" value={post.id} /> : null}
      <input type="hidden" name="body" value={body} />
      <input type="hidden" name="locale" value={locale} />

      {state && "error" in state ? (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <label htmlFor="title" className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Headline
            </label>
            <input
              id="title"
              name="title"
              required
              minLength={4}
              maxLength={160}
              defaultValue={post?.title}
              className="w-full rounded border border-neutral-300 px-3 py-2 text-lg font-serif outline-none focus:border-red-600"
              placeholder="A striking, specific headline"
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Dek / excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              required
              minLength={10}
              maxLength={280}
              rows={2}
              defaultValue={post?.excerpt}
              className="w-full resize-none rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-red-600"
              placeholder="One or two sentences summarizing the story"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Article body (Markdown)
            </label>
            <div data-color-mode="light">
              <MDEditor value={body} onChange={(v) => setBody(v ?? "")} height={420} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <label htmlFor="localeSelect" className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Language
            </label>
            {post ? (
              <p className="mb-4 w-full rounded border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-600">
                {post.locale === "RW" ? "Kinyarwanda" : "English"} (fixed after creation)
              </p>
            ) : (
              <select
                id="localeSelect"
                value={locale}
                onChange={(e) => setLocale(e.target.value as "RW" | "EN")}
                className="mb-4 w-full rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-red-600"
              >
                <option value="RW">Kinyarwanda</option>
                <option value="EN">English</option>
              </select>
            )}

            <label htmlFor="categoryId" className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              defaultValue={post?.categoryId ?? ""}
              className="mb-4 w-full rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-red-600"
            >
              <option value="" disabled>
                Select a category
              </option>
              {visibleCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <label htmlFor="status" className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={post?.status ?? "DRAFT"}
              className="mb-4 w-full rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-red-600"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>

            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input type="checkbox" name="featured" defaultChecked={post?.featured} />
              Feature on homepage
            </label>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <label htmlFor="heroImage" className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Hero image {post ? "(leave blank to keep current)" : ""}
            </label>
            {preview ? (
              <div className="relative mb-3 aspect-[16/9] w-full overflow-hidden rounded bg-neutral-100">
                <Image src={preview} alt="" fill className="object-cover" unoptimized />
              </div>
            ) : null}
            <input
              id="heroImage"
              name="heroImage"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
              className="w-full text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-50"
          >
            {pending ? "Saving…" : post ? "Save changes" : "Create post"}
          </button>
        </div>
      </div>
    </form>
  );
}
