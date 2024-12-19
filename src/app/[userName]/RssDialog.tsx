import { CheckIcon, CopyIcon, XIcon } from "lucide-react";
import { useContext } from "react";

import { Button } from "@/components/park-ui/button";
import { Dialog } from "@/components/park-ui/dialog";
import { Stack, VStack } from "@styled-system/jsx";
import { Clipboard } from "@/components/park-ui/clipboard";
import { Input } from "@/components/park-ui/styled/clipboard";
import { FormLabel } from "@/components/park-ui/form-label";
import { i18n } from "@/lib/i18n/strings";
import { LocaleContext } from "@/lib/i18n/LocaleProvider";

export const RssDialog = ({ children }: { children: JSX.Element }) => {
  const url =
    typeof location === "object"
      ? new URL(`${location.pathname.replace(/\/$/, "")}/rss`, location.href)
          .href
      : "";
  const { locale } = useContext(LocaleContext);
  return (
    <Dialog.Root lazyMount={true}>
      <Dialog.Trigger cursor="pointer" asChild>
        {children}
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxHeight="90vh" overflowY="scroll">
          <Stack p="6">
            <Stack gap="1">
              <Dialog.Title>RSS</Dialog.Title>
              <Dialog.Description>
                {i18n("You can subscribe to the list as RSS feed.", locale)}
              </Dialog.Description>
            </Stack>
            <VStack alignItems="stretch">
              <Clipboard.Root value={url}>
                <Clipboard.Label asChild>
                  <FormLabel>{i18n("Unread", locale)}</FormLabel>
                </Clipboard.Label>
                <Clipboard.Control>
                  <Clipboard.Input asChild>
                    <Input
                      fontSize="xs"
                      width="100%"
                      bgColor="black.a10"
                      color="white"
                      paddingInline="2"
                      borderRadius="sm"
                    />
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
                  <FormLabel>{i18n("Read", locale)}</FormLabel>
                </Clipboard.Label>
                <Clipboard.Control>
                  <Clipboard.Input asChild>
                    <Input
                      fontSize="xs"
                      width="100%"
                      bgColor="black.a10"
                      color="white"
                      paddingInline="2"
                      borderRadius="sm"
                    />
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
