import { useActionState, useEffect } from "react";
import { CheckIcon, UndoIcon, XIcon } from "lucide-react";

import { Button } from "@/components/park-ui/button";
import { HStack, VStack, Box } from "@styled-system/jsx";
import { Text } from "@/components/park-ui";
import { ApiUserPageResponse } from "@/app/api/users/[userName]/pages/route";
import { requestReadPage } from "@/app/[userName]/ReadPageFormAction";
import { requestDeletePage } from "@/app/[userName]/DeletePageFormAction";

export const PageListItem = ({
  page,
  isRead,
  isMyPage,
  refresh,
}: {
  page: ApiUserPageResponse[number];
  isRead: boolean;
  isMyPage: boolean;
  refresh: () => Promise<void>;
}) => {
  const [{ state: readState }, readAction, isReadPending] = useActionState(
    requestReadPage,
    {
      state: "idle",
      timestamp: Date.now(),
    } as const
  );

  const [{ state: deleteState }, deleteAction, isDeletePending] =
    useActionState(requestDeletePage, {
      state: "idle",
      timestamp: Date.now(),
    } as const);

  useEffect(() => {
    if (readState === "success") {
      refresh();
    }
  }, [readState, refresh]);

  useEffect(() => {
    if (deleteState === "success") {
      refresh();
    }
  }, [deleteState, refresh]);

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
            // eslint-disable-next-line @next/next/no-img-element
            <img
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
        ) : null}
        {isMyPage ? (
          <form
            action={deleteAction}
            onSubmit={(e) => {
              if (!confirm("Are you sure?")) {
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
        ) : null}
      </HStack>
    </a>
  );
};
