import { CheckIcon, CopyIcon, RefreshCcwIcon, XIcon } from "lucide-react";
import { useActionState, useContext } from "react";
import Image from "next/image";

import { Button } from "@/components/park-ui/button";
import { Dialog } from "@/components/park-ui/dialog";
import { Box, Stack } from "@styled-system/jsx";
import { Clipboard } from "@/components/park-ui/clipboard";
import { Input } from "@/components/park-ui/styled/clipboard";
import { FormLabel } from "@/components/park-ui/form-label";
import { Textarea } from "@/components/park-ui/textarea";
import { Collapsible } from "@/components/park-ui/collapsible";
import { requestAccessTokenRotate } from "@/app/[userName]/AccessTokenRotateFormAction";
import { LoggedInUser } from "@/lib/types";
import { Text } from "@/components/park-ui";
import { LocaleContext } from "@/lib/i18n/LocaleProvider";
import { i18n } from "@/lib/i18n/strings";

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

  const { locale } = useContext(LocaleContext);

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
              <Dialog.Title>{i18n("API Usage", locale)}</Dialog.Title>
              <Dialog.Description>
                {i18n("You can also add pages to the list via API.", locale)}
              </Dialog.Description>
            </Stack>
            <Stack>
              <Clipboard.Root
                value={personalAccessToken}
                paddingBottom="6"
                borderBottomWidth="1"
                borderBottomColor="gray.8"
              >
                <Clipboard.Label asChild>
                  <FormLabel>{i18n("Your Access Token", locale)}</FormLabel>
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
                          i18n(
                            "Are you sure you want to rotate the access token? This will invalidate the current access token.",
                            locale
                          )
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
            </Stack>
            <Section title={i18n("Add a page via cURL", locale)}>
              <Clipboard.Root value={exampleCode}>
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
            </Section>
            <Section title="Add a page via iOS share sheet">
              <Dialog.Description>
                {i18n(
                  "You can add a page from the share sheet by using iOS Shortcuts.",
                  locale
                )}
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
                  <Text as="span">
                    {i18n("Download the shortcut.", locale)}
                  </Text>
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
                        {i18n("Download", locale)}
                      </Button>
                    </a>
                  </Box>
                </li>
                <li>
                  <Text as="span">{i18n("Setup the shortcut", locale)}</Text>
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
                    {i18n(
                      "Available in the share sheet opened from Safari.",
                      locale
                    )}
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
            </Section>
            <Section title={i18n("Add a page via Android share menu", locale)}>
              <Dialog.Description>
                {i18n("You can add a page from the share menu.", locale)}
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
                  <Text as="span">
                    {i18n("Add to Home screen. (Install it as PWA)", locale)}
                  </Text>
                  <Image
                    src="/android-share-1.png"
                    width="948"
                    height="614"
                    alt=""
                  />
                </li>
                <li>
                  <Text as="span">
                    {i18n("Available in the share menu from browser.", locale)}
                  </Text>
                  <Image
                    src="/android-share-2.png"
                    width="948"
                    height="614"
                    alt=""
                  />
                </li>
              </ol>
            </Section>
            <Section title={i18n("Add a page via Chrome Extension", locale)}>
              <Dialog.Description>
                {i18n(
                  "You can add a page by using a Chrome Extension.",
                  locale
                )}
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
                  <Text as="span">
                    {i18n("Download the Chrome Extension.", locale)}
                  </Text>
                  <Box marginLeft="5">
                    <a
                      href="https://chromewebstore.google.com/detail/atode-yomu-client/dannfglgdahhnfmofngclkoicbikicgj"
                      target="_blank"
                    >
                      <Button variant="subtle">
                        <Image
                          src="/chrome.svg"
                          width="28"
                          height="28"
                          alt=""
                        />
                        {i18n("Download", locale)}
                      </Button>
                    </a>
                  </Box>
                </li>
                <li>
                  <Text as="span">{i18n("Setup the extension", locale)}</Text>
                  <Box marginLeft="5">
                    <Image
                      src="/configure_chrome_extension.png"
                      width="909"
                      height="421"
                      alt=""
                    />
                  </Box>
                </li>
                <li>
                  <Text as="span">
                    {i18n(
                      "Click the extension button on the page you want to add.",
                      locale
                    )}
                  </Text>
                  <Box marginLeft="5">
                    <Image
                      src="/usage_chrome_extension.png"
                      width="591"
                      height="278"
                      alt=""
                    />
                  </Box>
                </li>
              </ol>
            </Section>
            <Section title={i18n("Add a page via Alfred Workflow", locale)}>
              <Dialog.Description>
                {i18n("You can add a page by using Alfred Workflow.", locale)}
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
                  <Text as="span">
                    {i18n("Download the Alfred Workflow.", locale)}
                  </Text>
                  <Box marginLeft="5">
                    <a href="/atodeyomu.alfredworkflow" target="_blank">
                      <Button variant="subtle">
                        <Image
                          src="/alfred.png"
                          width="32"
                          height="26"
                          alt=""
                        />
                        {i18n("Download", locale)}
                      </Button>
                    </a>
                  </Box>
                </li>
                <li>
                  <Text as="span">{i18n("Setup the workflow", locale)}</Text>
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
                    {i18n(
                      "Run the workflow with the URL you want to add.",
                      locale
                    )}
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
            </Section>
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

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <Stack
      paddingBottom="2"
      borderBottomWidth="1"
      borderBottomColor="gray.8"
      _last={{
        border: "none",
      }}
    >
      <Collapsible.Root lazyMount>
        <Collapsible.Trigger cursor="pointer" asChild>
          <Text
            as="h3"
            size="md"
            fontWeight="semibold"
            _before={{
              content: `"▶"`,
              display: "inline",
              marginRight: "1",
            }}
            _expanded={{
              _before: {
                content: `"▼"`,
                marginRight: "1",
              },
            }}
          >
            {title}
          </Text>
        </Collapsible.Trigger>
        <Collapsible.Content>{children}</Collapsible.Content>
      </Collapsible.Root>
    </Stack>
  );
};
