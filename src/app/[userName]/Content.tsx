"use client";

import {
  CheckCheckIcon,
  CircleCheckIcon,
  CircleXIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useActionState, useCallback, useEffect } from "react";
import useSWRInfinite from "swr/infinite";

import { AddPageForm } from "@/app/[userName]/AddPageForm";
import { Header } from "@/app/[userName]/Header";
import { PageList } from "@/app/[userName]/PageList";
import { type ApiUserPageResponse } from "@/app/api/users/[userName]/pages/fetchPages";
import { Tabs } from "@/components/park-ui";
import { Button } from "@/components/park-ui/button";
import { Toast } from "@/components/park-ui/toast";
import { Box, HStack, VStack } from "@styled-system/jsx";
import { LoggedInUser } from "@/lib/types";
import { apiUserPageDefaultPerPage } from "@/app/api/users/[userName]/pages/apiUserPageDefaultPerPage";
import { requestMarkAllAsRead } from "@/app/[userName]/MarkAllAsReadFormAction";
import { Badge } from "@/components/park-ui/badge";
import { Text } from "@/components/park-ui";

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
  initialPageData,
}: {
  userName: string;
  userIcon: string | null;
  loggedInUser: LoggedInUser | null;
  isMyPage: boolean;
  isPrivate: boolean;
  initialPageData: {
    unread: ApiUserPageResponse;
    read: ApiUserPageResponse;
  };
}) => {
  const getKeyUnread = (
    pageIndex: number,
    previousPageData: ApiUserPageResponse
  ) => {
    if (previousPageData && !previousPageData.pages.length) return null;
    return `/api/users/${userName}/pages?perPage=${apiUserPageDefaultPerPage}&page=${pageIndex + 1}`;
  };
  const unreadData = useSWRInfinite(getKeyUnread, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateFirstPage: false,
    fallbackData: [initialPageData.unread],
  });

  const getKeyRead = (
    pageIndex: number,
    previousPageData: ApiUserPageResponse
  ) => {
    if (previousPageData && !previousPageData.pages.length) return null;
    return `/api/users/${userName}/pages?perPage=${apiUserPageDefaultPerPage}&page=${pageIndex + 1}&read=1`;
  };
  const readData = useSWRInfinite(getKeyRead, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateFirstPage: false,
    fallbackData: [initialPageData.read],
  });

  const showLoadMoreUnread =
    (unreadData.data?.[unreadData.data.length - 1]?.pages.length ?? 0) ===
    apiUserPageDefaultPerPage;
  const showLoadMoreRead =
    (readData.data?.[readData.data.length - 1]?.pages.length ?? 0) ===
    apiUserPageDefaultPerPage;

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

  const newPageAdded = searchParams.get("newPageAdded") === "1";
  useEffect(() => {
    if (newPageAdded) {
      toaster.create({
        title: "Added to unread",
        type: "success",
      });
    }
  }, [newPageAdded]);

  const [
    { state: markAllAsReadState, timestamp: markAllAsReadTimestamp },
    markAllAsReadAction,
    isMarkAllAsReadPending,
  ] = useActionState(requestMarkAllAsRead, {
    state: "idle",
    timestamp: Date.now(),
  } as const);
  useEffect(() => {
    if (markAllAsReadState === "success") {
      refresh();
      toaster.create({
        title: "Marked all as read",
        type: "success",
      });
    }
  }, [markAllAsReadState, refresh, markAllAsReadTimestamp]);

  return (
    <VStack gap={{ base: "6", smDown: "4" }}>
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
        <HStack>
          <Tabs.List flex="1">
            <Link href={pathname}>
              <Tabs.Trigger key={"unread"} value={"unread"}>
                <Text fontSize={{ base: "md", smDown: "sm" }}>Unread</Text>
                <Badge size="sm" variant="subtle">
                  {unreadData.data?.[0]?.totalCount ?? 0}
                </Badge>
              </Tabs.Trigger>
            </Link>
            <Link href="?read=1">
              <Tabs.Trigger key={"read"} value={"read"}>
                <Text fontSize={{ base: "md", smDown: "sm" }}>Read</Text>
                <Badge size="sm" variant="subtle">
                  {readData.data?.[0]?.totalCount ?? 0}
                </Badge>
              </Tabs.Trigger>
            </Link>
            <Tabs.Indicator />
            <Box
              display={
                unreadData.data?.[0]?.pages.length !== 0 &&
                currentTab === "unread"
                  ? "block"
                  : "none"
              }
              marginRight={{ smDown: "4" }}
              marginLeft="auto"
            >
              <form
                action={markAllAsReadAction}
                onSubmit={(e) => {
                  if (!confirm("Are you sure you want to mark all as read?")) {
                    e.preventDefault();
                  }
                }}
              >
                <Button
                  type="submit"
                  size="xs"
                  variant="subtle"
                  loading={isMarkAllAsReadPending}
                >
                  <CheckCheckIcon color="green" />
                  Mark all as read
                </Button>
              </form>
            </Box>
          </Tabs.List>
        </HStack>
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
            emptyMessage={
              readData.data?.[0]?.pages.length === 0
                ? "No pages have been added yet."
                : "All done!"
            }
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
            emptyMessage="No pages have been done yet."
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
