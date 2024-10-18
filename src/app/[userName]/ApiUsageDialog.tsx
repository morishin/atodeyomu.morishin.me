import { CheckIcon, CopyIcon, RefreshCcwIcon, XIcon } from "lucide-react";
import { useActionState } from "react";
import Image from "next/image";

import { Button } from "@/components/park-ui/button";
import { Dialog } from "@/components/park-ui/dialog";
import { Box, HStack, Stack, VStack } from "@styled-system/jsx";
import { Clipboard } from "@/components/park-ui/clipboard";
import { Input } from "@/components/park-ui/styled/clipboard";
import { FormLabel } from "@/components/park-ui/form-label";
import { Textarea } from "@/components/park-ui/textarea";
import { requestAccessTokenRotate } from "@/app/[userName]/AccessTokenRotateFormAction";
import { LoggedInUser } from "@/lib/types";
import { Text } from "@/components/park-ui";

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
        <Dialog.Content
          width="2xl"
          maxWidth="90vw"
          maxHeight="90vh"
          overflowY="scroll"
        >
          <Stack p="6">
            <Stack gap="1">
              <Dialog.Title>API Usage</Dialog.Title>
              <Dialog.Description>
                You can also add pages to the list via API.
              </Dialog.Description>
            </Stack>
            <VStack alignItems="stretch">
              <Clipboard.Root
                value={personalAccessToken}
                paddingBottom="6"
                borderBottomWidth="1"
                borderBottomColor="gray.8"
              >
                <Clipboard.Label asChild>
                  <FormLabel>Your Access Token</FormLabel>
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
              <Clipboard.Root
                value={exampleCode}
                paddingBottom="6"
                borderBottomWidth="1"
                borderBottomColor="gray.8"
              >
                <Text as="h3" size="md" fontWeight="semibold">
                  Add a page via cURL
                </Text>
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
            <Stack
              gap="1"
              paddingBottom="6"
              borderBottomWidth="1"
              borderBottomColor="gray.8"
            >
              <Text as="h3" size="md" fontWeight="semibold">
                Add a page via iOS share sheet
              </Text>
              <Dialog.Description>
                You can add a page from the share sheet by using iOS Shortcuts.
              </Dialog.Description>
              <ol
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1em",
                  listStyleType: "decimal",
                  listStylePosition: "inside",
                  lineHeight: "2",
                  paddingTop: "0.5em",
                }}
              >
                <li>
                  <Text as="span">Download the shortcut.</Text>
                  <Box marginLeft="5">
                    <a
                      href="https://www.icloud.com/shortcuts/49d2a7898efe4f8b86406fb58a58fa1c"
                      target="_blank"
                    >
                      <Button variant="subtle">
                        <Image
                          src="/shortcut.png"
                          width="32"
                          height="32"
                          alt=""
                        />
                        Download
                      </Button>
                    </a>
                  </Box>
                </li>
                <li>
                  <Text as="span">Setup the shortcut</Text>
                  <Box marginLeft="5">
                    <Image
                      src="/configure_shortcut.png"
                      width="948"
                      height="614"
                      alt=""
                    />
                  </Box>
                </li>
                <li>
                  <Text as="span">
                    Available in the share sheet opened from Safari.
                  </Text>
                  <Box marginLeft="5">
                    <Image
                      src="/share_sheet.png"
                      width="609"
                      height="282"
                      alt=""
                    />
                  </Box>
                </li>
              </ol>
            </Stack>
            <Stack
              gap="1"
              paddingBottom="6"
              borderBottomWidth="1"
              borderBottomColor="gray.8"
            >
              <Text as="h3" size="md" fontWeight="semibold">
                Add a page via Android share menu
              </Text>
              <Dialog.Description>
                You can add a page from the share menu.
              </Dialog.Description>
              <ol
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1em",
                  listStyleType: "decimal",
                  listStylePosition: "inside",
                  lineHeight: "2",
                  paddingTop: "0.5em",
                }}
              >
                <li>
                  <Text as="span">Add to Home screen. (Install it as PWA)</Text>
                  <Image
                    src="/android-share-1.png"
                    width="948"
                    height="614"
                    alt=""
                  />
                </li>
                <li>
                  <Text as="span">
                    Available in the share menu from browser.
                  </Text>
                  <Image
                    src="/android-share-2.png"
                    width="948"
                    height="614"
                    alt=""
                  />
                </li>
              </ol>
            </Stack>
            <Stack gap="1">
              <Text as="h3" size="md" fontWeight="semibold">
                Add a page via <a href="https://www.alfredapp.com/">Alfred</a>{" "}
                Workflow
              </Text>
              <Dialog.Description>
                You can add a page by using Alfred Workflow.
              </Dialog.Description>
              <ol
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1em",
                  listStyleType: "decimal",
                  listStylePosition: "inside",
                  lineHeight: "2",
                  paddingTop: "0.5em",
                }}
              >
                <li>
                  <Text as="span">Download the Alfred Workflow.</Text>
                  <Box marginLeft="5">
                    <a href="/atodeyomu.alfredworkflow">
                      <Button variant="subtle">
                        <Image
                          src="/alfred.png"
                          width="32"
                          height="26"
                          alt=""
                        />
                        Download
                      </Button>
                    </a>
                  </Box>
                </li>
                <li>
                  <Text as="span">Setup the workflow</Text>
                  <Box marginLeft="5">
                    <Image
                      src="/import_alfred.png"
                      width="562"
                      height="250"
                      alt=""
                    />
                  </Box>
                </li>
                <li>
                  <Text as="span">
                    Run the workflow with the URL you want to add.
                  </Text>
                  <Box marginLeft="5">
                    <Image
                      src="/execute_alfred.png"
                      width="764"
                      height="172"
                      alt=""
                    />
                  </Box>
                </li>
              </ol>
            </Stack>
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
