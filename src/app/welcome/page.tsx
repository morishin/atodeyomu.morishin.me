import { notFound, redirect } from "next/navigation";

import { WelcomeForm } from "@/app/welcome/WelcomeForm";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    notFound();
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { pages: true },
  });
  if (!user) {
    notFound();
  }
  if (user.pages.length > 0 || user.registerCompleted) {
    redirect(`/${user.name}`);
  }

  return <WelcomeForm currentName={user.name} />;
}
