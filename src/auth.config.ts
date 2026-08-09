import type { NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: "ADMIN" | "EDITOR";
  }
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "EDITOR";
      name?: string | null;
      email?: string | null;
    };
  }
}

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      if (!path.startsWith("/admin")) return true;
      if (path === "/admin/login") return true;
      if (!isLoggedIn) return false;

      const adminOnly = path.startsWith("/admin/users") || path.startsWith("/admin/categories");
      if (adminOnly && auth.user.role !== "ADMIN") {
        return Response.redirect(new URL("/admin/dashboard", nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      const t = token as typeof token & { id?: string; role?: "ADMIN" | "EDITOR" };
      session.user.id = t.id as string;
      session.user.role = t.role as "ADMIN" | "EDITOR";
      return session;
    },
  },
  providers: [],
};
