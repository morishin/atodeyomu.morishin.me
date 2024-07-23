import { Tabs } from "@/components/park-ui";
import { prisma } from "@/lib/prisma";
import { VStack } from "@styled-system/jsx";

export default async function Page({
  params,
}: {
  params: { userName: string };
}) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { name: params.userName },
  });
  return (
    <VStack>
      <h1>{user.name}</h1>
      <Tabs.Root defaultValue="unread">
        <Tabs.List>
          <Tabs.Trigger key={"unread"} value={"unread"}>
            Unread
          </Tabs.Trigger>
          <Tabs.Trigger key={"read"} value={"read"}>
            Read
          </Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value="unread">Know React? Check out Solid!</Tabs.Content>
        <Tabs.Content value="read">Know Solid? Check out Svelte!</Tabs.Content>
      </Tabs.Root>
    </VStack>
  );
}
