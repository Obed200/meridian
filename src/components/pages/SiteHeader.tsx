import { Masthead } from "@/components/layout/Masthead";
import { AdSlot } from "@/components/layout/AdSlot";
import type { Locale } from "@/lib/i18n";

export function SiteHeader({ locale, switchHref }: { locale: Locale; switchHref?: string }) {
  return (
    <>
      <Masthead locale={locale} switchHref={switchHref} />
      <div className="border-b border-neutral-100 bg-white py-3">
        <AdSlot variant="leaderboard" locale={locale} />
      </div>
    </>
  );
}
