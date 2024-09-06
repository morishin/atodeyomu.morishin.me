import { RssIcon, EllipsisIcon, GlobeIcon, LockIcon } from "lucide-react";
import { useActionState, useEffect } from "react";

import { ChangeVisibilityDialog } from "@/app/[userName]/ChangeVisibilityDialog";
import { requestChangeVisibility } from "@/app/[userName]/ChangeVisibilityFormAction";
import { RssDialog } from "@/app/[userName]/RssDialog";
import { Button } from "@/components/park-ui/button";
import { Avatar } from "@/components/park-ui/avatar";
import { HStack } from "@styled-system/jsx";
import { Text } from "@/components/park-ui";
import { Badge } from "@/components/park-ui/badge";

export const Header = ({
  userName,
  userIcon,
  isMyPage,
  isPrivate,
}: {
  userName: string;
  userIcon: string | null;
  isMyPage: boolean;
  isPrivate: boolean;
}) => {
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

  return (
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
  );
};
