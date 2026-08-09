import Image from "next/image";
import clsx from "clsx";

const ASPECT: Record<Variant, string> = {
  hero: "aspect-[16/9]",
  card: "aspect-[3/2]",
  wide: "aspect-[21/9]",
  square: "aspect-square",
};

type Variant = "hero" | "card" | "wide" | "square";

export function ResponsiveImage({
  src,
  alt,
  variant = "card",
  sizes = "100vw",
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  variant?: Variant;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={clsx("relative overflow-hidden bg-neutral-200", ASPECT[variant], className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
