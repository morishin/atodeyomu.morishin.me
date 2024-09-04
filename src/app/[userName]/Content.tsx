"use client";

import useSWRInfinite from "swr/infinite";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleCheckIcon,
  CircleEllipsisIcon,
  CircleXIcon,
  EllipsisIcon,
  GlobeIcon,
  LockIcon,
  RssIcon,
  XIcon,
} from "lucide-react";
import { useActionState, useCallback, useEffect, useState } from "react";

import { PageList } from "@/app/[userName]/PageList";
import { Tabs, Text } from "@/components/park-ui";
import { HStack, Stack, VStack } from "@styled-system/jsx";
import { AddPageForm } from "@/app/[userName]/AddPageForm";
import { type ApiUserPageResponse } from "@/app/api/users/[userName]/pages/route";
import { Avatar } from "@/components/park-ui/avatar";
import { Badge } from "@/components/park-ui/badge";
import { Dialog } from "@/components/park-ui/dialog";
import { Button } from "@/components/park-ui/button";
import { requestChangeVisibility } from "@/app/[userName]/ChangeVisibilityFormAction";
import { Toast } from "@/components/park-ui/toast";
import { ChangeVisibilityDialog } from "@/app/[userName]/ChangeVisibilityDialog";
import { RssDialog } from "@/app/[userName]/RssDialog";

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
  isPrivate,
  initialTab,
}: {
  userName: string;
  userIcon: string | null;
  isMyPage: boolean;
  isPrivate: boolean;
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

  const refresh = useCallback(async () => {
    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        await Promise.all([unreadData.mutate(), readData.mutate()]);
      });
    } else {
      await Promise.all([unreadData.mutate(), readData.mutate()]);
    }
  }, [unreadData.mutate, readData.mutate]);

  const [dialogType, setDialogType] = useState<
    "changeVisibility" | "rss" | null
  >(null);

  const visibilityBadge = isPrivate ? (
    <Badge size="sm" variant="solid">
      <LockIcon />
      Private
    </Badge>
  ) : (
    <Badge size="sm" variant="outline">
      <GlobeIcon />
      Public
    </Badge>
  );

  const [
    { state: changeVisibilityState },
    changeVisibilityAction,
    isChangeVisibilityPending,
  ] = useActionState(requestChangeVisibility, {
    state: "idle",
    timestamp: Date.now(),
  } as const);

  useEffect(() => {
    if (changeVisibilityState === "success") {
      location.reload();
    }
  }, [changeVisibilityState]);

  return (
    <VStack w="2xl" maxW="100vw" gap="6">
      <HStack
        alignSelf="stretch"
        justifyContent="space-between"
        padding={{ smDown: "2", base: "0" }}
      >
        <HStack alignItems="center">
          <HStack alignItems="center">
            <Avatar src={userIcon ?? undefined} name={userName} />
            <Text fontSize="xl">{userName}</Text>
          </HStack>
          <HStack alignItems="center" gap="1">
            {isMyPage ? (
              <ChangeVisibilityDialog
                changeVisibilityAction={changeVisibilityAction}
                isPrivate={isPrivate}
                isChangeVisibilityPending={isChangeVisibilityPending}
              >
                {visibilityBadge}
              </ChangeVisibilityDialog>
            ) : (
              visibilityBadge
            )}
            {!isPrivate ? (
              <RssDialog>
                <Button size="xs" variant="ghost">
                  <RssIcon />
                </Button>
              </RssDialog>
            ) : null}
          </HStack>
        </HStack>
        <Button size="md" variant="ghost">
          <EllipsisIcon />
        </Button>
      </HStack>
      {isMyPage ? <AddPageForm refresh={refresh} toaster={toaster} /> : null}
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
