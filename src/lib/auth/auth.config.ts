import { randomBytes } from "crypto";

import { init } from "@paralleldrive/cuid2";
import type { NextAuthConfig, Session } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

const forbiddenNames = ["welcome"];

const generateUniqueName = async (name: string) => {
  const cuid = init({ length: 6 });
  const sameNamedUser = await prisma.user.findUnique({
    where: { name },
  });
  return sameNamedUser === null && !forbiddenNames.includes(name)
    ? name
    : `${name}-${cuid()}`;
};

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_PROVIDER_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_PROVIDER_GOOGLE_CLIENT_SECRET,
      profile: async (profile) => {
        const name = await generateUniqueName(profile.email.split("@")[0]);
        const personalAccessToken = randomBytes(20).toString("hex");
        return {
          id: profile.sub,
          name,
          image: profile.picture,
          email: profile.email,
          personalAccessToken,
        };
      },
    }),
    GitHub({
      clientId: process.env.AUTH_PROVIDER_GITHUB_CLIENT_ID,
      clientSecret: process.env.AUTH_PROVIDER_GITHUB_CLIENT_SECRET,
      profile: async (profile) => {
        const name = await generateUniqueName(profile.login);
        const personalAccessToken = randomBytes(20).toString("hex");
        return {
          id: profile.id.toString(),
          name,
          image: profile.avatar_url,
          email: profile.email,
          personalAccessToken,
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
