import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    // On every Google sign-in, make sure the person has a profile row and remember its id.
    async jwt({ token, user, trigger }) {
      if ((trigger === "signIn" || trigger === "signUp") && user?.email) {
        const sql = await db();
        const [profile] = await sql<{ id: string }[]>`
          insert into profiles (email, full_name, avatar_url)
          values (${user.email.toLowerCase()}, ${user.name ?? null}, ${user.image ?? null})
          on conflict (email) do update
            set avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url),
                full_name = coalesce(profiles.full_name, excluded.full_name)
          returning id`;
        token.profileId = profile.id;
      }
      return token;
    },
    session({ session, token }) {
      if (typeof token.profileId === "string") session.user.id = token.profileId;
      return session;
    },
  },
});
