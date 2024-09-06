import { Session } from "next-auth";
import { redirect } from "next/navigation";

export const redirectToWelcomePageIfNeeded = async (
  session?: Session | null
) => {
  if (session?.user?.registerCompleted === false) {
    redirect("/welcome");
  }
};
