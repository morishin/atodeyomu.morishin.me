import NextAuth from "next-auth";

import { authConfig } from "@/lib/auth/auth.config";

// https://authjs.dev/getting-started/migrating-to-v5#authenticating-server-side
const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
