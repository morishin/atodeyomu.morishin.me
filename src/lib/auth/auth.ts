import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

import authConfig from "@/lib/auth/auth.config";

const prisma = new PrismaClient();

// https://authjs.dev/getting-started/migrating-to-v5#authenticating-server-side
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  ...authConfig,
});
