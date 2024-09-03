"use client";

import useSWRInfinite from "swr/infinite";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { PageList } from "@/app/[userName]/PageList";
import { Tabs, Text } from "@/components/park-ui";
import { HStack, VStack } from "@styled-system/jsx";
import { AddPageForm } from "@/app/[userName]/AddPageForm";
import { type ApiUserPageResponse } from "@/app/api/users/[userName]/pages/route";
import { Avatar } from "@/components/park-ui/avatar";

type Page = ApiUserPageResponse[number];

const perPage = 20;

const fetcher: (url: string) => Promise<ApiUserPageResponse> = (url: string) =>
  fetch(url).then((r) => r.json());

export const Content = ({
  userName,
  userIcon,
  isMyPage,
  initialTab,
}: {
  userName: string;
  userIcon: string | null;
  isMyPage: boolean;
  initialTab: "read" | "unread";
}) => {
  const getKeyUnread = (pageIndex: number, previousPageData: Page[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/api/users/${userName}/pages?perPage=${perPage}&page=${pageIndex + 1}`;
  };
  const unreadData = useSWRInfinite(getKeyUnread, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateFirstPage: false,
  });

  const getKeyRead = (pageIndex: number, previousPageData: Page[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/api/users/${userName}/pages?perPage=${perPage}&page=${pageIndex + 1}&read=1`;
  };
  const readData = useSWRInfinite(getKeyRead, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateFirstPage: false,
  });

  const showLoadMoreUnread =
    (unreadData.data?.[unreadData.data.length - 1]?.length ?? 0) === perPage;
  const showLoadMoreRead =
    (readData.data?.[readData.data.length - 1]?.length ?? 0) === perPage;

  const pathname = usePathname();

  const refresh = async () => {
    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        await Promise.all([unreadData.mutate(), readData.mutate()]);
      });
    } else {
      await Promise.all([unreadData.mutate(), readData.mutate()]);
    }
  };

  return (
    <VStack w="2xl" maxW="100vw" gap="6">
      <HStack alignSelf="stretch" padding={{ smDown: "2", base: "0" }}>
        <Avatar src={userIcon ?? undefined} name={userName} />
        <Text fontSize="xl">{userName}</Text>
      </HStack>
      {isMyPage ? <AddPageForm refresh={refresh} /> : null}
      <Tabs.Root defaultValue={initialTab}>
        <Tabs.List>
          <Link href={pathname}>
            <Tabs.Trigger key={"unread"} value={"unread"}>
              Unread
            </Tabs.Trigger>
          </Link>
          <Link href="?read=1">
            <Tabs.Trigger key={"read"} value={"read"}>
              Read
            </Tabs.Trigger>
          </Link>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value="unread">
          <PageList
            data={unreadData.data}
            size={unreadData.size}
            setSize={unreadData.setSize}
            isMyPage={isMyPage}
            isRead={false}
            isLoading={unreadData.isLoading}
            showLoadMore={showLoadMoreUnread}
            refresh={refresh}
          />
        </Tabs.Content>
        <Tabs.Content value="read">
          <PageList
            data={readData.data}
            size={readData.size}
            setSize={readData.setSize}
            isMyPage={isMyPage}
            isRead={true}
            isLoading={readData.isLoading}
            showLoadMore={showLoadMoreRead}
            refresh={refresh}
          />
        </Tabs.Content>
      </Tabs.Root>
    </VStack>
  );
};
