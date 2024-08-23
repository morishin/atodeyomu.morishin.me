import { Content } from "@/app/[userName]/Content";
import { type ApiUserPageResponse } from "@/app/api/users/[userName]/pages/route";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { VStack } from "@styled-system/jsx";

type Page = ApiUserPageResponse[number];

export default async function Page({
  params: { userName },
}: {
  params: { userName: string };
}) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { name: userName },
  });
  const session = await auth();
  const isMyPage = session?.user?.id === user.id;

  return (
    <VStack>
      <h1>{user.name}</h1>
      <Content userName={user.name} isMyPage={isMyPage} />
    </VStack>
  );
}
