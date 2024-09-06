import { type Session } from "next-auth";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";

export const redirectToWelcomePageIfNeeded = async (
  session?: Session | null
) => {
  const userId = (session === undefined ? await auth() : session)?.user?.id;
  if (userId) {
    const currentUser = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    if (!currentUser.registerCompleted) {
      redirect("/welcome");
    }
  }
};
