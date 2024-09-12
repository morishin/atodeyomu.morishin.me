import { PlusIcon } from "lucide-react";
import { useActionState, useEffect } from "react";
import { CreateToasterReturn } from "@ark-ui/react";

import { requestAddPage } from "@/app/[userName]/AddPageFormAction";
import { Button } from "@/components/park-ui/button";
import { Field } from "@/components/park-ui/field";
import { HStack, Box } from "@styled-system/jsx";

export function AddPageForm({
  refresh,
  toaster,
}: {
  refresh: () => Promise<void>;
  toaster: CreateToasterReturn;
}) {
  const [{ state, timestamp }, action, isPending] = useActionState(
    requestAddPage,
    {
      state: "idle",
      timestamp: Date.now(),
    } as const
  );

  useEffect(() => {
    if (state === "success") {
      refresh();
      toaster.create({
        title: "Added to unread",
        type: "success",
      });
    }
  }, [state, refresh, timestamp, toaster]);

  return (
    <Box width="100%" padding={{ smDown: "2", base: "0" }}>
      <form action={action}>
        <HStack>
          <Field.Root flex="1">
            <Field.Input
              type="url"
              name="url"
              fontSize={{ smDown: "lg", base: "xl" }}
              placeholder="https://..."
              required={true}
              disabled={isPending}
            />
          </Field.Root>
          <Button type="submit" disabled={isPending} loading={isPending}>
            <PlusIcon />
            <Box display={{ smDown: "none", base: "inline" }}>
              Add to unread
            </Box>
            <Box display={{ smDown: "inline", base: "none" }}>Add</Box>
          </Button>
        </HStack>
      </form>
    </Box>
  );
}
