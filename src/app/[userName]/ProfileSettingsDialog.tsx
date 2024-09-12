import { XIcon } from "lucide-react";

import { Text } from "@/components/park-ui";
import { Button } from "@/components/park-ui/button";
import { Dialog } from "@/components/park-ui/dialog";
import { Field } from "@/components/park-ui/field";
import { LoggedInUser } from "@/lib/types";
import { HStack, Stack, VStack } from "@styled-system/jsx";

export const ProfileSettingsDialog = ({
  open,
  loggedInUser,
  onClose,
}: {
  open: boolean;
  loggedInUser: LoggedInUser;
  onClose: () => void;
}) => {
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
              <Dialog.Title>Edit Profile</Dialog.Title>
            </Stack>
            <VStack alignItems="stretch">
              <VStack gap="4" alignItems="flex-start">
                <Text fontSize="md">Username</Text>
                <HStack padding="4" borderRadius="xl" bgColor="gray.3">
                  <Text fontSize="md">atodeyomu.morishin.me</Text>
                  <Text fontSize="md">/</Text>
                  <Field.Root flex="1">
                    <Field.Input
                      type="text"
                      name="name"
                      placeholder="your_name"
                      required={true}
                      defaultValue={loggedInUser.name}
                      bgColor="white"
                    />
                  </Field.Root>
                </HStack>
                <Text fontSize="md">Picture</Text>
              </VStack>
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
