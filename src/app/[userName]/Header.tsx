import {
  RssIcon,
  EllipsisIcon,
  GlobeIcon,
  LockIcon,
  SettingsIcon,
  LogOutIcon,
  ChevronsLeftRightEllipsisIcon,
} from "lucide-react";
import { useActionState, useEffect } from "react";

import { ChangeVisibilityDialog } from "@/app/[userName]/ChangeVisibilityDialog";
import { requestChangeVisibility } from "@/app/[userName]/ChangeVisibilityFormAction";
import { RssDialog } from "@/app/[userName]/RssDialog";
import { Button } from "@/components/park-ui/button";
import { Avatar } from "@/components/park-ui/avatar";
import { HStack } from "@styled-system/jsx";
import { Text } from "@/components/park-ui";
import { Badge } from "@/components/park-ui/badge";
import { Menu } from "@/components/park-ui/menu";

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
      <Menu.Root>
        <Menu.Trigger asChild>
          <Button size="md" variant="ghost">
            <EllipsisIcon />
          </Button>
        </Menu.Trigger>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.ItemGroup>
              <Menu.Item value="settings">
                <HStack gap="2">
                  <SettingsIcon /> Settings
                </HStack>
              </Menu.Item>
              <Menu.Item value="api">
                <HStack gap="2">
                  <ChevronsLeftRightEllipsisIcon /> API
                </HStack>
              </Menu.Item>
              <Menu.Separator />
              <a href="/api/auth/signout">
                <Menu.Item value="logout">
                  <HStack gap="2">
                    <LogOutIcon />
                    Logout
                  </HStack>
                </Menu.Item>
              </a>
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </HStack>
  );
};
