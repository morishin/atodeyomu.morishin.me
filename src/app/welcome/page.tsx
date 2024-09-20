import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { WelcomeForm } from "@/app/welcome/WelcomeForm";
import { authConfig } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;
  if (!userId) {
    notFound();
  }
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: { pages: true },
  });
  if (user.pages.length > 0 || user.registerCompleted) {
    redirect(`/${user.name}`);
  }

  return <WelcomeForm currentName={user.name} />;
}
