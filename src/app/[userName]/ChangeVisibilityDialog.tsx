import { Button } from "@/components/park-ui/button";
import { Dialog } from "@/components/park-ui/dialog";
import { Stack } from "@styled-system/jsx";
import { XIcon } from "lucide-react";

export const ChangeVisibilityDialog = ({
  children,
  changeVisibilityAction,
  isPrivate,
  isChangeVisibilityPending,
}: {
  children: JSX.Element;
  changeVisibilityAction: (payload: FormData) => void;
  isPrivate: boolean;
  isChangeVisibilityPending: boolean;
}) => {
  return (
    <Dialog.Root lazyMount={true}>
      <Dialog.Trigger cursor="pointer" asChild>
        {children}
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
