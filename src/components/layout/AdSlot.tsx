import clsx from "clsx";

type Variant = "leaderboard" | "in-feed" | "sidebar" | "in-article";

const SIZE: Record<Variant, string> = {
  leaderboard: "h-[90px] w-full max-w-[970px]",
  "in-feed": "h-[250px] w-full",
  sidebar: "h-[600px] w-full max-w-[300px]",
  "in-article": "h-[280px] w-full",
};

const LABEL: Record<Variant, string> = {
  leaderboard: "970 × 90",
  "in-feed": "In-feed",
  sidebar: "300 × 600",
  "in-article": "In-article",
};

export function AdSlot({ variant, className }: { variant: Variant; className?: string }) {
  return (
    <div className={clsx("mx-auto flex flex-col items-center justify-center", SIZE[variant], className)}>
      <div className="flex h-full w-full flex-col items-center justify-center gap-1 border border-dashed border-neutral-300 bg-neutral-50 text-neutral-400">
        <span className="text-[10px] font-semibold uppercase tracking-widest">Advertisement</span>
        <span className="text-[10px]">{LABEL[variant]}</span>
      </div>
    </div>
  );
}
