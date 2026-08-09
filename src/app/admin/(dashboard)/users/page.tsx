import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteUser } from "@/lib/actions/users";
import { CreateEditorForm } from "@/components/admin/CreateEditorForm";

async function handleDelete(userId: string) {
  "use server";
  await deleteUser(userId);
}

export default async function UsersPage() {
  const session = await auth();
  const users = await prisma.user.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-neutral-900">Editors</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Create accounts for reporters and editors. Only admins can manage staff accounts.
      </p>

      <div className="mb-6">
        <CreateEditorForm />
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Posts</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-neutral-900">{u.name}</td>
                <td className="px-4 py-3 text-neutral-500">{u.email}</td>
                <td className="px-4 py-3 text-neutral-500">{u.role}</td>
                <td className="px-4 py-3 text-neutral-500">{u._count.posts}</td>
                <td className="px-4 py-3 text-right">
                  {u.role === "EDITOR" ? (
                    <form action={handleDelete.bind(null, u.id)}>
                      <button
                        type="submit"
                        disabled={u._count.posts > 0}
                        className="text-xs font-medium text-red-600 hover:underline disabled:text-neutral-300 disabled:no-underline"
                        title={u._count.posts > 0 ? "Reassign or delete their posts first" : "Delete editor"}
                      >
                        Delete
                      </button>
                    </form>
                  ) : u.id === session?.user.id ? (
                    <span className="text-xs text-neutral-400">You</span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
