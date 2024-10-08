"use client";

import { ArrowRightIcon, CircleXIcon, XIcon } from "lucide-react";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { HStack, VStack } from "@styled-system/jsx";
import { Text } from "@/components/park-ui";
import { Field } from "@/components/park-ui/field";
import { Button } from "@/components/park-ui/button";
import { requestUpdateUserName } from "@/app/welcome/UpdateUserNameFormAction";
import { Toast } from "@/components/park-ui/toast";
import { DeleteUserForm } from "@/app/welcome/DeleteUserForm";

const toaster = Toast.createToaster({
  placement: "top",
  overlap: true,
  gap: 16,
});

export const WelcomeForm = ({ currentName }: { currentName: string }) => {
  const [{ state, timestamp, userName, errorMessage }, action, isPending] =
    useActionState(requestUpdateUserName, {
      state: "idle",
      timestamp: Date.now(),
    } as const);

  const router = useRouter();

  useEffect(() => {
    if (state === "success") {
      router.push(`/${userName ?? ""}`);
    } else if (state === "error") {
      toaster.create({
        title: errorMessage ?? "Unexpected error occurred",
        type: "error",
      });
    }
  }, [router, state, timestamp, userName, errorMessage]);

  return (
    <VStack
      alignItems="center"
      paddingTop={{ smDown: "0", base: "4" }}
      paddingBottom="12"
      gap="7"
    >
      <Text as="h1" fontSize="2xl">
        Welcome
      </Text>
      <form action={action}>
        <VStack gap="4">
          <Text fontSize="md">Choose your username</Text>
          <HStack padding="4" borderRadius="xl" bgColor="gray.3">
            <Text fontSize="md">atodeyomu.morishin.me</Text>
            <Text fontSize="md">/</Text>
            <Field.Root flex="1">
              <Field.Input
                type="text"
                name="name"
                placeholder="your_name"
                required={true}
                defaultValue={userName ?? currentName}
                disabled={isPending}
                bgColor="white"
              />
            </Field.Root>
          </HStack>
          <Button type="submit" disabled={isPending} loading={isPending}>
            Get Started
            <ArrowRightIcon />
          </Button>
        </VStack>
      </form>
      <DeleteUserForm />
      <Toast.Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root key={toast.id} bgColor="red" color="white">
            <HStack alignItems="center">
              <CircleXIcon />
              <Toast.Title color="white">{toast.title}</Toast.Title>
            </HStack>
            <Toast.CloseTrigger asChild>
              <Button size="sm" variant="link">
                <XIcon />
              </Button>
            </Toast.CloseTrigger>
          </Toast.Root>
        )}
      </Toast.Toaster>
    </VStack>
  );
};
