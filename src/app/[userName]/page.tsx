import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { Content } from "@/app/[userName]/Content";
import { type ApiUserPageResponse } from "@/app/api/users/[userName]/pages/route";
import { authConfig } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma";
import { VStack } from "@styled-system/jsx";
import { redirectToWelcomePageIfNeeded } from "@/lib/redirects";
import { LoggedInUser } from "@/lib/types";

type Page = ApiUserPageResponse[number];

export default async function Page({
  params: { userName },
}: {
  params: { userName: string };
}) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { name: userName },
  });
  const session = await getServerSession(authConfig);
  await redirectToWelcomePageIfNeeded(session);

  const isMyPage = session?.user?.id === user.id;
  const isPrivate = user.private;

  if (isPrivate && !isMyPage) {
    notFound();
  }

  let loggedInUser: LoggedInUser | null;
  if (!session?.user) {
    loggedInUser = null;
  } else {
    loggedInUser = {
      name: session.user.name,
      image: session.user.image ?? null,
      personalAccessToken: session.user?.personalAccessToken,
    };
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
        loggedInUser={loggedInUser}
        isPrivate={isPrivate}
        isMyPage={isMyPage}
      />
    </VStack>
  );
}
