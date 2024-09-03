import { useActionState, useEffect } from "react";
import { CheckIcon } from "lucide-react";

import { Button } from "@/components/park-ui/button";
import { HStack, VStack, Box } from "@styled-system/jsx";
import { Text } from "@/components/park-ui";
import { ApiUserPageResponse } from "@/app/api/users/[userName]/pages/route";
import { requestReadPage } from "@/app/[userName]/ReadPageFormAction";

export const PageListItem = ({
  page,
  isRead,
  refresh,
}: {
  page: ApiUserPageResponse[number];
  isRead: boolean;
  refresh: () => Promise<void>;
}) => {
  const [{ state }, action, isPending] = useActionState(requestReadPage, {
    state: "idle",
    timestamp: Date.now(),
  } as const);

  useEffect(() => {
    if (state === "success") {
      refresh();
    }
  }, [state, refresh]);

  return (
    <HStack key={page.id} alignItems="flex-start">
      <Box
        width="64px"
        height="64px"
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
        <Text size="xs" textOverflow="ellipsis" lineClamp={1} color="fg.subtle">
          {page.description}
        </Text>
      </VStack>
      <form action={action}>
        <input type="hidden" name="pageId" value={page.id} />
        <input type="hidden" name="read" value={isRead ? "0" : "1"} />
        {state === "success" ? (
          <Button
            size="xs"
            variant="subtle"
            loading={isPending}
            disabled={true}
          >
            <CheckIcon color="green" />
            Done
          </Button>
        ) : (
          <Button type="submit" size="xs" variant="subtle" loading={isPending}>
            {isRead ? "Mark as unread" : "Mark as read"}
          </Button>
        )}
      </form>
    </HStack>
  );
};
