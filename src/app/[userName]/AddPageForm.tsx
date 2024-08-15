"use client";

import { PlusIcon } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/park-ui/button";
import { Field } from "@/components/park-ui/field";
import { HStack } from "@styled-system/jsx";
import { requestAddPage } from "@/app/[userName]/AddPageFormAction";

export function AddPageForm() {
  const [, action, isPending] = useActionState(requestAddPage, {});
  return (
    <form action={action}>
      <HStack maxW="100vw" flexWrap="wrap" w="xl">
        <Field.Root flex="1">
          <Field.Input
            type="url"
            name="url"
            fontSize="xl"
            placeholder="https://..."
          />
        </Field.Root>
        <Button type="submit" loading={isPending}>
          <PlusIcon />
          Add to Unreads
        </Button>
      </HStack>
    </form>
  );
}
