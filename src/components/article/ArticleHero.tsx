import { ResponsiveImage } from "@/components/media/ResponsiveImage";

export function ArticleHero({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6">
      <ResponsiveImage
        src={src}
        alt={alt}
        variant="hero"
        sizes="(min-width: 1024px) 960px, 100vw"
        priority
        className="rounded-sm"
      />
    </div>
  );
}
