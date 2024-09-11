import { GlobeIcon, LockIcon, XIcon } from "lucide-react";

import { Button } from "@/components/park-ui/button";
import { Dialog } from "@/components/park-ui/dialog";
import { Stack } from "@styled-system/jsx";
import { Badge } from "@/components/park-ui/badge";

export const ChangeVisibilityDialog = ({
  changeVisibilityAction,
  isPrivate,
  isChangeVisibilityPending,
}: {
  changeVisibilityAction: (payload: FormData) => void;
  isPrivate: boolean;
  isChangeVisibilityPending: boolean;
}) => {
  return (
    <Dialog.Root lazyMount={true}>
      <Dialog.Trigger cursor="pointer" asChild>
        {isPrivate ? (
          <Badge size="sm" variant="solid">
            <LockIcon />
            Private
          </Badge>
        ) : (
          <Badge size="sm" variant="outline">
            <GlobeIcon />
            Public
          </Badge>
        )}
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <form action={changeVisibilityAction}>
            <input type="hidden" name="private" value={isPrivate ? "0" : "1"} />
            <Stack gap="8" p="6">
              <Stack gap="1">
                <Dialog.Title>Change visibility</Dialog.Title>
                <Dialog.Description>
                  {`This page is currently ${isPrivate ? "private" : "public"}.`}
                </Dialog.Description>
              </Stack>
              <Stack gap="3" direction="row" width="full">
                <Dialog.CloseTrigger asChild>
                  <Button variant="outline" width="full">
                    Cancel
                  </Button>
                </Dialog.CloseTrigger>
                <Button
                  width="full"
                  loading={isChangeVisibilityPending}
                >{`Make ${isPrivate ? "public" : "private"}`}</Button>
              </Stack>
            </Stack>
            <Dialog.CloseTrigger asChild position="absolute" top="2" right="2">
              <Button aria-label="Close Dialog" variant="ghost" size="sm">
                <XIcon />
              </Button>
            </Dialog.CloseTrigger>
          </form>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
