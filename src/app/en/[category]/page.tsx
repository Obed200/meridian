import type { Metadata } from "next";
import { CategoryContent, getCategoryBySlug } from "@/components/pages/CategoryContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug("en", slug);
  if (!category) return {};
  return { title: category.name };
}

export default async function EnglishCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  return <CategoryContent locale="en" categorySlug={slug} />;
}
