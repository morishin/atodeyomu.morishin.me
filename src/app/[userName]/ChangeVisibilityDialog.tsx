import { GlobeIcon, LockIcon, XIcon } from "lucide-react";
import { useContext } from "react";

import { Button } from "@/components/park-ui/button";
import { Dialog } from "@/components/park-ui/dialog";
import { Stack } from "@styled-system/jsx";
import { Badge } from "@/components/park-ui/badge";
import { LocaleContext } from "@/lib/i18n/LocaleProvider";
import { i18n } from "@/lib/i18n/strings";

export const ChangeVisibilityDialog = ({
  changeVisibilityAction,
  isPrivate,
  isChangeVisibilityPending,
}: {
  changeVisibilityAction: (payload: FormData) => void;
  isPrivate: boolean;
  isChangeVisibilityPending: boolean;
}) => {
  const { locale } = useContext(LocaleContext);
  return (
    <Dialog.Root lazyMount={true}>
      <Dialog.Trigger cursor="pointer" asChild>
        {isPrivate ? (
          <Badge size="sm" variant="solid">
            <LockIcon />
            {i18n("Private", locale)}
          </Badge>
        ) : (
          <Badge size="sm" variant="outline">
            <GlobeIcon />
            {i18n("Public", locale)}
          </Badge>
        )}
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxHeight="90vh" overflowY="scroll">
          <form action={changeVisibilityAction}>
            <input type="hidden" name="private" value={isPrivate ? "0" : "1"} />
            <Stack gap="8" p="6">
              <Stack gap="1">
                <Dialog.Title>{i18n("Change visibility", locale)}</Dialog.Title>
                <Dialog.Description>
                  {i18n(
                    "This page is currently {{visibility}}.",
                    locale
                  ).replace(
                    "{{visibility}}",
                    isPrivate ? i18n("private", locale) : i18n("public", locale)
                  )}
                </Dialog.Description>
              </Stack>
              <Stack gap="3" direction="row" width="full">
                <Dialog.CloseTrigger asChild>
                  <Button variant="outline" width="full">
                    {i18n("Cancel", locale)}
                  </Button>
                </Dialog.CloseTrigger>
                <Button width="full" loading={isChangeVisibilityPending}>
                  {i18n("Make {{visibility}}", locale).replace(
                    "{{visibility}}",
                    isPrivate ? i18n("public", locale) : i18n("private", locale)
                  )}
                </Button>
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
