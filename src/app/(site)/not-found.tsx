import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-32 text-center sm:px-6">
      <span className="font-serif text-6xl font-bold text-neutral-950">404</span>
      <p className="mt-4 text-lg text-neutral-600">We couldn&apos;t find that story.</p>
      <Link href="/" className="mt-6 rounded bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800">
        Back to the front page
      </Link>
    </div>
  );
}
