import { notFound } from "next/navigation";

import { Content } from "@/app/[userName]/Content";
import { type ApiUserPageResponse } from "@/app/api/users/[userName]/pages/route";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { VStack } from "@styled-system/jsx";
import { redirectToWelcomePageIfNeeded } from "@/lib/redirects";

type Page = ApiUserPageResponse[number];

export default async function Page({
  params: { userName },
  searchParams: { read },
}: {
  params: { userName: string };
  searchParams: { read: string };
}) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { name: userName },
  });
  const session = await auth();
  await redirectToWelcomePageIfNeeded(session);

  const isMyPage = session?.user?.id === user.id;
  const isPrivate = user.private;

  if (isPrivate && !isMyPage) {
    notFound();
  }

  return (
    <VStack
      alignItems="stretch"
      paddingTop={{ smDown: "0", base: "4" }}
      paddingBottom="12"
    >
      <Content
        userName={user.name}
        userIcon={user.image}
        isPrivate={isPrivate}
        isMyPage={isMyPage}
        initialTab={Boolean(Number(read)) ? "read" : "unread"}
      />
    </VStack>
  );
}
