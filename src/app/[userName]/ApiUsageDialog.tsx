import { CheckIcon, CopyIcon, RefreshCcwIcon, XIcon } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/park-ui/button";
import { Dialog } from "@/components/park-ui/dialog";
import { Stack, VStack } from "@styled-system/jsx";
import { Clipboard } from "@/components/park-ui/clipboard";
import { Input } from "@/components/park-ui/styled/clipboard";
import { FormLabel } from "@/components/park-ui/form-label";
import { Textarea } from "@/components/park-ui/textarea";
import { requestAccessTokenRotate } from "@/app/[userName]/AccessTokenRotateFormAction";
import { LoggedInUser } from "@/lib/types";

export const ApiUsageDialog = ({
  open,
  loggedInUser,
  onClose,
}: {
  open: boolean;
  loggedInUser: LoggedInUser;
  onClose: () => void;
}) => {
  const [{ personalAccessToken }, action, isPending] = useActionState(
    requestAccessTokenRotate,
    {
      state: "idle",
      timestamp: Date.now(),
      personalAccessToken: loggedInUser.personalAccessToken,
    } as const
  );

  const url =
    typeof location === "object"
      ? new URL(`/api/users/${loggedInUser.name}/pages`, location.href).href
      : "";

  const exampleCode = `curl -X POST ${url} \
-H "Content-Type: application/json" \
-H "Authorization: Bearer ${personalAccessToken}" \
-d '{"url": "https://example.com" }'`;

  return (
    <Dialog.Root
      lazyMount={true}
      open={open}
      onOpenChange={(details) => {
        if (!details.open) {
          onClose();
        }
      }}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content width="2xl">
          <Stack p="6">
            <Stack gap="1">
              <Dialog.Title>API Usage</Dialog.Title>
            </Stack>
            <VStack alignItems="stretch">
              <Clipboard.Root value={personalAccessToken}>
                <Clipboard.Label asChild>
                  <FormLabel>Access Token</FormLabel>
                </Clipboard.Label>
                <Clipboard.Control>
                  <Clipboard.Input asChild>
                    <Input
                      fontSize="xs"
                      width="100%"
                      bgColor="black.a10"
                      _selection={{ bgColor: "gray.10" }}
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
                  <form
                    action={action}
                    onSubmit={(e) => {
                      if (
                        !confirm(
                          "Are you sure you want to rotate the access token? This will invalidate the current access token."
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      colorPalette="red"
                      type="submit"
                      loading={isPending}
                      aria-label="Rotate Access Token"
                    >
                      <RefreshCcwIcon />
                    </Button>
                  </form>
                </Clipboard.Control>
              </Clipboard.Root>

              <Clipboard.Root value={exampleCode}>
                <Clipboard.Label asChild>
                  <FormLabel>Example</FormLabel>
                </Clipboard.Label>
                <Clipboard.Control>
                  <Clipboard.Input asChild>
                    <Textarea
                      readOnly={true}
                      fontSize="xs"
                      width="100%"
                      bgColor="black.a10"
                      color="white"
                      _selection={{ bgColor: "gray.10" }}
                      paddingInline="2"
                      borderRadius="sm"
                      height="7em"
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
