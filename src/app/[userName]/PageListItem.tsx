import { useActionState, useContext, useEffect } from "react";
import { CheckIcon, PlusIcon, UndoIcon, XIcon } from "lucide-react";
import { CreateToasterReturn } from "@ark-ui/react";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { Button } from "@/components/park-ui/button";
import { HStack, VStack, Box } from "@styled-system/jsx";
import { Text } from "@/components/park-ui";
import { type ApiUserPageResponse } from "@/app/api/users/[userName]/pages/fetchPages";
import { requestReadPage } from "@/app/[userName]/ReadPageFormAction";
import { requestDeletePage } from "@/app/[userName]/DeletePageFormAction";
import { requestAddToMyUnread } from "@/app/[userName]/AddToMyUnreadFormAction";
import { LocaleContext } from "@/lib/i18n/LocaleProvider";
import { i18n } from "@/lib/i18n/strings";

export const PageListItem = ({
  page,
  isRead,
  isMyPage,
  refresh,
  toaster,
}: {
  page: ApiUserPageResponse["pages"][number];
  isRead: boolean;
  isMyPage: boolean;
  refresh: () => Promise<void>;
  toaster: CreateToasterReturn;
}) => {
  const session = useSession();
  const isLoggedin = session.status === "authenticated";

  const { locale } = useContext(LocaleContext);

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
        title: isRead
          ? i18n("Marked as unread", locale)
          : i18n("Marked as read", locale),
        type: "success",
      });
    }
  }, [readState, refresh, readTimestamp, toaster, isRead, locale]);

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
        title: i18n("Added to your unread", locale),
        type: "success",
      });
    }
  }, [addToMyUnreadState, toaster, addToMyUnreadTimestamp, locale]);

  return (
    <a key={page.id} href={page.url}>
      <HStack
        alignItems="flex-start"
        paddingBlock="2"
        paddingInline={{ smDown: "4", base: "0" }}
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
            lineClamp={{ smDown: 2, base: 1 }}
            textWrap="pretty"
            wordBreak="break-all"
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
            wordBreak="break-all"
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
                  {isRead
                    ? i18n("Mark as unread", locale)
                    : i18n("Mark as read", locale)}
                </Box>
              </Button>
            </form>
            <form
              action={deleteAction}
              onSubmit={(e) => {
                if (
                  !confirm(
                    `${i18n("Are you sure to delete this page?", locale)}\n"${page.title}"`
                  )
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
                {i18n("Add to your unread", locale)}
              </Box>
              <Box display={{ base: "none", smDown: "inline" }}>
                {i18n("Add", locale)}
              </Box>
            </Button>
          </form>
        ) : null}
      </HStack>
    </a>
  );
};
