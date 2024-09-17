import {
  RssIcon,
  EllipsisIcon,
  SettingsIcon,
  LogOutIcon,
  ChevronsLeftRightEllipsisIcon,
  LogInIcon,
  HomeIcon,
} from "lucide-react";
import { useActionState, useCallback, useEffect, useState } from "react";
import { CreateToasterReturn } from "@ark-ui/react";
import Link from "next/link";

import { ChangeVisibilityDialog } from "@/app/[userName]/ChangeVisibilityDialog";
import { requestChangeVisibility } from "@/app/[userName]/ChangeVisibilityFormAction";
import { RssDialog } from "@/app/[userName]/RssDialog";
import { Button } from "@/components/park-ui/button";
import { Avatar } from "@/components/park-ui/avatar";
import { HStack } from "@styled-system/jsx";
import { Text } from "@/components/park-ui";
import { Menu } from "@/components/park-ui/menu";
import { ApiUsageDialog } from "@/app/[userName]/ApiUsageDialog";
import { LoggedInUser } from "@/lib/types";
import { ProfileSettingsDialog } from "@/app/[userName]/ProfileSettingsDialog";

export const Header = ({
  userName,
  userIcon,
  isMyPage,
  loggedInUser,
  isPrivate,
  toaster,
}: {
  userName: string;
  userIcon: string | null;
  isMyPage: boolean;
  loggedInUser: LoggedInUser | null;
  isPrivate: boolean;
  toaster: CreateToasterReturn;
}) => {
  const [
    { state: changeVisibilityState },
    changeVisibilityAction,
    isChangeVisibilityPending,
  ] = useActionState(requestChangeVisibility, {
    state: "idle",
    timestamp: Date.now(),
  } as const);

  const [isOpenApiUsageDialog, setIsOpenApiUsageDialog] = useState(false);
  const [isOpenProfileSettingsDialog, setIsOpenProfileSettingsDialog] =
    useState(false);

  useEffect(() => {
    if (changeVisibilityState === "success") {
      location.reload();
    }
  }, [changeVisibilityState]);

  const openProfileSettingsDialog = useCallback(() => {
    setIsOpenProfileSettingsDialog(true);
  }, []);

  const openApiUsageDialog = useCallback(() => {
    setIsOpenApiUsageDialog(true);
  }, []);

  const closeProfileSettingsDialog = useCallback(() => {
    setIsOpenProfileSettingsDialog(false);
  }, []);

  const closeApiUsageDialog = useCallback(() => {
    setIsOpenApiUsageDialog(false);
  }, []);

  return (
    <HStack
      alignSelf="stretch"
      justifyContent="space-between"
      padding={{ smDown: "2", base: "0" }}
    >
      <HStack alignItems="center">
        <Link href={`/${userName}`}>
          <HStack alignItems="center">
            <Avatar src={userIcon ?? undefined} name={userName} />
            <Text fontSize="xl">{userName}</Text>
          </HStack>
        </Link>
        <HStack alignItems="center" gap="1">
          {isMyPage ? (
            <ChangeVisibilityDialog
              changeVisibilityAction={changeVisibilityAction}
              isPrivate={isPrivate}
              isChangeVisibilityPending={isChangeVisibilityPending}
            />
          ) : null}
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
              {loggedInUser ? (
                <>
                  {!isMyPage ? (
                    <Link href="/">
                      <Menu.Item value="home">
                        <HStack gap="2">
                          <Avatar
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            size="dummy"
                            height="20px"
                            width="20px"
                            src={loggedInUser?.image ?? undefined}
                            name={loggedInUser?.name}
                          />{" "}
                          Home
                        </HStack>
                      </Menu.Item>
                    </Link>
                  ) : null}
                  <Menu.Item
                    value="profile"
                    onClick={openProfileSettingsDialog}
                  >
                    <HStack gap="2">
                      <SettingsIcon /> Edit Profile
                    </HStack>
                  </Menu.Item>
                  <Menu.Item value="api" onClick={openApiUsageDialog}>
                    <HStack gap="2">
                      <ChevronsLeftRightEllipsisIcon /> API Usage
                    </HStack>
                  </Menu.Item>
                  <Menu.Separator />
                  <Link href="/api/auth/signout">
                    <Menu.Item value="logout">
                      <HStack gap="2">
                        <LogOutIcon />
                        Logout
                      </HStack>
                    </Menu.Item>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/">
                    <Menu.Item value="home">
                      <HStack gap="2">
                        <HomeIcon />
                        Home
                      </HStack>
                    </Menu.Item>
                  </Link>
                  <Link href="/api/auth/signin">
                    <Menu.Item value="login">
                      <HStack gap="2">
                        <LogInIcon />
                        Login
                      </HStack>
                    </Menu.Item>
                  </Link>
                </>
              )}
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
      {loggedInUser && (
        <>
          <ApiUsageDialog
            open={isOpenApiUsageDialog}
            loggedInUser={loggedInUser}
            onClose={closeApiUsageDialog}
          />
          <ProfileSettingsDialog
            open={isOpenProfileSettingsDialog}
            loggedInUser={loggedInUser}
            onClose={closeProfileSettingsDialog}
            toaster={toaster}
          />
        </>
      )}
    </HStack>
  );
};
