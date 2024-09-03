import { PlusIcon } from "lucide-react";
import { useActionState, useEffect } from "react";

import { requestAddPage } from "@/app/[userName]/AddPageFormAction";
import { Button } from "@/components/park-ui/button";
import { Field } from "@/components/park-ui/field";
import { HStack } from "@styled-system/jsx";

export function AddPageForm({
  isAvailable,
  refresh,
}: {
  isAvailable: boolean;
  refresh: () => Promise<void>;
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
    }
  }, [state, timestamp, refresh]);

  return (
    <form action={action}>
      <HStack maxW="100vw" flexWrap="wrap" w="xl">
        <Field.Root flex="1">
          <Field.Input
            type="url"
            name="url"
            fontSize="xl"
            placeholder="https://..."
            required={true}
            disabled={!isAvailable || isPending}
          />
        </Field.Root>
        <Button type="submit" disabled={!isAvailable} loading={isPending}>
          <PlusIcon />
          Add to Unread
        </Button>
      </HStack>
    </form>
  );
}
