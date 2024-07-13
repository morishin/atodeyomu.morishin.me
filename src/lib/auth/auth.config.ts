import GitHub from "next-auth/providers/github";
import type { NextAuthConfig, Session } from "next-auth";
import { init } from "@paralleldrive/cuid2";

import { prisma } from "@/lib/prisma";

const generateUniqueName = async (name: string) => {
  const cuid = init({ length: 6 });
  const sameNamedUser = await prisma.user.findUnique({
    where: { name },
  });
  return sameNamedUser === null ? name : `${name}-${cuid()}`;
};

export default {
  providers: [
    GitHub({
      clientId: process.env.AUTH_PROVIDER_GITHUB_CLIENT_ID,
      clientSecret: process.env.AUTH_PROVIDER_GITHUB_CLIENT_SECRET,
      profile: async (profile) => {
        const name = await generateUniqueName(profile.login);
        return {
          id: profile.id.toString(),
          name,
          image: profile.avatar_url,
          email: profile.email,
        };
      },
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
