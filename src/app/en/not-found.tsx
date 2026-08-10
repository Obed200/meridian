import Link from "next/link";
import { dictionaries } from "@/lib/i18n";
import { SiteHeader } from "@/components/pages/SiteHeader";

export default function EnglishNotFound() {
  const t = dictionaries.en;
  return (
    <>
      <SiteHeader locale="en" />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-32 text-center sm:px-6">
        <span className="font-serif text-6xl font-bold text-neutral-950">{t.notFoundTitle}</span>
        <p className="mt-4 text-lg text-neutral-600">{t.notFoundBody}</p>
        <Link href="/en" className="mt-6 rounded bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800">
          {t.backToFrontPage}
        </Link>
      </div>
    </>
  );
}
