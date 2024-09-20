import { useActionState, useEffect } from "react";
import { CheckIcon, PlusIcon, UndoIcon, XIcon } from "lucide-react";
import { CreateToasterReturn } from "@ark-ui/react";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { Button } from "@/components/park-ui/button";
import { HStack, VStack, Box } from "@styled-system/jsx";
import { Text } from "@/components/park-ui";
import { type ApiUserPageResponse } from "@/app/api/users/[userName]/pages/route";
import { requestReadPage } from "@/app/[userName]/ReadPageFormAction";
import { requestDeletePage } from "@/app/[userName]/DeletePageFormAction";
import { requestAddToMyUnread } from "@/app/[userName]/AddToMyUnreadFormAction";

export const PageListItem = ({
  page,
  isRead,
  isMyPage,
  refresh,
  toaster,
}: {
  page: ApiUserPageResponse[number];
  isRead: boolean;
  isMyPage: boolean;
  refresh: () => Promise<void>;
  toaster: CreateToasterReturn;
}) => {
  const session = useSession();
  const isLoggedin = session.status === "authenticated";

  const [
    { state: readState, timestamp: readTimestamp },
    readAction,
    isReadPending,
  ] = useActionState(requestReadPage, {
    state: "idle",
    timestamp: Date.now(),
  } as const);

  const [{ state: deleteState }, deleteAction, isDeletePending] =
    useActionState(requestDeletePage, {
      state: "idle",
      timestamp: Date.now(),
    } as const);

  useEffect(() => {
    if (readState === "success") {
      refresh();
      toaster.create({
        title: isRead ? "Marked as unread" : "Marked as read",
        type: "success",
      });
    }
  }, [readState, refresh, readTimestamp, toaster, isRead]);

  useEffect(() => {
    if (deleteState === "success") {
      refresh();
    }
  }, [deleteState, refresh]);

  const [
    { state: addToMyUnreadState, timestamp: addToMyUnreadTimestamp },
    addToMyUnreadAction,
    isAddToMyUnreadPending,
  ] = useActionState(requestAddToMyUnread, {
    state: "idle",
    timestamp: Date.now(),
  } as const);

  useEffect(() => {
    if (addToMyUnreadState === "success") {
      toaster.create({
        title: "Added to your unread",
        type: "success",
      });
    }
  }, [addToMyUnreadState, toaster, addToMyUnreadTimestamp]);

  return (
    <a key={page.id} href={page.url}>
      <HStack
        alignItems="flex-start"
        padding="2"
        cursor="pointer"
        borderRadius="lg"
        _hover={{ bgColor: "gray.3" }}
      >
        <Box
          minWidth="48px"
          width={{ smDown: "48px", base: "64px" }}
          height={{ smDown: "48px", base: "64px" }}
          bg="gray"
          borderRadius="4px"
          borderWidth="thin"
          borderColor="lightgray"
          overflow="hidden"
        >
          {page.image ? (
            <Image
              alt=""
              src={page.image}
              width="64"
              height="64"
              style={{
                objectFit: "cover",
                backgroundColor: "white",
                width: "100%",
                height: "100%",
              }}
            />
          ) : null}
        </Box>
        <VStack flex="1" alignItems="flex-start" gap="0">
          <Text
            as="h3"
            fontWeight="semibold"
            textOverflow="ellipsis"
            lineClamp={1}
          >
            {page.title}
          </Text>
          <Text size="xs" textOverflow="ellipsis" lineClamp={1}>
            {new URL(page.url).hostname}
          </Text>
          <Text
            size="xs"
            textOverflow="ellipsis"
            lineClamp={1}
            color="fg.subtle"
          >
            {page.description}
          </Text>
        </VStack>
        {isMyPage ? (
          <>
            <form action={readAction}>
              <input type="hidden" name="pageId" value={page.id} />
              <input type="hidden" name="read" value={isRead ? "0" : "1"} />
              <Button
                type="submit"
                size="xs"
                variant="subtle"
                loading={isReadPending}
              >
                {isRead ? <UndoIcon /> : <CheckIcon color="green" />}
                <Box display={{ smDown: "none" }}>
                  {isRead ? "Mark as unread" : "Mark as read"}
                </Box>
              </Button>
            </form>
            <form
              action={deleteAction}
              onSubmit={(e) => {
                if (
                  !confirm(`Are you sure to delete this page?\n"${page.title}"`)
                ) {
                  e.preventDefault();
                }
              }}
            >
              <input type="hidden" name="pageId" value={page.id} />
              <Button
                type="submit"
                size="xs"
                variant="ghost"
                loading={isDeletePending}
              >
                <XIcon />
              </Button>
            </form>
          </>
        ) : isLoggedin ? (
          <form action={addToMyUnreadAction}>
            <input type="hidden" name="pageId" value={page.id} />
            <Button
              type="submit"
              size="xs"
              variant="subtle"
              loading={isAddToMyUnreadPending}
            >
              <PlusIcon />
              <Box display={{ base: "inline", smDown: "none" }}>
                Add to my unread
              </Box>
              <Box display={{ base: "none", smDown: "inline" }}>Add</Box>
            </Button>
          </form>
        ) : null}
      </HStack>
    </a>
  );
};
