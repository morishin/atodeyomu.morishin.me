"use client";

import useSWRInfinite from "swr/infinite";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { PageList } from "@/app/[userName]/PageList";
import { Tabs } from "@/components/park-ui";
import { VStack } from "@styled-system/jsx";
import { AddPageForm } from "@/app/[userName]/AddPageForm";
import { type ApiUserPageResponse } from "@/app/api/users/[userName]/pages/route";

type Page = ApiUserPageResponse[number];

const perPage = 20;

const fetcher: (url: string) => Promise<ApiUserPageResponse> = (url: string) =>
  fetch(url).then((r) => r.json());

export const Content = ({
  userName,
  isMyPage,
  initialTab,
}: {
  userName: string;
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
    await Promise.all([unreadData.mutate(), readData.mutate()]);
  };

  return (
    <VStack>
      <AddPageForm isAvailable={isMyPage} refresh={refresh} />
      <Tabs.Root defaultValue={initialTab} w="xl" maxW="100vw">
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
