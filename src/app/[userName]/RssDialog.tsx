import { Button } from "@/components/park-ui/button";
import { Dialog } from "@/components/park-ui/dialog";
import { Stack, VStack } from "@styled-system/jsx";
import { CheckIcon, CopyIcon, XIcon } from "lucide-react";
import { Clipboard } from "@/components/park-ui/clipboard";
import { Input } from "@/components/park-ui/styled/clipboard";
import { FormLabel } from "@/components/park-ui/form-label";

export const RssDialog = ({ children }: { children: JSX.Element }) => {
  const url =
    typeof location === "object"
      ? new URL(`${location.pathname.replace(/\/$/, "")}/rss`, location.href)
          .href
      : "";
  return (
    <Dialog.Root lazyMount={true}>
      <Dialog.Trigger cursor="pointer" asChild>
        {children}
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Stack p="6">
            <Stack gap="1">
              <Dialog.Title>RSS</Dialog.Title>
              <Dialog.Description>
                You can subscribe to this page with RSS.
              </Dialog.Description>
            </Stack>
            <VStack alignItems="stretch">
              <Clipboard.Root value={url}>
                <Clipboard.Label asChild>
                  <FormLabel>Unread</FormLabel>
                </Clipboard.Label>
                <Clipboard.Control>
                  <Clipboard.Input asChild>
                    <Input fontSize="xs" width="100%" />
                  </Clipboard.Input>
                  <Clipboard.Trigger asChild>
                    <Button variant="subtle" size="sm">
                      <Clipboard.Indicator copied={<CheckIcon />}>
                        <CopyIcon />
                      </Clipboard.Indicator>
                    </Button>
                  </Clipboard.Trigger>
                </Clipboard.Control>
              </Clipboard.Root>

              <Clipboard.Root value={`${url}?read=1`}>
                <Clipboard.Label asChild>
                  <FormLabel>Read</FormLabel>
                </Clipboard.Label>
                <Clipboard.Control>
                  <Clipboard.Input asChild>
                    <Input fontSize="xs" width="100%" />
                  </Clipboard.Input>
                  <Clipboard.Trigger asChild>
                    <Button variant="subtle" size="sm">
                      <Clipboard.Indicator copied={<CheckIcon />}>
                        <CopyIcon />
                      </Clipboard.Indicator>
                    </Button>
                  </Clipboard.Trigger>
                </Clipboard.Control>
              </Clipboard.Root>
            </VStack>
          </Stack>
          <Dialog.CloseTrigger asChild position="absolute" top="2" right="2">
            <Button aria-label="Close Dialog" variant="ghost" size="sm">
              <XIcon />
            </Button>
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
