import { XIcon } from "lucide-react";
import { useActionState, useContext, useEffect, useState } from "react";
import { CreateToasterReturn } from "@ark-ui/react";

import { Text } from "@/components/park-ui";
import { Button } from "@/components/park-ui/button";
import { Dialog } from "@/components/park-ui/dialog";
import { Field } from "@/components/park-ui/field";
import { LoggedInUser } from "@/lib/types";
import { HStack, Stack, VStack } from "@styled-system/jsx";
import { requestProfilePicture } from "@/app/[userName]/ProfilePictureFormAction";
import { FileUpload } from "@/components/park-ui/file-upload";
import { Avatar } from "@/components/park-ui/avatar";
import { requestUpdateUserName } from "@/app/welcome/UpdateUserNameFormAction";
import { FormLabel } from "@/components/park-ui/form-label";
import { LocaleContext } from "@/lib/i18n/LocaleProvider";
import { i18n } from "@/lib/i18n/strings";

export const ProfileSettingsDialog = ({
  open,
  loggedInUser,
  onClose,
  toaster,
}: {
  open: boolean;
  loggedInUser: LoggedInUser;
  onClose: () => void;
  toaster: CreateToasterReturn;
}) => {
  const [
    {
      state: userNameState,
      errorMessage: userNameErrorMessage,
      timestamp: userNameTimestamp,
      userName,
    },
    userNameAction,
    isUserNamePending,
  ] = useActionState(requestUpdateUserName, {
    state: "idle",
    timestamp: Date.now(),
  } as const);

  const [
    { state: profilePictureState, timestamp: profilePictureTimestamp },
    profilePictureAction,
    isProfilePicturePending,
  ] = useActionState(requestProfilePicture, {
    state: "idle",
    timestamp: Date.now(),
  } as const);

  const { locale } = useContext(LocaleContext);

  useEffect(() => {
    if (userNameState === "success") {
      toaster.create({
        title: i18n("Username updated", locale),
        type: "success",
      });
      onClose();
      location.href = `/${userName}`;
    } else if (userNameState === "error") {
      toaster.create({
        title: userNameErrorMessage ?? "Unexpected error occurred",
        type: "error",
      });
    }
  }, [
    locale,
    onClose,
    toaster,
    userName,
    userNameErrorMessage,
    userNameState,
    userNameTimestamp,
  ]);

  useEffect(() => {
    if (profilePictureState === "success") {
      toaster.create({
        title: i18n("Profile picture updated", locale),
        type: "success",
      });
      onClose();
    } else if (profilePictureState === "error") {
      toaster.create({
        title: "Failed to update profile picture",
        type: "error",
      });
    }
  }, [
    onClose,
    profilePictureState,
    toaster,
    userNameErrorMessage,
    userNameState,
    profilePictureTimestamp,
    locale,
  ]);

  const [isEnabledUpdateUserNameButton, setIsEnabledUpdateUserNameButton] =
    useState(false);
  const [
    isEnabledUpdateProfilePictureButton,
    setIsEnabledUpdateProfilePictureButton,
  ] = useState(false);

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
              <Dialog.Title>{i18n("Edit Profile", locale)}</Dialog.Title>
            </Stack>
            <VStack alignItems="stretch">
              <VStack gap="4" alignItems="flex-start">
                <form
                  action={userNameAction}
                  onSubmit={(e) => {
                    if (
                      !confirm(i18n("Are you sure to update username?", locale))
                    ) {
                      e.preventDefault();
                    }
                  }}
                >
                  <VStack gap="4" alignItems="flex-start">
                    <FormLabel fontSize="md">
                      {i18n("Username", locale)}
                    </FormLabel>
                    <HStack padding="4" borderRadius="xl" bgColor="gray.3">
                      <Text fontSize="md">atodeyomu.morishin.me</Text>
                      <Text fontSize="md">/</Text>
                      <Field.Root flex="1">
                        <Field.Input
                          type="text"
                          autoComplete="off"
                          name="name"
                          placeholder="your_name"
                          required={true}
                          defaultValue={loggedInUser.name}
                          onChange={(e) => {
                            setIsEnabledUpdateUserNameButton(
                              e.target.value !== loggedInUser.name
                            );
                          }}
                          bgColor="white"
                        />
                      </Field.Root>
                    </HStack>
                    <Button
                      type="submit"
                      variant="subtle"
                      colorPalette="red"
                      loading={isUserNamePending}
                      disabled={!isEnabledUpdateUserNameButton}
                    >
                      {i18n("Save Username", locale)}
                    </Button>
                  </VStack>
                </form>
                <form action={profilePictureAction}>
                  <VStack gap="4" alignItems="flex-start">
                    <FormLabel fontSize="md">
                      {i18n("Picture", locale)}
                    </FormLabel>
                    <FileUpload.Root
                      maxFileSize={4.5 * 2 ** 20} // 4.5MB
                      onFileReject={(details) => {
                        if (details.files.length > 0) {
                          toaster.create({
                            title: `Error: ${details.files[0]?.errors[0]}`,
                            type: "error",
                          });
                        }
                      }}
                    >
                      <FileUpload.Dropzone
                        minHeight="unset"
                        borderStyle="dashed"
                        borderColor="gray.8"
                        padding={0}
                        width="120px"
                        height="120px"
                        cursor="pointer"
                      >
                        <FileUpload.Trigger asChild>
                          <FileUpload.Context>
                            {({ acceptedFiles }) => {
                              const file = acceptedFiles[0];
                              return file ? (
                                <FileUpload.Item
                                  file={file}
                                  padding={0}
                                  columnGap={0}
                                  borderRadius="50%"
                                  overflow="hidden"
                                >
                                  <FileUpload.ItemPreview type="image/*">
                                    <FileUpload.ItemPreviewImage
                                      width="120px"
                                      height="120px"
                                      objectFit="cover"
                                    />
                                  </FileUpload.ItemPreview>
                                </FileUpload.Item>
                              ) : (
                                <Avatar
                                  src={loggedInUser.image ?? undefined}
                                  name={loggedInUser.name}
                                  width="120px"
                                  height="120px"
                                  display="flex"
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-expect-error
                                  size="dummy"
                                />
                              );
                            }}
                          </FileUpload.Context>
                        </FileUpload.Trigger>
                      </FileUpload.Dropzone>
                      <FileUpload.HiddenInput
                        name="image"
                        onChange={(e) => {
                          setIsEnabledUpdateProfilePictureButton(
                            (e.target.files && e.target.files.length > 0) ??
                              false
                          );
                        }}
                      />
                    </FileUpload.Root>
                    <Button
                      type="submit"
                      variant="subtle"
                      loading={isProfilePicturePending}
                      disabled={!isEnabledUpdateProfilePictureButton}
                    >
                      {i18n("Save Picture", locale)}
                    </Button>
                  </VStack>
                </form>
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
