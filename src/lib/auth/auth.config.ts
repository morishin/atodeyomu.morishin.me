import GitHub from "next-auth/providers/github";
import type { NextAuthConfig, Session } from "next-auth";

export default {
  providers: [
    GitHub({
      clientId: process.env.AUTH_PROVIDER_GITHUB_CLIENT_ID,
      clientSecret: process.env.AUTH_PROVIDER_GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Drop unused fields from the original session (like email)
      const newSession = {
        user: {
          id: user.id,
          name: user.name ?? "",
          image: user.image,
        },
        expires: session.expires,
      } satisfies Session;
      return newSession;
    },
  },
} satisfies NextAuthConfig;
