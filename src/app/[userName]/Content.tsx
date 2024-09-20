"use client";

import { CircleCheckIcon, CircleXIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import useSWRInfinite from "swr/infinite";

import { AddPageForm } from "@/app/[userName]/AddPageForm";
import { Header } from "@/app/[userName]/Header";
import { PageList } from "@/app/[userName]/PageList";
import { type ApiUserPageResponse } from "@/app/api/users/[userName]/pages/route";
import { Tabs } from "@/components/park-ui";
import { Button } from "@/components/park-ui/button";
import { Toast } from "@/components/park-ui/toast";
import { HStack, VStack } from "@styled-system/jsx";
import { LoggedInUser } from "@/lib/types";

type Page = ApiUserPageResponse[number];

const perPage = 20;

const fetcher: (url: string) => Promise<ApiUserPageResponse> = (url: string) =>
  fetch(url).then((r) => r.json());

const toaster = Toast.createToaster({
  placement: "bottom",
  overlap: true,
  gap: 16,
});

export const Content = ({
  userName,
  userIcon,
  isMyPage,
  loggedInUser,
  isPrivate,
}: {
  userName: string;
  userIcon: string | null;
  loggedInUser: LoggedInUser | null;
  isMyPage: boolean;
  isPrivate: boolean;
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

  const refresh = useCallback(async () => {
    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        await Promise.all([unreadData.mutate(), readData.mutate()]);
      });
    } else {
      await Promise.all([unreadData.mutate(), readData.mutate()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unreadData.mutate, readData.mutate]);

  const searchParams = useSearchParams();
  const currentTab = searchParams.get("read") === "1" ? "read" : "unread";

  return (
    <VStack gap="6">
      <Header
        userName={userName}
        userIcon={userIcon}
        isMyPage={isMyPage}
        loggedInUser={loggedInUser}
        isPrivate={isPrivate}
        toaster={toaster}
      />
      {isMyPage ? <AddPageForm refresh={refresh} toaster={toaster} /> : null}
      <Tabs.Root value={currentTab}>
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
            toaster={toaster}
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
            toaster={toaster}
          />
        </Tabs.Content>
      </Tabs.Root>
      <Toast.Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root
            key={toast.id}
            bgColor={
              toast.type === "error"
                ? "red"
                : toast.type === "success"
                  ? "green"
                  : undefined
            }
            color="white"
          >
            <HStack alignItems="center">
              {toast.type === "error" ? <CircleXIcon /> : null}
              {toast.type === "success" ? <CircleCheckIcon /> : null}
              <Toast.Title color="white">{toast.title}</Toast.Title>
            </HStack>
            <Toast.CloseTrigger asChild>
              <Button size="sm" variant="link">
                <XIcon />
              </Button>
            </Toast.CloseTrigger>
          </Toast.Root>
        )}
      </Toast.Toaster>
    </VStack>
  );
};
