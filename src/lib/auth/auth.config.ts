import { randomBytes } from "node:crypto";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { init } from "@paralleldrive/cuid2";
import { User } from "@prisma/client";
import type { NextAuthOptions, Session } from "next-auth";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

const forbiddenNames = ["welcome"];
const cookiePrefix = "atodeyomu.";

const generateUniqueName = async (name: string) => {
  const cuid = init({ length: 6 });
  const sameNamedUser = await prisma.user.findUnique({
    where: { name },
  });
  return sameNamedUser === null && !forbiddenNames.includes(name)
    ? name
    : `${name}-${cuid()}`;
};

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    Google({
      clientId: process.env.AUTH_PROVIDER_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.AUTH_PROVIDER_GOOGLE_CLIENT_SECRET!,
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
  ],
  callbacks: {
    async session({ session, user }) {
      const appUser = user as User;
      const newSession = {
        user: {
          id: appUser.id,
          name: appUser.name ?? "",
          image: appUser.image,
          private: appUser.private,
          registerCompleted: appUser.registerCompleted,
          personalAccessToken: appUser.personalAccessToken,
        },
        expires: session.expires,
      } satisfies Session;
      return newSession;
    },
  },
  // https://next-auth.js.org/configuration/options#example
  cookies:
    process.env.NODE_ENV === "production"
      ? {
          sessionToken: {
            name: `__Secure-next-auth.session-token`,
            options: {
              httpOnly: true,
              sameSite: "lax",
              path: "/",
              secure: true,
            },
          },
          callbackUrl: {
            name: `__Secure-next-auth.callback-url`,
            options: {
              sameSite: "lax",
              path: "/",
              secure: true,
            },
          },
          csrfToken: {
            name: `__Host-next-auth.csrf-token`,
            options: {
              httpOnly: true,
              sameSite: "lax",
              path: "/",
              secure: true,
            },
          },
          pkceCodeVerifier: {
            name: `${cookiePrefix}next-auth.pkce.code_verifier`,
            options: {
              httpOnly: true,
              sameSite: "lax",
              path: "/",
              secure: true,
            },
          },
          state: {
            name: `${cookiePrefix}next-auth.state`,
            options: {
              httpOnly: true,
              sameSite: "lax",
              path: "/",
              secure: true,
            },
          },
          nonce: {
            name: `${cookiePrefix}next-auth.nonce`,
            options: {
              httpOnly: true,
              sameSite: "lax",
              path: "/",
              secure: true,
            },
          },
        }
      : undefined,
} satisfies NextAuthOptions;
