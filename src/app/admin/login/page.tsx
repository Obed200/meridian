import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn, auth } from "@/auth";

async function loginAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/admin/login?error=1");
    }
    throw error;
  }
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/admin/dashboard");
  }

  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-serif text-3xl font-bold tracking-tight text-white">
            The Meridian Post
          </span>
          <p className="mt-2 text-sm text-neutral-400">Newsroom sign in</p>
        </div>

        <form
          action={loginAction}
          className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6 shadow-xl"
        >
          {error ? (
            <p className="rounded border border-red-900 bg-red-950/50 px-3 py-2 text-sm text-red-400">
              Invalid email or password.
            </p>
          ) : null}

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-400"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-red-600"
              placeholder="you@meridianpost.local"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-400"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-red-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Staff access only. Contact your admin for an account.
        </p>
      </div>
    </div>
  );
}
