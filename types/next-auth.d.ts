import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user?: DefaultSession["user"] & {
      name: string;
      private: boolean;
      registerCompleted: boolean;
      personalAccessToken: string;
    };
  }
}
