"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

function UKFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden="true">
      <rect width="60" height="30" fill="#00247d" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#cf142b" strokeWidth="2" />
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#cf142b" strokeWidth="6" />
    </svg>
  );
}

function RwandaFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden="true">
      <rect width="60" height="30" fill="#20603D" />
      <rect width="60" height="20" fill="#00A1DE" />
      <rect y="16" width="60" height="4" fill="#FAD201" />
      <g transform="translate(45,7)" fill="#E5BE01">
        {Array.from({ length: 24 }).map((_, i) => (
          <rect key={i} x="-0.6" y="-6.5" width="1.2" height="3" transform={`rotate(${i * 15})`} />
        ))}
        <circle r="3.2" />
      </g>
    </svg>
  );
}

const FLAGS: Record<Locale, typeof UKFlag> = { en: UKFlag, rw: RwandaFlag };
const CODES: Record<Locale, string> = { en: "ENG", rw: "KINY" };
const NAMES: Record<Locale, string> = { en: "English", rw: "Kinyarwanda" };

function FlagChip({ locale }: { locale: Locale }) {
  const Flag = FLAGS[locale];
  return (
    <span className="inline-block h-3.5 w-5 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-inset ring-black/10">
      <Flag className="h-full w-full" />
    </span>
  );
}

export function LanguageSwitcher({ locale, otherHref }: { locale: Locale; otherHref: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const other: Locale = locale === "rw" ? "en" : "rw";

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] font-semibold text-neutral-700 hover:border-neutral-300"
      >
        <FlagChip locale={locale} />
        {CODES[locale]}
        <svg viewBox="0 0 10 6" className="h-1.5 w-2.5 fill-neutral-400">
          <path d="M0,0 L10,0 L5,6 Z" />
        </svg>
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-30 mt-1.5 flex w-28 flex-col gap-1.5 rounded-lg border border-neutral-200 bg-white p-1.5 shadow-lg">
          {([locale, other] as const).map((l) => {
            const isActive = l === locale;
            const chip = (
              <span className="flex w-full items-center gap-2 rounded-md border border-neutral-200 px-2 py-1.5 text-[11px] font-semibold text-neutral-700">
                <FlagChip locale={l} />
                {CODES[l]}
              </span>
            );
            return isActive ? (
              <div key={l} title={NAMES[l]} className="cursor-default opacity-50">
                {chip}
              </div>
            ) : (
              <Link key={l} href={otherHref} title={NAMES[l]} onClick={() => setOpen(false)}>
                {chip}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
